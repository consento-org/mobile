import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TopNavigation } from './components/TopNavigation'

export enum ErrorCode {
  noRelation = 'no-relation',
  noVault = 'no-vault'
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const errors = {
  [ErrorCode.noRelation]: 'Relation not found.',
  [ErrorCode.noVault]: 'Vault not found.'
}

export const ErrorScreen = ({ code }: { code: ErrorCode }): JSX.Element => {
  return <View style={styles.container}>
    <TopNavigation title='Error' back='main' />
    <View>
      <Text>{errors[code]}</Text>
    </View>
  </View>
}
