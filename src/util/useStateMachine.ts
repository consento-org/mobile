import { useState, useEffect } from 'react'

export type TSetStateOps<StateEnum, Ops> = (state: StateEnum, stateOps?: Ops) => boolean
export interface IStateMachine <StateEnum, Ops> {
  initialState: StateEnum
  setState: TSetStateOps<StateEnum, Ops>
  close(): void
}
export interface IStateManager <StateEnum, Ops> {
  setState: TSetStateOps<StateEnum, Ops>
  close(): void
  reset(): void
}
export type TMachineFactory <StateEnum, Ops, Init> = (updateState: (state: StateEnum) => void, reset: () => void, init: Init) => IStateMachine<StateEnum, Ops>

interface IState <StateEnum, Ops> {
  state: StateEnum,
  ops?: Ops
}

function createStateManager <StateEnum, Ops, Init> (create: TMachineFactory<StateEnum, Ops, Init>, init: Init, setInternal: (state: IState<StateEnum, Ops>) => void) {
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

export function useStateMachine <StateEnum extends string, Ops, Init extends Array<any>> (
  createStateMachine: TMachineFactory<StateEnum, Ops, Init>,
  init: Init = [] as Init
): [ IState<StateEnum, Ops>, IStateManager<StateEnum, Ops> ] {
  const [ state, setInternal ] = useState<IState<StateEnum, Ops>>()
  const [ manager, setManager ] = useState<IStateManager<StateEnum, Ops>>()
  useEffect(() => {
    const manager = createStateManager<StateEnum, Ops, Init>(createStateMachine, init, setInternal)
    setManager(manager)
    return () => manager.close()
  }, init)
  return [ state, manager ]
}
