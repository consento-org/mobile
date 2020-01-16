import React, { useState, useEffect, createContext } from 'react'
import { BackHandler, Alert } from 'react-native'
import { TNavigation } from '../screens/navigation'
import { isPromiseLike } from '@consento/crypto/util/isPromiseLike'

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

export interface IFormField <T> {
  value: T
  readonly initial: T
  readonly invalid?: string
  readonly isInvalid: boolean
  readonly isDirty: boolean
  readonly loaded: boolean
  setValue (newValue: T): void
  handleValue (newValue: T): void
  reset (): void
}

export type TOrPromise<T> = T | Promise<T>
export type TInitiatorFn<T> = () => TOrPromise<T>
export type TInitiator<T> = TOrPromise<T> | TInitiatorFn<T>

export interface IForm {
  leave: (next: () => void) => void
  save?: () => Promise<boolean>
  error?: Error
  invalid?: {
    [key: string]: string
  }
  isDirty: boolean
  isInvalid: boolean
  isSaving: boolean
  useField <T> (key: string, initial: TInitiator<T>, validate?: (value: T) => boolean | string, save?: (value: T) => void | Promise<void>): IFormField<T>
}

export interface IMainForm extends IForm {
  Form ({ children }: { children?: React.ReactChild | React.ReactChild[] }): JSX.Element
}

function isInitiatorFn <T> (input: TInitiator<T>): input is TInitiatorFn<T> {
  return typeof input === 'function'
}

class FormField<T> implements IFormField<T> {
  initial: T
  invalid?: string
  isInvalid: boolean
  isDirty: boolean
  loaded: boolean

  save: (newValue: T) => void | Promise<void>
  _value: T
  _validate: (defaultValue: T) => boolean | string
  _triggerUpdate: () => void

  constructor (initial: TInitiator<T>, validate: (defaultValue: T) => boolean | string, triggerUpdate: () => void, save: (newValue: T) => void | Promise<void>) {
    const valOrPromise = isInitiatorFn(initial) ? initial() : initial
    if (isPromiseLike(valOrPromise)) {
      this.loaded = false
      valOrPromise
        .then(initial => {
          this._value = initial
          this.initial = initial
          this.loaded = true
          this.validate()
          triggerUpdate()
        })
        .catch(error => console.error(error))
    } else {
      this._value = valOrPromise
      this.initial = valOrPromise
      this.loaded = true
    }
    this._validate = validate
    this._triggerUpdate = triggerUpdate
    this.save = save
    this.validate = this.validate.bind(this)
    this.setValue = this.setValue.bind(this)
    this.handleValue = this.handleValue.bind(this)
    this.reset = this.reset.bind(this)
    this.validate()
  }
  get value (): T {
    return this._value
  }
  set value (newValue: T) {
    this.setValue(newValue)
  }
  handleValue (newValue: T): void {
    this.setValue(newValue)
  }
  setValue (newValue: T): void {
    if (this._value != newValue) {
      this._value = newValue
      this.isDirty = newValue !== this.initial
      this.validate()
      this._triggerUpdate()
    }
  }
  reset () {
    this.value = this.initial
  }
  validate () {
    if (this._validate === undefined) {
      this.isInvalid = false
      return
    }
    const valid = this._validate(this._value)
    if (typeof valid === 'string') {
      this.invalid = valid
      this.isInvalid = true
    } else {
      this.invalid = valid ? undefined : 'invalid'
      this.isInvalid = !valid
    }
  }
}

export const FormContext = createContext<IForm>(null)

export function useForm (
  navigation: TNavigation,
  save?: (fields: { [key: string]: any }) => void | Promise<void>,
  leave?: () => void
): IMainForm {
  const [form, setForm] = useState<IMainForm>((): IMainForm => {
    const fields: { [key: string]: FormField<any> } = {}
    const _save = async (): Promise<boolean> => {
      if (!form.isDirty || form.isInvalid) {
        return false
      }
      form.error = undefined
      form.isSaving = true
      setForm(form)
      try {
        const ops = []
        const data = Object.keys(fields).reduce((data: { [key: string]: any }, key) => {
          const field = fields[key]
          if (typeof field.save === 'function') {
            const result = field.save(field.value)
            if (result !== undefined) {
              ops.push(result)
            }
          }
          data[key] = field.value
          return data
        }, {})
        if (typeof save === 'function') {
          await save(data)
        }
        await Promise.all(ops)
        console.log('saved')
        form.isDirty = false
        form.isSaving = false
        setForm(form)
        console.log('done')
        return true
      } catch (error) {
        console.log({ error })
        form.error = error
        form.isSaving = false
        setForm(form)
        return false
      }
    }
    const form: IMainForm = {
      isDirty: false,
      isInvalid: false,
      isSaving: false,
      invalid: undefined,
      error: undefined,
      save: undefined,
      async leave (next: () => any): Promise<boolean> {
        if (!form.isDirty) {
          next()
          return true 
        }
        if (form.isInvalid) {
          alertInvalid(next)
          return false
        }
        let _resolve: (successful: boolean) => void
        const result = new Promise<boolean>(resolve => {
          _resolve = resolve
        })
        alertSave(
          async (): Promise<void> => {
            const done = await form.save()
            if (done) {
              next()
            }
            _resolve(done)
          },
          next
        )
        return result
      },
      useField <T> (key: string, initial: TInitiator<T>, validate?: (value: T) => boolean | string, save?: (value: T) => void | Promise<void>): IFormField<T> {
        const setUpdate = useState<number>(Date.now())[1]
        const field = useState<IFormField<T>>(() => {
          if (fields[key] !== undefined) {
            throw new Error(`Form field [${key}] already exists.`)
          }
          const field = new FormField(initial, validate, () => {
            triggerUpdate()
            setUpdate(Date.now())
          }, save)
          fields[key] = field
          return field
        })[0]
        return field
      },
      Form ({ children }: { children?: React.ReactChild | React.ReactChild[] }) {
        if (children === null || children === undefined) {
          return <></>
        }
        return <FormContext.Provider value={form}>{children}</FormContext.Provider>
      }
    }

    const triggerUpdate = (): void => {
      let isDirty = false
      const invalid = Object.keys(fields).reduce((invalid: { [key: string]: string }, key) => {
        const field = fields[key]
        if (field.isInvalid) {
          if (invalid === undefined) {
            invalid = {}
          }
          invalid[key] = field.invalid
        }
        if (field.isDirty) {
          isDirty = true
        }
        return invalid
      }, undefined)
      form.invalid = invalid
      form.isInvalid = invalid !== undefined
      form.isDirty = isDirty
      form.save = isDirty ? _save : undefined
      setForm(form)
    }
    return form
  })

  useEffect(() => {
    if (!form.isDirty) return
    const next = () => {
      if (leave !== undefined) {
        leave()
      } else {
        navigation.goBack()
      }
    }
    const fnc = () => {
      if (!form.isDirty) {
        return false
      }
      if (form.isInvalid) {
        alertInvalid(next)
        return true
      }
      alertSave(
        async (): Promise<void> => {
          const done = await form.save()
          if (done) {
            next()
          }
        },
        next
      )
      return true
    }
    console.log('add back listeners')
    BackHandler.addEventListener('hardwareBackPress', fnc)
    return () => BackHandler.removeEventListener('hardwareBackPress', fnc)
  })

  return form
}
