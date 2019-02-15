import { listenTo } from './listen-to'

/**
 * Resolves the first time the event occurs. The event listener is removed after the Promise resolves.
 *
 * @returns {Promise<eventResults>} Resolves with whatever the event passes the callback.
 *
 * @example
 * const eventPromise = EventPromise(chrome.someEvent)
 *
 * eventPromise.then(() => {
 *   // This will only be called
 *   // the first time the event occurs.
 * })
 */
export const EventPromise = (...args) =>
  new Promise((resolve, reject) => {
    try {
      listenTo(...args)
        .forEach(resolve)
        .catch(reject)
        .clear(() => true)
    } catch (error) {
      reject(error)
    }
  })
