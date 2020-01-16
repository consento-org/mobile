import React, { createContext, useState, useEffect } from 'react'
import { View, GestureResponderEvent, TouchableWithoutFeedback, TouchableOpacity, BackHandler } from 'react-native'
import { IPopupContext, IPopupMenuItem } from './PopupMenu'
import { useVUnits } from '../../styles/Component'
import { useSafeArea } from 'react-native-safe-area-context'
import { elementContextMenu } from '../../styles/component/elementContextMenu'

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
    items: IPopupMenuItem[]
    pos: { left: number, top: number }
  }>(null)
  const open = (items: IPopupMenuItem[], context: any, event: GestureResponderEvent): void => {
    setActive({
      context,
      items,
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
        onItemSelect={(item, event) => {
          setActive(null)
          // eslint-disable-next-line no-unused-expressions
          item?.action(active.context, event)
        }} /> : <></>}
    </View>
  </ContextMenuContext.Provider>
}

const Divider = (): JSX.Element => {
  return <View style={{ height: elementContextMenu.divider.place.height }}>
    <View
      style={{
        width: '100%',
        height: elementContextMenu.divider.component.line.place.top,
        borderBottomWidth: elementContextMenu.divider.component.line.place.height,
        borderColor: elementContextMenu.divider.component.line.fill.color
      }} />
  </View>
}

const Item = ({ item, context, close }: { item: IPopupMenuItem, context: any, close: () => any }): JSX.Element => {
  return <TouchableOpacity
    style={{ height: elementContextMenu.copy.component.height }} onPress={(event) => {
      item.action(context, event)
      close()
    }}>
    {
      item.dangerous
        ? <elementContextMenu.delete.component.label.Render value={item.name} />
        : <elementContextMenu.copy.component.label.Render value={item.name} />
    }
  </TouchableOpacity>
}

export interface IConsentMenuDisplayProps {
  pos: {
    top: number
    left: number
  }
  items?: IPopupMenuItem[]
  onItemSelect: (item: IPopupMenuItem, event: GestureResponderEvent) => void
  context: any
  close: () => any
}

export const ContextMenuDisplay = ({ items, onItemSelect, pos, context, close }: IConsentMenuDisplayProps): JSX.Element => {
  const cancel = (): void => onItemSelect(null, null)
  const { vw, vh } = useVUnits()
  const inset = useSafeArea()

  const width = elementContextMenu.width
  const height = items
    .map(item => item === null ? elementContextMenu.divider.place.height : elementContextMenu.copy.place.height)
    .reduce((height, itemHeight) => height + itemHeight) + elementContextMenu.copy.place.top + (elementContextMenu.height - elementContextMenu.delete.place.bottom)

  const maxLeft = vw(100) - inset.right
  const maxTop = vh(100) - inset.bottom

  const left = (pos.left + width > maxLeft) ? maxLeft - width : pos.left
  const top = (pos.top + height > maxTop) ? maxTop - height : pos.top

  return <View style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1
  }}>
    <TouchableWithoutFeedback onPress={cancel}>
      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: elementContextMenu.darkening.fill.color }} />
    </TouchableWithoutFeedback>
    <View style={{ position: 'absolute', top, left, width, height, backgroundColor: elementContextMenu.bg.fill.color, borderRadius: elementContextMenu.bg.borderRadius }}>
      <View style={{ marginTop: elementContextMenu.copy.place.top, display: 'flex', flexDirection: 'column' }}>
        {items.map((item, index) => {
          if (item === null) {
            return <Divider key={index} />
          }
          return <Item key={index} item={item} context={context} close={close} />
        })}
      </View>
    </View>
  </View>
}
