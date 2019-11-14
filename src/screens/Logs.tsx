import React from 'react'
import { FlatList, View, Text } from 'react-native'
import { elementLogLine } from '../styles/component/elementLogLine'

interface LogEntry {
  key: string
  date: number
  data: string
}

const sampleData = [
  { key: '1', date: Date.now(), data: `A very long log message, with 
  
line breaks, because that is funny to layout and hard to display.` },
  { key: '2', date: Date.now(), data: 'Vault created.' },
  { key: '3', date: Date.now(), data: 'XXX.' },
  { key: '4', date: Date.now(), data: 'YYY.' },
  { key: '5', date: Date.now(), data: 'ZZZ.' },
  { key: '6', date: Date.now(), data: 'Hoola Hoop.' }
] as LogEntry[]

class LogEntry extends React.Component<{ item: LogEntry }> {
  render () {
    return <View style={{ display: 'flex', flexDirection: 'column' }}>
      <Text style={{
        ...elementLogLine.time.style,
        paddingLeft: elementLogLine.time.place.x,
        paddingRight: elementLogLine.width - elementLogLine.time.place.right,
        height: elementLogLine.time.place.height
      }}>{ '02.10.2019' }</Text>
      <Text style={{
        ...elementLogLine.text.style,
        backgroundColor: elementLogLine.bg.fill.color,
        paddingTop: elementLogLine.text.place.y - elementLogLine.bg.place.y,
        paddingBottom: elementLogLine.height - elementLogLine.text.place.bottom,
        paddingLeft: elementLogLine.text.place.x,
        paddingRight: elementLogLine.width - elementLogLine.text.place.right,
        width: 'auto'
      }}>{ this.props.item.data }</Text>
    </View>
  }
}

export class Logs extends React.Component {
  render () {
    return <FlatList style={{ backgroundColor: elementLogLine.backgroundColor }} renderItem={ (item: any) => <LogEntry item={ item.item as LogEntry } /> } data={ sampleData }/>
  }
}
