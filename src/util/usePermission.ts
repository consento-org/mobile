import { useEffect, useState } from 'react'
import { askAsync, PermissionStatus, PermissionType } from 'expo-permissions'

export { PermissionStatus }

export enum Permissions {
  CAMERA = 'camera',
  CAMERA_ROLL = 'cameraRoll',
  AUDIO_RECORDING = 'audioRecording',
  LOCATION = 'location',
  USER_FACING_NOTIFICATIONS = 'userFacingNotifications',
  NOTIFICATIONS = 'notifications',
  CONTACTS = 'contacts',
  CALENDAR = 'calendar',
  REMINDERS = 'reminders',
  SYSTEM_BRIGHTNESS = 'systemBrightness'
}

export function usePermission (permission: PermissionType, processError: (error: Error) => any): { status: PermissionStatus, reask: () => void } {
  const [status, setStatus] = useState<PermissionStatus>(PermissionStatus.UNDETERMINED)
  const [ask, setAsk] = useState<number>(Date.now())

  useEffect(() => {
    askAsync(permission)
      .then(result => {
        setStatus(result.permissions[permission].status)
      })
      .catch(processError)
    return () => {
      processError = null
    }
  }, [ask]) // Only if the ask timestamp changes we ask again - :)

  return {
    status,
    reask () {
      setAsk(Date.now())
    }
  }
}
