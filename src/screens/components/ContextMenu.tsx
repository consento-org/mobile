import React, { createContext, useState, useEffect } from 'react'
import { View, GestureResponderEvent, TouchableWithoutFeedback, TouchableOpacity, BackHandler, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { elementContextMenu } from '../../styles/design/layer/elementContextMenu'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { ViewBorders } from '../../styles/util/types'
import { IPopupContext, IPopupMenu, IPopupMenuEntry, IPopupMenuItem, isDivider } from './PopupMenu'

const noContext = (): void => {
  throw new Error('Not in a ContextMenu Context!')
}

export const ContextMenuContext = createContext<IPopupContext>({
  open: noContext,
  close: noContext
})

export interface IPopupMenuProps {
  children?: React.ReactChild | React.ReactChild[]
}

export const ContextMenu = ({ children }: IPopupMenuProps): JSX.Element => {
  const [active, setActive] = useState<{
    context: any
    items: IPopupMenuEntry[]
    pos: { left: number, top: number }
  } | null>(null)
  const open = (menu: IPopupMenu, event: GestureResponderEvent): void => {
    setActive({
      context: menu.context,
      items: menu.items,
      pos: {
        top: event.nativeEvent.pageY,
        left: event.nativeEvent.pageX
      }
    })
  }
  const close = (): void => setActive(null)
  useEffect(() => {
    if (active === null) return
    const lockBackHandler = (): boolean => {
      close()
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', lockBackHandler)
    return () => BackHandler.removeEventListener('hardwareBackPress', lockBackHandler)
  }, [active !== null])

  return <ContextMenuContext.Provider value={{ open, close }}>
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {children}
      {active !== null ? <ContextMenuDisplay
        close={close}
        context={active.context}
        items={active.items}
        pos={active.pos}
        onCancel={() => setActive(null)}
        onItemSelect={(item, event) => {
          setActive(null)
          // eslint-disable-next-line no-unused-expressions
          item?.action(active.context, event)
        }} /> : <></>}
    </View>
  </ContextMenuContext.Provider>
}

const Divider = (): JSX.Element => {
  return <View style={{ height: elementContextMenu.layers.divider.place.height }}>
    <View
      style={{
        width: '100%',
        height: elementContextMenu.layers.divider.layers.line.place.top,
        borderBottomWidth: elementContextMenu.layers.divider.layers.line.place.height,
        borderColor: elementContextMenu.layers.divider.layers.line.fill.color
      }} />
  </View>
}

const Item = ({ item, context, close }: { item: IPopupMenuItem, context: any, close: () => any }): JSX.Element => {
  return <TouchableOpacity
    style={{ height: elementContextMenu.layers.copy.place.height }} onPress={(event) => {
      item.action(context, event)
      close()
    }}>
    {
      item.dangerous ?? false
        ? <SketchElement src={elementContextMenu.layers.delete.layers.label}>{item.name}</SketchElement>
        : <SketchElement src={elementContextMenu.layers.copy.layers.label}>{item.name}</SketchElement>
    }
  </TouchableOpacity>
}

export interface IConsentMenuDisplayProps {
  pos: {
    top: number
    left: number
  }
  items: IPopupMenuEntry[]
  onCancel: () => void
  onItemSelect: (item: IPopupMenuItem, event: GestureResponderEvent) => void
  context: any
  close: () => any
}

const padding = {
  left: 10,
  right: 10,
  top: 10,
  bottom: 10
}
const offset = {
  top: -50,
  left: -50
}

export const ContextMenuDisplay = ({ items, onItemSelect, onCancel, pos, context, close }: IConsentMenuDisplayProps): JSX.Element => {
  const window = useWindowDimensions()
  const inset = useSafeAreaInsets()

  const width = elementContextMenu.place.width
  const height = items
    .map(item =>
      isDivider(item)
        ? elementContextMenu.layers.divider.place.height
        : elementContextMenu.layers.copy.place.height
    )
    .reduce(
      (height, itemHeight) => height + itemHeight
    ) +
    elementContextMenu.layers.copy.place.top +
    elementContextMenu.layers.delete.place.bottom

  const maxLeft = window.width - inset.right - padding.right
  const maxTop = window.width - inset.bottom - padding.bottom

  pos.left += offset.left
  pos.top += offset.top

  const left = (pos.left + width > maxLeft) ? maxLeft - width : Math.max(pos.left, padding.left)
  const top = (pos.top + height > maxTop) ? maxTop - height : Math.max(pos.top, padding.top)

  return <View style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1
  }}>
    <TouchableWithoutFeedback onPress={onCancel}>
      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: elementContextMenu.layers.darkening.fill.color }} />
    </TouchableWithoutFeedback>
    <View style={{ position: 'absolute', top, left, width, height, backgroundColor: elementContextMenu.layers.bg.fill.color, ...elementContextMenu.layers.bg.borderStyle(ViewBorders.all) }}>
      <View style={{ marginTop: elementContextMenu.layers.copy.place.top, display: 'flex', flexDirection: 'column' }}>
        {items.filter(Boolean).map((item, index) => {
          if (isDivider(item)) {
            return <Divider key={index} />
          }
          return <Item key={index} item={item} context={context} close={close} />
        })}
      </View>
    </View>
  </View>
}
