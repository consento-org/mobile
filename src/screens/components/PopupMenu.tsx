import React, { useState, createContext } from 'react'
import { View, ViewStyle, Text, TextStyle } from 'react-native'
import { elementPopUpMenu } from '../../styles/component/elementPopUpMenu'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler'

export interface IPopupMenuItem {
  name: string
  action (): void
}

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

interface IPopupContext {
  open (): void
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
  items: IPopupMenuItem[]
  children?: React.ReactChild | React.ReactChild[]
}

export const PopupMenu = ({ items, children }: IPopupMenuProps): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false)
  const open = (): void => setVisible(true)
  const close = (): void => setVisible(false)
  return <PopupContext.Provider value={{ open, close }}>
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {children}
      {visible ? <PopupMenuDisplay
        items={items}
        onItemSelect={item => {
          setVisible(false)
          // eslint-disable-next-line no-unused-expressions
          item?.action()
        }} /> : null}
    </View>
  </PopupContext.Provider>
}

export const PopupMenuDisplay = ({ items, onItemSelect }: { items?: IPopupMenuItem[], onItemSelect: (item?: IPopupMenuItem) => any }): JSX.Element => {
  const cancel = (): void => onItemSelect(null)
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
        items?.map(item =>
          <TouchableOpacity containerStyle={{ width: '100%' }} activeOpacity={0.8} onPress={() => onItemSelect(item)}>
            <Text style={{
              ...elementPopUpMenu.createText.style,
              ...itemStyle,
              height: elementPopUpMenu.createText.place.height,
              textAlignVertical: 'center',
              backgroundColor: elementPopUpMenu.buttonBg.fill.color
            }}>{item.name}</Text>
          </TouchableOpacity>
        )
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
