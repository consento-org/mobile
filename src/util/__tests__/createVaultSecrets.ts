import { createVaultSecrets, IVaultSecrets, IVaultSecretsProps } from '../createVaultSecrets'
import { cryptoCore } from '../../cryptoCore'
import { exists } from '@consento/api/util'

async function waitABit <T> (next: () => T): Promise<T> {
  return await new Promise <T>(resolve => {
    setTimeout(
      () => resolve(next()),
      (Math.random() * 20) | 0
    )
  })
}

function factory (store?: { [key: string]: string }, impl?: Partial<IVaultSecretsProps>): {
  store: { [key: string]: string }
  vaultSecrets: IVaultSecrets
} {
  if (!exists(store)) {
    store = {}
  }
  const vaultSecrets = createVaultSecrets({
    cryptoCore,
    async setItemAsync (key: string, value: string): Promise<void> {
      return await waitABit(() => {
        store[key] = value
      })
    },
    async getItemAsync (key: string): Promise<string> {
      return await waitABit(() => store[key])
    },
    async deleteItemAsync (key: string): Promise<void> {
      return await waitABit(() => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete store[key]
      })
    },
    ...impl
  })
  return {
    store,
    vaultSecrets
  }
}

describe('secrets', () => {
  it('can be created', async () => {
    const { vaultSecrets } = factory()
    const { keyHex, secretKeyBase64 } = vaultSecrets.create()
    expect(keyHex).toMatch(/^[0-9A-F]{12}$/i)
    expect((await secretKeyBase64).length).toBe(44)
  })
  it('created secrets are persisted', async () => {
    const { vaultSecrets, store } = factory()
    const { keyHex, secretKeyBase64 } = vaultSecrets.create()
    const receivedSecretKeyBase64 = await secretKeyBase64
    await vaultSecrets.persistedKeys()
    expect(store).toEqual({
      'vault-': keyHex,
      [`vault-${keyHex}`]: receivedSecretKeyBase64
    })
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(true)
  })
  it('created secrets can be read', async () => {
    const { vaultSecrets } = factory()
    const { keyHex, secretKeyBase64 } = vaultSecrets.create()
    expect(await vaultSecrets.get(keyHex)).toBe(await secretKeyBase64)
  })
  it('persisted secrets can be restored', async () => {
    const { vaultSecrets, store } = factory()
    const { keyHex, secretKeyBase64 } = vaultSecrets.create()
    expect(await secretKeyBase64).toBe(await factory(store).vaultSecrets.get(keyHex))
  })
  it('missing secrets will return empty', async () => {
    const { vaultSecrets } = factory()
    const keyHex = '7f67251e6ffcfce123c291f2bc84abcf060d1d97537c5764c95cab72d1afe574'
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(false)
    expect(await vaultSecrets.delete(keyHex)).toBe(false)
    // getKey will trigger the device's read function
    expect(await vaultSecrets.get(keyHex)).toBeUndefined()
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(false)
    expect(await vaultSecrets.delete(keyHex)).toBe(false)
  })
  it('secrets can be stored in memory', async () => {
    const { vaultSecrets, store } = factory()
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    const keyHex = '60aed38912e3'
    expect(await vaultSecrets.set(keyHex, secretKeyBase64, false)).toBe(secretKeyBase64)
    expect(store).toEqual({})
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(false)
  })
  it('secrets can be stored twice without ', async () => {
    const { vaultSecrets, store } = factory()
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    const keyHex = '60aed38912e3'
    expect(await vaultSecrets.set(keyHex, secretKeyBase64, false)).toBe(secretKeyBase64)
    expect(store).toEqual({})
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(false)
  })
  it('secrets can be stored on device', async () => {
    const { vaultSecrets, store } = factory()
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    const keyHex = '60aed38912e3'
    expect(await vaultSecrets.set(keyHex, secretKeyBase64, true)).toBe(secretKeyBase64)
    expect(store).toEqual({ [`vault-${keyHex}`]: secretKeyBase64 })
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(true)
  })
  it('repeatedly setting the same secrets', async () => {
    const { vaultSecrets, store } = factory()
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    const keyHex = '60aed38912e3'
    expect(await vaultSecrets.set(keyHex, secretKeyBase64, true)).toBe(secretKeyBase64)
    expect(await vaultSecrets.set(keyHex, secretKeyBase64, true)).toBe(secretKeyBase64)
    expect(await vaultSecrets.persistedKeys()).toEqual([keyHex])
    expect(store).toEqual({ [`vault-${keyHex}`]: secretKeyBase64, 'vault-': keyHex })
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(true)
  })
  it('secrets stored on device can be deleted', async () => {
    const { vaultSecrets, store } = factory()
    const { keyHex, secretKeyBase64 } = vaultSecrets.create()
    await secretKeyBase64
    expect(await vaultSecrets.delete(keyHex)).toBe(true)
    expect(await vaultSecrets.persistedKeys()).toEqual([])
    expect(store).toEqual({})
  })
  it('secrets stored in memory can be deleted', async () => {
    const { vaultSecrets } = factory()
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    const keyHex = '60aed38912e3'
    await vaultSecrets.set(keyHex, secretKeyBase64, false)
    expect(await vaultSecrets.delete(keyHex)).toBe(true)
  })
  it('toggling a missing key off a device throws error', async () => {
    const { vaultSecrets } = factory()
    try {
      await vaultSecrets.toggleDevicePersistence('key', false)
      fail('should throw')
    } catch (err) {
      expect(err.code).toBe('unpersist-no-key')
    }
  })
  it('toggling a missing key on a device throws error', async () => {
    const { vaultSecrets } = factory()
    try {
      await vaultSecrets.toggleDevicePersistence('key', true)
      fail('should throw')
    } catch (err) {
      expect(err.code).toBe('persist-no-key')
    }
  })
  it('toggling deleted key throws error, but keeps read intact', async () => {
    const { vaultSecrets } = factory()
    const keyHex = '60aed38912e3'
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    await vaultSecrets.set(keyHex, secretKeyBase64, false)
    await vaultSecrets.delete(keyHex)
    try {
      await vaultSecrets.toggleDevicePersistence(keyHex, false)
      fail('should throw')
    } catch (err) {
      expect(err.code).toBe('unpersist-no-key')
      expect(await vaultSecrets.get(keyHex)).toBeUndefined()
    }
  })
  it('persist a secret that is already persisted stays persisted', async () => {
    const { vaultSecrets } = factory()
    const keyHex = '60aed38912e3'
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    await vaultSecrets.set(keyHex, secretKeyBase64, true)
    expect(await vaultSecrets.persistOnDevice(keyHex)).toBe(secretKeyBase64)
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(true)
  })
  it('moving a persisted secret to memory', async () => {
    const { vaultSecrets } = factory()
    const keyHex = '60aed38912e3'
    const secretKeyBase64 = '9Uo16fCCzimCuQpxiHKjkhPOPkHFvu22lnElyB0QM5U='
    await vaultSecrets.set(keyHex, secretKeyBase64, true)
    expect(await vaultSecrets.removeFromDevice(keyHex)).toBe(secretKeyBase64)
    expect(await vaultSecrets.isPersistedOnDevice(keyHex)).toBe(false)
  })
  it('listing two secrets', async () => {
    const { vaultSecrets } = factory()
    await vaultSecrets.set('a', '1', true)
    await vaultSecrets.set('b', '2', true)
    expect(await vaultSecrets.persistedKeys()).toEqual(['a', 'b'])
  })
  it('sort order by insert for persisted Keys', async () => {
    const { vaultSecrets, store } = factory()
    await vaultSecrets.set('a', '1', true)
    await vaultSecrets.set('b', '2', true)
    await vaultSecrets.delete('a')
    await vaultSecrets.set('a', '1', true)
    expect(await vaultSecrets.persistedKeys()).toEqual(['b', 'a'])
    expect(store).toEqual({ 'vault-': 'b;a', 'vault-b': '2', 'vault-a': '1' })
  })
  it('repeated setting of secrets will list only once', async () => {
    const { vaultSecrets, store } = factory()
    await vaultSecrets.set('a', '1', true)
    await vaultSecrets.set('a', '2', true)
    expect(await vaultSecrets.persistedKeys()).toEqual(['a'])
    expect(store).toEqual({ 'vault-': 'a', 'vault-a': '2' })
  })
  it('filling and clearing an index', async () => {
    const { vaultSecrets, store } = factory()
    await vaultSecrets.set('a', '1', true)
    await vaultSecrets.set('b', '2', true)
    await vaultSecrets.toggleDevicePersistence('b', false)
    await vaultSecrets.toggleDevicePersistence('a', false)
    expect(await vaultSecrets.persistedKeys()).toEqual([])
    expect(store).toEqual({})
  })
  it('removing an item that isnt indexed', async () => {
    const { vaultSecrets } = factory()
    await vaultSecrets.set('a', '1', true)
    await vaultSecrets.set('b', '2', false)
    expect(await vaultSecrets.persistedKeys()).toEqual(['a'])
  })
  it('stored index item not read', async () => {
    const { vaultSecrets, store } = factory({
      'vault-': 'a',
      'vault-a': '1'
    })
    expect(await vaultSecrets.persistedKeys()).toEqual(['a'])
    await vaultSecrets.set('b', '2', true)
    expect(await vaultSecrets.persistedKeys()).toEqual(['a', 'b'])
    expect(store).toEqual({
      'vault-': 'a;b',
      'vault-a': '1',
      'vault-b': '2'
    })
  })
  it('clearing items from store and in memory', async () => {
    const { vaultSecrets, store } = factory({
      'vault-': 'a',
      'vault-a': '1'
    })
    await vaultSecrets.set('b', '2', true)
    await vaultSecrets.set('c', '3', false)
    await vaultSecrets.clear()
    expect(store).toEqual({})
    expect(await vaultSecrets.get('c')).toBeUndefined()
  })
})
