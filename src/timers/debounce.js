import { timeout } from './timeout'

/**
 * A Promise based debounce function that resolves with true
 * only after the function has not been called
 * for a certain amount of time.
 * When the debouncer is called a second time,
 * the first promise immediately resolves to false.
 *
 * @param {function(*):boolean|string|number} debounceCallback - Callback for each time the debouncer is called.
 * @returns {function(*):TimeoutPromise<boolean>} Returns a debouncer function.
 *
 * @example
 * // Debounce for 5ms
 * const debouncer = debounce(() => 5)
 * debouncer().then() // Resolves to false
 * debouncer().then() // Resolves to true
 *
 * @example
 * const debouncer = debounce(text => {
 *   if (text === '') {
 *     // Resolve both the pending promise
 *     // and this one to false
 *     return false
 *   }
 *   if (text.includes('\n')) {
 *     // Resolve both promises to true
 *     return true
 *   } else {
 *     // Resolve the prev promise to false
 *     // And resolve the current promise in 5ms
 *     return 5
 *   }
 * })
 *
 * debouncer('still typing') // Debounce
 * debouncer('') // Don't continue, no input
 * debouncer('done typing\n') // Resolve immediately
 */
export const debounce = fn => {
  let promise = null

  return x => {
    const result = fn(x)

    // handle old promise
    if (promise) {
      promise.resolve(false)
      promise = null
    }

    // create new promise
    if (typeof result === 'boolean') {
      return timeout(0).resolve(result)
    } else {
      promise = timeout(result).then((x = true) => x)
      return promise
    }
  }
}
