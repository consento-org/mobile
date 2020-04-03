import { getInfoAsync, makeDirectoryAsync, documentDirectory, cacheDirectory, readDirectoryAsync, deleteAsync, writeAsStringAsync, FileInfo, WritingOptions, readAsStringAsync } from 'expo-file-system'
import { generateId } from './generateId'
import { bufferToString } from '@consento/crypto/util/buffer'
import { Buffer } from 'buffer'

export { Buffer } from 'buffer'

export interface IFSUtils {
  resolve (path: string[]): string
  write (path: string[], contents: string | Uint8Array, options?: { mkdir?: boolean }): Promise<void>
  readBuffer (path: string[]): Promise<Buffer>
  readString (path: string[]): Promise<string>
  delete (path: string[], options?: { idempotent?: boolean }): Promise<void>
  mkdirp (path: string[]): Promise<string[]>
  rimraf (path?: string[]): Promise<void>
  list (path: string[]): Promise<string[]>
  info (path: string[], options?: { md5?: boolean, size?: boolean }): Promise<FileInfo>
}

export interface ICacheFSUtils extends IFSUtils {
  mkdirTmpAsync (): Promise<string[]>
}

function pathToString (root: string, path: string[]): string {
  let result = root
  if (path === null || path === undefined) {
    return result
  }
  for (const entry of path) {
    if (/\/$/.test(result)) {
      result += entry
      continue
    }
    result += `/${entry}`
  }
  return result
}

export function dirname (path: string[]): string[] {
  return path.slice(0, path.length - 1)
}

async function rimraf (root: string, folder?: string[]): Promise<void> {
  const path = pathToString(root, folder)
  const entries = await readDirectoryAsync(path)
  await Promise.all(entries.map(async entry => {
    const parts = Array.isArray(folder) ? [...folder, entry] : [entry]
    const path = pathToString(root, parts)
    await deleteAsync(path)
  }))
}

async function mkdirp (root: string, path: string[]): Promise<string[]> {
  const pathAsString = pathToString(root, path)
  const info = await getInfoAsync(pathAsString)
  if (!info.exists) {
    const parent = dirname(path)
    await mkdirp(root, parent)
    await makeDirectoryAsync(pathAsString)
  }
  return path
}

function createFSUtils (root: string): IFSUtils {
  const resolve = (path: string[]): string => pathToString(root, path)
  const _mkdirp = async (path: string[]): Promise<string[]> => await mkdirp(root, path)
  return {
    write: async (path: string[], contents: string | Uint8Array, options?: { mkdir?: boolean }) => {
      const contentsAsString = typeof contents === 'string' ? contents : bufferToString(contents, 'base64')
      const writeOptions: WritingOptions = {
        encoding: typeof contents === 'string' ? 'utf8' : 'base64'
      }
      const uri = resolve(path)
      try {
        await writeAsStringAsync(uri, contentsAsString, writeOptions)
      } catch (err) {
        if (options?.mkdir) {
          await docs.mkdirp(dirname(path))
          await writeAsStringAsync(uri, contentsAsString, writeOptions)
        } else {
          throw err
        }
      }
    },
    readString: async (path: string[]): Promise<string> => {
      return await readAsStringAsync(resolve(path), { encoding: 'utf8' })
    },
    readBuffer: async (path: string[]): Promise<Buffer> => {
      return Buffer.from(await readAsStringAsync(resolve(path), { encoding: 'base64' }), 'base64')
    },
    delete: async (path: string[], options?: { idempotent?: boolean }) => await deleteAsync(resolve(path), options),
    rimraf: async (path: string[]) => await rimraf(root, path),
    list: async (path: string[]) => await readDirectoryAsync(resolve(path)),
    info: async (path: string[], options?: { md5?: boolean, size?: boolean }) => await getInfoAsync(resolve(path), options),
    mkdirp: _mkdirp,
    resolve
  }
}

const _cache = createFSUtils(cacheDirectory)

export const cache: ICacheFSUtils = {
  ..._cache,
  async mkdirTmpAsync (): Promise<string[]> {
    const id = generateId()
    const dir = ['.tmp', id]
    await _cache.mkdirp(dir)
    return dir
  }
}

export const docs = createFSUtils(documentDirectory)
