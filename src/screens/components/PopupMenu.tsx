import React, { useState, createContext, useEffect } from 'react'
import { View, ViewStyle, Text, TextStyle, GestureResponderEvent, BackHandler } from 'react-native'
import { elementPopUpMenu } from '../../styles/component/elementPopUpMenu'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler'

export interface IPopupMenuItem<TContext = any> {
  name: string
  dangerous?: boolean
  action (context: TContext, event: GestureResponderEvent): any
}

export const DIVIDER = Symbol('consento/context/divider')

export function isDivider <TContext = any> (input: TPopupMenuItem<TContext>): input is Symbol {
  return input === DIVIDER
}

export type TPopupMenuItem <TContext = any> = IPopupMenuItem<TContext> | Symbol

const style: ViewStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  paddingBottom: elementPopUpMenu.height - elementPopUpMenu.buttonBg.place.bottom,
  paddingLeft: elementPopUpMenu.buttonBg.place.left,
  paddingRight: elementPopUpMenu.width - elementPopUpMenu.buttonBg.place.right
}

const itemStyle: TextStyle = {
  width: '100%',
  textAlignVertical: 'center',
  backgroundColor: elementPopUpMenu.buttonBg.fill.color,
  borderTopWidth: 1,
  borderColor: elementPopUpMenu.separator.fill.color
}

const { borderRadius } = elementPopUpMenu.buttonBg

export interface IPopupContext {
  open <TContext = any, TItem = any> (actions: Array<IPopupMenuItem<TContext, TItem>>, context?: TContext, event?: GestureResponderEvent): void
  close (): void
}

const noContext = (): void => {
  throw new Error('Not in a PopupMenu Context!')
}

export const PopupContext = createContext<IPopupContext>({
  open: noContext,
  close: noContext
})

export interface IPopupMenuProps {
  children?: React.ReactChild | React.ReactChild[]
}

export const PopupMenu = ({ children }: IPopupMenuProps): JSX.Element => {
  const [active, setActive] = useState<{
    context: any
    items: IPopupMenuItem[]
  }>(null)
  const open = (items: IPopupMenuItem[], context: any): void => setActive({ context, items })
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

  return <PopupContext.Provider value={{ open, close }}>
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {children}
      {active !== null ? <PopupMenuDisplay
        items={active.items}
        onItemSelect={(item, event) => {
          setActive(null)
          // eslint-disable-next-line no-unused-expressions
          item?.action(active.context, event)
        }} /> : <></>}
    </View>
  </PopupContext.Provider>
}

export const PopupMenuDisplay = ({ items, onItemSelect }: { items?: IPopupMenuItem[], onItemSelect: (item: IPopupMenuItem, event: GestureResponderEvent) => void }): JSX.Element => {
  const cancel = (): void => onItemSelect(null, null)
  return <View style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1
  }}>
    <TouchableWithoutFeedback style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: elementPopUpMenu.bg.fill.color }} onPress={cancel}>
      <View />
    </TouchableWithoutFeedback>
    <View style={style}>
      <Text style={{
        ...elementPopUpMenu.disabled.style,
        ...itemStyle,
        height: elementPopUpMenu.description.place.height,
        borderColor: elementPopUpMenu.separator.fill.color,
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius
      }}>{elementPopUpMenu.description.text}</Text>
      {
        items?.map((item, index) => {
          if (item instanceof Symbol) {
            return null
          }
          return <TouchableOpacity containerStyle={{ width: '100%' }} key={index} activeOpacity={0.8} onPress={event => onItemSelect(item, event)}>
            <Text style={{
              ...elementPopUpMenu.createText.style,
              ...itemStyle,
              height: elementPopUpMenu.createText.place.height,
              textAlignVertical: 'center',
              backgroundColor: elementPopUpMenu.buttonBg.fill.color
            }}>{item.name}</Text>
          </TouchableOpacity>
        })
      }
      <Text style={{
        ...elementPopUpMenu.disabled.style,
        ...itemStyle,
        height: elementPopUpMenu.disabled.place.height,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius
      }}>{elementPopUpMenu.disabled.text}</Text>
      <TouchableOpacity containerStyle={{ width: '100%' }} activeOpacity={0.8} onPress={cancel}>
        <Text style={{
          ...elementPopUpMenu.cancel.style,
          marginTop: elementPopUpMenu.buttonBg.place.top - elementPopUpMenu.bottomBg.place.bottom,
          width: '100%',
          height: elementPopUpMenu.buttonBg.place.height,
          textAlignVertical: 'center',
          backgroundColor: elementPopUpMenu.buttonBg.fill.color,
          borderRadius
        }}>{elementPopUpMenu.cancel.text}</Text>
      </TouchableOpacity>
    </View>
  </View>
}
