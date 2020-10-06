import React, { useState, useEffect, createContext } from 'react'
import { BackHandler, Alert } from 'react-native'
import { isPromiseLike } from '@consento/crypto/util/isPromiseLike'
import { deepEqual } from 'fast-equals'
import throttle from 'lodash.throttle'
import { goBack } from './navigate'

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
  value: T | undefined
  valueString: string | undefined
  readonly initial: T | undefined
  readonly invalid?: string
  readonly isInvalid: boolean
  readonly isDirty: boolean
  readonly loaded: boolean
  setValue: (newValue: T | undefined) => void
  setValueString: (newValue: string | undefined) => void
  handleValue: (newValue: T | undefined) => void
  handleString: (newValue: string | undefined) => void
  setInitial: (initial: TInitiator<T>) => void
  reset: () => void
}

export type TOrPromise<T> = T | Promise<T>
export type TInitiatorFn<T> = () => TOrPromise<T>
export type TInitiator<T> = TOrPromise<T> | TInitiatorFn<T>

export interface IForm {
  leave: (next?: () => void) => void
  save?: () => Promise<boolean>
  error?: Error
  invalid?: {
    [key: string]: string
  }
  isDirty: boolean
  isInvalid: boolean
  isSaving: boolean
  useStringField: (key: string, initial: TInitiator<string | null>, validate?: (value: string | null) => boolean | string, save?: (value: string | null) => void | Promise<void>) => IFormField<string | null>
  useField: <T>(key: string, initial: TInitiator<T>, convert: IStringConvert<T>, validate?: (value: string) => boolean | string, save?: (value: T) => void | Promise<void>) => IFormField<T>
}

export interface IMainForm extends IForm {
  Form: ({ children }: { children?: React.ReactChild | React.ReactChild[] }) => JSX.Element
}

function isInitiatorFn <T> (input: TInitiator<T>): input is TInitiatorFn<T> {
  return typeof input === 'function'
}

export interface IStringConvert<T> {
  fromString: (string: string) => T
  toString: (value: T) => string
}

export const STRING_CONVERT: IStringConvert<string | null> = {
  fromString: (string: string): string | null => string === '' ? null : string,
  toString: (string: string | null): string => string === null ? '' : string
}

export const FLOAT_CONVERT: IStringConvert<number | null> = {
  fromString: (string: string): number | null => string === '' ? null : parseFloat(string),
  toString: (value: number | null): string => value === null ? '' : value.toString(10)
}

function isFnInitator <T> (input: TInitiator<T>): input is TInitiatorFn<T> {
  return typeof input === 'function'
}

class FormField<T> implements IFormField<T> {
  initial: T | undefined
  invalid?: string
  isInvalid: boolean = false
  isDirty: boolean = false
  loaded: boolean = false

  save?: (newValue: T) => void | Promise<void>
  _value: string | undefined
  _validate?: (value: string) => boolean | string
  _triggerUpdate: () => void
  _initiator: TInitiator<T> | undefined
  _initCount: number = 0
  _firstInitFinished: boolean = false
  _initiatorPromise: PromiseLike<T> | undefined
  _convert: IStringConvert<T>

  constructor (convert: IStringConvert<T>, triggerUpdate: () => void, validate?: (value: string) => boolean | string, save?: (newValue: T) => void | Promise<void>) {
    this._triggerUpdate = triggerUpdate
    this._validate = validate
    this._triggerUpdate = triggerUpdate
    this._convert = convert
    this.save = save
    this.validate = this.validate.bind(this)
    this.setValue = this.setValue.bind(this)
    this.handleValue = this.handleValue.bind(this)
    this.reset = this.reset.bind(this)
    this.setValueString = throttle(this.setValueString.bind(this), 1000, { leading: true })
    this.handleString = this.handleString.bind(this)
  }

  setInitial (initiator: TInitiator<T>): void {
    if (this._initiator === initiator) {
      return
    }
    this._initiator = initiator
    const initCount = ++this._initCount
    const valOrPromise = isFnInitator(initiator) ? initiator() : initiator
    if (isPromiseLike(valOrPromise)) {
      if (valOrPromise === this._initiatorPromise) {
        return
      }
      this.loaded = false
      this._initiatorPromise = valOrPromise
      valOrPromise.then(
        newInitial => {
          if (initCount !== this._initCount) {
            return // Another initial value was set meanwhile
          }
          this._finishInitial(newInitial, true)
        },
        error => console.error(error)
      )
      if (this._firstInitFinished) {
        this._triggerUpdate()
      }
    } else {
      this._initiatorPromise = undefined
      this._finishInitial(valOrPromise)
    }
  }

  _finishInitial (initial: T, async: boolean = false): void {
    if (this.initial !== initial || !this._firstInitFinished) {
      const doUpdate = !this.loaded || this.updateState()
      this.loaded = true
      this.initial = initial
      if (!this._firstInitFinished) {
        this._firstInitFinished = true
        this._value = this._convert.toString(initial)
        if (!async) {
          return
        }
      }
      if (doUpdate) {
        this._triggerUpdate()
      }
    } else if (!this.loaded) {
      this.loaded = true
      this._triggerUpdate()
    }
  }

  get value (): T | undefined {
    return this._value !== undefined ? this._convert.fromString(this._value) : undefined
  }

  set value (newValue: T | undefined) {
    this.setValue(newValue)
  }

  get valueString (): string | undefined {
    return this._value
  }

  set valueString (newValue: string | undefined) {
    this.setValueString(newValue)
  }

  handleValue (newValue: T | undefined): void {
    this.setValue(newValue)
  }

  handleString (newValue: string | undefined): void {
    this.setValueString(newValue)
  }

