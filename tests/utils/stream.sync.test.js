import { EventStream } from '../../src/main'
import { mockEvent, attachMock } from '../mock.event'

afterEach(() => {
  mockEvent.listeners = []
  jest.clearAllMocks()
})

describe('basic EventStream', () => {
  test('EventStream setup', () => {
    const mapMock = jest.fn()

    EventStream(attachMock).map(mapMock)

    expect(attachMock).toBeCalled()
    expect(mockEvent.listeners.length).toBe(1)
    expect(mapMock).not.toBeCalled()
  })
})

describe('map method', () => {
  test('basic map', () => {
    const mapMock = jest.fn()

    EventStream(attachMock).map(mapMock)
    mockEvent.fireEvent(1)

    expect(mapMock).toBeCalled()
    expect(mapMock).toBeCalledWith(1, [1])
  })

  test('map method chain', () => {
    const add = x => x + 1
    const mapMock1 = jest.fn(add)
    const mapMock2 = jest.fn(add)

    EventStream(attachMock)
      .map(mapMock1)
      .map(mapMock2)

    mockEvent.fireEvent(1)

    expect(mapMock1).toBeCalled()
    expect(mapMock1).toBeCalledWith(1, [1])

    expect(mapMock2).toBeCalled()
    expect(mapMock2).toBeCalledWith(2, [1])
  })
})

describe('forEach method', () => {
  test('basic forEach', () => {
    const forEachMock = jest.fn()

    EventStream(attachMock).forEach(forEachMock)
    mockEvent.fireEvent(1)

    expect(forEachMock).toBeCalled()
    expect(forEachMock).toBeCalledWith(1, [1])
  })

  test('forEach method chain', () => {
    const add = x => x + 1
    const forEachMock1 = jest.fn(add)
    const forEachMock2 = jest.fn(add)

    EventStream(attachMock)
      .forEach(forEachMock1)
      .forEach(forEachMock2)

    mockEvent.fireEvent(1)

    expect(forEachMock1).toBeCalled()
    expect(forEachMock1).toBeCalledWith(1, [1])

    expect(forEachMock2).toBeCalled()
    expect(forEachMock2).toBeCalledWith(1, [1])
  })
})

describe('filter method', () => {
  test('basic filter', () => {
    const filterMock = jest.fn(() => true)

    EventStream(attachMock).filter(filterMock)

    mockEvent.fireEvent(1)

    expect(filterMock).toBeCalled()
    expect(filterMock).toBeCalledWith(1, [1])
  })

  test('filter true', () => {
    const mapMock = jest.fn()
    const filterMock = jest.fn(() => true)

    EventStream(attachMock)
      .filter(filterMock)
      .map(mapMock)

    mockEvent.fireEvent(1)

    expect(filterMock).toBeCalled()
    expect(filterMock).toBeCalledWith(1, [1])

    expect(mapMock).toBeCalled()
    expect(mapMock).toBeCalledWith(1, [1])
  })

  test('filter false', () => {
    const mapMock = jest.fn()
    const filterMock = jest.fn(() => false)

    EventStream(attachMock)
      .filter(filterMock)
      .map(mapMock)

    mockEvent.fireEvent(1)

    expect(filterMock).toBeCalled()
    expect(filterMock).toBeCalledWith(1, [1])

    expect(mapMock).not.toBeCalled()
  })

  test('filter method chain', () => {
    const filterMock1 = jest.fn(() => true)
    const filterMock2 = jest.fn(() => false)
    const mapMock1 = jest.fn()
    const mapMock2 = jest.fn()

    EventStream(attachMock)
      .filter(filterMock1)
      .filter(filterMock2)
      .map(mapMock1)
      .map(mapMock2)

    mockEvent.fireEvent(1)

    expect(filterMock1).toBeCalled()
    expect(filterMock1).toBeCalledWith(1, [1])

    expect(filterMock2).toBeCalled()
    expect(filterMock2).toBeCalledWith(1, [1])

    expect(mapMock1).not.toBeCalled()
    expect(mapMock2).not.toBeCalled()
  })
})

describe('catch method', () => {
  const logError = console.error

  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = logError
  })

  test('basic catch', () => {
    const catchMock = jest.fn()

    EventStream(attachMock).catch(catchMock)

    mockEvent.fireEvent(1)

    expect(catchMock).not.toBeCalled()
  })

  test('catches error and continues', () => {
    const bomb = jest.fn(() => {
      throw 'boom!'
    })
    const catchMock = jest.fn(() => 2)
    const after = jest.fn()

    EventStream(attachMock)
      .map(bomb)
      .catch(catchMock)
      .map(after)

    mockEvent.fireEvent(1)

    expect(bomb).toBeCalled()
    expect(bomb).toThrow()

    expect(catchMock).toBeCalled()
    expect(catchMock).toBeCalledWith('boom!', [1])

    expect(after).toBeCalled()
    expect(after).toBeCalledWith(2, [1])
  })

  test('does not catch if no error', () => {
    const before = jest.fn(x => x)
    const catchMock = jest.fn(() => 2)
    const after = jest.fn()

    EventStream(attachMock)
      .map(before)
      .catch(catchMock)
      .map(after)

    mockEvent.fireEvent(1)

    expect(before).toBeCalled()
    expect(before).not.toThrow()

    expect(catchMock).not.toBeCalled()

    expect(after).toBeCalled()
    expect(after).toBeCalledWith(1, [1])
  })

  test('only catches after error', () => {
    const before = jest.fn(x => x)
    const catchMock1 = jest.fn(() => 2)
    const bomb = jest.fn(() => {
      throw 'boom!'
    })
    const catchMock2 = jest.fn()
    const after = jest.fn()

    EventStream(attachMock)
      .map(before)
      .catch(catchMock1)
      .map(bomb)
      .catch(catchMock2)
      .map(after)

    mockEvent.fireEvent(1)

    expect(before).toBeCalled()
    expect(before).not.toThrow()

    expect(catchMock1).not.toBeCalled()

    expect(bomb).toBeCalled()
    expect(bomb).toThrow()

    expect(catchMock2).toBeCalled()
    expect(catchMock2).toBeCalledWith('boom!', [1])

    expect(after).toBeCalled()
  })

  test('catches error before filter and stops', () => {
    const bomb = jest.fn(() => {
      throw 'boom!'
    })
    const filterMock = jest.fn()
    const catchMock = jest.fn(() => 2)
    const after = jest.fn()

    EventStream(attachMock)
      .map(bomb)
      .filter(filterMock)
      .catch(catchMock)
      .map(after)

    mockEvent.fireEvent(1)

    expect(bomb).toBeCalled()
    expect(bomb).toThrow()

    expect(filterMock).not.toBeCalled()

    expect(catchMock).toBeCalled()
    expect(catchMock).toBeCalledWith('boom!', [1])

    expect(after).not.toBeCalled()
  })

  test('handle uncaught errors', () => {
    const bomb = jest.fn(() => {
      throw 'boom!'
    })

    EventStream(attachMock).map(bomb)

    mockEvent.fireEvent(1)

    expect(console.error).toBeCalled()
  })
})
