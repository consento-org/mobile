import { readDirectoryAsync, deleteAsync, documentDirectory } from 'expo-file-system'

export interface IDeleteState {
  total: number
  current: number
}

async function _rimraf (folder: string): Promise<void> {
  // TODO: delete secure store items!!!
  const entries = await readDirectoryAsync(folder)
  await Promise.all(entries.map(async entry => {
    const child = `${folder}/${entry}`
    await deleteAsync(child)
  }))
}

export async function rimraf (folder: string): Promise<void> {
  await _rimraf(`file://${documentDirectory}/${folder}`)
}
