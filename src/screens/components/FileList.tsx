import React, { useContext } from 'react'
import { View } from 'react-native'
import { elementFileList } from '../../styles/component/elementFileList'
import { elementVaultEmpty } from '../../styles/component/elementVaultEmpty'
import { ContextMenuContext } from './ContextMenu'
import { EmptyView } from './EmptyView'
import { PopupContext, IPopupMenuItem } from './PopupMenu'
import { TNavigation, withNavigation } from '../navigation'
import { elementPopUpMenu } from '../../styles/component/elementPopUpMenu'
import { VaultContext } from '../../model/VaultContext'
import { ImageFile, FileType, TextFile, File } from '../../model/VaultData'
import { filter } from '../../util/filter'
import { observer } from 'mobx-react'
import { ScreenshotContext } from '../../util/screenshots'

interface IFileListAction <T extends File> {
  name: string
  action (item: T): void
}

export interface ISectionProps <T extends File> {
  name: string
  items: T[]
}

export interface IFileListItemProps <T extends File> {
  item: T
  navigation: TNavigation
}

const section = elementFileList.sectionText.component
const itemProto = elementFileList.entry.component

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
        } else {
          screenshots.vaultFilesTextContext.takeSync(200)
        }
        open([
          { name: 'Rename', action (item): void { console.log(`Rename ${item.name}`) } },
          { name: 'Share', action (item): void { console.log(`Share ${item.name}`) } },
          { name: 'Other', action (item): void { console.log(`Other ${item.name}`) } },
          null,
          {
            name: 'Delete',
            action: (file: File): void => vault.data.deleteFile(file),
            dangerous: true
          }
        ], item, event)
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
  const popupActions: IPopupMenuItem[] = [
    {
      name: elementPopUpMenu.takePicture.text,
      action: () =>
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
      action: () => {
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
