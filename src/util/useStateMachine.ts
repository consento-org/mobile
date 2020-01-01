import { useState, useEffect } from 'react'

export type TSetStateOps<StateEnum, Ops> = (state: StateEnum, stateOps?: Ops) => boolean
export interface IStateMachine <StateEnum, Ops = any> {
  initialState: StateEnum
  setState: TSetStateOps<StateEnum, Ops>
  close(): void
}
export interface IStateManager <StateEnum, Ops = any> {
  setState: TSetStateOps<StateEnum, Ops>
  close(): void
  reset(): void
}
export type TMachineFactory <StateEnum, Ops, Init> = (updateState: (state: StateEnum) => void, reset: () => void, init: Init) => IStateMachine<StateEnum, Ops>

export interface IState <StateEnum, Ops> {
  state: StateEnum
  ops?: Ops
}

function createStateManager <StateEnum, Ops, Init> (create: TMachineFactory<StateEnum, Ops, Init>, init: Init, setInternal: (state: IState<StateEnum, Ops>) => void): IStateManager<StateEnum, Ops> {
  let machine: IStateMachine<StateEnum, Ops>
  const reset = (): void => {
    if (machine !== undefined) {
      machine.close()
    }
    machine = create((state: StateEnum, ops?: Ops): void => {
      setInternal({ state, ops })
    }, reset, init)
    setInternal({ state: machine.initialState })
  }
  reset()
  return {
    close: () => {
      machine.close()
      machine = undefined
    },
    setState: (state: StateEnum, ops?: Ops): boolean => {
      if (machine === undefined) {
        return false
      }
      if (machine.setState(state, ops)) {
        setInternal({ state, ops })
        return true
      }
      return false
    },
    reset
  }
}

export function useStateMachine <StateEnum extends string, Ops, Init extends any[]> (
  createStateMachine: TMachineFactory<StateEnum, Ops, Init>,
  init: Init = [] as Init
): [ IState<StateEnum, Ops>, IStateManager<StateEnum, Ops> ] {
  const [state, setInternal] = useState<IState<StateEnum, Ops>>()
  const [manager] = useState<IStateManager<StateEnum, Ops>>(() =>
    createStateManager<StateEnum, Ops, Init>(createStateMachine, init, setInternal)
  )
  useEffect(() => {
    return () => manager.close()
  }, [])
  return [state, manager]
}
