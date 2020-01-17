import randomBytes from '@consento/sync-randombytes'
import { bufferToString } from '@consento/crypto/util/buffer'
import { ICryptoCore } from '@consento/crypto/core/types'

export interface IVaultSecretsProps {
  prefix?: string
  cryptoCore: ICryptoCore
  setItemAsync (key: string, value: string): Promise<void>
  getItemAsync (key: string): Promise<string>
  deleteItemAsync (key: string): Promise<void>
}

export interface IVaultSecrets {
  create (): { keyHex: string, secretKeyBase64: Promise<string> }
  persistedKeys (): Promise<string[]>
  clear (): Promise<void>
  get (keyHex: string): Promise<string>
  delete (keyHex: string): Promise<boolean>
  set (keyHex: string, secretKeyBase64: string, persistOnDevice: boolean): Promise<string>
  isPersistedOnDevice (keyHex: string): Promise<boolean>
  toggleDevicePersistence (keyHex: string, persistOnDevice: boolean): Promise<string>
  persistOnDevice (keyHex: string): Promise<string>
  removeFromDevice (keyHex: string): Promise<string>
}

interface IMemory {
  value: string
  persistedOnDevice: boolean
}

function createPersistError (keyHex: string, persistOnDevice: boolean): Error {
  if (persistOnDevice) {
    return Object.assign(new Error(`Can not persist key [${keyHex}] to device. It is not stored in memory!`), { code: 'persist-no-key' })
  }
  return Object.assign(new Error(`Can not remove key [${keyHex}] from device. It is not stored in memory!`), { code: 'unpersist-no-key' })
}

enum EPersisted {
  NO_CHANGE = 1,
  NOT_PERSISTED = 2,
  PERSISTED = 3
}

type ResolvePersisted = (persisted: EPersisted) => void

