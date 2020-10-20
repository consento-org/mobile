import React, { forwardRef, useEffect, useState } from 'react'
import { Dimensions, ScaledSize, StyleSheet, View, ViewStyle, VirtualizedList } from 'react-native'
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
  style?: ViewStyle
  itemStyle: IGridItemStyle
  listKey?: (row: number, columns: number) => string
  keyExtractor?: (item: TFinal, index: number) => string
  centerContent?: boolean
  forwardRef?: React.Ref<VirtualizedList<unknown>>
}

const styles = StyleSheet.create({
  list: {
    height: 0 /* React-navigation fix - TODO check if new version fixes this or file bug */
  },
  row: {
    alignSelf: 'center',
    flexDirection: 'row'
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

function calcGrid (itemStyle: IGridItemStyle, getOrCreateElement: (index: number) => React.ReactNode, container: { width: number, height: number }): IGrid {
  const marginHorizontal = ((itemStyle.marginLeft ?? itemStyle.marginHorizontal ?? 0) + (itemStyle.marginRight ?? itemStyle.marginHorizontal ?? 0))
  const marginVertical = ((itemStyle.marginTop ?? itemStyle.marginVertical ?? 0) + (itemStyle.marginBottom ?? itemStyle.marginVertical ?? 0))
  const itemHeight = itemStyle.height + marginVertical
  const itemWidth = itemStyle.width + marginHorizontal
  const columns = (container.width / itemWidth) | 0
  const rows = (container.height / itemHeight) | 0
  const rowWidth = columns * itemWidth
  const rowStyle = StyleSheet.create({
    row: {
      ...styles.row,
      width: rowWidth,
      height: itemHeight
    }
  }).row
  return {
    columns,
    rows,
    getItem: (_: any, index: number): number => index * columns /* start */,
    getItemLayout: (_, index: number) => ({ length: itemHeight, offset: index * itemHeight, index }),
    renderRow: input => {
      const start = input.item as number
      const list = []
      for (let offset = 0; offset < columns; offset++) {
        list.push(getOrCreateElement(start + offset))
      }
      return <View key={`start-${start}`} style={rowStyle}>{list}</View>
    }
  }
}

function useGrid <TFinal> (itemStyle: IGridItemStyle, view: IArrayView<TFinal>, renderItem: (item: TFinal) => JSX.Element): IGrid {
  const [getOrCreateElement] = useState(() => {
    const cache: { [index: number]: React.ReactNode } = {}
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
    return (index: number): React.ReactNode => {
      let node = cache[index]
      if (node === undefined) {
        node = React.createElement(renderIndex, { key: `listItem-${index}`, index })
        cache[index] = node
      }
      return node
    }
  })
  let [grid, setGrid] = useState(() => calcGrid(itemStyle, getOrCreateElement, Dimensions.get('window')))
  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }): any => {
      const newGrid = calcGrid(itemStyle, getOrCreateElement, window)
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

type KeyedMobxGridProps = { view: IArrayView<any> } & Pick<IMobxGridProps<any, any>, 'keyExtractor' | 'itemStyle' | 'renderItem' | 'centerContent' | 'style'>
const KeyedMobxGrid = forwardRef<VirtualizedList<any>, KeyedMobxGridProps>(
  ({ view, style, keyExtractor, itemStyle, renderItem, centerContent }: KeyedMobxGridProps, ref) => {
    const { columns, getItem, getItemLayout, renderRow } = useGrid(itemStyle, view, renderItem)
    const numItems = useAutorun(() => view.size)
    const itemCount = Math.ceil(numItems / columns)
    return <VirtualizedList
      ref={ref}
      data={[]}
      extraData={`${itemCount}`}
      getItemCount={() => itemCount}
      style={style !== undefined ? StyleSheet.compose<ViewStyle>(styles.list, style) : styles.list}
      keyExtractor={(keyExtractor ?? defaultKeyExtractor) as () => string}
      renderItem={renderRow}
      {...{
        getItem, getItemLayout, centerContent
      }}
    />
  }
)

export type IMobxGrid = <TSource, TFinal = TSource>(props: IMobxGridProps<TSource, TFinal> & { ref?: React.Ref<VirtualizedList<any>> }) => JSX.Element
export const MobxGrid: IMobxGrid = forwardRef<VirtualizedList<any>, IMobxGridProps<any, any>>(
  (props: IMobxGridProps<any, any>, ref: any) => {
    const { data, style, filter, sort, map, start, limit, itemStyle, renderItem, keyExtractor, centerContent } = props
    const view = createView<any, any>(data, { filter, sort, map, start, limit })
    const key = useAutorun(() => view.key.get(), undefined, [data])
    return <KeyedMobxGrid {...{ view, style, key, ref, itemStyle, renderItem, keyExtractor, centerContent }} />
  }
) as unknown as IMobxGrid
