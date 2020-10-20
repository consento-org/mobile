import React, { useState, createContext } from 'react'
import { View, TextStyle, GestureResponderEvent, StyleSheet, Pressable } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { elementPopUpMenu } from '../../styles/design/layer/elementPopUpMenu'
import { SketchElement } from '../../styles/util/react/SketchElement'
import { useBackHandler } from '../../util/navigate'

export type IPopupMenuEntry <TContext = any> = IPopupMenuItem<TContext> | Symbol

export interface IPopupMenuItem<TContext = any> {
  name: string
  dangerous?: boolean
  action: (context: TContext, event: GestureResponderEvent) => any
}

export interface IPopupMenu <TContext = any> {
  context?: TContext
  items: Array<IPopupMenuEntry<TContext>>
}

export interface IPopupContext {
  open: <TContext = any>(menu: IPopupMenu<TContext>, event: GestureResponderEvent) => void
  close: () => void
}

export interface IPopupMenuProps {
  children?: React.ReactChild | React.ReactChild[]
}

export const DIVIDER = Symbol('consento/context/divider')

export function isDivider <TContext = any> (input: IPopupMenuEntry<TContext>): input is Symbol {
  return input === DIVIDER
}

const itemStyle: TextStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: elementPopUpMenu.layers.buttonBg.fill.color,
  borderTopWidth: 1,
  borderColor: elementPopUpMenu.layers.separator.fill.color
}

const { borderRadius } = elementPopUpMenu.layers.topBg.borderStyle()

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: elementPopUpMenu.layers.buttonBg.place.bottom,
    paddingLeft: elementPopUpMenu.layers.buttonBg.place.left,
    paddingRight: elementPopUpMenu.layers.buttonBg.place.right
  },
  bg: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: elementPopUpMenu.layers.bg.fill.color
  },
  first: {
    ...itemStyle,
    alignSelf: 'stretch',
    height: elementPopUpMenu.layers.description.place.height,
    borderTopRightRadius: borderRadius,
    borderTopLeftRadius: borderRadius,
    borderTopWidth: 0
  },
  item: {
    ...itemStyle,
    height: elementPopUpMenu.layers.createText.place.height,
    backgroundColor: elementPopUpMenu.layers.buttonBg.fill.color
  },
  last: {
    ...itemStyle,
    height: elementPopUpMenu.layers.disabled.place.height,
    borderBottomRightRadius: borderRadius,
    borderBottomLeftRadius: borderRadius
  },
  cancel: {
    ...itemStyle,
    height: elementPopUpMenu.layers.cancel.place.height,
    borderRadius,
    marginTop: elementPopUpMenu.layers.buttonBg.place.spaceY(elementPopUpMenu.layers.bottomBg.place)
  }
})

const noContext = (): void => {
  throw new Error('Not in a PopupMenu Context!')
}

export const PopupContext = createContext<IPopupContext>({
  open: noContext,
  close: noContext
})

export const PopupMenu = ({ children }: IPopupMenuProps): JSX.Element => {
  const [active, setActive] = useState<IPopupMenu | null>(() => null)
  const close = (): void => setActive(null)

  useBackHandler(close, { deps: [active !== null], active: active !== null })

  const context: IPopupContext = {
    open: (menu) => setActive(menu),
    close
  }

  return <PopupContext.Provider value={context}>
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {children}
      {active !== null ? <PopupMenuDisplay
        items={active.items}
        onCancel={() => {
          setActive(null)
        }}
        onItemSelect={(item, event) => {
          setActive(null)
          item?.action(active.context, event)
        }} /> : <></>}
    </View>
  </PopupContext.Provider>
}

interface IPopupMenuDisplayProps {
  items: IPopupMenuEntry[]
  onCancel: () => void
  onItemSelect: (item: IPopupMenuItem, event: GestureResponderEvent) => void
}

export const PopupMenuDisplay = ({ items, onItemSelect, onCancel }: IPopupMenuDisplayProps): JSX.Element => {
  return <View style={styles.container}>
    <Pressable onPress={onCancel} style={styles.bg}>
      <View />
    </Pressable>
    <View style={styles.menu}>
      <View style={styles.first}><SketchElement src={elementPopUpMenu.layers.description} /></View>
      {
        items.map((item, index) => {
          if (item instanceof Symbol) {
            return null
          }
          return <TouchableOpacity containerStyle={styles.item} key={index} activeOpacity={0.8} onPress={event => onItemSelect(item, event)}>
            <SketchElement src={elementPopUpMenu.layers.createText}>{item.name}</SketchElement>
          </TouchableOpacity>
        })
      }
      <View style={styles.last}><SketchElement src={elementPopUpMenu.layers.disabled} /></View>
      <TouchableOpacity containerStyle={styles.cancel} activeOpacity={0.8} onPress={onCancel}>
        <SketchElement src={elementPopUpMenu.layers.cancel} />
      </TouchableOpacity>
    </View>
  </View>
}
