export const mockEvent = {
  addListener: jest.fn(fn => {
    mockEvent.listeners.push(fn)
  }),

  removeListener: jest.fn(fn => {
    mockEvent.listeners = mockEvent.listeners.filter(
      f => f !== fn,
    )
  }),

  fireEvent: jest.fn(event =>
    mockEvent.listeners.forEach(fn => {
      fn(event)
    }),
  ),

  listeners: [],
}

export const attachMock = jest.fn(callback => {
  const mockcallback = jest.fn(callback)
  mockEvent.addListener(mockcallback)
  return mockEvent.removeListener
})

const stubTrue = () => true
const stubFalse = () => false
const identity = x => x
const promiseResolve = x => Promise.resolve(x)
const promiseReject = () => Promise.reject('boo!')
const throwFn = () => {
  throw 'boo!'
}

export const pipeMock = jest.fn(identity)

export const filterTrueMock = jest.fn(stubTrue)
export const filterFalseMock = jest.fn(stubFalse)

export const throwMock = jest.fn(throwFn)

export const clearTrueMock = jest.fn(stubTrue)
export const clearFalseMock = jest.fn(stubFalse)

export const resolveMock = jest.fn(promiseResolve)
export const rejectMock = jest.fn(promiseReject)
