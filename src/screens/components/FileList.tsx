import React, { useContext } from 'react'
import { View, Alert } from 'react-native'
import { observer } from 'mobx-react'
import { ContextMenuContext } from './ContextMenu'
import { EmptyView } from './EmptyView'
import { PopupContext, IPopupMenuEntry, DIVIDER, IPopupMenuItem } from './PopupMenu'
import { VaultContext } from '../../model/VaultContext'
import { ImageFile, FileType, TextFile, File } from '../../model/VaultData'
import { filter } from '../../util/filter'
import { Vault } from '../../model/Vault'
import { ScreenshotContext } from '../../util/screenshots'
import { shareBlob, copyToClipboard, exportBlob, safeFileName } from '../../util/expoSecureBlobStore'
import { deleteWarning } from './deleteWarning'
import { navigate } from '../../util/navigate'
import { elementVaultEmpty } from '../../styles/design/layer/elementVaultEmpty'
import { elementPopUpMenu } from '../../styles/design/layer/elementPopUpMenu'
import { elementFileList } from '../../styles/design/layer/elementFileList'
import { SketchElement } from '../../styles/util/react/SketchElement'

export interface ISectionProps <T extends File> {
  name: string
  items: T[]
}

export interface IFileListItemProps <T extends File> {
  item: T
}

const itemProto = elementFileList.layers.entry

interface IFileContext {
  vault: Vault
  file: File
}
const shareAction: IPopupMenuItem<IFileContext> = {
  name: 'Share',
  action: ({ file }) => {
    shareBlob(file.secretKey, file.fileName)
      .catch(exportError => console.log({ exportError }))
  }
}
const copyAction: IPopupMenuItem<IFileContext> = {
  name: 'Copy Content',
  action: ({ file }) => {
    copyToClipboard(file.secretKey, file.fileName)
      .catch(clipboardError => console.log({ clipboardError }))
  }
}
const exportAction: IPopupMenuItem<IFileContext> = {
  name: 'Export',
  action: ({ file, vault }): void => {
    const albumName = `Consento | ${safeFileName(vault.name)}`
    exportBlob(file.secretKey, albumName, file.fileName)
      .then(
        () => {
          Alert.alert(
            'Successfully exported',
            `Added "${file.fileName}"\n → "${albumName}"`,
            [
              { text: 'ok' }
            ]
          )
        },
        exportBlobError => console.log({ exportBlobError })
      )
  }
}
const deleteAction: IPopupMenuItem<IFileContext> = {
  name: 'Delete',
  action: ({ file, vault }): void => {
    deleteWarning({
      onPress: () => vault.data.deleteFile(file),
      itemName: 'file'
    })
  },
  dangerous: true
}

const textActions: Array<IPopupMenuEntry<IFileContext>> = [
  shareAction,
  exportAction,
  copyAction,
  DIVIDER,
  deleteAction
]

const imageActions: Array<IPopupMenuEntry<IFileContext>> = [
  shareAction,
  exportAction,
  DIVIDER,
  deleteAction
]

const addActions: Array<IPopupMenuEntry<Vault>> = [
  {
    name: elementPopUpMenu.layers.takePicture.text,
    action: vault =>
      navigate('camera', {
        onPicture (input: ImageFile): void {
          vault.data.addFile(input)
          navigate('editor', {
            vault: vault.$modelId,
            file: input.$modelId
          })
        },
        onClose () {
          navigate('vault', {
            valut: vault.$modelId
          })
        }
      })
  },
  {
    name: elementPopUpMenu.layers.createText.text,
    action: vault => {
      const textFile = new TextFile({
        name: vault.newFilename(),
        secretKeyBase64: ''
      })
      vault.data.addFile(textFile)
      navigate('editor', {
        vault: vault.$modelId,
        file: textFile.$modelId
      })
    }
  }
]

const FileListItem = observer(function <T extends File> ({ item }: IFileListItemProps<T>): JSX.Element {
  const { open } = useContext(ContextMenuContext)
  const { vault } = useContext(VaultContext)
  if (vault === null) {
    throw new Error('not in a vault context')
  }
  const screenshots = useContext(ScreenshotContext)

  return <View style={{ height: itemProto.place.height, width: '100%', display: 'flex', flexDirection: 'row' }}>
    <SketchElement src={itemProto.layers.label} style={{ flexGrow: 1, marginLeft: itemProto.layers.label.place.left }}>{item.name}</SketchElement>
    <SketchElement
      src={itemProto.layers.menu}
      onPress={event => {
        if (item.type === FileType.image) {
          screenshots.vaultFilesImageContext.takeSync(200)
          open({ items: imageActions, context: { file: item, vault } }, event)
        } else {
          screenshots.vaultFilesTextContext.takeSync(200)
          open({ items: textActions, context: { file: item, vault } }, event)
        }
      }}
    />
    <SketchElement
      src={itemProto.layers.open}
      onPress={() => navigate('editor', {
        vault: vault.$modelId,
        file: item.$modelId
      })}
    />
  </View>
})

const section = elementFileList.layers.sectionText

const Section = function <T extends File> ({ name, items }: ISectionProps<T>): JSX.Element {
  if (items.length === 0) {
    return <></>
  }
  return <View>
    <View style={{ position: 'relative', width: '100%', height: section.place.height }}>
      <SketchElement
        src={section.layers.bg}
        style={{
          position: 'absolute',
          width: '100%',
          top: section.layers.bg.place.top
        }}
      />
      <SketchElement
        src={section.layers.label}
        style={{
          position: 'absolute',
          top: section.layers.label.place.top,
          left: section.layers.label.place.left,
          width: section.layers.label.place.width,
          height: section.layers.label.place.height
        }}
      >{name}</SketchElement>
    </View>
    {items.map(item => <FileListItem key={item.$modelId} item={item} />)}
  </View>
}

export const FileList = observer((): JSX.Element => {
  const { vault } = useContext(VaultContext)
  if (vault === null) {
    throw new Error('Missing vault in context!')
  }
  const screenshots = useContext(ScreenshotContext)
  const files = vault.data?.files ?? []
  const textFiles = filter(files, (item): item is TextFile => item.type === FileType.text)
  const imageFiles = filter(files, (item): item is ImageFile => item.type === FileType.image)
  const { open } = useContext(PopupContext)
  if (files.length === 0) {
    screenshots.vaultFilesEmpty.takeSync(500)
  }
  if (textFiles.length > 0 && imageFiles.length > 0) {
    screenshots.vaultFilesFull.takeSync(500)
  }
  return <EmptyView
    empty={elementVaultEmpty}
    onAdd={event => {
      screenshots.vaultFilesPopup.takeSync(500)
      open({ items: addActions, context: vault }, event)
    }}
  >
    {
      files.length > 0
        ? <View style={{ backgroundColor: elementFileList.backgroundColor, flexGrow: 1 }}>
          <Section name={elementFileList.layers.sectionText.layers.label.text} items={textFiles} />
          <Section name={elementFileList.layers.sectionImage.layers.label.text} items={imageFiles} />
          <SketchElement
            src={elementFileList.layers.size}
            style={{
              marginLeft: elementFileList.layers.size.place.left,
              marginTop: 20 // Not readable from design document
            }}
          />
        </View>
        : undefined
    }
  </EmptyView>
})
