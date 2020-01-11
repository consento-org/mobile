import React from 'react'
import { FlatList, View, Text, ViewStyle } from 'react-native'
import { elementLogLine } from '../styles/component/elementLogLine'

interface LogEntry {
  key: string
  date: number
  data: string
}

const sampleData: LogEntry[] = [
  {
    key: '1', date: Date.now(), data: `A very long log message, with 
  
line breaks, because that is funny to layout and hard to display.`
  },
  { key: '2', date: Date.now(), data: 'Vault created.' },
  { key: '3', date: Date.now(), data: 'XXX.' },
  { key: '4', date: Date.now(), data: 'YYY.' },
  { key: '5', date: Date.now(), data: 'ZZZ.' },
  { key: '6', date: Date.now(), data: 'Hoola Hoop.' }
]

const LogEntry = ({ item }: { item: LogEntry }): JSX.Element =>
  <View style={{ display: 'flex', flexDirection: 'column' }}>
    <Text style={{
      ...elementLogLine.time.style,
      paddingLeft: elementLogLine.time.place.x,
      paddingRight: elementLogLine.width - elementLogLine.time.place.right,
      height: elementLogLine.time.place.height
    }}>02.10.2019</Text>
    <Text style={{
      ...elementLogLine.text.style,
      backgroundColor: elementLogLine.bg.fill.color,
      paddingTop: elementLogLine.text.place.y - elementLogLine.bg.place.y,
      paddingBottom: elementLogLine.height - elementLogLine.text.place.bottom,
      paddingLeft: elementLogLine.text.place.x,
      paddingRight: elementLogLine.width - elementLogLine.text.place.right,
      width: 'auto'
    }}>{item.data}</Text>
  </View>

const renderItem = (item: any): JSX.Element => <LogEntry item={item.item as LogEntry} />

const style: ViewStyle = {
  backgroundColor: elementLogLine.backgroundColor
}

export const Logs = (): JSX.Element => <FlatList style={style} renderItem={renderItem} data={sampleData} />
