import React, { forwardRef, useState } from 'react'
import { ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle, VirtualizedList } from 'react-native'
import { createView, IArrayView, IFilter, IMap, ISort, ISupportedArray } from '../../util/ArraySetView'
import { useAutorun } from '../../util/useAutorun'

export interface IListItemStyle {
  height: number
  marginVertical?: number
  marginTop?: number
  marginBottom?: number
}

export interface IMobxListProps<TSource, TFinal = TSource> {
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

type KeyedMobxGridProps = { view: IArrayView<any> } & Pick<IMobxListProps<any, any>, 'keyExtractor' | 'itemStyle' | 'renderItem' | 'centerContent' | 'style'>
const KeyedMobxList = forwardRef<VirtualizedList<any>, KeyedMobxGridProps>(
  ({ view, style, keyExtractor, itemStyle, renderItem, centerContent }: KeyedMobxGridProps, ref) => {
    const [getOrCreateElement] = useState(() => {
      const cache: { [index: number]: React.ReactElement } = {}
      const renderIndex = ({ index }: { index: number }): JSX.Element => {
        const lookup = useAutorun(() => {
          view.key.get()
          if (index >= view.size) {
            return undefined
          }
          return view.item(index)
        })
        if (lookup === undefined) {
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
  })

export type IMobxList = <TSource, TFinal = TSource> (props: IMobxListProps<TSource, TFinal> & { ref?: React.Ref<VirtualizedList<any>> }) => JSX.Element
export const MobxList: IMobxList = forwardRef<any, any>(
  (props: IMobxListProps<any, any>, ref: any) => {
    const { data, filter, sort, map, start, limit, itemStyle, renderItem, keyExtractor, centerContent, style } = props
    const view = createView<any, any>(data, { filter, sort, map, start, limit })
    const { key } = useAutorun(() => ({ numItems: view.size, key: view.key.get() }), undefined, [data])
    return <KeyedMobxList {...{ view, key, targeRef: ref, itemStyle, renderItem, keyExtractor, centerContent, style }} />
  }
) as unknown as IMobxList
