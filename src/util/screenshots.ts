import { useState } from 'react'
import { captureScreen, releaseCapture } from 'react-native-view-shot'
import Constants from 'expo-constants'

/***
 * This is only active if a screenshot server url is given when starting the expo process.
 * Which is the case when you run `npm run screenshot`.
 *
 * This is NOT ACTIVE IN PRODUCTION!
 *
 * For more: see CONTRIBUTING.md section "Screenshots"
 */
const SCREENSHOT_SERVER_URL: string | undefined = Constants.manifest.extra.SCREENSHOT_SERVER_URL

export interface IScreenshot {
  name: string
  instructions: string
  isDone: () => boolean
  use: () => {
    done: boolean
    takeSync: (delay?: number, condition?: boolean) => void
    take: (delay?: number, condition?: boolean) => Promise<void>
  }
  handle: (delay?: number) => () => undefined
  take: (delay?: number, condition?: boolean) => Promise<void>
  takeSync: (delay?: number, condition?: boolean) => undefined
}

async function requestDeviceId (serverUrl: string): Promise<string> {
  await wait(10)
  const res = await fetch(`${serverUrl}/device`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; charset=UTF-8'
    },
    body: JSON.stringify({
      installationId: Constants.installationId,
      screenshots: Object.keys(screenshots) // Transmitted to delete the screenshots when starting.
    })
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

async function storeScreenshot (serverUrl: string, name: string): Promise<void> {
  const uri = await captureScreen({})
  const formData = new FormData()
  formData.append('file', { uri, name: `${name}.png`, type: 'image/png' } as any)
  try {
    await fetch(`${serverUrl}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; charset=UTF-8'
      },
      body: formData
    })
  } finally {
    await releaseCapture(uri)
  }
}

function createStartupStrategy (serverUrl: string): IScreenshotStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const init = (async () => {
    return {
      deviceId: await requestDeviceId(serverUrl),
      doneScreenshots: new Set(await requestList(serverUrl))
    }
  })()
  return {
    async take (name: string, delay: number): Promise<void> {
      const { deviceId, doneScreenshots } = await init
      if (await deviceId === 'device-0') {
        if (delay > 0) {
          await wait(delay)
        }
        if (!doneScreenshots.has(name)) {
          await storeScreenshot(serverUrl, name)
          const missing = Object.values(screenshots).filter(screenshot => !(screenshot.isDone() || doneScreenshots.has(screenshot.name)))
          if (missing.length > 0) {
            console.log(`Screenshot ${name} taken. ${missing.length} Missing Screenshots. Next: → ${missing[0].name}\n      ${missing[0].instructions}`)
          } else {
            console.log(`Screenshot ${name} taken. All screenshots done. Good job! Now run '$ npx expo-optimize' in the CLI.`)
          }
        }
      }
    }
  }
}

interface IScreenshotStrategy {
  take: (name: string, delay: number) => Promise<void>
}

export const isScreenshotEnabled = SCREENSHOT_SERVER_URL !== undefined

const skipStrategy: IScreenshotStrategy = {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  take: () => Promise.resolve()
}

const strategy = SCREENSHOT_SERVER_URL === undefined ? skipStrategy : createStartupStrategy(SCREENSHOT_SERVER_URL)

function createScreenShot (name: string, instructions: string): IScreenshot {
  let isDone: boolean = !isScreenshotEnabled
  const take = async (delay?: number, condition?: boolean): Promise<void> => {
    if (condition === false || isDone) {
      return
    }
    isDone = true
    try {
      await strategy.take(name, delay ?? 0)
    } catch (err) {
      isDone = false
      throw err
    }
  }
  const takeSync = (delay?: number, condition?: boolean): undefined => {
    take(delay, condition)
      .catch(screenshotError => console.log({ screenshotError }))
    return undefined
  }
  return {
    name,
    instructions,
    isDone: () => isDone,
    take,
    takeSync,
    handle: (delay: number = 0): (() => undefined) => {
      return (): undefined => takeSync(delay)
    },
    use () {
      const [done, setDone] = useState<boolean>(isDone)
      return {
        done,
        takeSync: (delay?: number, condition?: boolean) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          take(delay, condition).finally(() => setDone(isDone))
        },
        take: async (delay?: number, condition?: boolean): Promise<void> => {
          try {
            await take(delay, condition)
          } finally {
            setDone(isDone)
          }
        }
      }
    }
  }
}

export const screenshots = {
  vaultsFull: createScreenShot('vaultsFull', '<taken during startup>'),
  config: createScreenShot('config', 'Open the config screen with the top-left consento icon.'),
  vaultFilesEmpty: createScreenShot('vaultFilesEmpty', 'Go back to the vaults screen. Click on the "My Contracts" vault.'),
  vaultLocksNoRelation: createScreenShot('vaultLocksNoRelation', 'Click on the "Locks" tab in the vault.'),
  consentosEmpty: createScreenShot('consentosEmpty', 'Go back to the Main screen and go the Consentos tab.'),
  relationsEmpty: createScreenShot('relationsEmpty', 'Go to the Relations tab.'),
  relationEmpty: createScreenShot('relationEmpty', 'Add a new relation and use your second device to create a relation'),
  relationFull: createScreenShot('relationFull', 'Enter the name "Friend" and create an avatar. Save the relation - NOTE: give this relation also the name "Friend" on the other device.'),
  relationsOne: createScreenShot('relationsOne', 'Return back to the relations screen'),
  relationsTwo: createScreenShot('relationsTwo', 'Add another, unnamed relation without avatar with your second device. And then go back to the relations list.'),
  vaultFilesPopup: createScreenShot('vaultFilesPopup', 'Go back to the vaults screen, choose the "My Contracts" vault and press "ADD" in the bottom'),
  vaultTextEditor: createScreenShot('vaultTextEditor', 'Add a text file, enter "My secret text" as title and enter "This is a secret text." as message. Then save the text.'),
  vaultImageEditor: createScreenShot('vaultImageEditor', 'Return to the files screen. Add an image file, take a picture of the printed ./screenshot/fake-top-secret-document.pdf and save the image.'),
  vaultFilesFull: createScreenShot('vaultFilesFull', 'Return the files dialog.'),
  vaultLocksNoLock: createScreenShot('vaultLocksNoLock', 'Click on the "Locks" tab in the vault. '),
  vaultLocksNoSelection: createScreenShot('vaultLocksNoSelection', 'Use "ADD" to add an relationship.'),
  vaultLocksSelection: createScreenShot('vaultLocksSelection', 'Select the "Friend" relationship.'),
  vaultLocksPending: createScreenShot('vaultLocksPending', 'Press "SAVE" and show the vault pending.'),
  vaultLocksConfirmed: createScreenShot('vaultLocksConfirmed', ' On the other device accept incoming notification.'),
  vaultsVaultOneLocked: createScreenShot('vaultsVaultOneLocked', 'Lock the Vault using the big "LOCK" button.'),
  vaultsVaultOnePending: createScreenShot('vaultsVaultOnePending', 'Choose the "My Contracts" vault that is locked.'),
  vaultPending: createScreenShot('vaultPending', 'Click on the now pending "My Contracts" vault. Wait for a bit and then unlock it on the other device.'),
  vaultFilesTextContext: createScreenShot('vaultFilesTextContext', 'Click on the "..." button in the text file line.'),
  vaultFilesImageContext: createScreenShot('vaultFilesImageContext', 'Click outside (dark area) of the context menu to close it. Then click on "..." beside the image.'),
  vaultLog: createScreenShot('vaultLog', 'Click outside (dark area) of th context menu to close it. Go to "Logs" of "My Contracts"'),
  consentosBecomeUnlockeePending: createScreenShot('consentosBecomeUnlockeePending', 'On the other device, go to the My Contracts vault and add the Friend relationship. On the main device go to Consentos.'),
  consentosBecomeUnlockeeRevoked: createScreenShot('consentosBecomeUnlockeeRevoked', 'Deny becoming a lockee.'),
  consentosBecomeUnlockeeDenied: createScreenShot('consentosBecomeUnlockeeDenied', 'Wait for it ...'),
  consentosBecomeUnlockeeConfirming: createScreenShot('consentosBecomeUnlockeeConfirming', 'Delete the Consento and on the other device, add the Friend relationship again as lock.'),
  consentosBecomeUnlockeeAccepted: createScreenShot('consentosBecomeUnlockeeAccepted', 'Wait for it ...'),
  consentosUnlockPending: createScreenShot('consentosUnlockPending', 'Delete the Consento on the main device. On the other device LOCK the vault and click on it again to unlock.'),
  consentosUnlockDenied: createScreenShot('consentosUnlockDenied', 'Deny unlocking.'),
  consentosUnlockAccepted: createScreenShot('consentosUnlockAccepted', 'Delete the Consento on the main device. On the other device wait until you can unlock again. Unlock again.'),
  consentosUnlockExpired: createScreenShot('consentosUnlockExpired', 'Delete the Consento on the main device. On the other device wait until you can unlock again. Unlock again. Then accept on the main device.'),
  vaultsEmpty: createScreenShot('vaultsEmpty', 'Delete all vaults.')
}
