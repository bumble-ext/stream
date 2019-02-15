import ms from 'ms'
import { BumbleStream } from '../event-stream'

/**
 * Mappable setInterval. Uses BumbleStream internally.
 *
 * @function interval
 * @param {string} time - Represents time between intervals.
 * @returns {Object} Returns a BumbleStreamChain object.
 *
 * @example
 * interval('10s').forEach((x) => {
 *   console.log(x, 'times')
 * })
 */
export function interval(time) {
  const milliseconds = typeof time === 'string' ? ms(time) : time

  return BumbleStream(callback => {
    // Create counter
    let count = 0

    // Start interval, pass count to callback, increment count
    const id = setInterval(() => {
      callback(count)
      count++
    }, milliseconds)

    // Return function to stop interval
    return () => clearInterval(id)
  })
}
