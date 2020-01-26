import { useState, useContext, createContext, createRef, useEffect } from 'react'
import { View } from 'react-native'
import { captureScreen } from 'react-native-view-shot'
import { deleteAsync } from 'expo-file-system'
import { exists } from './exists'

export enum EScreenshotState {
  ready = 'ready',
  pending = 'pending',
  running = 'running',
  done = 'done',
  unavailable = 'unavailable',
  requested = 'requested'
}

export const ScreenshotContext = createContext<IScreenshotSystem>(null)

export interface IScreenshot {
  take (delay?: number): void
  state: EScreenshotState
  ok: boolean
}

export interface IScreenshotSystem {
  serverUrl: string
  deviceId: Promise<String>
  takenScreenshots: Set<string>
  takeScreenshot (name: string, forDeviceId: string): Promise<void>
}

export function initScreenshot (serverUrl: string): IScreenshotSystem {
  const deviceId: Promise<string> = requestDeviceId(serverUrl).catch(deviceIdError => {
    console.log({ deviceIdError })
    return null
  })
  const takenScreenshots = new Set<string>()
  return {
    deviceId,
    async takeScreenshot (name: string, forDeviceId: string): Promise<void> {
      const thisDeviceId = await deviceId
      if (thisDeviceId !== forDeviceId) {
        console.log(`Skipping Screenshot ${name}@${thisDeviceId} - id mismatch ${forDeviceId}`)
      }
      if (takenScreenshots.has(name)) {
        console.log(`Skipping Screenshot ${name}@${thisDeviceId} - already taken`)
      }
      takenScreenshots.add(name)
      const uri = await captureScreen({})
      console.log(`Captured Screenshot ${name}@${thisDeviceId} - ${uri}`)
      ;(async () => {
        const formData = new FormData()
        formData.append('file', { uri, name: `${name}.png`, type: 'image/png' } as any)
        await fetch(`${serverUrl}/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data; charset=UTF-8'
          },
          body: formData
        })
        await deleteAsync(uri)
      })().catch(screenshotStoreError => console.log({ screenshotStoreError }))
    },
    takenScreenshots,
    serverUrl
  }
}

async function requestDeviceId (serverUrl: string): Promise<string> {
  const res = await fetch(`${serverUrl}/device`, {
    headers: {
      'installation-id': Expo.Constants.installationId as string
    }
  })
  return res.text()
}

export function useScreenshot (name: string, forDeviceId: string = 'device-0'): IScreenshot {
  const system = useContext(ScreenshotContext)
  const [{ state, delay }, setState] = useState<{ state: EScreenshotState, delay?: number }>({ state: EScreenshotState.ready })
  useEffect(() => {
    if (state !== EScreenshotState.requested) {
      return
    }
    setState({ state: EScreenshotState.pending })
    setTimeout(() => {
      setState({ state: EScreenshotState.running })
      system.takeScreenshot(name, forDeviceId)
        .then(
          () => {
            try {
              setState({ state: EScreenshotState.done })
            } catch (err) {}
          },
          captureError => {
            console.error(captureError)
            try {
              setState({ state: EScreenshotState.done })
            } catch (err) {}
          }
        )
    }, delay ?? 0)
  }, [state === EScreenshotState.requested])
  if (!exists(system)) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      take (): void {},
      state: EScreenshotState.unavailable,
      ok: true
    }
  }
  if (system.takenScreenshots.has(name)) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      take (): void {},
      state: EScreenshotState.done,
      ok: true
    }
  }
  return {
    take: (delay: number = 0) => {
      if (state === EScreenshotState.ready) {
        setState({ state: EScreenshotState.requested, delay })
      }
    },
    state,
    ok: state === EScreenshotState.done
  }
}
