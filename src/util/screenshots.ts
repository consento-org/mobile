import { createContext, useState, useContext } from 'react'
import { exists } from '@consento/api/util'
import { captureScreen, releaseCapture } from 'react-native-view-shot'

enum Screens {
  loading = 'loading',
  config = 'config',
  vaultsFull = 'vaultsFull',
  vaultFilesEmpty = 'vaultFilesEmpty',
  vaultLocksNoRelation = 'vaultLocksNoRelation',
  relationsEmpty = 'relationsEmpty',
  relationEmpty = 'relationEmpty',
  relationFull = 'relationFull',
  relationsOne = 'relationsOne',
  relationsTwo = 'relationsTwo',
  vaultFilesPopup = 'vaultFilesPopup',
  vaultTextEditor = 'vaultTextEditor',
  vaultImageEditor = 'vaultImageEditor',
  vaultFilesFull = 'vaultFilesFull',
  vaultLocksNoLock = 'vaultLocksNoLock',
  vaultLocksNoSelection = 'vaultLocksNoSelection',
  vaultLocksSelection = 'vaultLocksSelection',
  vaultLocksPending = 'vaultLocksPending',
  vaultLocksConfirmed = 'vaultLocksConfirmed',
  vaultsVaultOneLocked = 'vaultsVaultOneLocked',
  vaultPending = 'vaultPending',
  vaultsVaultOnePending = 'vaultsVaultOnePending',
  vaultFilesTextContext = 'vaultFilesTextContext',
  vaultFilesImageContext = 'vaultFilesImageContext',
  vaultLog = 'vaultLog',
  consentosEmpty = 'consentosEmpty',
  consentosBecomeUnlockeePending = 'consentosBecomeUnlockeePending',
  consentosBecomeUnlockeeRevoked = 'consentosBecomeUnlockeeRevoked',
  consentosBecomeUnlockeeDenied = 'consentosBecomeUnlockeeDenied',
  consentosBecomeUnlockeeConfirming = 'consentosBecomeUnlockeeConfirming',
  consentosBecomeUnlockeeAccepted = 'consentosBecomeUnlockeeAccepted',
  consentosUnlockPending = 'consentosUnlockPending',
  consentosUnlockDenied = 'consentosUnlockDenied',
  consentosUnlockAccepted = 'consentosUnlockAccepted',
  consentosUnlockExpired = 'consentosUnlockExpired',
  vaultsEmpty = 'vaultsEmpty'
}

export interface IScreenshot {
  use (): { done: boolean, take: (delay?: number) => void }
  take (delay?: number): Promise<void>
  handle (delay?: number): () => void
  takeSync (delay?: number): void
}

export type IScreenshots = Record<Screens, IScreenshot>

async function requestDeviceId (serverUrl: string): Promise<string> {
  const res = await fetch(`${serverUrl}/device`, {
    headers: {
      // @ts-ignore
      'installation-id': Expo.Constants.installationId as string
    }
  })
  return await res.text()
}

async function requestList (serverUrl: string): Promise<string[]> {
  const res = await fetch(`${serverUrl}/list`)
  return JSON.parse(await res.text())
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
function wait (delay: number): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/return-await
  return new Promise(resolve => setTimeout(resolve, delay))
}

async function storeScreenshot (uri: string, serverUrl: string, name: string): Promise<void> {
  const formData = new FormData()
  formData.append('file', { uri, name: `${name}.png`, type: 'image/png' } as any)
  await fetch(`${serverUrl}/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; charset=UTF-8'
    },
    body: formData
  })
  await releaseCapture(uri)
}

async function initServer (serverUrl: string): Promise<{ deviceId: string, files: string[] }> {
  return {
    deviceId: await requestDeviceId(serverUrl),
    files: await requestList(serverUrl)
  }
}

interface IScreenshotSystem {
  take (name: string, delay: number): Promise<void>
  isDone (name: string): boolean
}

function createSystem (serverUrl?: string): IScreenshotSystem {
  if (!exists(serverUrl) || serverUrl === '') {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      take: async (): Promise<void> => {},
      isDone: () => true
    }
  }
  const init = initServer(serverUrl)
  const takenScreenshots = new Map<string, Promise<void>>()
  const doneScreenshots = new Set<string>()
  init
    .then(
      ({ files }) => {
        for (const file of files) {
          if (Screens[file] !== undefined) {
            doneScreenshots.add(file)
          }
        }
      },
      initError => console.log({ initError })
    )
  return {
    async take (name: string, delay: number): Promise<void> {
      const { deviceId } = await init
      if (deviceId === 'device-0') {
        if (delay > 0) {
          await wait(delay)
        }
        let screenshot = takenScreenshots.get(name)
        if (screenshot === undefined) {
          const uri = await captureScreen({})
          screenshot = storeScreenshot(uri, serverUrl, name).then(
            () => {
              doneScreenshots.add(name)
              const missing = Object.keys(Screens).filter(name => !doneScreenshots.has(name))
              if (missing.length > 0) {
                console.log(`${missing.length.toString()} Missing Screenshots. Next: → ${missing[0]}`)
              }
            },
            (storeError) => {
              console.log({ storeError })
              takenScreenshots.delete(name)
              doneScreenshots.delete(name)
            }
          )
          takenScreenshots.set(name, screenshot)
        }
        return await screenshot
      }
    },
    isDone: (name: string): boolean => doneScreenshots.has(name)
  }
}

function createScreenshot (name: string, system: IScreenshotSystem): IScreenshot {
  const takeSync = (delay: number = 0): void => {
    system.take(name, delay)
      .catch(screenshotError => console.log({ screenshotError }))
  }
  return {
    take: async (delay: number = 0): Promise<void> => await system.take(name, delay),
    takeSync,
    handle: (delay: number = 0): (() => void) => {
      return () => takeSync(delay)
    },
    use () {
      const [done, setDone] = useState<boolean>(system.isDone(name))
      return {
        done,
        take: (delay: number = 0) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          system.take(name, delay).finally(() => setDone(true))
        }
      }
    }
  }
}

export function createScreenshots (serverUrl: string): IScreenshots {
  const system = createSystem(serverUrl)
  return Object.keys(Screens)
    .reduce(
      (allShots: { [key: string]: IScreenshot }, key) => {
        allShots[key] = createScreenshot(key, system)
        return allShots
      },
      {}
    ) as any
}

export function useScreenshotEnabled (): boolean {
  const screenshots = useContext(ScreenshotContext)
  return screenshots !== NO_SCREEN_SHOTS
}

export const NO_SCREEN_SHOTS = createScreenshots(null)
export const ScreenshotContext = createContext<IScreenshots>(NO_SCREEN_SHOTS)
