import React, { useContext } from 'react'
import { FlatList, View, Text, ViewStyle } from 'react-native'
import { elementLogLine } from '../styles/component/elementLogLine'
import { useHumanSince } from '../util/useHumanSince'
import { ILogEntry } from '../model/Consento.types'
import { observer } from 'mobx-react'
import { VaultContext } from '../model/VaultContext'
import { ScreenshotContext, useScreenshotEnabled } from '../util/screenshots'
import { withNavigationFocus } from 'react-navigation'

const LogEntry = ({ item }: { item: ILogEntry }): JSX.Element =>
  <View style={{ display: 'flex', flexDirection: 'column' }}>
    <Text style={{
      ...elementLogLine.time.style,
      paddingLeft: elementLogLine.time.place.x,
      paddingRight: elementLogLine.width - elementLogLine.time.place.right,
      height: elementLogLine.time.place.height
    }}>{useHumanSince(item.time)}</Text>
    <Text style={{
      ...elementLogLine.text.style,
      backgroundColor: elementLogLine.bg.fill.color,
      paddingTop: elementLogLine.text.place.y - elementLogLine.bg.place.y,
      paddingBottom: elementLogLine.height - elementLogLine.text.place.bottom,
      paddingLeft: elementLogLine.text.place.x,
      paddingRight: elementLogLine.width - elementLogLine.text.place.right,
      width: 'auto'
    }}>{item.text}</Text>
  </View>

const renderItem = (item: any): JSX.Element => <LogEntry item={item.item as ILogEntry} />

const style: ViewStyle = {
  backgroundColor: elementLogLine.backgroundColor
}

const FocusedLog = observer((): JSX.Element => {
  const { vault } = useContext(VaultContext)
  const screenshots = useContext(ScreenshotContext)
  screenshots.vaultLog.takeSync(500)
  return <FlatList style={style} renderItem={renderItem} data={vault.log} />
})

export const Logs = withNavigationFocus(({ isFocused }: { isFocused: boolean }) => {
  const isScreenshotEnabled = useScreenshotEnabled()
  if (!isScreenshotEnabled || isFocused) {
    return <FocusedLog />
  }
  return <View />
})
