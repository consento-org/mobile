import React, { useContext } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { useHumanSince } from '../util/useHumanSince'
import { ILogEntry } from '../model/Consento.types'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'
import { screenshots } from '../util/screenshots'
import { elementLogLine } from '../styles/design/layer/elementLogLine'
import { SketchElement } from '../styles/util/react/SketchElement'

const styles = StyleSheet.create({
  list: {
    backgroundColor: elementLogLine.backgroundColor
  },
  logEntry: {
    display: 'flex',
    flexDirection: 'column'
  },
  time: {
    paddingLeft: elementLogLine.layers.time.place.x,
    paddingRight: elementLogLine.layers.time.place.right,
    height: elementLogLine.layers.time.place.height
  },
  text: {
    backgroundColor: elementLogLine.layers.bg.fill.color,
    paddingTop: elementLogLine.layers.text.place.y - elementLogLine.layers.bg.place.y,
    paddingBottom: elementLogLine.layers.text.place.bottom,
    paddingLeft: elementLogLine.layers.text.place.x,
    paddingRight: elementLogLine.layers.text.place.right,
    width: 'auto'
  }
})

const LogEntry = ({ item }: { item: ILogEntry }): JSX.Element =>
  <View style={styles.logEntry}>
    <SketchElement src={elementLogLine.layers.time} style={styles.time}>{useHumanSince(item.time)}</SketchElement>
    <SketchElement src={elementLogLine.layers.text} style={styles.text}>{item.text}</SketchElement>
  </View>

const renderItem = (item: any): JSX.Element => <LogEntry item={item.item as ILogEntry} />

export const Logs = observer((): JSX.Element => {
  const { vault } = useContext(VaultContext)
  if (vault === null) {
    throw new Error('not in vault context')
  }
  screenshots.vaultLog.takeSync(500)
  return <FlatList style={styles.list} renderItem={renderItem} data={vault.log} />
})
