import { Alert } from 'react-native'

export function deleteWarning ({ onPress, itemName }: { onPress: () => any, itemName: string }): void {
  Alert.alert(
    'Delete',
    `Are you sure you want to delete this ${itemName}? This can not be reverted!`,
    [
      {
        text: 'Delete',
        onPress
      },
      { text: 'Cancel' }
    ]
  )
}
