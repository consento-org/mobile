import { StyleProp, StyleSheet } from 'react-native'

type ComposeStyle <T> = StyleProp<T> | Array<StyleProp<T>>

function flatten <T> (style: ComposeStyle<T>): ComposeStyle<T> {
  if (!Array.isArray(style)) {
    return style
  }
  let result: Array<StyleProp<T>> = []
  for (let sub of style) {
    if (Array.isArray(sub)) {
      sub = flatten(sub as ComposeStyle<T>)
      result = result.concat(sub)
    } else {
      result.push(sub as ComposeStyle<T>)
    }
  }
  return result
}

export function composeAll <T> (style: ComposeStyle<T>, ...styles: Array<ComposeStyle<T>>): StyleProp<T> {
  if (styles.length === 0) {
    return style
  }
  let result = styles[0] === null ? style : StyleSheet.compose(style, styles[0])
  result = composeAll(result, ...styles.slice(1))
  return flatten(result)
}
