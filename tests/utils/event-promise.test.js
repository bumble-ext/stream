import { mockEvent } from '../mock.event'
import { EventPromise } from '../../src/main'

describe('event promise', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockEvent.listeners = []
  })

  test('event promise setup', () => {
    const whenMockEvent = EventPromise(mockEvent)

    expect(mockEvent.addListener).toBeCalled()
    expect(mockEvent.addListener.mock.calls[0].length).toBe(1)
    expect(
      mockEvent.addListener.mock.calls[0][0]
    ).toBeInstanceOf(Function)

    expect(mockEvent.listeners.length).toBe(1)

    expect(whenMockEvent).toBeInstanceOf(Promise)
  })

  test('basic event promise', () => {
    const whenMockEvent = EventPromise(mockEvent)

    const event = { apples: 2 }
    mockEvent.fireEvent(event)

    expect(mockEvent.addListener).toBeCalledTimes(1)
    expect(mockEvent.removeListener).toBeCalled()
    expect(mockEvent.listeners.length).toBe(0)

    return whenMockEvent.then(e => {
      expect(e).toBe(event)
    })
  })
})
