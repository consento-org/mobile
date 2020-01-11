import { useState, useEffect } from 'react'
import { BackHandler, Alert } from 'react-native'
import { TNavigation } from '../screens/navigation'

function alertInvalid (onDiscard: () => any): void {
  Alert.alert('Unsaved Changes', 'Leaving this page will discard any changes!', [
    {
      text: 'Discard',
      onPress: onDiscard
    },
    {
      text: 'Stay'
    }
  ])
}

function alertSave (onOK: () => any, onDiscard: () => any): void {
  Alert.alert('Unsaved Changes', 'Leaving this page will discard any changes!', [
    {
      text: 'Save & Close',
      onPress: onOK
    },
    {
      text: 'Discard',
      onPress: onDiscard
    },
    {
      text: 'Stay'
    }
  ])
}

export function useForm (navigation: TNavigation, save: () => any): {
  leave: (next: () => void) => void
  save?: () => Promise<boolean>
  error?: Error
  isDirty: boolean
  isInvalid: boolean
  isSaving: boolean
  setDirty: (dirty: boolean, invalid?: boolean) => void
} {
  const [isDirty, _setDirty] = useState<boolean>(false)
  const [isInvalid, setInvalid] = useState<boolean>(false)
  const [isSaving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  const setDirty = (dirty: boolean, invalid?: boolean): void => {
    _setDirty(dirty)
    setInvalid(invalid || false)
  }

  let _save: () => Promise<boolean>

  if (isDirty && !isInvalid) {
    _save = async (): Promise<boolean> => {
      setError(undefined)
      setSaving(true)
      try {
        await save()
        setDirty(false)
      } catch (error) {
        setError(error)
        setSaving(false)
        return false
      }
      setSaving(false)
      return true
    }
  }

  const leave = (next: () => any): boolean => {
    if (!isDirty) {
      return next()
    }
    if (isInvalid) {
      alertInvalid(next)
      return true
    }
    alertSave(() => {
      (async () => {
        setSaving(true)
        await save()
        next()
      })().catch(error => {
        setSaving(false)
        setError(error)
      })
    }, next)
    return true
  }

  useEffect(() => {
    if (!isDirty) return
    const fnc = leave.bind(null, () => {
      BackHandler.removeEventListener('hardwareBackPress', fnc)
      navigation.goBack()
    })
    BackHandler.addEventListener('hardwareBackPress', fnc)
    return () => BackHandler.removeEventListener('hardwareBackPress', fnc)
  })

  return { leave, isSaving, error, isDirty, setDirty, isInvalid, save: _save }
}
