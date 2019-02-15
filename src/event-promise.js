import { listenTo } from './listen-to'

/**
 * Resolves the first time the event occurs.
 *
 * @example
 * const eventPromise = new EventPromise(chrome.someEvent)
 *
 * @example
 * const eventPromise = EventPromise.for(chrome.someEvent)
 */
export class EventPromise extends Promise {
  constructor(...args) {
    super((resolve, reject) => {
      try {
        listenTo(...args)
          .forEach(resolve)
          .catch(reject)
          .clear(() => true)
      } catch (error) {
        reject(error)
      }
    })
  }
}

EventPromise.for = (...args) => new EventPromise(...args)
