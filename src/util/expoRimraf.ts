import { readDirectoryAsync, deleteAsync, documentDirectory, getInfoAsync } from 'expo-file-system'

export interface IDeleteState {
  total: number
  current: number
}

async function _rimraf (folder: string, update: (state: IDeleteState) => void, state: IDeleteState) {
  const entries = await readDirectoryAsync(folder)
  state.total += entries.length
  await Promise.all(entries.map(async entry => {
    const child = `${folder}/${entry}`
    state.total += 1
    update(state)
    const info = await getInfoAsync(child)
    if (info.isDirectory) {
      await _rimraf(child, update, state)
    }
    await deleteAsync(child)
    state.current += 1
    update(state)
  }))
}

export async function rimraf (folder: string, update: (state: IDeleteState) => void): Promise<void> {
  await _rimraf(`file://${documentDirectory}/${folder}`, update, {
    total: 0,
    current: 0
  })
}