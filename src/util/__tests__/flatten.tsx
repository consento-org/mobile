import { flatten } from '../flatten'

it ('simply flattens a tree', () => {
  expect(flatten((b: boolean): b is boolean => typeof b === 'boolean', {
    x: true,
    y: {
      z: true,
      a: {
        b: true,
        c: false
      }
    }
  })).toEqual({
    x: true,
    'y.a.b': true,
    'y.a.c': false,
    'y.z': true
  })
})
