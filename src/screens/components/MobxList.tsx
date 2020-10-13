import React, { forwardRef, useState } from 'react'
import { ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle, VirtualizedList } from 'react-native'
import { createView, IFilter, IMap, ISort, ISupportedArray } from '../../util/ArraySetView'
import { useAutorun } from '../../util/useAutorun'

export interface IListItemStyle {
  height: number
  marginVertical?: number
  marginTop?: number
  marginBottom?: number
}

export interface IMobxGridProps<TSource, TFinal = TSource> {
  data: ISupportedArray<TSource>
  style?: StyleProp<ViewStyle>
  filter?: IFilter<TSource>
  sort?: ISort<TSource>
  map?: IMap<TSource, TFinal>
  start?: number
  limit?: number
  renderItem: (item: TFinal) => JSX.Element
  itemStyle: IListItemStyle
  listKey?: (row: number, columns: number) => string
  keyExtractor?: (item: TFinal, index: number) => string
  centerContent?: boolean
}

const styles = StyleSheet.create({
  list: {
    height: 0 /* React-navigation fix - TODO check if new version fixes this or file bug */
  }
})

const defaultKeyExtractor = (_: any, index: number): string => index.toString()
const getItem = (_: any, index: number): number => index

export type IMobxList = <TSource, TFinal = TSource> (props: IMobxGridProps<TSource, TFinal> & { ref?: React.Ref<VirtualizedList<any>> }) => JSX.Element
export const MobxList: IMobxList = forwardRef<any, any>(function <TSource, TFinal = TSource> (props: IMobxGridProps<TSource, TFinal>, ref: any): JSX.Element {
  const { data, style, filter, sort, map, start, limit, itemStyle, renderItem, keyExtractor, centerContent } = props
  const view = createView<TSource, TFinal>(data, { filter, sort, map, start, limit })
  const [getOrCreateElement] = useState(() => {
    const cache: { [index: number]: React.ReactElement } = {}
    const renderIndex = ({ index }: { index: number }): JSX.Element => {
      const lookup = useAutorun(() => {
        if (index >= view.size) {
          return -1
        }
        return view.item(index)
      })
      if (lookup === -1) {
        return <></>
      }
      // It is important that the index lookup is here. This way renderItem will be only called if the
      // result of `view.item(index)` changes.
      return renderItem(view.item(index))
    }
    return (index: number): React.ReactElement => {
      let node = cache[index]
      if (node === undefined) {
        node = React.createElement(renderIndex, { key: `listItem-${index}`, index })
        cache[index] = node
      }
      return node
    }
  })
  const numItems = useAutorun(() => view.size)
  const marginVertical = ((itemStyle.marginTop ?? itemStyle.marginVertical ?? 0) + (itemStyle.marginBottom ?? itemStyle.marginVertical ?? 0))
  const height = itemStyle.height + marginVertical
  return <VirtualizedList
    ref={ref}
    data={[]}
    style={style !== undefined ? StyleSheet.compose<ViewStyle>(styles.list, style) : styles.list}
    extraData={numItems}
    getItem={getItem}
    getItemLayout={(_, index) => ({ length: height, offset: index * height, index })}
    getItemCount={() => numItems}
    centerContent={centerContent}
    keyExtractor={(keyExtractor ?? defaultKeyExtractor) as () => string}
    renderItem={(item: ListRenderItemInfo<unknown>) => getOrCreateElement(item.index)}
  />
} as any) as any