export function createVaultSecrets ({ prefix, setItemAsync, getItemAsync, deleteItemAsync, cryptoCore }: IVaultSecretsProps): IVaultSecrets {
  if (prefix === null || prefix === undefined) {
    prefix = 'vault'
  }
  const inMemory: { [keyHex: string]: Promise<IMemory> } = {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const preventDangling = (): void => {}

  const _setMemory = async (key: string, op: (mem: IMemory) => Promise<IMemory>): Promise<IMemory> => {
    const former = inMemory[key]
    const p = (async () => op(await former))()
    inMemory[key] = p
    p.catch(preventDangling)
    return p
  }
  const setMemory = async (key: string, op: (mem: IMemory) => Promise<IMemory>): Promise<IMemory> => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getMemory(key)
    return _setMemory(key, op)
  }
  const getMemory = async (key: string): Promise<IMemory> => {
    const read = inMemory[key]
    if (read === undefined) {
      return _setMemory(key, async () => {
        const value = await getItemAsync(key)
        if (value === undefined) {
          return
        }
        return {
          value,
          persistedOnDevice: true
        }
      })
    }
    return read
  }
  const getEntry = async (key: string): Promise<string> => {
    return (await getMemory(key))?.value
  }
  const isPersistedOnDevice = async (key: string): Promise<boolean> => {
    return (await getMemory(key))?.persistedOnDevice || false
  }
  const _setInternal = async (mem: IMemory, key: string, value: string, persistOnDevice: boolean): Promise<IMemory> => {
    if (mem?.persistedOnDevice === persistOnDevice && mem?.value === value) {
      return mem
    }
    if (persistOnDevice) {
      await setItemAsync(key, value)
    } else {
      if (mem?.persistedOnDevice) {
        await deleteItemAsync(key)
      }
    }
    return {
      value,
      persistedOnDevice: persistOnDevice
    }
  }
  const setKey = async (keyHex: string, secretKeyBase64: string, persistOnDevice: boolean): Promise<string> => {
    const key = `${prefix}-${keyHex}`
    const mem = (await setMemoryWithIndex(keyHex, async (mem, updateKeyIndex) => {
      const newMem = _setInternal(mem, key, secretKeyBase64, persistOnDevice)
      updateKeyIndex(persistOnDevice)
      return newMem
    }))
    return mem?.value
  }
  const _deleteInternal = async (mem: IMemory, key: string): Promise<boolean> => {
    let deleted = false
    if (mem !== undefined) {
      deleted = true
      if (mem.persistedOnDevice) {
        await deleteItemAsync(key)
      }
    }
    return deleted
  }
  const deleteKey = async (keyHex: string): Promise<boolean> => {
    let deleted: boolean = false
    return setMemoryWithIndex(keyHex, async (mem, updateKeyIndex): Promise<IMemory> => {
      const key = `${prefix}-${keyHex}`
      if (mem !== undefined) {
        deleted = true
        await _deleteInternal(mem, key)
      }
      updateKeyIndex(false)
      return undefined
    }).then(() => deleted)
  }
  const toggleDevicePersistence = async (keyHex: string, persistOnDevice: boolean): Promise<string> => {
    const key = `${prefix}-${keyHex}`
    const read = inMemory[key]
    if (read === undefined) {
      throw createPersistError(key, persistOnDevice)
    }
    let finish: (error: Error, result?: string) => void
    const resultPromise = new Promise<string>((resolve, reject) => {
      finish = (error: Error, result: string) => error !== null ? reject(error) : resolve(result)
    })
    await setMemoryWithIndex(keyHex, async (mem, updateKeyIndex) => {
      if (mem === undefined) {
        finish(createPersistError(key, persistOnDevice))
        return undefined
      }
      if (mem.persistedOnDevice === persistOnDevice) {
        finish(null, mem.value)
        return mem
      }
      const newMem = await _setInternal(mem, key, mem.value, persistOnDevice)
      updateKeyIndex(persistOnDevice)
      finish(null, newMem.value)
      return newMem
    })
    return resultPromise
  }
  const indexKey = `${prefix}$`
  const applyIndex = (indexMem: IMemory, keyHex: string, persisted: EPersisted): IMemory | Promise<IMemory> => {
    if (persisted === EPersisted.NO_CHANGE) {
      // No change in persistence
      return indexMem
    }
    if (persisted === EPersisted.NOT_PERSISTED) {
      if (indexMem === undefined) {
        // Item isn't persisted but we don't have a persisted item anyways
        return indexMem
      }
      const keysHex = indexMem.value.split(';')
      const index = keysHex.indexOf(keyHex)
      if (index === -1) {
        // No change here as well, as the index isn't empty but doesn't contain the key
        return indexMem
      }
      keysHex.splice(index, 1)
      if (keysHex.length > 0) {
        // Updating the index with a missing index entry
        return _setInternal(indexMem, indexKey, keysHex.join(';'), true)
      }
      // Deleting the index as it is empty
      return _deleteInternal(indexMem, indexKey).then(() => undefined)
    }
    if (indexMem === undefined) {
      // Storing the key as first entry
      return _setInternal(indexMem, indexKey, keyHex, true)
    }
    const keysHex = indexMem.value.split(';')
    if (keysHex.indexOf(keyHex) === -1) {
      // Removing the key from the index
      return _setInternal(indexMem, indexKey, keysHex.concat(keyHex).join(';'), true)
    }
    return indexMem
  }
  const setMemoryWithIndex = async (keyHex: string, op: (mem: IMemory, updateKeyIndex: (persisted: boolean) => void) => Promise<IMemory>): Promise<IMemory> => {
    const key = `${prefix}-${keyHex}`
    let resolveFinish: (finish: ResolvePersisted) => void
    const finishIndex = new Promise<ResolvePersisted>((resolve) => {
      resolveFinish = resolve
    })
    setMemory(indexKey, async (indexMem) => {
      return new Promise(resolve => {
        resolveFinish((persisted: EPersisted) => {
          resolve(applyIndex(indexMem, keyHex, persisted))
        })
      })
    }).catch(preventDangling)
    let persisted: EPersisted = EPersisted.NO_CHANGE
    let newValue: IMemory
    try {
      newValue = await setMemory(key, async (mem) =>
        op(mem, (_persisted) => {
          persisted = _persisted ? EPersisted.PERSISTED : EPersisted.NOT_PERSISTED
        })
      )
    } finally {
      (await finishIndex)(persisted)
    }
    return newValue
  }
  const persistedKeys = async (): Promise<string[]> => getEntry(indexKey).then(data => data === undefined ? [] : data.split(';'))
  return {
    create: (): { keyHex: string, secretKeyBase64: Promise<string> } => {
      const keyHex = randomBytes(Buffer.alloc(6)).toString('hex')
      const key = `${prefix}-${keyHex}`
      return {
        keyHex,
        secretKeyBase64: setMemoryWithIndex(keyHex, async (_, updateKeyIndex) => {
          const secretKey = await cryptoCore.createSecretKey()
          const result = await _setInternal(undefined, key, bufferToString(secretKey, 'base64'), true)
          updateKeyIndex(true)
          return result
        }).then(mem => mem.value)
      }
    },
    clear: async () => {
      const keysHex = new Set(await persistedKeys())
      for (const key in inMemory) {
        if (key.indexOf(`${prefix}-`) !== 0) {
          continue
        }
        const keyHex = key.substr(prefix.length + 1)
        deleteKey(keyHex).catch(preventDangling)
        keysHex.delete(keyHex)
      }
      for (const keyHex of keysHex) {
        deleteKey(keyHex).catch(preventDangling)
      }
      await persistedKeys()
    },
    set: setKey,
    persistedKeys,
    get: async (keyHex: string): Promise<string> => getEntry(`${prefix}-${keyHex}`),
    delete: deleteKey,
    isPersistedOnDevice: async (keyHex: string): Promise<boolean> => isPersistedOnDevice(`${prefix}-${keyHex}`),
    toggleDevicePersistence,
    persistOnDevice: async (keyHex: string): Promise<string> => toggleDevicePersistence(keyHex, true),
    removeFromDevice: async (keyHex: string): Promise<string> => toggleDevicePersistence(keyHex, false)
  }
}
