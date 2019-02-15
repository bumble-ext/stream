import { BumbleStream, timeout } from '../../src/main'
import { attachMock, mockEvent } from '../mock.event'

afterEach(() => {
  mockEvent.listeners = []
  jest.clearAllMocks()
})

describe('async stream', () => {
  describe('await method', () => {
    test('basic awaitMap', done => {
      const asyncMock = jest.fn(async x => x)

      BumbleStream(attachMock)
        .awaitMap(asyncMock)
        .map(() => {
          expect(asyncMock).toBeCalledTimes(1)
          expect(asyncMock).toBeCalledWith(1, [1])

          done()
        })

      mockEvent.fireEvent(1)
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

    test('catch after await', done => {
      const awaitMock = jest.fn(x => Promise.resolve(x))
      const catchMock = jest.fn(() => 2)
      const bomb = jest.fn(() => {
        throw 'boom!'
      })

      BumbleStream(attachMock)
        .map(bomb)
        .await(awaitMock)
        .catch(catchMock)
        .map(catchReturnValue => {
          expect(bomb).toBeCalled()

          expect(awaitMock).not.toBeCalled()

          expect(catchMock).toBeCalled()
          expect(catchMock).toBeCalledWith('boom!', [1])

          expect(catchReturnValue).toBe(2)
        })
        .map(done)
        .catch(done)

      mockEvent.fireEvent(1)
    })

    test('handle uncaught async errors', () => {
      const awaitMock = jest.fn(x => Promise.resolve(x))

      const bomb = jest.fn(() => {
        throw 'boom!'
      })

      BumbleStream(attachMock)
        .await(awaitMock)
        .map(bomb)

      mockEvent.fireEvent(1)

      expect(console.error).not.toBeCalled()

      return timeout(0).then(() => {
        expect(console.error).toBeCalled()
      })
    })
  })
})
