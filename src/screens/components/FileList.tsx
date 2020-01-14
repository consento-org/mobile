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
import randomBytes from '@consento/sync-randombytes'
import { Buffer } from 'buffer'

interface IFileListAction {
  name: string
  action (item: IFileListItem): void
}

interface IFileListItem {
  name: string
  path: string
}

export interface ISectionProps {
  name: string
  items: IFileListItem[]
}

export interface IFileListItemProps {
  item: IFileListItem
}

const section = elementFileList.sectionText.component
const itemProto = elementFileList.entry.component

const FileListItem = ({ item }: IFileListItemProps): JSX.Element => {
  const { open } = useContext(ContextMenuContext)

  return <View style={{ height: itemProto.height, width: '100%' }}>
    <itemProto.label.Render horz='stretch' value={item.name} />
    <itemProto.open.Render horz='end' onPress={() => console.log('xxx')} />
    <itemProto.menu.Render
      horz='end' onPress={(event) => open([
        { name: 'Rename', action (item): void { console.log(`Rename ${item.name}`) } },
        { name: 'Share', action (item): void { console.log(`Share ${item.name}`) } },
        { name: 'Other', action (item): void { console.log(`Other ${item.name}`) } },
        null,
        { name: 'Delete', action (item): void { console.log(`DELETE ${item.name}`) }, dangerous: true }
      ], item, event)} debug style={{ zIndex: 1 }} />
  </View>
}

const Section = ({ name, items }: ISectionProps): JSX.Element => {
  if (items.length === 0) {
    return null
  }
  return <View>
    <View style={{ position: 'relative', width: '100%', height: section.height }}>
      <section.bg.Render horz='stretch' />
      <section.label.Render value={name} style={{ position: 'absolute' }} />
    </View>
    {items.map(item => <FileListItem key={item.name} item={item} />)}
  </View>
}

export const FileList = withNavigation(({ navigation }: { navigation: TNavigation }): JSX.Element => {
  const files = [
    { path: 'image/Test', name: 'Test' },
    { path: 'image/Top', name: 'Top' },
    { path: 'text/Test', name: 'Test' },
    { path: 'text/Top', name: 'Top' }
  ]
  const textFiles = files.filter(item => /^text\//.test(item.path))
  const imageFiles = files.filter(item => /^image\//.test(item.path))
  const { vault } = useContext(VaultContext)
  const { open } = useContext(PopupContext)
  const popupActions: IPopupMenuItem[] = [
    {
      name: elementPopUpMenu.takePicture.text,
      action: () =>
        navigation.navigate('camera', {
          onPicture (picture) {
            const key = randomBytes(Buffer.alloc(4)).toString('hex')
            vault.images[key] = picture
            navigation.navigate('imageEditor', {
              vault: vault.$modelId,
              imageKey: key
            })
          }
        })
    },
    { name: elementPopUpMenu.createText.text, action: () => navigation.navigate('textEditor') }
  ]
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
})
