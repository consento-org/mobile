import { context } from '../context'

describe('translation', () => {
  it('simple', () => {
    const { t, hasT } = context({
      icons: {},
      strings: {
        hello: 'world',
        shiny: {
          happy: 'people'
        }
      }
    })
    expect(t('hello')).toBe('world')
    expect(t('holla')).toBe('<holla>')
    expect(t('shiny.happy')).toBe('people')
    expect(hasT('hello')).toBe(true)
    expect(hasT('holla')).toBe(false)
  })
  it('contexts', () => {
    const { t, hasT } = context({
      icons: {},
      strings: {
        hello: 'world',
        shiny: {
          happy: 'people'
        }
      }
    }).ctx('shiny')
    expect(t('hello')).toBe('<shiny.hello>')
    expect(t('happy')).toBe('people')
    expect(hasT('hello')).toBe(false)
    expect(hasT('happy')).toBe(true)
  })
})
