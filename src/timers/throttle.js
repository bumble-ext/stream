import { timeout } from './timeout'

/**
 * @todo
 * Throttle should resolve the most recent promise,
 * not the first promise. See the first example.
 *
 * A Promise based throttle function that resolves with true
 * after a specified amount of time. When the thottler is called
 * a second time before the first promise resolves,
 * the returned promise immediately resolves to false.
 *
 * @param {function(*):boolean|string|number} fn - Callback for each time the throttler is called.
 * @returns {function(*):TimeoutPromise<boolean>} Returns a throttler function.
 *
 * @example
 * // Debounce for 5ms
 * const throttler = throttle(() => 5)
 * throttler().then() // Resolves to true after 5ms
 * throttler().then() // Resolves to false now
 *
 * @example
 * const throttler = throttle(text => {
 *   if (text === '') {
 *     // Resolve the previous to false now
 *     // Resolve the current promise to false now
 *     // Clear the timeout
 *     return false
 *   }
 *   if (text.includes('\n')) {
 *     // Resolve the previous promise to false now
 *     // and the current promise to true now
 *     // Clear the timeout
 *     return true
 *   } else {
 *     // Resolve the previous promise to false now
 *     // Resolve the current promise to true after 5ms
 *     return 5
 *   }
 * })
 *
 * throttler('still typing') // Resolve every 5ms
 * throttler('') // Resolve both to false now
 * throttler('done typing\n') // Resolve both to true now
 */
export const throttle = fn => {
  let promise = null

  return x => {
    const result = fn(x)

    // handle old promise
    if (!promise) {
      promise = timeout(result)
        // Clean up promise
        .then((x = true) => {
          promise = null
          return x
        })

      return promise
    } else if (typeof result === 'boolean') {
      promise.resolve(result)
    }

    return timeout(0).resolve(false)
  }
}
