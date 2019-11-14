import React, { ReactNode } from 'react'
import { Text } from 'react-native'
import { flatten, Hierarchy } from './flatten'

export interface IIconProps {
  focused: boolean
  tintColor?: string
  horizontal?: boolean
}

export type IIcon = ReactNode | ((props: IIconProps) => ReactNode)

function isString (val: any): val is string {
  return typeof val === 'string'
}

function isIcon (val: any): val is IIcon {
  if (typeof val !== 'object') return true
  if (Array.isArray(val)) return true
  if (val.hasOwnProperty('type')) return true
  return false
}

export interface TContextData {
  icons: Hierarchy<IIcon>,
  strings: Hierarchy<string>
}

export interface IContext {
  t (key: string, ...params: string[]): string
  hasT (key: string): boolean
  icon (key: string, props?: IIconProps): ReactNode
  hasIcon (key: string, props?: IIconProps): boolean
  ctx (subPrefix: string): IContext
}

export function context ({ icons: iconsHierarchy, strings: stringsHierarchy }: TContextData) {
  const icons = flatten(isIcon, iconsHierarchy)
  const strings = flatten(isString, stringsHierarchy)
  return ctx('')

  function ctx (prefix): IContext {
    return {
      t (key, ...params) {
        return strings[`${prefix}${key}`] || `<${prefix}${key}>`
      },
      hasT (key) {
        return strings.hasOwnProperty(`${prefix}${key}`)
      },
      icon (key, props?: IIconProps) {
        const path = `${prefix}${key}`
        const icon = icons[path]
        if (typeof icon === 'function') {
          return icon(props)
        }
        if (typeof icon !== undefined) {
          return icon
        }
        return <Text>{`$ICON[${path}]`}</Text>
      },
      hasIcon (key, props?: IIconProps) {
        const path = `${prefix}${key}`
        const icon = icons[path]
        return (icon !== undefined)
      },
      ctx (subPrefix) {
        return ctx(`${prefix}${subPrefix}.`)
      }
    }
  }
}
