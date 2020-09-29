import React, { useEffect, useState } from 'react'
import { ArraySet } from 'mobx-keystone'
import { observer } from 'mobx-react'
import { Dimensions, ScaledSize, StyleSheet, View, VirtualizedList } from 'react-native'
import { IFilter, ISort } from '../../util/ArraySetView'

export interface IMobxGridProps<TItem> {
  arraySet: ArraySet<TItem>
  renderItem: (item: TItem) => JSX.Element
  filter?: IFilter<TItem>
  sort?: ISort<TItem>
  itemStyle: {
    width: number
    height: number
    marginHorizontal: number
  }
  listKey?: (numColumns: number) => string
  keyExtractor?: (item: TItem, index: number) => string
}

const styles = StyleSheet.create({
  list: {
    height: 0 /* React-navigation fix - TODO check if new version fixes this or file bug */
  }
})

const defaultKeyExtractor = (_: any, index: number): string => index.toString()

interface IGrid { columns: number, rows: number }

function calcGrid (item: { width: number, height: number }, container: { width: number, height: number }): IGrid {
  const columns = container.width / item.width | 0
  const rows = container.height / item.height | 0
  return { columns, rows }
}

function useGrid (size: { width: number, height: number }): IGrid {
  let [grid, setGrid] = useState(() => calcGrid(size, Dimensions.get('window')))
  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }): any => {
      const newGrid = calcGrid(size, window)
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

export const MobxGrid = observer(function <TItem> ({ arraySet, itemStyle, renderItem, listKey, keyExtractor }: IMobxGridProps<TItem>): JSX.Element {
  const { columns, rows } = useGrid(itemStyle)
  const numVaults = arraySet.size
  const initialNumToRender = rows + 1
  return React.createElement(
    VirtualizedList,
    {
      key: `list-${rows}-${columns}`,
      data: arraySet,
      listKey: (listKey !== undefined ? listKey(columns) : null) ?? `grid-${columns}`,
      getItem: (arraySet: ArraySet<TItem>, index: number): TItem[] => arraySet.items.slice((index * columns), (index * columns) + columns),
      getItemCount: () => Math.ceil(numVaults / columns),
      centerContent: true,
      initialNumToRender,
      style: styles.list,
      keyExtractor: (keyExtractor ?? defaultKeyExtractor) as () => string,
      renderItem: (input: { index: number, item: unknown }): JSX.Element => {
        const vaultRow = input.item as TItem[]
        return <View key={`row-${input.index}`} style={{ alignSelf: 'center', flexDirection: 'row', width: columns * itemStyle.width + (columns * itemStyle.marginHorizontal * 2) }}>
          {vaultRow.map(vault => renderItem(vault))}
        </View>
      }
    },
    null
  )
})
