import React, { forwardRef, useEffect, useState } from 'react'
import { Dimensions, ScaledSize, StyleSheet, View, VirtualizedList } from 'react-native'
import { createView, IArrayView, IFilter, IMap, ISort, ISupportedArray } from '../../util/ArraySetView'
import { useAutorun } from '../../util/useAutorun'

export interface IGridItemStyle {
  width: number
  height: number
  marginHorizontal?: number
  marginVertical?: number
  marginLeft?: number
  marginRight?: number
  marginTop?: number
  marginBottom?: number
}

export interface IMobxGridProps<TSource, TFinal = TSource> {
  data: ISupportedArray<TSource>
  filter?: IFilter<TSource>
  sort?: ISort<TSource>
  map?: IMap<TSource, TFinal>
  start?: number
  limit?: number
  renderItem: (item: TFinal) => JSX.Element
  itemStyle: IGridItemStyle
  listKey?: (row: number, columns: number) => string
  keyExtractor?: (item: TFinal, index: number) => string
  centerContent?: boolean
  forwardRef?: React.Ref<VirtualizedList<unknown>>
}

const styles = StyleSheet.create({
  list: {
    height: 0 /* React-navigation fix - TODO check if new version fixes this or file bug */
  }
})

const defaultKeyExtractor = (_: any, index: number): string => index.toString()

interface IGrid {
  columns: number
  rows: number
  getItem: (_: any, index: number) => number
  getItemLayout: (data: any, index: number) => { length: number, offset: number, index: number }
  renderRow: (input: { index: number, item: unknown }) => JSX.Element
}

function calcGrid (style: IGridItemStyle, getOrCreateElement: (index: number) => React.ReactNode, container: { width: number, height: number }): IGrid {
  const columns = container.width / style.width | 0
  const rows = container.height / style.height | 0
  const marginHorizontal = ((style.marginLeft ?? style.marginHorizontal ?? 0) + (style.marginRight ?? style.marginHorizontal ?? 0))
  const marginVertical = ((style.marginTop ?? style.marginVertical ?? 0) + (style.marginBottom ?? style.marginVertical ?? 0))
  const height = style.height + marginVertical
  const width = columns * (style.width + marginHorizontal)
  const itemStyle = StyleSheet.create({
    item: {
      alignSelf: 'center',
      flexDirection: 'row',
      width,
      height
    }
  }).item
  return {
    columns,
    rows,
    getItem: (_: any, index: number): number => index * columns /* start */,
    getItemLayout: (_, index: number) => ({ length: height, offset: index * height, index }),
    renderRow: input => {
      const start = input.item as number
      const list = []
      for (let offset = 0; offset < columns; offset++) {
        list.push(getOrCreateElement(start + offset))
      }
      return <View key={`start-${start}`} style={itemStyle}>{list}</View>
    }
  }
}

function useGrid <TFinal> (style: IGridItemStyle, view: IArrayView<TFinal>, renderItem: (item: TFinal) => JSX.Element): IGrid {
  const [getOrCreateElement] = useState(() => {
    const cache: { [index: number]: React.ReactNode } = {}
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
    return (index: number): React.ReactNode => {
      let node = cache[index]
      if (node === undefined) {
        node = React.createElement(renderIndex, { key: `listItem-${index}`, index })
        cache[index] = node
      }
      return node
    }
  })
  let [grid, setGrid] = useState(() => calcGrid(style, getOrCreateElement, Dimensions.get('window')))
  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }): any => {
      const newGrid = calcGrid(style, getOrCreateElement, window)
      if (newGrid.columns !== grid.columns || newGrid.rows !== grid.rows) {
        grid = newGrid
        setGrid(newGrid)
      }
    }
    Dimensions.addEventListener('change', handler)
    return () => Dimensions.removeEventListener('change', handler)
  }, [])
  return grid
}

export type IMobxGrid = <TSource, TFinal = TSource>(props: IMobxGridProps<TSource, TFinal> & { ref?: React.Ref<VirtualizedList<any>> }) => JSX.Element | null
export const MobxGrid: IMobxGrid = forwardRef<VirtualizedList<any>, IMobxGridProps<any, any>>(function <TSource, TFinal = TSource> (props: IMobxGridProps<TSource, TFinal>, ref: any): JSX.Element | null {
  const { data, filter, sort, map, start, limit, itemStyle, renderItem, keyExtractor, centerContent } = props
  const view = createView<TSource, TFinal>(data, { filter, sort, map, start, limit })
  const { columns, getItem, getItemLayout, renderRow } = useGrid(itemStyle, view, renderItem)
  const numItems = useAutorun(() => view.size)
  const itemCount = Math.ceil(numItems / columns)
  return <VirtualizedList
    ref={ref}
    data={[]}
    extraData={itemCount}
    getItemCount={() => itemCount}
    style={styles.list}
    keyExtractor={(keyExtractor ?? defaultKeyExtractor) as () => string}
    renderItem={renderRow}
    {...{
      getItem, getItemLayout, centerContent
    }}
  />
} as any) as unknown as IMobxGrid
