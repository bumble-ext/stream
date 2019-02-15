import { throttle, timeout } from '../../src/main'

describe('throttle', () => {
  const spy = jest.fn()
  const init = jest.fn(() => 5)

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  test('basic', done => {
    const throttled = throttle(init)

    expect(init).not.toBeCalled()

    const promise = throttled().then(spy)

    expect(init).toBeCalled()

    timeout(1).then(() => {
      expect(spy).not.toBeCalled()

      jest.runAllTimers()
    })

    promise.then(() => {
      expect(spy).toBeCalled()
      expect(spy).toBeCalledWith(true)

      expect(init).toBeCalledTimes(1)

      done()
    })

    jest.advanceTimersByTime(2)
  })

  test('throttle one time', done => {
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    const throttled = throttle(init)

    // Call throttled once
    const promise1 = throttled('x').then(spy1)

    expect(spy1).not.toBeCalled()
    expect(init).toBeCalledTimes(1)
    expect(init).toBeCalledWith('x')

    // Wait 1ms
    timeout(1).then(() => {
      expect(spy1).not.toBeCalled()

      // Call throttled again
      const promise2 = throttled('y').then(spy2)

      expect(spy1).not.toBeCalled()
      expect(spy2).not.toBeCalled()
      expect(init).toBeCalledTimes(2)
      expect(init).toBeCalledWith('y')

      promise2.then(() => {
        expect(spy1).not.toBeCalled()
        expect(spy2).toBeCalledTimes(1)
        expect(spy2).toBeCalledWith(false)

        jest.runAllTimers()
      })

      promise1.then(() => {
        expect(spy1).toBeCalledTimes(1)
        expect(spy1).toBeCalledWith(true)
        expect(spy2).toBeCalledTimes(1)
        expect(spy2).toBeCalledWith(false)

        done()
      })

      jest.advanceTimersByTime(2)
    })

    jest.advanceTimersByTime(2)
  })

  test('flush', done => {
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    const throttled = throttle(x => x)

    const first = throttled(5).then(spy1)
    const second = throttled(true).then(spy2)

    second.then(() => {
      expect(spy1).not.toBeCalled()
    })

    first.then(() => {
      expect(spy1).toBeCalledTimes(1)
      expect(spy1).toBeCalledWith(true)
      expect(spy2).toBeCalledTimes(1)
      expect(spy2).toBeCalledWith(false)

      done()
    })

    jest.runAllTimers()
  })

  test('clear', done => {
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    const throttled = throttle(x => x)

    const first = throttled(5).then(spy1)
    const second = throttled(false).then(spy2)

    second.then(() => {
      expect(spy1).not.toBeCalled()
    })

    first.then(() => {
      expect(spy1).toBeCalledTimes(1)
      expect(spy1).toBeCalledWith(false)
      expect(spy2).toBeCalledTimes(1)
      expect(spy2).toBeCalledWith(false)

      done()
    })

    jest.runAllTimers()
  })
})
