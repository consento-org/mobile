import React from 'react'
import { useUser } from '../model/Consento'
import { isImageFile, isTextFile } from '../model/VaultData'
import { navigate } from '../util/navigate'
import { ImageEditor } from './ImageEditor'
import { TextEditor } from './TextEditor'

export const FileEditor = ({ vaultId, fileId }: { vaultId: string, fileId: string }): JSX.Element => {
  const vault = useUser().findVault(vaultId)
  if (vault === undefined) {
    navigate(['main', 'vaults'])
    return <></>
  }
  const file = vault.findFile(fileId)
  if (isImageFile(file)) {
    return <ImageEditor image={file} vault={vault} />
  }
  if (isTextFile(file)) {
    return <TextEditor textFile={file} vault={vault} />
  }
  navigate('vault', { vault: vault.$modelId })
  return <></>
}
