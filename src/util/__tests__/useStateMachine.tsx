import { useStateMachine, IStateManager } from '../useStateMachine'
import { mount, ReactWrapper } from 'enzyme'
import { act } from 'react-dom/test-utils'
import React, { useContext } from 'react'

describe('StateManager', () => {
  let _update: (state: string) => void
  let _reset: () => void
  let _created = 0
  let _closed = 0
  let _init: any[]
  const createStateMachine = (updateState: (state: string) => void, reset: () => void, init: any[]) => {
    _init = init
    _created += 1
    _update = updateState
    _reset = reset
    return {
      initialState: 'hi',
      setState: (newState: string) => newState === 'beep',
      close: () => {
        _closed += 1
      }
    }
  }
  const Ctx = React.createContext('init-1')
  const Any = (props: { state: string }) => {
    return <></>
  }
  const Main = (props: { ctx: string }) => {
    return <Ctx.Provider value={ props.ctx }><Component /></Ctx.Provider>
  }
  const Component = () => {
    const data = [ useContext(Ctx) ]
    const [ state, manager ] = useStateMachine(createStateMachine, data )
    return <Any state={state} manager={manager} />
  }
  let init = 'init0'
  const wrapper = mount(<Main ctx={ init }/>)
  const get = function <T> (component: T): ReactWrapper<T> { return wrapper.find(component).first() }

  it('initial state', () => {
    expect(get(Any).prop('state')).toEqual({ state: 'hi' })
    expect(_init).toEqual(['init0'])
    expect(_created).toBe(1)
  })
  it('implementation can update the parent state', () => {
    act(() => {
      _update('test')
    })
    wrapper.update()
    expect(get(Any).prop('state')).toEqual({ state: 'test' })
    expect(_created).toBe(1)
    expect(_closed).toBe(0)
  })
  it('implementation can reset the state (which closes and restarts the system)', () => {
    act(() => {
      _reset()
    })
    wrapper.update()
    expect(get(Any).prop('state')).toEqual({ state: 'hi' })
    expect(_created).toBe(2)
    expect(_closed).toBe(1)
  })
  it('Changing the state from outside can be prevented...', () => {
    const manager: IStateManager<string, any> = get(Any).prop('manager')
    act(() => {
      expect(manager.setState('bloop')).toBe(false)
    })
    wrapper.update()
    expect(get(Any).prop('state')).toEqual({ state: 'hi' })
  })
  it('... or allowed', () => {
    const manager: IStateManager<string, any> = get(Any).prop('manager')
    act(() => {
      expect(manager.setState('beep', 'woops')).toBe(true)
    })
    wrapper.update()
    expect(get(Any).prop('state')).toEqual({ state: 'beep', ops: 'woops' })
  })
  it('a change of context will also restart', () => {
    act(() => {
      wrapper.setProps({ ctx: 'init1' })
    })
    wrapper.update()
    expect(_init).toEqual(['init1'])
    expect(_created).toBe(3)
    expect(_closed).toBe(2)
  })
})
