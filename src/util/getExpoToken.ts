import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'
import randomBytes from 'get-random-values-polypony'
import Constants from 'expo-constants'
import { bufferToString } from '@consento/api/util'
import { createError } from './createError'

function rndChar (num: number): string {
  return bufferToString(randomBytes(new Uint8Array(num * 2)), 'hex')
}

function randomDummyExpoToken (): string {
  const prefix = Math.random() > 0.5 ? 'ExponentPushToken' : 'ExpoPushToken'
  return `${prefix}[${rndChar(8)}-${rndChar(4)}-${rndChar(4)}-${rndChar(4)}-${rndChar(12)}]`
}

async function _getExpoToken (): Promise<string> {
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
      throw createError('Permission to receive Notifications not granted!', {
        status: finalStatus
      })
    }
  }

  // Get the token that uniquely identifies this device
  try {
    return await Notifications.getExpoPushTokenAsync()
  } catch (error) {
    if (Constants.debugMode) {
      console.warn(`[DEV MODE ONLY!] Error while collecting expo token, using dummy token: ${String(error)}`)
      return randomDummyExpoToken()
    }
    throw error
  }
}

const expoToken = _getExpoToken()

export async function getExpoToken (): Promise<string> {
  return await expoToken
}
