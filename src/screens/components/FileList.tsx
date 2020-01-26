import React, { useContext } from 'react'
import { View } from 'react-native'
import { elementFileList } from '../../styles/component/elementFileList'
import { elementVaultEmpty } from '../../styles/component/elementVaultEmpty'
import { ContextMenuContext } from './ContextMenu'
import { EmptyView } from './EmptyView'
import { PopupContext, TPopupMenuItem, DIVIDER, IPopupMenuItem } from './PopupMenu'
import { TNavigation, withNavigation } from '../navigation'
import { elementPopUpMenu } from '../../styles/component/elementPopUpMenu'
import { VaultContext } from '../../model/VaultContext'
import { ImageFile, FileType, TextFile, File } from '../../model/VaultData'
import { filter } from '../../util/filter'
import { observer } from 'mobx-react'
import { Vault } from '../../model/Vault'
import { ScreenshotContext } from '../../util/screenshots'
import { shareBlob, copyToClipboard } from '../../util/expoSecureBlobStore'
import { deleteWarning } from './deleteWarning'

export interface ISectionProps <T extends File> {
  name: string
  items: T[]
}

export interface IFileListItemProps <T extends File> {
  item: T
  navigation: TNavigation
}

function safeFileName (filename: string): string {
  return filename.replace(/\s\t/ig, '_').replace(/[^a-z0-9_-]/ig, encodeURIComponent)
}

const section = elementFileList.sectionText.component
const itemProto = elementFileList.entry.component

interface IFileContext {
  vault: Vault
  file: File
}
const shareAction: IPopupMenuItem<IFileContext> = {
  name: 'Share',
  action: ({ file }) => {
    shareBlob(file.secretKey, `${safeFileName(file.name)}.${file.type === FileType.image ? 'jpg' : 'txt'}`)
      .catch(exportError => console.log({ exportError }))
  }
}
const copyAction: IPopupMenuItem<IFileContext> = {
  name: 'Copy Content',
  action: ({ file }) => {
    copyToClipboard(file.secretKey, file.name)
      .catch(clipboardError => console.log({ clipboardError }))
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

const textActions: Array<TPopupMenuItem<IFileContext>> = [
  shareAction,
  copyAction,
  DIVIDER,
  deleteAction
]

const imageActions: Array<TPopupMenuItem<IFileContext>> = [
  shareAction,
  DIVIDER,
  deleteAction
]

const addActions: Array<TPopupMenuItem<{ vault: Vault, navigation: TNavigation }>> = [
  {
    name: elementPopUpMenu.takePicture.text,
    action: ({ vault, navigation }) =>
      navigation.navigate('camera', {
        onPicture (input: ImageFile): void {
          vault.data.addFile(input)
          navigation.navigate('editor', {
            vault: vault.$modelId,
            file: input.$modelId
          })
        },
        onClose () {
          navigation.navigate('vault', {
            valut: vault.$modelId
          })
        }
      })
  },
  {
    name: elementPopUpMenu.createText.text,
    action: ({ vault, navigation }) => {
      const textFile = new TextFile({
        name: vault.newFilename()
      })
      vault.data.addFile(textFile)
      navigation.navigate('editor', {
        vault: vault.$modelId,
        file: textFile.$modelId
      })
    }
  }
]

const FileListItem = withNavigation(observer(function <T extends File> ({ item, navigation }: IFileListItemProps<T>): JSX.Element {
  const { open } = useContext(ContextMenuContext)
  const { vault } = useContext(VaultContext)
  const screenshots = useContext(ScreenshotContext)

  return <View style={{ height: itemProto.height, width: '100%' }}>
    <itemProto.label.Render horz='stretch' value={item.name} />
    <itemProto.open.Render
      horz='end'
      onPress={() => navigation.navigate('editor', {
        vault: vault.$modelId,
        file: item.$modelId
      })}
    />
    <itemProto.menu.Render
      horz='end' onPress={(event) => {
        if (item.type === FileType.image) {
          screenshots.vaultFilesImageContext.takeSync(200)
          open<IFileContext>(imageActions, { file: item, vault }, event)
        } else {
          screenshots.vaultFilesTextContext.takeSync(200)
          open<IFileContext>(textActions, { file: item, vault }, event)
        }
      }} style={{ zIndex: 1 }} />
  </View>
}))

const Section = function <T extends File> ({ name, items }: ISectionProps<T>): JSX.Element {
  if (items.length === 0) {
    return null
  }
  return <View>
    <View style={{ position: 'relative', width: '100%', height: section.height }}>
      <section.bg.Render horz='stretch' />
      <section.label.Render value={name} style={{ position: 'absolute' }} />
    </View>
    {items.map(item => <FileListItem key={item.$modelId} item={item} />)}
  </View>
}

export const FileList = withNavigation(observer(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  const { vault } = useContext(VaultContext)
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
  return <EmptyView prototype={elementVaultEmpty} onAdd={() => open(popupActions)}>
    {
      files.length > 0
        ? <View>
          <Section name={elementFileList.sectionText.text.label} items={textFiles} />
          <Section name={elementFileList.sectionImage.text.label} items={imageFiles} />
          <elementFileList.size.Render />
        </View>
        : null
    }
  </EmptyView>
}))
