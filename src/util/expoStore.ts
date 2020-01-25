import { IStore, IStoreEntry } from './createSecureStore'
import { docs } from './expoFsUtils'

export const expoStore: IStore = {
  async read (path: string[]): Promise<Uint8Array> {
    return docs.readBuffer(path)
  },
  async info (path: string[]): Promise<IStoreEntry> {
    return docs.info(path)
  },
  async write (path: string[], data: Uint8Array): Promise<void> {
    return docs.write(path, data, { mkdir: true })
  },
  async delete (path: string[]): Promise<void> {
    await docs.delete(path)
  },
  async list (path: string[]): Promise<string[]> {
    try {
      return await docs.list(path)
    } catch (err) {
      return []
    }
  }
}
