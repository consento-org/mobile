import { useState, useEffect } from 'react'

export type TSetStateOptions<StateEnum, Ops> = (state: StateEnum, stateOptions?: Ops) => boolean
export interface IStateMachine <StateEnum, Ops = any> {
  initialState: StateEnum
  setState: TSetStateOptions<StateEnum, Ops>
  close: () => void
}
export interface IStateManager <StateEnum, Ops = any> {
  setState: TSetStateOptions<StateEnum, Ops>
  close: () => void
  reset: () => void
}
export type TMachineFactory <StateEnum, Options, Init> = (updateState: (state: StateEnum) => void, reset: () => void, init: Init) => IStateMachine<StateEnum, Options>

export interface IState <StateEnum, Options> {
  state: StateEnum
  options?: Options
}

function createStateManager <StateEnum, Options, Init> (create: TMachineFactory<StateEnum, Options, Init>, init: Init, setInternal: (state: IState<StateEnum, Options>) => void): IStateManager<StateEnum, Options> {
  let machine: IStateMachine<StateEnum, Options> | undefined
  const reset = (): void => {
    if (machine !== undefined) {
      machine.close()
    }
    machine = create((state: StateEnum, options?: Options): void => {
      setInternal({ state, options })
    }, reset, init)
    setInternal({ state: machine.initialState })
  }
  reset()
  return {
    close: () => {
      if (machine !== undefined) {
        machine.close()
      }
      machine = undefined
    },
    setState: (state: StateEnum, options?: Options): boolean => {
      if (machine === undefined) {
        return false
      }
      if (machine.setState(state, options)) {
        setInternal({ state, options })
        return true
      }
      return false
    },
    reset
  }
}

export function useStateMachine <StateEnum extends string, Options, Init extends any[] = any[]> (
  createStateMachine: TMachineFactory<StateEnum, Options, Init>,
  init?: Init
): [ IState<StateEnum, Options>, IStateManager<StateEnum, Options> ] {
  const [state, setInternal] = useState<IState<StateEnum, Options>>()
  const [manager] = useState<IStateManager<StateEnum, Options>>(() =>
    createStateManager<StateEnum, Options, Init>(createStateMachine, init ?? ([] as unknown as Init), setInternal)
  )
  useEffect(() => {
    return () => manager.close()
  }, [])
  return [state as IState<StateEnum, Options>, manager]
}
