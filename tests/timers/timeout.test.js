import { timeout } from '../../src/main'

describe('timeout', () => {
  test('basic timeout', () => {
    const spy = jest.fn()
    return timeout(0)
      .then(spy)
      .then(() => {
        expect(spy).toBeCalled()
      })
  })

  test('timeout catch', () => {
    const bomb = () => {
      throw 'Boom!'
    }
    const spy = jest.fn()

    return timeout(0)
      .then(bomb)
      .catch(spy)
      .then(() => {
        expect(spy).toBeCalled()
      })
  })

  test('timeout clear', () => {
    const spy = jest.fn()

    const timer = timeout(5).then(spy)

    timer.clear()

    return timeout(10).then(() => {
      expect(spy).not.toBeCalled()
    })
  })

  test('timeout resolve', () => {
    const spy = jest.fn()

    const timer = timeout(5).then(spy)

    timer.resolve('good').then(spy)

    return timeout(1).then(() => {
      expect(spy).toBeCalledWith('good')
      expect(spy).toBeCalledTimes(2)
    })
  })

  test('timeout reject', () => {
    const spy = jest.fn()

    const timer = timeout(5).catch(spy)

    timer.reject('bad').then(spy)

    return timeout(1).then(() => {
      expect(spy).toBeCalledWith('bad')
      expect(spy).toBeCalledTimes(2)
    })
  })

  test('timeout clear then resolve', () => {
    const spy = jest.fn()

    const timer = timeout(5).then(spy)

    timer.clear()

    return timeout(10)
      .then(() => {
        expect(spy).not.toBeCalled()

        return timer.resolve('ok')
      })
      .then(() => {
        expect(spy).toBeCalledWith('ok')
      })
  })
})
