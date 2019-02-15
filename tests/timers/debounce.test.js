import { debounce, timeout } from '../../src/main'

describe('debounce', () => {
  const spy = jest.fn()
  const init = jest.fn(() => 5)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('basic', () => {
    const debounced = debounce(init)
    expect(init).not.toBeCalled()

    const promise = debounced().then(spy)

    expect(init).toBeCalled()

    timeout(3).then(() => {
      expect(spy).not.toBeCalled()
    })

    return promise.then(() => {
      expect(spy).toBeCalled()
      expect(spy).toBeCalledWith(true)

      expect(init).toBeCalledTimes(1)
    })
  })

  test('bounce one time', async () => {
    const debounced = debounce(init)

    debounced('x').then(spy)
    expect(spy).not.toBeCalled()
    expect(init).toBeCalledTimes(1)
    expect(init).toBeCalledWith('x')

    await timeout(1)
    expect(spy).not.toBeCalled()

    debounced('y').then(spy)
    expect(spy).not.toBeCalled()
    expect(init).toBeCalledTimes(2)
    expect(init).toBeCalledWith('y')

    await timeout(1)
    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)

    await timeout(6)
    expect(spy).toBeCalledTimes(2)
    expect(spy.mock.calls).toEqual([[false], [true]])
  })

  test('flush', async () => {
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    const debounced = debounce(x => x)

    debounced(5).then(spy1)
    debounced(true).then(spy2)

    await timeout(1)
    expect(spy1).toBeCalledTimes(1)
    expect(spy1).toBeCalledWith(false)
    expect(spy2).toBeCalledTimes(1)
    expect(spy2).toBeCalledWith(true)
  })

  test('clear', async () => {
    const spy1 = jest.fn()
    const spy2 = jest.fn()

    const debounced = debounce(x => x)

    debounced(5).then(spy1)
    debounced(false).then(spy2)

    await timeout(1)
    expect(spy1).toBeCalledTimes(1)
    expect(spy1).toBeCalledWith(false)
    expect(spy2).toBeCalledTimes(1)
    expect(spy2).toBeCalledWith(false)
  })
})
