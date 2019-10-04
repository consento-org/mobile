import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'

export async function getExpoToken(): Promise<string> {
  // Adopted from https://docs.expo.io/versions/v34.0.0/guides/push-notifications/
  const result = await Permissions.getAsync(Permissions.NOTIFICATIONS)

  const { status: existingStatus } = result

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status: finalStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS)

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      throw Object.assign(new Error(`Permission to receive Notifications not granted!`), {
        status: finalStatus
      })
    }
  }

  // Get the token that uniquely identifies this device
  return await Notifications.getExpoPushTokenAsync()
}