  setValue (newValue: T | undefined): void {
    this.setValueString(newValue !== undefined ? this._convert.toString(newValue) : undefined)
  }

  setValueString (newValue: string | undefined): void {
    if (this._value !== newValue) {
      this._value = newValue
      this.updateState()
      this._triggerUpdate()
    }
  }

  reset (): void {
    this.value = this.initial
  }

  updateState (): boolean {
    const newState = {
      isDirty: this.value !== this.initial,
      ...this.validate()
    }
    if (
      newState.isDirty !== this.isDirty ||
      newState.isInvalid !== this.isInvalid ||
      newState.invalid !== this.invalid
    ) {
      this.isDirty = newState.isDirty
      this.isInvalid = newState.isInvalid
      this.invalid = newState.invalid
      return true
    }
    return false
  }

  validate (): { isInvalid: boolean, invalid?: string } {
    if (this._validate === undefined) {
      return { isInvalid: false }
    }
    const { valueString } = this
    const valid = valueString === undefined ? false : this._validate(valueString)
    if (typeof valid === 'string') {
      return { isInvalid: true, invalid: valid }
    }
    return {
      invalid: valid ? undefined : 'invalid',
      isInvalid: !valid
    }
  }
}

export const FormContext = createContext<IForm | null>(null)

export function useForm (
  save?: (fields: { [key: string]: any }) => void | Promise<void>,
  leave?: () => void
): IMainForm {
  const setUpdate = useState<number>(Date.now())[1]
  const form = useState<IMainForm>((): IMainForm => {
    const fields: { [key: string]: FormField<any> } = {}
    const _save = async (): Promise<boolean> => {
      if (!form.isDirty || form.isInvalid) {
        return false
      }
      form.error = undefined
      form.isSaving = true
      setUpdate(Date.now())
      try {
        const ops: Array<Promise<void>> = []
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
        form.isDirty = false
        form.isSaving = false
        setUpdate(Date.now())
        return true
      } catch (error) {
        form.error = error
        form.isSaving = false
        setUpdate(Date.now())
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
      async leave (next?: () => any): Promise<boolean> {
        const handleNext = next ?? leave ?? goBack
        if (!form.isDirty) {
          handleNext()
          return true
        }
        if (form.isInvalid) {
          alertInvalid(handleNext)
          return false
        }
        let _resolve: (successful: boolean) => void
        const result = new Promise<boolean>(resolve => {
          _resolve = resolve
        })
        alertSave(
          async (): Promise<void> => {
            const done = form.save !== undefined ? await form.save() : true
            if (done) {
              handleNext()
            }
            _resolve(done)
          },
          handleNext
        )
        return await result
      },
      useStringField (key: string, initial: TInitiator<string | null>, validate?: (value: string | null) => boolean | string, save?: (value: string | null) => void | Promise<void>): IFormField<string | null> {
        return this.useField<string | null>(key, initial, STRING_CONVERT, validate, save)
      },
      useField <T> (key: string, initial: TInitiator<T>, convert: IStringConvert<T>, validate?: (value: string) => boolean | string, save?: (value: T) => void | Promise<void>): IFormField<T> {
        const setUpdate = useState<number>(Date.now())[1]
        const [field] = useState<FormField<T>>(() => {
          const field = new FormField<T>(convert, () => {
            triggerUpdate()
            setUpdate(Date.now())
          }, validate, save)
          return field
        })
        useEffect(() => {
          if (fields[key] !== undefined) {
            throw new Error(`Form field [${key}] already exists.`)
          }
          fields[key] = field
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          return () => { delete fields[key] }
        }, [])
        if (isInitiatorFn(initial)) {
          useEffect(() => {
            field.setInitial((initial as Function)())
          }, [])
        } else {
          field.setInitial(initial)
        }
        return field
      },
      Form ({ children }: { children?: React.ReactChild | React.ReactChild[] }) {
        if (children === null || children === undefined) {
          return <></>
        }
        return <FormContext.Provider value={form}>{children}</FormContext.Provider>
      }
    }

    form.useStringField = form.useStringField.bind(form)

    const triggerUpdate = (): void => {
      let isDirty = false
      const invalid = Object
        .keys(fields)
        .reduce<{ [key: string]: string } | undefined>(
        (invalid, key) => {
          const field = fields[key]
          if (field.isInvalid) {
            if (invalid === undefined) {
              invalid = {}
            }
            invalid[key] = field.invalid as string /* invalid is certainly a string when the field is invalid */
          }
          if (field.isDirty) {
            isDirty = true
          }
          return invalid
        }, undefined)
      let hasChange = false
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!deepEqual(invalid, form.invalid)) {
        form.invalid = invalid
        form.isInvalid = invalid !== undefined
        hasChange = true
      }
      if (isDirty !== form.isDirty) {
        form.isDirty = isDirty
        form.save = isDirty ? _save : undefined
        hasChange = true
      }
      if (hasChange) {
        setUpdate(Date.now())
      }
    }
    return form
  })[0]

  useEffect(() => {
    const next = (): boolean => {
      if (leave !== undefined) {
        leave()
      } else {
        goBack()
      }
      return true
    }
    if (!form.isDirty) {
      BackHandler.addEventListener('hardwareBackPress', next)
      return () => BackHandler.removeEventListener('hardwareBackPress', next)
    }
    const fnc = (): boolean => {
      if (!form.isDirty) {
        return next()
      }
      if (form.isInvalid) {
        alertInvalid(next)
        return true
      }
      alertSave(
        async (): Promise<void> => {
          const done = form.save !== undefined ? await form.save() : true
          if (done) {
            next()
          }
        },
        next
      )
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', fnc)
    return () => BackHandler.removeEventListener('hardwareBackPress', fnc)
  })

  return form
}
