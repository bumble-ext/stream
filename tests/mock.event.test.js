import { mockEvent } from './mock.event'

describe('mockEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEvent.listeners = []
  })

  test('addListener method', () => {
    const spy = jest.fn()
    mockEvent.addListener(spy)

    expect(mockEvent.addListener).toBeCalled()
    expect(spy).not.toBeCalled()
    expect(mockEvent.listeners.length).toBe(1)
  })

  test('removeListener method', () => {
    const spy = jest.fn()
    mockEvent.addListener(spy)

    mockEvent.removeListener(spy)

    expect(mockEvent.removeListener).toBeCalled()
    expect(spy).not.toBeCalled()
    expect(mockEvent.listeners.length).toBe(0)
  })

  test('fireEvent method', () => {
    const spy = jest.fn()

    mockEvent.addListener(spy)

    mockEvent.fireEvent(spy)

    expect(mockEvent.fireEvent).toBeCalled()
    expect(spy).toBeCalled()
  })
})
