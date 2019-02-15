import { withPrev } from '../../src/helpers/with-prev'
import { not } from '../../src/main'
import isEqual from 'lodash/fp/isEqual'

describe('withPrev', () => {
  test('basic withPrev', () => {
    const spy = jest.fn(not(isEqual))
    const hasChanged = withPrev(spy)

    const result1 = hasChanged(5)
    const result2 = hasChanged(6)

    expect(spy).toBeCalledTimes(2)
    expect(spy.mock.calls[0]).toEqual([undefined, 5])
    expect(spy.mock.calls[1]).toEqual([5, 6])

    expect(result1).toBe(true)
    expect(result2).toBe(true)
  })

  test('withPrev no change', () => {
    const spy = jest.fn(not(isEqual))
    const hasChanged = withPrev(spy)

    const result1 = hasChanged(5)
    const result2 = hasChanged(5)

    expect(spy).toBeCalledTimes(2)
    expect(spy.mock.calls[0]).toEqual([undefined, 5])
    expect(spy.mock.calls[1]).toEqual([5, 5])

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('withPrev initial value', () => {
    const spy = jest.fn((a, b) => a + b)
    const add = withPrev(spy, 4)

    const result1 = add(5)
    const result2 = add(6)

    expect(spy).toBeCalledTimes(2)
    expect(spy.mock.calls[0]).toEqual([4, 5])
    expect(spy.mock.calls[1]).toEqual([5, 6])

    expect(result1).toBe(9)
    expect(result2).toBe(11)
  })
})
