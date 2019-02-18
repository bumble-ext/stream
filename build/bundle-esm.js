const map = mapFn => ({ use, result, error, args }) => {
  try {
    if (use && !error) {
      return {
        use,
        args,
        result: mapFn(result, args)
      }
    } else {
      return { use, result, error, args }
    }
  } catch (error) {
    return { error, use, args }
  }
};

const filter = predFn => ({
  use,
  error,
  result,
  args
}) => {
  try {
    if (error) {
      return { use: false, result, error, args }
    } else if (use) {
      return {
        use: predFn(result, args),
        result,
        args
      }
    } else {
      return { use, result, error, args }
    }
  } catch (error) {
    return { error, use, args }
  }
};

const clear = clearFn => predFn => ({
  use,
  error,
  result,
  args
}) => {
  try {
    if (use && !error && predFn(result, args)) {
      clearFn();
    }

    return { use, result, error, args }
  } catch (error) {
    return { error, use, args }
  }
};

const forEach = forEachFn => ({
  use,
  result,
  error,
  args
}) => {
  try {
    if (use && !error) {
      forEachFn(result, args);
    }

    return { use, result, error, args }
  } catch (error) {
    return { error, use, args }
  }
};

const awaitFilter = (callback, asyncFn) => ({
  use,
  result,
  error,
  args
}) => {
  if (error) {
    return {
      error: callback.direct({
        use: false,
        error,
        args
      }),
      use: false,
      args
    }
  } else if (use) {
    return {
      result: Promise.resolve(result)
        .then(r => asyncFn(r, args))
        .then(use => ({
          use: !!use,
          result,
          args
        }))
        .catch(e => ({
          use,
          error: e,
          args
        }))
        .then(callback.direct),
      use,
      args
    }
  } else {
    return {
      result: callback.direct({
        use,
        result,
        args
      }),
      use,
      args
    }
  }
};

const awaitMap = (callback, asyncFn) => ({
  use,
  result,
  error,
  args
}) => {
  if (error) {
    return {
      error: callback.direct({
        use,
        error,
        args
      }),
      use,
      args
    }
  } else if (use) {
    return {
      result: Promise.resolve(result)
        .then(r => asyncFn(r, args))
        .then(r => ({ use, args, result: r }))
        .catch(e => ({
          use,
          error: e,
          args
        }))
        .then(callback.direct),
      use,
      args
    }
  } else {
    return {
      result: callback.direct({
        use,
        result,
        args
      }),
      use,
      args
    }
  }
};

const handleError = catchFn => ({
  use,
  error,
  result,
  args
}) => {
  try {
    if (error) {
      return {
        result: catchFn(error, args),
        use,
        args
      }
    } else {
      return { use, result, args }
    }
  } catch (error) {
    return { error, use, args }
  }
};

/**
 * A configurable API with familiar methods that compose a callback function that can be passed to an event listener.
 *
 * The attach function should return a clear function: a function that removes the listener.
 *
 * @function BumbleStream
 * @param {Function} callback - Pass to an event listener.
 * @param {directCallback} callback.direct - Use to directly configure a stream.
 * @returns {BumbleStreamChain} An object with familiar method names.
 *
 * @example
 * const listenToChromeEvent = (eventObject) => {
 *   return BumbleStream(callback => {
 *     // Add the composed callback to the event listeners.
 *     eventObject.addListener(callback)
 *     // Return a function to remove the callback
 *     // from the event listener.
 *     return () => eventObject.removeListener(callback)
 *   })
 * }
 *
 * @example
 * function interval(time) {
 *   const milliseconds = ms(time)
 *
 *   return BumbleStream(callback => {
 *     // Create counter
 *     let count = 0
 *
 *     // Start interval, pass count to callback, increment count
 *     const id = setInterval(() => {
 *       callback(count)
 *       count++
 *     }, milliseconds)
 *
 *     // Return function to stop interval
 *     return () => clearInterval(id)
 *   })
 * }
 */
function BumbleStream(attachFn, ...args) {
  let composedFn = x => x;

  // used by composeClear()
  const clearFn = attachFn(callback, ...args);

  callback.direct = direct;

  /**
   * Map changes result to the return value of mapFn.
   *
   * @memberof BumbleStreamChain
   * @function map
   * @param {Function} fn - The return value is passed to the next method.
   * @returns {BumbleStreamChain}
   *
   * @example
   * interval('10s')
   *   .map(() => 1)
   *   .map((x) => x + 1)
   *   .map((x) => {
   *     console.log('This should be 2', x)
   *   })
   *
   */
  const map$$1 = compose(map);

  /**
   * Use for effects. ForEach does not pass its return value to the next function.
   *
   * @memberof BumbleStreamChain
   * @function forEach
   * @param {Function} fn - The return value is ignored.
   * @returns {methods} BumbleStream methods object.
   *
   * @example
   * interval('10s')
   *   .map(() => 1)
   *   .forEach((x) => {
   *     const count = x + 1
   *     console.log('This should be 2', count)
   *     return count
   *   })
   *   .map((x) => {
   *     console.log('This should be 1', x)
   *   })
   */
  const forEach$$1 = compose(forEach);

  /**
   * Filter stops further mapping
   * and returns the current value
   * if the predicate returns false.
   *
   * @memberof BumbleStreamChain
   * @function filter
   * @param {Function} predFn - Predicate.
   * @returns {Object} BumbleStream methods object.
   *
   * @example
   * interval('10s')
   *   // This will skip the first 2 intervals
   *   .filter((x) => x > 2)
   *   .forEach((x) => {
   *     console.log('This should be 3', x)
   *   })
   *
   */
  const filter$$1 = compose(filter);

  /**
   * Clear removes the event listener and
   * continues down the map chain
   * if the predicate returns true.
   *
   * It calls the function returned by attachFn.
   *
   * @memberof BumbleStreamChain
   * @function clear
   * @param {Function} [predFn] - Predicate.
   * @returns {Object} BumbleStream methods object.
   *
   * @example
   * interval('10s')
   *   // This will clear the interval on the 3rd time.
   *   .clear((x) => x > 2)
   *   .forEach(() => {
   *     console.log('I will log three times.')
   *   })
   *
   * @example
   * interval('10s')
   *   // This will clear the interval immediately.
   *   .clear()
   *   .forEach(() => {
   *     console.log('I will never log.')
   *   })
   *
   * @example
   * const clear = interval('10s').clear
   * //This will clear the interval when something fails to load.
   * window.onerror = (e) => clear()
   *
   */
  const clear$$1 = predFn =>
    predFn
      ? compose(clear(() => clearFn()))(predFn)
      : clearFn();

  /**
   * Catch could cause a call to filter to be skipped.
   * If this happens, the chain could begin to execute again.
   *
   * @memberof BumbleStreamChain
   * @function catch
   * @param {Function} fn - Called when an error is encountered.
   * @returns {Object} BumbleStream methods object.
   *
   * @example
   * interval('10s')
   *   .map(() => {
   *     new Error('Boom!')
   *   })
   *   .catch((error) => {
   *     console.log('The next line will say "Boom!"')
   *     console.error(error.message)
   *   })
   *
   */
  const handleError$$1 = compose(handleError);

  /**
   * Map a function that returns a Promise.
   * Composes a new BumbleStream callback
   * to pass to the returned Promise.then().
   *
   * @memberof BumbleStreamChain
   * @function await
   * @param {Function} asyncFn - Async Function.
   * @returns {Object} The BumbleStreamChain object.
   *
   * @example
   * listenTo(window, 'onload')
   *   .map(() => 'https://www.google.com')
   *   .await(fetch)
   *   .map((response) => {
   *     console.log(response.ok)
   *   })
   *
   */
  const awaitMap$$1 = composeAsync(awaitMap);

  /**
   * Evaluates a function that returns a predicate Promise
   * and stops further execution if the Promise resolves to false.
   *
   * @memberof BumbleStreamChain
   * @function awaitFilter
   * @param {function(*): boolean} asyncPredFn - Async Predicate Function.
   * @returns {Object} The BumbleStreamChain object.
   *
   * @example
   * listenTo(window, 'onload')
   *   .map(() => 'https://www.google.com')
   *   .await.filter(fetch)
   *   .map((response) => {
   *     console.log(response.ok)
   *   })
   *
   */
  const awaitFilter$$1 = composeAsync(awaitFilter);

  /**
   * The BumbleStreamChain composes a callback using
   * the familiar JS Array higher order function chain pattern.
   *
   * @member {Object}
   * @namespace BumbleStreamChain
   */
  const methods = {
    map: map$$1,
    filter: filter$$1,
    forEach: forEach$$1,
    catch: handleError$$1,
    clear: clear$$1,
    await: awaitMap$$1,
    awaitMap: awaitMap$$1,
    awaitFilter: awaitFilter$$1,
  };

  return methods

  function callback(...args) {
    return handleUncaughtError(
      composedFn({
        result: args[0],
        args,
        use: true,
      }),
    )
  }

  function direct(payload) {
    return handleUncaughtError(composedFn(payload))
  }

  function handleUncaughtError({ result, error }) {
    if (error) {
      if (error instanceof Promise) {
        Promise.resolve(error).then(error => {
          console.error('Uncaught async error in BumbleStream');
          console.error(error);
        });
      } else {
        console.error('Uncaught error in BumbleStream');
        console.error(error);
      }
    } else {
      return result
    }
  }

  function compose(wrapper) {
    return fn => {
      const newFn = wrapper(fn);
      const oldFn = composedFn;

      composedFn = event => newFn(oldFn(event));

      return methods
    }
  }

  /* Goes into BumbleStream */
  function composeAsync(wrapper) {
    return asyncFn =>
      BumbleStream(callback => {
        const newFn = wrapper(callback, asyncFn);

        const oldFn = composedFn;

        composedFn = event => newFn(oldFn(event));

        return clearFn
      })
  }
}
/**
 * Use to directly configure the BumbleStream.
 * Used internally by the async method.
 *
 * @callback directCallback
 * @param {Object} payload - The value BumbleStream uses internally.
 * @param {any} payload.result - The value to pass to the next method callback.
 * @param {Array} payload.args - An array to pass to each method callback.
 * @param {boolean} payload.use - Will cause method callback to skip if false.
 *
 * @example
 * BumbleStream(({direct}) => {
 *   // Immediately execute composed callback
 *   direct({
 *     result: 123,
 *     args: [1, 2, 3],
 *     use: true,
 *   })
 *
 *   // Configure clearFn
 *   return () => clear()
 * })
 */

/**
 * Listen to one or multiple events on a DOM Element.
 *
 * @memberof listenTo
 * @function listenToChromeEvent
 * @param {Object} eventObject - A DOM Element.
 * @param {...any} [args] - Additional arguments to spread into Event.addListener().
 * @returns {Object} Returns a BumbleStream object.
 *
 * @example
 * const myDiv = document.querySelector('#mydiv')
 * listenToDomEvent(myDiv, 'click')
 *   .map((event) => {})
 *
 * @example
 * const myDiv = document.querySelector('#mydiv')
 * listenToDomEvent(myDiv, ['click', 'keypress'])
 *   .map((event) => {})
 */
const listenToChromeEvent = (eventObject, ...args) => {
  return BumbleStream(callback => {
    eventObject.addListener(callback, ...args);
    return () => eventObject.removeListener(callback)
  })
};

/**
 * Listen to one or multiple events on a DOM Element.
 *
 * @memberof listenTo
 * @function listenToDomEvent
 * @param {Object} target - A DOM Element.
 * @param {string|Array<string>} event - An event string or an array of event strings.
 * @returns {Object} Returns a BumbleStream object.
 *
 * @example
 * const myDiv = document.querySelector('#mydiv')
 * listenToDomEvent(myDiv, 'click')
 *   .map((event) => {})
 *
 * @example
 * const myDiv = document.querySelector('#mydiv')
 * listenToDomEvent(myDiv, ['click', 'keypress'])
 *   .map((event) => {})
 */
const listenToDomEvent = (target, event) => {
  return BumbleStream(callback => {
    if (Array.isArray(event)) {
      event.forEach(event =>
        target.addEventListener(event, callback),
      );

      return () =>
        event.forEach(event =>
          target.removeEventListener(event, callback),
        )
    } else {
      target.addEventListener(event, callback);
      return () => target.removeEventListener(event, callback)
    }
  })
};

/**
 * Map responses to events. Uses BumbleStream internally.
 *
 * @function listenTo
 * @param {Object} target - Either Chrome API Event or DOM Element.
 * @param  {...any} [args] - Event string or additional arguments.
 * @returns {Object} Returns a BumbleStream object.
 *
 * @example
 * listenTo(chrome.runtime.onMessage).map(({greeting}) => {
 *   if(greeting === 'hello') {
 *     return ({greeting: 'goodbye'})
 *   }
 * })
 *
 */
const listenTo = (target, ...args) => {
  if (target.addEventListener) {
    return listenToDomEvent(target, args[0])
  } else {
    return listenToChromeEvent(target, ...args)
  }
};
listenTo.domEvent = listenToDomEvent;
listenTo.chromeEvent = listenToChromeEvent;

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
const EventPromise = (...args) =>
  new Promise((resolve, reject) => {
    try {
      listenTo(...args)
        .forEach(resolve)
        .catch(reject)
        .clear(() => true);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * Thenable setTimeout. Uses Promise internally.
 * The Promise resolves with undefined.
 *
 * @todo Could be refactored to use an empty promise
 *
 * @memberof
 * @function timeout
 * @param {string|number} time - String description of time or milliseconds if number.
 * @returns {Object} Returns a thenable object for chaining.
 *
 * @example
 * timeout('10s').then(() => {
 *   console.log('It has been 10 seconds!')
 * })
 *
 * @example
 * // Use argument defaults to pass
 * // values when the promise resolves.
 * timeout('10s').then((result = 5) => {
 *   console.log('The result is', result)
 * }) // The result is 5
 *
 * @example
 * // Call resolve to resolve the promise immediately.
 * // The promise will resolve with the value you pass to it.
 * timeout('10s').then((result = 5) => {
 *   console.log('The result is', result)
 * }).resolve(6) // The result is 6
 */
function timeout(time) {
  const milliseconds = typeof time === 'string' ? ms(time) : time;

  let timeoutId;
  let promiseResolve;
  let promiseReject;

  let promise = new Promise((resolve, reject) => {
    try {
      promiseResolve = x => resolve(x);
      promiseReject = x => reject(x);

      timeoutId = setTimeout(() => {
        try {
          promiseResolve = () => {};
          promiseReject = () => {};

          resolve();
        } catch (error) {
          reject(error);
        }
      }, milliseconds);
    } catch (error) {
      reject(error);
    }
  });

  const methods = {
    /**
     * Add another function to the Promise chain.
     *
     * @returns {Object} The methods object
     *
     * @example
     * timeout('5s').then(() => {
     *   console.log('5 seconds have passed.')
     * })
     */
    then: fn => {
      promise = promise.then(fn);
      return methods
    },

    /**
     * Catch a rejected promise.
     *
     * @returns {Object} The methods object
     *
     * @example
     * timeout('5s')
     *   .then(() => {
     *     throw 'No, no quiero.'
     *   })
     *   .catch((error) => {
     *     console.log('Just do it.')
     *   })
     */
    catch: fn => {
      promise = promise.catch(fn);
      return methods
    },

    /**
     * Stop the timer.
     * The promise will remain pending,
     * and can be resolved and rejected.
     *
     * @example
     * const timer = timeout('5s')
     * timer.clear()
     */
    clear: () => {
      clearTimeout(timeoutId);
    },

    /**
     * Clear the timeout and resolve the promise immediately with the parameter value.
     *
     * @function resolve
     * @param {*} value - The value to pass to resolve().
     * @returns {undefined} Returns undefined
     *
     * @example
     * timeout('5s').resolve('Done!')
     */
    resolve: x => {
      methods.clear();
      promiseResolve(x);
      return methods
    },

    /**
     * Clear the timeout and resolve the promise immediately with the parameter value.
     *
     * @function reject
     * @param {*} value - The value to pass to reject().
     * @returns {undefined} Returns undefined
     *
     * @example
     * timeout('5s').reject('No soup for you!')
     */
    reject: x => {
      methods.clear();
      promiseReject(x);
      return methods
    },

    /** The id returned by setTimeout */
    timeoutId
  };

  return methods
}

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
const debounce = fn => {
  let promise = null;

  return x => {
    const result = fn(x);

    // handle old promise
    if (promise) {
      promise.resolve(false);
      promise = null;
    }

    // create new promise
    if (typeof result === 'boolean') {
      return timeout(0).resolve(result)
    } else {
      promise = timeout(result).then((x = true) => x);
      return promise
    }
  }
};

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
function interval(time) {
  const milliseconds = typeof time === 'string' ? ms(time) : time;

  return BumbleStream(callback => {
    // Create counter
    let count = 0;

    // Start interval, pass count to callback, increment count
    const id = setInterval(() => {
      callback(count);
      count++;
    }, milliseconds);

    // Return function to stop interval
    return () => clearInterval(id)
  })
}

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
const throttle = fn => {
  let promise = null;

  return x => {
    const result = fn(x);

    // handle old promise
    if (!promise) {
      promise = timeout(result)
        // Clean up promise
        .then((x = true) => {
          promise = null;
          return x
        });

      return promise
    } else if (typeof result === 'boolean') {
      promise.resolve(result);
    }

    return timeout(0).resolve(false)
  }
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _mapping = createCommonjsModule(function (module, exports) {
/** Used to map aliases to their real names. */
exports.aliasToReal = {

  // Lodash aliases.
  'each': 'forEach',
  'eachRight': 'forEachRight',
  'entries': 'toPairs',
  'entriesIn': 'toPairsIn',
  'extend': 'assignIn',
  'extendAll': 'assignInAll',
  'extendAllWith': 'assignInAllWith',
  'extendWith': 'assignInWith',
  'first': 'head',

  // Methods that are curried variants of others.
  'conforms': 'conformsTo',
  'matches': 'isMatch',
  'property': 'get',

  // Ramda aliases.
  '__': 'placeholder',
  'F': 'stubFalse',
  'T': 'stubTrue',
  'all': 'every',
  'allPass': 'overEvery',
  'always': 'constant',
  'any': 'some',
  'anyPass': 'overSome',
  'apply': 'spread',
  'assoc': 'set',
  'assocPath': 'set',
  'complement': 'negate',
  'compose': 'flowRight',
  'contains': 'includes',
  'dissoc': 'unset',
  'dissocPath': 'unset',
  'dropLast': 'dropRight',
  'dropLastWhile': 'dropRightWhile',
  'equals': 'isEqual',
  'identical': 'eq',
  'indexBy': 'keyBy',
  'init': 'initial',
  'invertObj': 'invert',
  'juxt': 'over',
  'omitAll': 'omit',
  'nAry': 'ary',
  'path': 'get',
  'pathEq': 'matchesProperty',
  'pathOr': 'getOr',
  'paths': 'at',
  'pickAll': 'pick',
  'pipe': 'flow',
  'pluck': 'map',
  'prop': 'get',
  'propEq': 'matchesProperty',
  'propOr': 'getOr',
  'props': 'at',
  'symmetricDifference': 'xor',
  'symmetricDifferenceBy': 'xorBy',
  'symmetricDifferenceWith': 'xorWith',
  'takeLast': 'takeRight',
  'takeLastWhile': 'takeRightWhile',
  'unapply': 'rest',
  'unnest': 'flatten',
  'useWith': 'overArgs',
  'where': 'conformsTo',
  'whereEq': 'isMatch',
  'zipObj': 'zipObject'
};

/** Used to map ary to method names. */
exports.aryMethod = {
  '1': [
    'assignAll', 'assignInAll', 'attempt', 'castArray', 'ceil', 'create',
    'curry', 'curryRight', 'defaultsAll', 'defaultsDeepAll', 'floor', 'flow',
    'flowRight', 'fromPairs', 'invert', 'iteratee', 'memoize', 'method', 'mergeAll',
    'methodOf', 'mixin', 'nthArg', 'over', 'overEvery', 'overSome','rest', 'reverse',
    'round', 'runInContext', 'spread', 'template', 'trim', 'trimEnd', 'trimStart',
    'uniqueId', 'words', 'zipAll'
  ],
  '2': [
    'add', 'after', 'ary', 'assign', 'assignAllWith', 'assignIn', 'assignInAllWith',
    'at', 'before', 'bind', 'bindAll', 'bindKey', 'chunk', 'cloneDeepWith',
    'cloneWith', 'concat', 'conformsTo', 'countBy', 'curryN', 'curryRightN',
    'debounce', 'defaults', 'defaultsDeep', 'defaultTo', 'delay', 'difference',
    'divide', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'endsWith', 'eq',
    'every', 'filter', 'find', 'findIndex', 'findKey', 'findLast', 'findLastIndex',
    'findLastKey', 'flatMap', 'flatMapDeep', 'flattenDepth', 'forEach',
    'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight', 'get',
    'groupBy', 'gt', 'gte', 'has', 'hasIn', 'includes', 'indexOf', 'intersection',
    'invertBy', 'invoke', 'invokeMap', 'isEqual', 'isMatch', 'join', 'keyBy',
    'lastIndexOf', 'lt', 'lte', 'map', 'mapKeys', 'mapValues', 'matchesProperty',
    'maxBy', 'meanBy', 'merge', 'mergeAllWith', 'minBy', 'multiply', 'nth', 'omit',
    'omitBy', 'overArgs', 'pad', 'padEnd', 'padStart', 'parseInt', 'partial',
    'partialRight', 'partition', 'pick', 'pickBy', 'propertyOf', 'pull', 'pullAll',
    'pullAt', 'random', 'range', 'rangeRight', 'rearg', 'reject', 'remove',
    'repeat', 'restFrom', 'result', 'sampleSize', 'some', 'sortBy', 'sortedIndex',
    'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexOf', 'sortedUniqBy',
    'split', 'spreadFrom', 'startsWith', 'subtract', 'sumBy', 'take', 'takeRight',
    'takeRightWhile', 'takeWhile', 'tap', 'throttle', 'thru', 'times', 'trimChars',
    'trimCharsEnd', 'trimCharsStart', 'truncate', 'union', 'uniqBy', 'uniqWith',
    'unset', 'unzipWith', 'without', 'wrap', 'xor', 'zip', 'zipObject',
    'zipObjectDeep'
  ],
  '3': [
    'assignInWith', 'assignWith', 'clamp', 'differenceBy', 'differenceWith',
    'findFrom', 'findIndexFrom', 'findLastFrom', 'findLastIndexFrom', 'getOr',
    'includesFrom', 'indexOfFrom', 'inRange', 'intersectionBy', 'intersectionWith',
    'invokeArgs', 'invokeArgsMap', 'isEqualWith', 'isMatchWith', 'flatMapDepth',
    'lastIndexOfFrom', 'mergeWith', 'orderBy', 'padChars', 'padCharsEnd',
    'padCharsStart', 'pullAllBy', 'pullAllWith', 'rangeStep', 'rangeStepRight',
    'reduce', 'reduceRight', 'replace', 'set', 'slice', 'sortedIndexBy',
    'sortedLastIndexBy', 'transform', 'unionBy', 'unionWith', 'update', 'xorBy',
    'xorWith', 'zipWith'
  ],
  '4': [
    'fill', 'setWith', 'updateWith'
  ]
};

/** Used to map ary to rearg configs. */
exports.aryRearg = {
  '2': [1, 0],
  '3': [2, 0, 1],
  '4': [3, 2, 0, 1]
};

/** Used to map method names to their iteratee ary. */
exports.iterateeAry = {
  'dropRightWhile': 1,
  'dropWhile': 1,
  'every': 1,
  'filter': 1,
  'find': 1,
  'findFrom': 1,
  'findIndex': 1,
  'findIndexFrom': 1,
  'findKey': 1,
  'findLast': 1,
  'findLastFrom': 1,
  'findLastIndex': 1,
  'findLastIndexFrom': 1,
  'findLastKey': 1,
  'flatMap': 1,
  'flatMapDeep': 1,
  'flatMapDepth': 1,
  'forEach': 1,
  'forEachRight': 1,
  'forIn': 1,
  'forInRight': 1,
  'forOwn': 1,
  'forOwnRight': 1,
  'map': 1,
  'mapKeys': 1,
  'mapValues': 1,
  'partition': 1,
  'reduce': 2,
  'reduceRight': 2,
  'reject': 1,
  'remove': 1,
  'some': 1,
  'takeRightWhile': 1,
  'takeWhile': 1,
  'times': 1,
  'transform': 2
};

/** Used to map method names to iteratee rearg configs. */
exports.iterateeRearg = {
  'mapKeys': [1],
  'reduceRight': [1, 0]
};

/** Used to map method names to rearg configs. */
exports.methodRearg = {
  'assignInAllWith': [1, 0],
  'assignInWith': [1, 2, 0],
  'assignAllWith': [1, 0],
  'assignWith': [1, 2, 0],
  'differenceBy': [1, 2, 0],
  'differenceWith': [1, 2, 0],
  'getOr': [2, 1, 0],
  'intersectionBy': [1, 2, 0],
  'intersectionWith': [1, 2, 0],
  'isEqualWith': [1, 2, 0],
  'isMatchWith': [2, 1, 0],
  'mergeAllWith': [1, 0],
  'mergeWith': [1, 2, 0],
  'padChars': [2, 1, 0],
  'padCharsEnd': [2, 1, 0],
  'padCharsStart': [2, 1, 0],
  'pullAllBy': [2, 1, 0],
  'pullAllWith': [2, 1, 0],
  'rangeStep': [1, 2, 0],
  'rangeStepRight': [1, 2, 0],
  'setWith': [3, 1, 2, 0],
  'sortedIndexBy': [2, 1, 0],
  'sortedLastIndexBy': [2, 1, 0],
  'unionBy': [1, 2, 0],
  'unionWith': [1, 2, 0],
  'updateWith': [3, 1, 2, 0],
  'xorBy': [1, 2, 0],
  'xorWith': [1, 2, 0],
  'zipWith': [1, 2, 0]
};

/** Used to map method names to spread configs. */
exports.methodSpread = {
  'assignAll': { 'start': 0 },
  'assignAllWith': { 'start': 0 },
  'assignInAll': { 'start': 0 },
  'assignInAllWith': { 'start': 0 },
  'defaultsAll': { 'start': 0 },
  'defaultsDeepAll': { 'start': 0 },
  'invokeArgs': { 'start': 2 },
  'invokeArgsMap': { 'start': 2 },
  'mergeAll': { 'start': 0 },
  'mergeAllWith': { 'start': 0 },
  'partial': { 'start': 1 },
  'partialRight': { 'start': 1 },
  'without': { 'start': 1 },
  'zipAll': { 'start': 0 }
};

/** Used to identify methods which mutate arrays or objects. */
exports.mutate = {
  'array': {
    'fill': true,
    'pull': true,
    'pullAll': true,
    'pullAllBy': true,
    'pullAllWith': true,
    'pullAt': true,
    'remove': true,
    'reverse': true
  },
  'object': {
    'assign': true,
    'assignAll': true,
    'assignAllWith': true,
    'assignIn': true,
    'assignInAll': true,
    'assignInAllWith': true,
    'assignInWith': true,
    'assignWith': true,
    'defaults': true,
    'defaultsAll': true,
    'defaultsDeep': true,
    'defaultsDeepAll': true,
    'merge': true,
    'mergeAll': true,
    'mergeAllWith': true,
    'mergeWith': true,
  },
  'set': {
    'set': true,
    'setWith': true,
    'unset': true,
    'update': true,
    'updateWith': true
  }
};

/** Used to map real names to their aliases. */
exports.realToAlias = (function() {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      object = exports.aliasToReal,
      result = {};

  for (var key in object) {
    var value = object[key];
    if (hasOwnProperty.call(result, value)) {
      result[value].push(key);
    } else {
      result[value] = [key];
    }
  }
  return result;
}());

/** Used to map method names to other names. */
exports.remap = {
  'assignAll': 'assign',
  'assignAllWith': 'assignWith',
  'assignInAll': 'assignIn',
  'assignInAllWith': 'assignInWith',
  'curryN': 'curry',
  'curryRightN': 'curryRight',
  'defaultsAll': 'defaults',
  'defaultsDeepAll': 'defaultsDeep',
  'findFrom': 'find',
  'findIndexFrom': 'findIndex',
  'findLastFrom': 'findLast',
  'findLastIndexFrom': 'findLastIndex',
  'getOr': 'get',
  'includesFrom': 'includes',
  'indexOfFrom': 'indexOf',
  'invokeArgs': 'invoke',
  'invokeArgsMap': 'invokeMap',
  'lastIndexOfFrom': 'lastIndexOf',
  'mergeAll': 'merge',
  'mergeAllWith': 'mergeWith',
  'padChars': 'pad',
  'padCharsEnd': 'padEnd',
  'padCharsStart': 'padStart',
  'propertyOf': 'get',
  'rangeStep': 'range',
  'rangeStepRight': 'rangeRight',
  'restFrom': 'rest',
  'spreadFrom': 'spread',
  'trimChars': 'trim',
  'trimCharsEnd': 'trimEnd',
  'trimCharsStart': 'trimStart',
  'zipAll': 'zip'
};

/** Used to track methods that skip fixing their arity. */
exports.skipFixed = {
  'castArray': true,
  'flow': true,
  'flowRight': true,
  'iteratee': true,
  'mixin': true,
  'rearg': true,
  'runInContext': true
};

/** Used to track methods that skip rearranging arguments. */
exports.skipRearg = {
  'add': true,
  'assign': true,
  'assignIn': true,
  'bind': true,
  'bindKey': true,
  'concat': true,
  'difference': true,
  'divide': true,
  'eq': true,
  'gt': true,
  'gte': true,
  'isEqual': true,
  'lt': true,
  'lte': true,
  'matchesProperty': true,
  'merge': true,
  'multiply': true,
  'overArgs': true,
  'partial': true,
  'partialRight': true,
  'propertyOf': true,
  'random': true,
  'range': true,
  'rangeRight': true,
  'subtract': true,
  'zip': true,
  'zipObject': true,
  'zipObjectDeep': true
};
});
var _mapping_1 = _mapping.aliasToReal;
var _mapping_2 = _mapping.aryMethod;
var _mapping_3 = _mapping.aryRearg;
var _mapping_4 = _mapping.iterateeAry;
var _mapping_5 = _mapping.iterateeRearg;
var _mapping_6 = _mapping.methodRearg;
var _mapping_7 = _mapping.methodSpread;
var _mapping_8 = _mapping.mutate;
var _mapping_9 = _mapping.realToAlias;
var _mapping_10 = _mapping.remap;
var _mapping_11 = _mapping.skipFixed;
var _mapping_12 = _mapping.skipRearg;

/**
 * The default argument placeholder value for methods.
 *
 * @type {Object}
 */
var placeholder = {};

/** Built-in value reference. */
var push = Array.prototype.push;

/**
 * Creates a function, with an arity of `n`, that invokes `func` with the
 * arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} n The arity of the new function.
 * @returns {Function} Returns the new function.
 */
function baseArity(func, n) {
  return n == 2
    ? function(a, b) { return func.apply(undefined, arguments); }
    : function(a) { return func.apply(undefined, arguments); };
}

/**
 * Creates a function that invokes `func`, with up to `n` arguments, ignoring
 * any additional arguments.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @param {number} n The arity cap.
 * @returns {Function} Returns the new function.
 */
function baseAry(func, n) {
  return n == 2
    ? function(a, b) { return func(a, b); }
    : function(a) { return func(a); };
}

/**
 * Creates a clone of `array`.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the cloned array.
 */
function cloneArray(array) {
  var length = array ? array.length : 0,
      result = Array(length);

  while (length--) {
    result[length] = array[length];
  }
  return result;
}

/**
 * Creates a function that clones a given object using the assignment `func`.
 *
 * @private
 * @param {Function} func The assignment function.
 * @returns {Function} Returns the new cloner function.
 */
function createCloner(func) {
  return function(object) {
    return func({}, object);
  };
}

/**
 * A specialized version of `_.spread` which flattens the spread array into
 * the arguments of the invoked `func`.
 *
 * @private
 * @param {Function} func The function to spread arguments over.
 * @param {number} start The start position of the spread.
 * @returns {Function} Returns the new function.
 */
function flatSpread(func, start) {
  return function() {
    var length = arguments.length,
        lastIndex = length - 1,
        args = Array(length);

    while (length--) {
      args[length] = arguments[length];
    }
    var array = args[start],
        otherArgs = args.slice(0, start);

    if (array) {
      push.apply(otherArgs, array);
    }
    if (start != lastIndex) {
      push.apply(otherArgs, args.slice(start + 1));
    }
    return func.apply(this, otherArgs);
  };
}

/**
 * Creates a function that wraps `func` and uses `cloner` to clone the first
 * argument it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} cloner The function to clone arguments.
 * @returns {Function} Returns the new immutable function.
 */
function wrapImmutable(func, cloner) {
  return function() {
    var length = arguments.length;
    if (!length) {
      return;
    }
    var args = Array(length);
    while (length--) {
      args[length] = arguments[length];
    }
    var result = args[0] = cloner.apply(undefined, args);
    func.apply(undefined, args);
    return result;
  };
}

/**
 * The base implementation of `convert` which accepts a `util` object of methods
 * required to perform conversions.
 *
 * @param {Object} util The util object.
 * @param {string} name The name of the function to convert.
 * @param {Function} func The function to convert.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.cap=true] Specify capping iteratee arguments.
 * @param {boolean} [options.curry=true] Specify currying.
 * @param {boolean} [options.fixed=true] Specify fixed arity.
 * @param {boolean} [options.immutable=true] Specify immutable operations.
 * @param {boolean} [options.rearg=true] Specify rearranging arguments.
 * @returns {Function|Object} Returns the converted function or object.
 */
function baseConvert(util, name, func, options) {
  var isLib = typeof name == 'function',
      isObj = name === Object(name);

  if (isObj) {
    options = func;
    func = name;
    name = undefined;
  }
  if (func == null) {
    throw new TypeError;
  }
  options || (options = {});

  var config = {
    'cap': 'cap' in options ? options.cap : true,
    'curry': 'curry' in options ? options.curry : true,
    'fixed': 'fixed' in options ? options.fixed : true,
    'immutable': 'immutable' in options ? options.immutable : true,
    'rearg': 'rearg' in options ? options.rearg : true
  };

  var defaultHolder = isLib ? func : placeholder,
      forceCurry = ('curry' in options) && options.curry,
      forceFixed = ('fixed' in options) && options.fixed,
      forceRearg = ('rearg' in options) && options.rearg,
      pristine = isLib ? func.runInContext() : undefined;

  var helpers = isLib ? func : {
    'ary': util.ary,
    'assign': util.assign,
    'clone': util.clone,
    'curry': util.curry,
    'forEach': util.forEach,
    'isArray': util.isArray,
    'isError': util.isError,
    'isFunction': util.isFunction,
    'isWeakMap': util.isWeakMap,
    'iteratee': util.iteratee,
    'keys': util.keys,
    'rearg': util.rearg,
    'toInteger': util.toInteger,
    'toPath': util.toPath
  };

  var ary = helpers.ary,
      assign = helpers.assign,
      clone = helpers.clone,
      curry = helpers.curry,
      each = helpers.forEach,
      isArray = helpers.isArray,
      isError = helpers.isError,
      isFunction = helpers.isFunction,
      isWeakMap = helpers.isWeakMap,
      keys = helpers.keys,
      rearg = helpers.rearg,
      toInteger = helpers.toInteger,
      toPath = helpers.toPath;

  var aryMethodKeys = keys(_mapping.aryMethod);

  var wrappers = {
    'castArray': function(castArray) {
      return function() {
        var value = arguments[0];
        return isArray(value)
          ? castArray(cloneArray(value))
          : castArray.apply(undefined, arguments);
      };
    },
    'iteratee': function(iteratee) {
      return function() {
        var func = arguments[0],
            arity = arguments[1],
            result = iteratee(func, arity),
            length = result.length;

        if (config.cap && typeof arity == 'number') {
          arity = arity > 2 ? (arity - 2) : 1;
          return (length && length <= arity) ? result : baseAry(result, arity);
        }
        return result;
      };
    },
    'mixin': function(mixin) {
      return function(source) {
        var func = this;
        if (!isFunction(func)) {
          return mixin(func, Object(source));
        }
        var pairs = [];
        each(keys(source), function(key) {
          if (isFunction(source[key])) {
            pairs.push([key, func.prototype[key]]);
          }
        });

        mixin(func, Object(source));

        each(pairs, function(pair) {
          var value = pair[1];
          if (isFunction(value)) {
            func.prototype[pair[0]] = value;
          } else {
            delete func.prototype[pair[0]];
          }
        });
        return func;
      };
    },
    'nthArg': function(nthArg) {
      return function(n) {
        var arity = n < 0 ? 1 : (toInteger(n) + 1);
        return curry(nthArg(n), arity);
      };
    },
    'rearg': function(rearg) {
      return function(func, indexes) {
        var arity = indexes ? indexes.length : 0;
        return curry(rearg(func, indexes), arity);
      };
    },
    'runInContext': function(runInContext) {
      return function(context) {
        return baseConvert(util, runInContext(context), options);
      };
    }
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Casts `func` to a function with an arity capped iteratee if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @returns {Function} Returns the cast function.
   */
  function castCap(name, func) {
    if (config.cap) {
      var indexes = _mapping.iterateeRearg[name];
      if (indexes) {
        return iterateeRearg(func, indexes);
      }
      var n = !isLib && _mapping.iterateeAry[name];
      if (n) {
        return iterateeAry(func, n);
      }
    }
    return func;
  }

  /**
   * Casts `func` to a curried function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity of `func`.
   * @returns {Function} Returns the cast function.
   */
  function castCurry(name, func, n) {
    return (forceCurry || (config.curry && n > 1))
      ? curry(func, n)
      : func;
  }

  /**
   * Casts `func` to a fixed arity function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity cap.
   * @returns {Function} Returns the cast function.
   */
  function castFixed(name, func, n) {
    if (config.fixed && (forceFixed || !_mapping.skipFixed[name])) {
      var data = _mapping.methodSpread[name],
          start = data && data.start;

      return start  === undefined ? ary(func, n) : flatSpread(func, start);
    }
    return func;
  }

  /**
   * Casts `func` to an rearged function if needed.
   *
   * @private
   * @param {string} name The name of the function to inspect.
   * @param {Function} func The function to inspect.
   * @param {number} n The arity of `func`.
   * @returns {Function} Returns the cast function.
   */
  function castRearg(name, func, n) {
    return (config.rearg && n > 1 && (forceRearg || !_mapping.skipRearg[name]))
      ? rearg(func, _mapping.methodRearg[name] || _mapping.aryRearg[n])
      : func;
  }

  /**
   * Creates a clone of `object` by `path`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {Array|string} path The path to clone by.
   * @returns {Object} Returns the cloned object.
   */
  function cloneByPath(object, path) {
    path = toPath(path);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        result = clone(Object(object)),
        nested = result;

    while (nested != null && ++index < length) {
      var key = path[index],
          value = nested[key];

      if (value != null &&
          !(isFunction(value) || isError(value) || isWeakMap(value))) {
        nested[key] = clone(index == lastIndex ? value : Object(value));
      }
      nested = nested[key];
    }
    return result;
  }

  /**
   * Converts `lodash` to an immutable auto-curried iteratee-first data-last
   * version with conversion `options` applied.
   *
   * @param {Object} [options] The options object. See `baseConvert` for more details.
   * @returns {Function} Returns the converted `lodash`.
   */
  function convertLib(options) {
    return _.runInContext.convert(options)(undefined);
  }

  /**
   * Create a converter function for `func` of `name`.
   *
   * @param {string} name The name of the function to convert.
   * @param {Function} func The function to convert.
   * @returns {Function} Returns the new converter function.
   */
  function createConverter(name, func) {
    var realName = _mapping.aliasToReal[name] || name,
        methodName = _mapping.remap[realName] || realName,
        oldOptions = options;

    return function(options) {
      var newUtil = isLib ? pristine : helpers,
          newFunc = isLib ? pristine[methodName] : func,
          newOptions = assign(assign({}, oldOptions), options);

      return baseConvert(newUtil, realName, newFunc, newOptions);
    };
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee, with up to `n`
   * arguments, ignoring any additional arguments.
   *
   * @private
   * @param {Function} func The function to cap iteratee arguments for.
   * @param {number} n The arity cap.
   * @returns {Function} Returns the new function.
   */
  function iterateeAry(func, n) {
    return overArg(func, function(func) {
      return typeof func == 'function' ? baseAry(func, n) : func;
    });
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee with arguments
   * arranged according to the specified `indexes` where the argument value at
   * the first index is provided as the first argument, the argument value at
   * the second index is provided as the second argument, and so on.
   *
   * @private
   * @param {Function} func The function to rearrange iteratee arguments for.
   * @param {number[]} indexes The arranged argument indexes.
   * @returns {Function} Returns the new function.
   */
  function iterateeRearg(func, indexes) {
    return overArg(func, function(func) {
      var n = indexes.length;
      return baseArity(rearg(baseAry(func, n), indexes), n);
    });
  }

  /**
   * Creates a function that invokes `func` with its first argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function() {
      var length = arguments.length;
      if (!length) {
        return func();
      }
      var args = Array(length);
      while (length--) {
        args[length] = arguments[length];
      }
      var index = config.rearg ? 0 : (length - 1);
      args[index] = transform(args[index]);
      return func.apply(undefined, args);
    };
  }

  /**
   * Creates a function that wraps `func` and applys the conversions
   * rules by `name`.
   *
   * @private
   * @param {string} name The name of the function to wrap.
   * @param {Function} func The function to wrap.
   * @returns {Function} Returns the converted function.
   */
  function wrap(name, func, placeholder$$1) {
    var result,
        realName = _mapping.aliasToReal[name] || name,
        wrapped = func,
        wrapper = wrappers[realName];

    if (wrapper) {
      wrapped = wrapper(func);
    }
    else if (config.immutable) {
      if (_mapping.mutate.array[realName]) {
        wrapped = wrapImmutable(func, cloneArray);
      }
      else if (_mapping.mutate.object[realName]) {
        wrapped = wrapImmutable(func, createCloner(func));
      }
      else if (_mapping.mutate.set[realName]) {
        wrapped = wrapImmutable(func, cloneByPath);
      }
    }
    each(aryMethodKeys, function(aryKey) {
      each(_mapping.aryMethod[aryKey], function(otherName) {
        if (realName == otherName) {
          var data = _mapping.methodSpread[realName],
              afterRearg = data && data.afterRearg;

          result = afterRearg
            ? castFixed(realName, castRearg(realName, wrapped, aryKey), aryKey)
            : castRearg(realName, castFixed(realName, wrapped, aryKey), aryKey);

          result = castCap(realName, result);
          result = castCurry(realName, result, aryKey);
          return false;
        }
      });
      return !result;
    });

    result || (result = wrapped);
    if (result == func) {
      result = forceCurry ? curry(result, 1) : function() {
        return func.apply(this, arguments);
      };
    }
    result.convert = createConverter(realName, func);
    result.placeholder = func.placeholder = placeholder$$1;

    return result;
  }

  /*--------------------------------------------------------------------------*/

  if (!isObj) {
    return wrap(name, func, defaultHolder);
  }
  var _ = func;

  // Convert methods by ary cap.
  var pairs = [];
  each(aryMethodKeys, function(aryKey) {
    each(_mapping.aryMethod[aryKey], function(key) {
      var func = _[_mapping.remap[key] || key];
      if (func) {
        pairs.push([key, wrap(key, func, _)]);
      }
    });
  });

  // Convert remaining methods.
  each(keys(_), function(key) {
    var func = _[key];
    if (typeof func == 'function') {
      var length = pairs.length;
      while (length--) {
        if (pairs[length][0] == key) {
          return;
        }
      }
      func.convert = createConverter(key, func);
      pairs.push([key, func]);
    }
  });

  // Assign to `_` leaving `_.prototype` unchanged to allow chaining.
  each(pairs, function(pair) {
    _[pair[0]] = pair[1];
  });

  _.convert = convertLib;
  _.placeholder = _;

  // Assign aliases.
  each(keys(_), function(key) {
    each(_mapping.realToAlias[key] || [], function(alias) {
      _[alias] = _[key];
    });
  });

  return _;
}

var _baseConvert = baseConvert;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** Used to store function metadata. */
var metaMap = _WeakMap && new _WeakMap;

var _metaMap = metaMap;

/**
 * The base implementation of `setData` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData = !_metaMap ? identity_1 : function(func, data) {
  _metaMap.set(func, data);
  return func;
};

var _baseSetData = baseSetData;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = _baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject_1(result) ? result : thisBinding;
  };
}

var _createCtor = createCtor;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = _createCtor(func);

  function wrapper() {
    var fn = (this && this !== _root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

var _createBind = createBind;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

var _composeArgs = composeArgs;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax$1(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

var _composeArgsRight = composeArgsRight;

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}

var _countHolders = countHolders;

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

var _baseLodash = baseLodash;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = _baseCreate(_baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

var _LazyWrapper = LazyWrapper;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

var noop_1 = noop;

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !_metaMap ? noop_1 : function(func) {
  return _metaMap.get(func);
};

var _getData = getData;

/** Used to lookup unminified function names. */
var realNames = {};

var _realNames = realNames;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = _realNames[result],
      length = hasOwnProperty$2.call(_realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

var _getFuncName = getFuncName;

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = _baseCreate(_baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

var _LodashWrapper = LodashWrapper;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof _LazyWrapper) {
    return wrapper.clone();
  }
  var result = new _LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = _copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

var _wrapperClone = wrapperClone;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array and iteratees accept only
 * one argument. The heuristic for whether a section qualifies for shortcut
 * fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike_1(value) && !isArray_1(value) && !(value instanceof _LazyWrapper)) {
    if (value instanceof _LodashWrapper) {
      return value;
    }
    if (hasOwnProperty$3.call(value, '__wrapped__')) {
      return _wrapperClone(value);
    }
  }
  return new _LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = _baseLodash.prototype;
lodash.prototype.constructor = lodash;

var wrapperLodash = lodash;

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = _getFuncName(func),
      other = wrapperLodash[funcName];

  if (typeof other != 'function' || !(funcName in _LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = _getData(other);
  return !!data && func === data[0];
}

var _isLaziable = isLaziable;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = _shortOut(_baseSetData);

var _setData = setData;

/** Used to match wrap detail comments. */
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

var _getWrapDetails = getWrapDetails;

/** Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

var _insertWrapDetails = insertWrapDetails;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
  return _defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex;

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

var _baseIsNaN = baseIsNaN;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var _strictIndexOf = strictIndexOf;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? _strictIndexOf(array, value, fromIndex)
    : _baseFindIndex(array, _baseIsNaN, fromIndex);
}

var _baseIndexOf = baseIndexOf;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && _baseIndexOf(array, value, 0) > -1;
}

var _arrayIncludes = arrayIncludes;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$1 = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256,
    WRAP_FLIP_FLAG = 512;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags = [
  ['ary', WRAP_ARY_FLAG],
  ['bind', WRAP_BIND_FLAG$1],
  ['bindKey', WRAP_BIND_KEY_FLAG],
  ['curry', WRAP_CURRY_FLAG],
  ['curryRight', WRAP_CURRY_RIGHT_FLAG],
  ['flip', WRAP_FLIP_FLAG],
  ['partial', WRAP_PARTIAL_FLAG],
  ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
  ['rearg', WRAP_REARG_FLAG]
];

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails(details, bitmask) {
  _arrayEach(wrapFlags, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !_arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

var _updateWrapDetails = updateWrapDetails;

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
function setWrapToString(wrapper, reference, bitmask) {
  var source = (reference + '');
  return _setToString(wrapper, _insertWrapDetails(source, _updateWrapDetails(_getWrapDetails(source), bitmask)));
}

var _setWrapToString = setWrapToString;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$2 = 1,
    WRAP_BIND_KEY_FLAG$1 = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG$1 = 8,
    WRAP_PARTIAL_FLAG$1 = 32,
    WRAP_PARTIAL_RIGHT_FLAG$1 = 64;

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG$1,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? WRAP_PARTIAL_FLAG$1 : WRAP_PARTIAL_RIGHT_FLAG$1);
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$1 : WRAP_PARTIAL_FLAG$1);

  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG$2 | WRAP_BIND_KEY_FLAG$1);
  }
  var newData = [
    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
    newHoldersRight, argPos, ary, arity
  ];

  var result = wrapFunc.apply(undefined, newData);
  if (_isLaziable(func)) {
    _setData(result, newData);
  }
  result.placeholder = placeholder;
  return _setWrapToString(result, func, bitmask);
}

var _createRecurry = createRecurry;

/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

var _getHolder = getHolder;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = _copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = _isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

var _reorder = reorder;

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

var _replaceHolders = replaceHolders;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$3 = 1,
    WRAP_BIND_KEY_FLAG$2 = 2,
    WRAP_CURRY_FLAG$2 = 8,
    WRAP_CURRY_RIGHT_FLAG$1 = 16,
    WRAP_ARY_FLAG$1 = 128,
    WRAP_FLIP_FLAG$1 = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG$1,
      isBind = bitmask & WRAP_BIND_FLAG$3,
      isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2,
      isCurried = bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1),
      isFlip = bitmask & WRAP_FLIP_FLAG$1,
      Ctor = isBindKey ? undefined : _createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = _getHolder(wrapper),
          holdersCount = _countHolders(args, placeholder);
    }
    if (partials) {
      args = _composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = _composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = _replaceHolders(args, placeholder);
      return _createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = _reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== _root && this instanceof wrapper) {
      fn = Ctor || _createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

var _createHybrid = createHybrid;

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry(func, bitmask, arity) {
  var Ctor = _createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = _getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : _replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return _createRecurry(
        func, bitmask, _createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== _root && this instanceof wrapper) ? Ctor : func;
    return _apply(fn, this, args);
  }
  return wrapper;
}

var _createCurry = createCurry;

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$4 = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG$4,
      Ctor = _createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== _root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return _apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

var _createPartial = createPartial;

/** Used as the internal argument placeholder. */
var PLACEHOLDER$1 = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$5 = 1,
    WRAP_BIND_KEY_FLAG$3 = 2,
    WRAP_CURRY_BOUND_FLAG$1 = 4,
    WRAP_CURRY_FLAG$3 = 8,
    WRAP_ARY_FLAG$2 = 128,
    WRAP_REARG_FLAG$1 = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$1 = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (WRAP_BIND_FLAG$5 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);

  var isCombo =
    ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_CURRY_FLAG$3)) ||
    ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_REARG_FLAG$1) && (data[7].length <= source[8])) ||
    ((srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$1)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG$3));

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & WRAP_BIND_FLAG$5) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & WRAP_BIND_FLAG$5 ? 0 : WRAP_CURRY_BOUND_FLAG$1;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? _composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? _replaceHolders(data[3], PLACEHOLDER$1) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? _composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? _replaceHolders(data[5], PLACEHOLDER$1) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & WRAP_ARY_FLAG$2) {
    data[8] = data[8] == null ? source[8] : nativeMin$1(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

var _mergeData = mergeData;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite_1(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$6 = 1,
    WRAP_BIND_KEY_FLAG$4 = 2,
    WRAP_CURRY_FLAG$4 = 8,
    WRAP_CURRY_RIGHT_FLAG$2 = 16,
    WRAP_PARTIAL_FLAG$2 = 32,
    WRAP_PARTIAL_RIGHT_FLAG$2 = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$2 = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *    1 - `_.bind`
 *    2 - `_.bindKey`
 *    4 - `_.curry` or `_.curryRight` of a bound function
 *    8 - `_.curry`
 *   16 - `_.curryRight`
 *   32 - `_.partial`
 *   64 - `_.partialRight`
 *  128 - `_.rearg`
 *  256 - `_.ary`
 *  512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG$2 | WRAP_PARTIAL_RIGHT_FLAG$2);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax$2(toInteger_1(ary), 0);
  arity = arity === undefined ? arity : toInteger_1(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$2) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : _getData(func);

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    _mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === undefined
    ? (isBindKey ? 0 : func.length)
    : nativeMax$2(newData[9] - length, 0);

  if (!arity && bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2)) {
    bitmask &= ~(WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG$6) {
    var result = _createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG$4 || bitmask == WRAP_CURRY_RIGHT_FLAG$2) {
    result = _createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG$2 || bitmask == (WRAP_BIND_FLAG$6 | WRAP_PARTIAL_FLAG$2)) && !holders.length) {
    result = _createPartial(func, bitmask, thisArg, partials);
  } else {
    result = _createHybrid.apply(undefined, newData);
  }
  var setter = data ? _baseSetData : _setData;
  return _setWrapToString(setter(result, newData), func, bitmask);
}

var _createWrap = createWrap;

/** Used to compose bitmasks for function metadata. */
var WRAP_ARY_FLAG$3 = 128;

/**
 * Creates a function that invokes `func`, with up to `n` arguments,
 * ignoring any additional arguments.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @param {number} [n=func.length] The arity cap.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.ary(parseInt, 1));
 * // => [6, 8, 10]
 */
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = (func && n == null) ? func.length : n;
  return _createWrap(func, WRAP_ARY_FLAG$3, undefined, undefined, undefined, undefined, n);
}

var ary_1 = ary;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$4.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$8.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$9.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$c.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$a.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn$1;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$d.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
  var result = [];
  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (_Map && getTag(new _Map) != mapTag$1) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$1) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$e.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$b.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag$1:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
}

var _baseIsMap = baseIsMap;

/* Node.js helper references. */
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

var isMap_1 = isMap;

/** `Object#toString` result references. */
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$3;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

var isSet_1 = isSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$2] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$2 || tag == argsTag$2 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap_1(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn : _getAllKeys)
    : (isFlat ? keysIn : keys_1);

  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return _baseClone(value, CLONE_SYMBOLS_FLAG$1);
}

var clone_1 = clone;

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG$5 = 8;

/**
 * Creates a function that accepts arguments of `func` and either invokes
 * `func` returning its result, if at least `arity` number of arguments have
 * been provided, or returns a function that accepts the remaining `func`
 * arguments, and so on. The arity of `func` may be specified if `func.length`
 * is not sufficient.
 *
 * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)(_, 3)(2);
 * // => [1, 2, 3]
 */
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = _createWrap(func, WRAP_CURRY_FLAG$5, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}

// Assign default placeholders.
curry.placeholder = {};

var curry_1 = curry;

/** `Object#toString` result references. */
var objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$f = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$f.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$c.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var domExcTag = '[object DOMException]',
    errorTag$2 = '[object Error]';

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike_1(value)) {
    return false;
  }
  var tag = _baseGetTag(value);
  return tag == errorTag$2 || tag == domExcTag ||
    (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject_1(value));
}

var isError_1 = isError;

/** `Object#toString` result references. */
var weakMapTag$3 = '[object WeakMap]';

/**
 * Checks if `value` is classified as a `WeakMap` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * _.isWeakMap(new WeakMap);
 * // => true
 *
 * _.isWeakMap(new Map);
 * // => false
 */
function isWeakMap(value) {
  return isObjectLike_1(value) && _getTag(value) == weakMapTag$3;
}

var isWeakMap_1 = isWeakMap;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$3 = '[object Error]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$4:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$3:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$3:
      return object.name == other.name && object.message == other.message;

    case regexpTag$3:
    case stringTag$3:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$5:
      var convert = _mapToArray;

    case setTag$5:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$3:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$g = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$d = objectProto$g.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$d.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$4 = '[object Object]';

/** Used for built-in method references. */
var objectProto$h = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$e = objectProto$h.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$2 : _getTag(object),
      othTag = othIsArr ? arrayTag$2 : _getTag(other);

  objTag = objTag == argsTag$3 ? objectTag$4 : objTag;
  othTag = othTag == argsTag$3 ? objectTag$4 : othTag;

  var objIsObj = objTag == objectTag$4,
      othIsObj = othTag == objectTag$4,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$e.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$e.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$2 ? symbolProto$2.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1;

/**
 * Creates a function that invokes `func` with the arguments of the created
 * function. If `func` is a property name, the created function returns the
 * property value for a given element. If `func` is an array or object, the
 * created function returns `true` for elements that contain the equivalent
 * source properties, otherwise it returns `false`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Util
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @returns {Function} Returns the callback.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
 * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, _.iteratee(['user', 'fred']));
 * // => [{ 'user': 'fred', 'age': 40 }]
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, _.iteratee('user'));
 * // => ['barney', 'fred']
 *
 * // Create custom iteratee shorthands.
 * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
 *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
 *     return func.test(string);
 *   };
 * });
 *
 * _.filter(['abc', 'def'], /ef/);
 * // => ['def']
 */
function iteratee(func) {
  return _baseIteratee(typeof func == 'function' ? func : _baseClone(func, CLONE_DEEP_FLAG$1));
}

var iteratee_1 = iteratee;

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray_1(value) || isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten;

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? _baseFlatten(array, 1) : [];
}

var flatten_1 = flatten;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$3 = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax$3(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$3(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return _setToString(_overRest(func, undefined, flatten_1), func + '');
}

var _flatRest = flatRest;

/** Used to compose bitmasks for function metadata. */
var WRAP_REARG_FLAG$2 = 256;

/**
 * Creates a function that invokes `func` with arguments arranged according
 * to the specified `indexes` where the argument value at the first index is
 * provided as the first argument, the argument value at the second index is
 * provided as the second argument, and so on.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to rearrange arguments for.
 * @param {...(number|number[])} indexes The arranged argument indexes.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var rearged = _.rearg(function(a, b, c) {
 *   return [a, b, c];
 * }, [2, 0, 1]);
 *
 * rearged('b', 'c', 'a')
 * // => ['a', 'b', 'c']
 */
var rearg = _flatRest(function(func, indexes) {
  return _createWrap(func, WRAP_REARG_FLAG$2, undefined, undefined, undefined, indexes);
});

var rearg_1 = rearg;

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath(value) {
  if (isArray_1(value)) {
    return _arrayMap(value, _toKey);
  }
  return isSymbol_1(value) ? [value] : _copyArray(_stringToPath(toString_1(value)));
}

var toPath_1 = toPath;

var _util = {
  'ary': ary_1,
  'assign': _baseAssign,
  'clone': clone_1,
  'curry': curry_1,
  'forEach': _arrayEach,
  'isArray': isArray_1,
  'isError': isError_1,
  'isFunction': isFunction_1,
  'isWeakMap': isWeakMap_1,
  'iteratee': iteratee_1,
  'keys': _baseKeys,
  'rearg': rearg_1,
  'toInteger': toInteger_1,
  'toPath': toPath_1
};

/**
 * Converts `func` of `name` to an immutable auto-curried iteratee-first data-last
 * version with conversion `options` applied. If `name` is an object its methods
 * will be converted.
 *
 * @param {string} name The name of the function to wrap.
 * @param {Function} [func] The function to wrap.
 * @param {Object} [options] The options object. See `baseConvert` for more details.
 * @returns {Function|Object} Returns the converted function or object.
 */
function convert(name, func, options) {
  return _baseConvert(_util, name, func, options);
}

var convert_1 = convert;

/** Error message constants. */
var FUNC_ERROR_TEXT$2 = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG$6 = 8,
    WRAP_PARTIAL_FLAG$3 = 32,
    WRAP_ARY_FLAG$4 = 128,
    WRAP_REARG_FLAG$3 = 256;

/**
 * Creates a `_.flow` or `_.flowRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new flow function.
 */
function createFlow(fromRight) {
  return _flatRest(function(funcs) {
    var length = funcs.length,
        index = length,
        prereq = _LodashWrapper.prototype.thru;

    if (fromRight) {
      funcs.reverse();
    }
    while (index--) {
      var func = funcs[index];
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT$2);
      }
      if (prereq && !wrapper && _getFuncName(func) == 'wrapper') {
        var wrapper = new _LodashWrapper([], true);
      }
    }
    index = wrapper ? index : length;
    while (++index < length) {
      func = funcs[index];

      var funcName = _getFuncName(func),
          data = funcName == 'wrapper' ? _getData(func) : undefined;

      if (data && _isLaziable(data[0]) &&
            data[1] == (WRAP_ARY_FLAG$4 | WRAP_CURRY_FLAG$6 | WRAP_PARTIAL_FLAG$3 | WRAP_REARG_FLAG$3) &&
            !data[4].length && data[9] == 1
          ) {
        wrapper = wrapper[_getFuncName(data[0])].apply(wrapper, data[3]);
      } else {
        wrapper = (func.length == 1 && _isLaziable(func))
          ? wrapper[funcName]()
          : wrapper.thru(func);
      }
    }
    return function() {
      var args = arguments,
          value = args[0];

      if (wrapper && args.length == 1 && isArray_1(value)) {
        return wrapper.plant(value).value();
      }
      var index = 0,
          result = length ? funcs[index].apply(this, args) : value;

      while (++index < length) {
        result = funcs[index].call(this, result);
      }
      return result;
    };
  });
}

var _createFlow = createFlow;

/**
 * Creates a function that returns the result of invoking the given functions
 * with the `this` binding of the created function, where each successive
 * invocation is supplied the return value of the previous.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {...(Function|Function[])} [funcs] The functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flowRight
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flow([_.add, square]);
 * addSquare(1, 2);
 * // => 9
 */
var flow = _createFlow();

var flow_1 = flow;

var func = convert_1('flow', flow_1);

func.placeholder = placeholder;
var flow$1 = func;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return _baseIsEqual(value, other);
}

var isEqual_1 = isEqual;

var func$1 = convert_1('isEqual', isEqual_1);

func$1.placeholder = placeholder;
var isEqual$1 = func$1;

/* ------------------ BOOLEAN ----------------- */

const not = fn => (...x) => !fn(...x);
const bool = fn => (...x) => !!fn(...x);

/* ------------------ CONSOLE ----------------- */

const log = msg => x => {
  console.log(msg, x);
  return x
};

const error = msg => x => {
  console.error(msg, x);
  return x
};

/**
 * Create a function that performs an operation on the first arguments from the current and previous calls.
 * Note: The state maintained by this function means that it should be composed outside the final function.
 *
 * @param {function(a, b)} fn - Callback
 * @returns {function(a)} Calls the callback with both the first argument from the current and previous calls.
 *
 * @example
 * // Set up withPrev to return true
 * // if previous and current arguments are not equal
 * const hasChanged = withPrev(not(isEqual))
 *
 * @example
 * // Previous call argument is undefined
 * hasChanged(5) // -> true
 *
 * @example
 * // Previous and current calls with same arguments
 * hasChanged(5) // -> true
 * hasChanged(5) // -> false
 *
 * @example
 * // Previous and current calls with different arguments
 * hasChanged(5) // -> true
 * hasChanged(6) // -> true
 *
 * @example
 * // Previous call argument is undefined
 * hasChanged(undefined) // -> false
 */
const withPrev = (fn, initialValue) => {
  let previous = initialValue;

  return current => {
    const result = fn(previous, current);

    // Save current value for next call
    previous = current;

    return result
  }
};

/**
 * Create a reducer function that performs an operation on the first current argument and previous result.
 *
 * @param {function(a, b)} fn - Callback
 * @returns {function(a)} Calls the callback with both the current argument and the previous result
 *
 * @example
 * // Set up withPrev to return true
 * // if previous and current arguments are not equal
 * const sum = withPrevResult(add, 0)
 *
 * @example
 * // Add to initial value
 * sum(5) // -> 5
 * // Add to previous result
 * sum(6) // -> 11
 */
const withPrevResult = (fn, initialValue) => {
  let previous = initialValue;

  return current => {
    const result = fn(previous, current);

    // Save current result for next call
    previous = result;

    return result
  }
};

/**
 * Create a function that performs an operation on the current and previous call arguments
 *
 * @param {function(Array<a>, Array<b>)} fn - Callback
 * @returns {Function} Calls the callback with both the current and previous call arguments
 *
 * @example
 * const logPrevAndCurrentArgs = withPrevArgs((prev, current) => {
 *   console.log('previous args:', prev)
 *   console.log('current args:', current)
 * }, [1, 2, 3])
 *
 * listenTo(event)
 *   .forEach(logPrevAndCurrentArgs)
 *
 * // First event:
 * // previous args: [1, 2, 3]
 * // current args: [4, 5, 6]
 *
 * // Second event:
 * // previous args: [4, 5, 6]
 * // current args: [7, 8, 9]
 */
const withPrevArgs = (fn, ...initialValues) => {
  let previous = initialValues;

  return (...current) => {
    const result = fn(previous, current);

    // Save current result for next call
    previous = current;

    return result
  }
};

withPrev.result = withPrevResult;
withPrev.args = withPrevArgs;

/**
 * Create a function that returns true if this
 * call's argument is different than the last call.
 * Maintains own state using a closure.
 * Instantiate for each place you use it.
 *
 * @returns {Function} Instance of hasChanged
 *
 * @example
 * const hasChanged = createHasChanged()
 */
const composeHasChanged = fn =>
  flow$1(
    fn,
    withPrev(not(isEqual$1)),
  );

/* ============================================ */

export { BumbleStream, listenTo, EventPromise, debounce, interval, throttle, timeout, withPrev, composeHasChanged, log, not, bool, error };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLWVzbS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3dyYXBwZXJzL21hcC5qcyIsIi4uL3NyYy93cmFwcGVycy9maWx0ZXIuanMiLCIuLi9zcmMvd3JhcHBlcnMvY2xlYXIuanMiLCIuLi9zcmMvd3JhcHBlcnMvZm9yLWVhY2guanMiLCIuLi9zcmMvd3JhcHBlcnMvYXdhaXQtZmlsdGVyLmpzIiwiLi4vc3JjL3dyYXBwZXJzL2F3YWl0LW1hcC5qcyIsIi4uL3NyYy93cmFwcGVycy9oYW5kbGUtZXJyb3IuanMiLCIuLi9zcmMvZXZlbnQtc3RyZWFtLmpzIiwiLi4vc3JjL2xpc3Rlbi10by5qcyIsIi4uL3NyYy9ldmVudC1wcm9taXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL21zL2luZGV4LmpzIiwiLi4vc3JjL3RpbWVycy90aW1lb3V0LmpzIiwiLi4vc3JjL3RpbWVycy9kZWJvdW5jZS5qcyIsIi4uL3NyYy90aW1lcnMvaW50ZXJ2YWwuanMiLCIuLi9zcmMvdGltZXJzL3Rocm90dGxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mcC9fbWFwcGluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZnAvcGxhY2Vob2xkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZwL19iYXNlQ29udmVydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNNYXNrZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hdGl2ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFZhbHVlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fV2Vha01hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21ldGFNYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0RGF0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVDdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmluZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FwcGx5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29tcG9zZUFyZ3MuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb21wb3NlQXJnc1JpZ2h0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY291bnRIb2xkZXJzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUxvZGFzaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0xhenlXcmFwcGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub29wLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0RGF0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3JlYWxOYW1lcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEZ1bmNOYW1lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fTG9kYXNoV3JhcHBlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weUFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fd3JhcHBlckNsb25lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC93cmFwcGVyTG9kYXNoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNMYXppYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Nob3J0T3V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0RGF0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFdyYXBEZXRhaWxzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5zZXJ0V3JhcERldGFpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2NvbnN0YW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0VG9TdHJpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb1N0cmluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RWFjaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGaW5kSW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYU4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpY3RJbmRleE9mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUluZGV4T2YuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUluY2x1ZGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fdXBkYXRlV3JhcERldGFpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXRXcmFwVG9TdHJpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVSZWN1cnJ5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0SG9sZGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jlb3JkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yZXBsYWNlSG9sZGVycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUh5YnJpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUN1cnJ5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlUGFydGlhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21lcmdlRGF0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b0Zpbml0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9JbnRlZ2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlV3JhcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvYXJ5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weU9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVDbGVhci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc29jSW5kZXhPZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUdldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUhhcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZVNldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0xpc3RDYWNoZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrR2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVDcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoQ2xlYXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hIYXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fSGFzaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlQ2xlYXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXBEYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXBDYWNoZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3RhY2suanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5c0luLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUJ1ZmZlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RmlsdGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9sc0luLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldEFsbEtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRBbGxLZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5c0luLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fRGF0YVZpZXcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19VaW50OEFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVBcnJheUJ1ZmZlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lRGF0YVZpZXcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVJlZ0V4cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lU3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVUeXBlZEFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNNYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTWFwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzU2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1NldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvY2xvbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2N1cnJ5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1BsYWluT2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Vycm9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1dlYWtNYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXRDYWNoZUFkZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlSGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0Q2FjaGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVNvbWUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYWNoZUhhcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQXJyYXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwVG9BcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbEJ5VGFnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxPYmplY3RzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzRXF1YWxEZWVwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzRXF1YWwuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNNYXRjaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzU3RyaWN0Q29tcGFyYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hdGNoRGF0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbWVtb2l6ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21lbW9pemVDYXBwZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpbmdUb1BhdGguanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheU1hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9TdHJpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0UGF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvS2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUhhc0luLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzUGF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaGFzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5RGVlcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvcHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXRlcmF0ZWUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2l0ZXJhdGVlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNGbGF0dGVuYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGbGF0dGVuLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mbGF0dGVuLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlclJlc3QuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mbGF0UmVzdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvcmVhcmcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvUGF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZnAvX3V0aWwuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZwL2NvbnZlcnQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVGbG93LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mbG93LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mcC9mbG93LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0VxdWFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mcC9pc0VxdWFsLmpzIiwiLi4vc3JjL2hlbHBlcnMvb3BlcmF0b3JzLmpzIiwiLi4vc3JjL2hlbHBlcnMvd2l0aC1wcmV2LmpzIiwiLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG1hcCA9IG1hcEZuID0+ICh7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9KSA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKHVzZSAmJiAhZXJyb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVzZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgcmVzdWx0OiBtYXBGbihyZXN1bHQsIGFyZ3MpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7IGVycm9yLCB1c2UsIGFyZ3MgfVxuICB9XG59XG4iLCJleHBvcnQgY29uc3QgZmlsdGVyID0gcHJlZEZuID0+ICh7XG4gIHVzZSxcbiAgZXJyb3IsXG4gIHJlc3VsdCxcbiAgYXJnc1xufSkgPT4ge1xuICB0cnkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHsgdXNlOiBmYWxzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gICAgfSBlbHNlIGlmICh1c2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVzZTogcHJlZEZuKHJlc3VsdCwgYXJncyksXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgYXJnc1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyB1c2UsIHJlc3VsdCwgZXJyb3IsIGFyZ3MgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBlcnJvciwgdXNlLCBhcmdzIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGNsZWFyID0gY2xlYXJGbiA9PiBwcmVkRm4gPT4gKHtcbiAgdXNlLFxuICBlcnJvcixcbiAgcmVzdWx0LFxuICBhcmdzXG59KSA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKHVzZSAmJiAhZXJyb3IgJiYgcHJlZEZuKHJlc3VsdCwgYXJncykpIHtcbiAgICAgIGNsZWFyRm4oKVxuICAgIH1cblxuICAgIHJldHVybiB7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHsgZXJyb3IsIHVzZSwgYXJncyB9XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBmb3JFYWNoID0gZm9yRWFjaEZuID0+ICh7XG4gIHVzZSxcbiAgcmVzdWx0LFxuICBlcnJvcixcbiAgYXJnc1xufSkgPT4ge1xuICB0cnkge1xuICAgIGlmICh1c2UgJiYgIWVycm9yKSB7XG4gICAgICBmb3JFYWNoRm4ocmVzdWx0LCBhcmdzKVxuICAgIH1cblxuICAgIHJldHVybiB7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHsgZXJyb3IsIHVzZSwgYXJncyB9XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBhd2FpdEZpbHRlciA9IChjYWxsYmFjaywgYXN5bmNGbikgPT4gKHtcbiAgdXNlLFxuICByZXN1bHQsXG4gIGVycm9yLFxuICBhcmdzXG59KSA9PiB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBlcnJvcjogY2FsbGJhY2suZGlyZWN0KHtcbiAgICAgICAgdXNlOiBmYWxzZSxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFyZ3NcbiAgICAgIH0pLFxuICAgICAgdXNlOiBmYWxzZSxcbiAgICAgIGFyZ3NcbiAgICB9XG4gIH0gZWxzZSBpZiAodXNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogUHJvbWlzZS5yZXNvbHZlKHJlc3VsdClcbiAgICAgICAgLnRoZW4ociA9PiBhc3luY0ZuKHIsIGFyZ3MpKVxuICAgICAgICAudGhlbih1c2UgPT4gKHtcbiAgICAgICAgICB1c2U6ICEhdXNlLFxuICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICBhcmdzXG4gICAgICAgIH0pKVxuICAgICAgICAuY2F0Y2goZSA9PiAoe1xuICAgICAgICAgIHVzZSxcbiAgICAgICAgICBlcnJvcjogZSxcbiAgICAgICAgICBhcmdzXG4gICAgICAgIH0pKVxuICAgICAgICAudGhlbihjYWxsYmFjay5kaXJlY3QpLFxuICAgICAgdXNlLFxuICAgICAgYXJnc1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBjYWxsYmFjay5kaXJlY3Qoe1xuICAgICAgICB1c2UsXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgYXJnc1xuICAgICAgfSksXG4gICAgICB1c2UsXG4gICAgICBhcmdzXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgY29uc3QgYXdhaXRNYXAgPSAoY2FsbGJhY2ssIGFzeW5jRm4pID0+ICh7XG4gIHVzZSxcbiAgcmVzdWx0LFxuICBlcnJvcixcbiAgYXJnc1xufSkgPT4ge1xuICBpZiAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IGNhbGxiYWNrLmRpcmVjdCh7XG4gICAgICAgIHVzZSxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFyZ3NcbiAgICAgIH0pLFxuICAgICAgdXNlLFxuICAgICAgYXJnc1xuICAgIH1cbiAgfSBlbHNlIGlmICh1c2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBQcm9taXNlLnJlc29sdmUocmVzdWx0KVxuICAgICAgICAudGhlbihyID0+IGFzeW5jRm4ociwgYXJncykpXG4gICAgICAgIC50aGVuKHIgPT4gKHsgdXNlLCBhcmdzLCByZXN1bHQ6IHIgfSkpXG4gICAgICAgIC5jYXRjaChlID0+ICh7XG4gICAgICAgICAgdXNlLFxuICAgICAgICAgIGVycm9yOiBlLFxuICAgICAgICAgIGFyZ3NcbiAgICAgICAgfSkpXG4gICAgICAgIC50aGVuKGNhbGxiYWNrLmRpcmVjdCksXG4gICAgICB1c2UsXG4gICAgICBhcmdzXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IGNhbGxiYWNrLmRpcmVjdCh7XG4gICAgICAgIHVzZSxcbiAgICAgICAgcmVzdWx0LFxuICAgICAgICBhcmdzXG4gICAgICB9KSxcbiAgICAgIHVzZSxcbiAgICAgIGFyZ3NcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBoYW5kbGVFcnJvciA9IGNhdGNoRm4gPT4gKHtcbiAgdXNlLFxuICBlcnJvcixcbiAgcmVzdWx0LFxuICBhcmdzXG59KSA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IGNhdGNoRm4oZXJyb3IsIGFyZ3MpLFxuICAgICAgICB1c2UsXG4gICAgICAgIGFyZ3NcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdXNlLCByZXN1bHQsIGFyZ3MgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBlcnJvciwgdXNlLCBhcmdzIH1cbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgd3JhcHBlcnMgZnJvbSAnLi93cmFwcGVycy9tYWluJ1xuXG4vKipcbiAqIEEgY29uZmlndXJhYmxlIEFQSSB3aXRoIGZhbWlsaWFyIG1ldGhvZHMgdGhhdCBjb21wb3NlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBjYW4gYmUgcGFzc2VkIHRvIGFuIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIFRoZSBhdHRhY2ggZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGNsZWFyIGZ1bmN0aW9uOiBhIGZ1bmN0aW9uIHRoYXQgcmVtb3ZlcyB0aGUgbGlzdGVuZXIuXG4gKlxuICogQGZ1bmN0aW9uIEJ1bWJsZVN0cmVhbVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBQYXNzIHRvIGFuIGV2ZW50IGxpc3RlbmVyLlxuICogQHBhcmFtIHtkaXJlY3RDYWxsYmFja30gY2FsbGJhY2suZGlyZWN0IC0gVXNlIHRvIGRpcmVjdGx5IGNvbmZpZ3VyZSBhIHN0cmVhbS5cbiAqIEByZXR1cm5zIHtCdW1ibGVTdHJlYW1DaGFpbn0gQW4gb2JqZWN0IHdpdGggZmFtaWxpYXIgbWV0aG9kIG5hbWVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsaXN0ZW5Ub0Nocm9tZUV2ZW50ID0gKGV2ZW50T2JqZWN0KSA9PiB7XG4gKiAgIHJldHVybiBCdW1ibGVTdHJlYW0oY2FsbGJhY2sgPT4ge1xuICogICAgIC8vIEFkZCB0aGUgY29tcG9zZWQgY2FsbGJhY2sgdG8gdGhlIGV2ZW50IGxpc3RlbmVycy5cbiAqICAgICBldmVudE9iamVjdC5hZGRMaXN0ZW5lcihjYWxsYmFjaylcbiAqICAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGNhbGxiYWNrXG4gKiAgICAgLy8gZnJvbSB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gKiAgICAgcmV0dXJuICgpID0+IGV2ZW50T2JqZWN0LnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKVxuICogICB9KVxuICogfVxuICpcbiAqIEBleGFtcGxlXG4gKiBmdW5jdGlvbiBpbnRlcnZhbCh0aW1lKSB7XG4gKiAgIGNvbnN0IG1pbGxpc2Vjb25kcyA9IG1zKHRpbWUpXG4gKlxuICogICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAqICAgICAvLyBDcmVhdGUgY291bnRlclxuICogICAgIGxldCBjb3VudCA9IDBcbiAqXG4gKiAgICAgLy8gU3RhcnQgaW50ZXJ2YWwsIHBhc3MgY291bnQgdG8gY2FsbGJhY2ssIGluY3JlbWVudCBjb3VudFxuICogICAgIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICogICAgICAgY2FsbGJhY2soY291bnQpXG4gKiAgICAgICBjb3VudCsrXG4gKiAgICAgfSwgbWlsbGlzZWNvbmRzKVxuICpcbiAqICAgICAvLyBSZXR1cm4gZnVuY3Rpb24gdG8gc3RvcCBpbnRlcnZhbFxuICogICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKGlkKVxuICogICB9KVxuICogfVxuICovXG5leHBvcnQgZnVuY3Rpb24gQnVtYmxlU3RyZWFtKGF0dGFjaEZuLCAuLi5hcmdzKSB7XG4gIGxldCBjb21wb3NlZEZuID0geCA9PiB4XG5cbiAgLy8gdXNlZCBieSBjb21wb3NlQ2xlYXIoKVxuICBjb25zdCBjbGVhckZuID0gYXR0YWNoRm4oY2FsbGJhY2ssIC4uLmFyZ3MpXG5cbiAgY2FsbGJhY2suZGlyZWN0ID0gZGlyZWN0XG5cbiAgLyoqXG4gICAqIE1hcCBjaGFuZ2VzIHJlc3VsdCB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIG1hcEZuLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIG1hcFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIFRoZSByZXR1cm4gdmFsdWUgaXMgcGFzc2VkIHRvIHRoZSBuZXh0IG1ldGhvZC5cbiAgICogQHJldHVybnMge0J1bWJsZVN0cmVhbUNoYWlufVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAubWFwKCgpID0+IDEpXG4gICAqICAgLm1hcCgoeCkgPT4geCArIDEpXG4gICAqICAgLm1hcCgoeCkgPT4ge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGJlIDInLCB4KVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBtYXAgPSBjb21wb3NlKHdyYXBwZXJzLm1hcClcblxuICAvKipcbiAgICogVXNlIGZvciBlZmZlY3RzLiBGb3JFYWNoIGRvZXMgbm90IHBhc3MgaXRzIHJldHVybiB2YWx1ZSB0byB0aGUgbmV4dCBmdW5jdGlvbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEJ1bWJsZVN0cmVhbUNoYWluXG4gICAqIEBmdW5jdGlvbiBmb3JFYWNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIHJldHVybiB2YWx1ZSBpcyBpZ25vcmVkLlxuICAgKiBAcmV0dXJucyB7bWV0aG9kc30gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAubWFwKCgpID0+IDEpXG4gICAqICAgLmZvckVhY2goKHgpID0+IHtcbiAgICogICAgIGNvbnN0IGNvdW50ID0geCArIDFcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBiZSAyJywgY291bnQpXG4gICAqICAgICByZXR1cm4gY291bnRcbiAgICogICB9KVxuICAgKiAgIC5tYXAoKHgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBiZSAxJywgeClcbiAgICogICB9KVxuICAgKi9cbiAgY29uc3QgZm9yRWFjaCA9IGNvbXBvc2Uod3JhcHBlcnMuZm9yRWFjaClcblxuICAvKipcbiAgICogRmlsdGVyIHN0b3BzIGZ1cnRoZXIgbWFwcGluZ1xuICAgKiBhbmQgcmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZVxuICAgKiBpZiB0aGUgcHJlZGljYXRlIHJldHVybnMgZmFsc2UuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBCdW1ibGVTdHJlYW1DaGFpblxuICAgKiBAZnVuY3Rpb24gZmlsdGVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRGbiAtIFByZWRpY2F0ZS5cbiAgICogQHJldHVybnMge09iamVjdH0gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAvLyBUaGlzIHdpbGwgc2tpcCB0aGUgZmlyc3QgMiBpbnRlcnZhbHNcbiAgICogICAuZmlsdGVyKCh4KSA9PiB4ID4gMilcbiAgICogICAuZm9yRWFjaCgoeCkgPT4ge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGJlIDMnLCB4KVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBmaWx0ZXIgPSBjb21wb3NlKHdyYXBwZXJzLmZpbHRlcilcblxuICAvKipcbiAgICogQ2xlYXIgcmVtb3ZlcyB0aGUgZXZlbnQgbGlzdGVuZXIgYW5kXG4gICAqIGNvbnRpbnVlcyBkb3duIHRoZSBtYXAgY2hhaW5cbiAgICogaWYgdGhlIHByZWRpY2F0ZSByZXR1cm5zIHRydWUuXG4gICAqXG4gICAqIEl0IGNhbGxzIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBhdHRhY2hGbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEJ1bWJsZVN0cmVhbUNoYWluXG4gICAqIEBmdW5jdGlvbiBjbGVhclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZEZuXSAtIFByZWRpY2F0ZS5cbiAgICogQHJldHVybnMge09iamVjdH0gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAvLyBUaGlzIHdpbGwgY2xlYXIgdGhlIGludGVydmFsIG9uIHRoZSAzcmQgdGltZS5cbiAgICogICAuY2xlYXIoKHgpID0+IHggPiAyKVxuICAgKiAgIC5mb3JFYWNoKCgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdJIHdpbGwgbG9nIHRocmVlIHRpbWVzLicpXG4gICAqICAgfSlcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW50ZXJ2YWwoJzEwcycpXG4gICAqICAgLy8gVGhpcyB3aWxsIGNsZWFyIHRoZSBpbnRlcnZhbCBpbW1lZGlhdGVseS5cbiAgICogICAuY2xlYXIoKVxuICAgKiAgIC5mb3JFYWNoKCgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdJIHdpbGwgbmV2ZXIgbG9nLicpXG4gICAqICAgfSlcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgY2xlYXIgPSBpbnRlcnZhbCgnMTBzJykuY2xlYXJcbiAgICogLy9UaGlzIHdpbGwgY2xlYXIgdGhlIGludGVydmFsIHdoZW4gc29tZXRoaW5nIGZhaWxzIHRvIGxvYWQuXG4gICAqIHdpbmRvdy5vbmVycm9yID0gKGUpID0+IGNsZWFyKClcbiAgICpcbiAgICovXG4gIGNvbnN0IGNsZWFyID0gcHJlZEZuID0+XG4gICAgcHJlZEZuXG4gICAgICA/IGNvbXBvc2Uod3JhcHBlcnMuY2xlYXIoKCkgPT4gY2xlYXJGbigpKSkocHJlZEZuKVxuICAgICAgOiBjbGVhckZuKClcblxuICAvKipcbiAgICogQ2F0Y2ggY291bGQgY2F1c2UgYSBjYWxsIHRvIGZpbHRlciB0byBiZSBza2lwcGVkLlxuICAgKiBJZiB0aGlzIGhhcHBlbnMsIHRoZSBjaGFpbiBjb3VsZCBiZWdpbiB0byBleGVjdXRlIGFnYWluLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGNhdGNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gQ2FsbGVkIHdoZW4gYW4gZXJyb3IgaXMgZW5jb3VudGVyZWQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEJ1bWJsZVN0cmVhbSBtZXRob2RzIG9iamVjdC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW50ZXJ2YWwoJzEwcycpXG4gICAqICAgLm1hcCgoKSA9PiB7XG4gICAqICAgICBuZXcgRXJyb3IoJ0Jvb20hJylcbiAgICogICB9KVxuICAgKiAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGUgbmV4dCBsaW5lIHdpbGwgc2F5IFwiQm9vbSFcIicpXG4gICAqICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAqICAgfSlcbiAgICpcbiAgICovXG4gIGNvbnN0IGhhbmRsZUVycm9yID0gY29tcG9zZSh3cmFwcGVycy5oYW5kbGVFcnJvcilcblxuICAvKipcbiAgICogTWFwIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUHJvbWlzZS5cbiAgICogQ29tcG9zZXMgYSBuZXcgQnVtYmxlU3RyZWFtIGNhbGxiYWNrXG4gICAqIHRvIHBhc3MgdG8gdGhlIHJldHVybmVkIFByb21pc2UudGhlbigpLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGF3YWl0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGFzeW5jRm4gLSBBc3luYyBGdW5jdGlvbi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIEJ1bWJsZVN0cmVhbUNoYWluIG9iamVjdC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogbGlzdGVuVG8od2luZG93LCAnb25sb2FkJylcbiAgICogICAubWFwKCgpID0+ICdodHRwczovL3d3dy5nb29nbGUuY29tJylcbiAgICogICAuYXdhaXQoZmV0Y2gpXG4gICAqICAgLm1hcCgocmVzcG9uc2UpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm9rKVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBhd2FpdE1hcCA9IGNvbXBvc2VBc3luYyh3cmFwcGVycy5hd2FpdE1hcClcblxuICAvKipcbiAgICogRXZhbHVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJlZGljYXRlIFByb21pc2VcbiAgICogYW5kIHN0b3BzIGZ1cnRoZXIgZXhlY3V0aW9uIGlmIHRoZSBQcm9taXNlIHJlc29sdmVzIHRvIGZhbHNlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGF3YWl0RmlsdGVyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKik6IGJvb2xlYW59IGFzeW5jUHJlZEZuIC0gQXN5bmMgUHJlZGljYXRlIEZ1bmN0aW9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgQnVtYmxlU3RyZWFtQ2hhaW4gb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBsaXN0ZW5Ubyh3aW5kb3csICdvbmxvYWQnKVxuICAgKiAgIC5tYXAoKCkgPT4gJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20nKVxuICAgKiAgIC5hd2FpdC5maWx0ZXIoZmV0Y2gpXG4gICAqICAgLm1hcCgocmVzcG9uc2UpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm9rKVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBhd2FpdEZpbHRlciA9IGNvbXBvc2VBc3luYyh3cmFwcGVycy5hd2FpdEZpbHRlcilcblxuICAvKipcbiAgICogVGhlIEJ1bWJsZVN0cmVhbUNoYWluIGNvbXBvc2VzIGEgY2FsbGJhY2sgdXNpbmdcbiAgICogdGhlIGZhbWlsaWFyIEpTIEFycmF5IGhpZ2hlciBvcmRlciBmdW5jdGlvbiBjaGFpbiBwYXR0ZXJuLlxuICAgKlxuICAgKiBAbWVtYmVyIHtPYmplY3R9XG4gICAqIEBuYW1lc3BhY2UgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICovXG4gIGNvbnN0IG1ldGhvZHMgPSB7XG4gICAgbWFwLFxuICAgIGZpbHRlcixcbiAgICBmb3JFYWNoLFxuICAgIGNhdGNoOiBoYW5kbGVFcnJvcixcbiAgICBjbGVhcixcbiAgICBhd2FpdDogYXdhaXRNYXAsXG4gICAgYXdhaXRNYXAsXG4gICAgYXdhaXRGaWx0ZXIsXG4gIH1cblxuICByZXR1cm4gbWV0aG9kc1xuXG4gIGZ1bmN0aW9uIGNhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gaGFuZGxlVW5jYXVnaHRFcnJvcihcbiAgICAgIGNvbXBvc2VkRm4oe1xuICAgICAgICByZXN1bHQ6IGFyZ3NbMF0sXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHVzZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpcmVjdChwYXlsb2FkKSB7XG4gICAgcmV0dXJuIGhhbmRsZVVuY2F1Z2h0RXJyb3IoY29tcG9zZWRGbihwYXlsb2FkKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVVuY2F1Z2h0RXJyb3IoeyByZXN1bHQsIGVycm9yIH0pIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGVycm9yKS50aGVuKGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmNhdWdodCBhc3luYyBlcnJvciBpbiBCdW1ibGVTdHJlYW0nKVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVbmNhdWdodCBlcnJvciBpbiBCdW1ibGVTdHJlYW0nKVxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29tcG9zZSh3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZuID0+IHtcbiAgICAgIGNvbnN0IG5ld0ZuID0gd3JhcHBlcihmbilcbiAgICAgIGNvbnN0IG9sZEZuID0gY29tcG9zZWRGblxuXG4gICAgICBjb21wb3NlZEZuID0gZXZlbnQgPT4gbmV3Rm4ob2xkRm4oZXZlbnQpKVxuXG4gICAgICByZXR1cm4gbWV0aG9kc1xuICAgIH1cbiAgfVxuXG4gIC8qIEdvZXMgaW50byBCdW1ibGVTdHJlYW0gKi9cbiAgZnVuY3Rpb24gY29tcG9zZUFzeW5jKHdyYXBwZXIpIHtcbiAgICByZXR1cm4gYXN5bmNGbiA9PlxuICAgICAgQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICAgICAgY29uc3QgbmV3Rm4gPSB3cmFwcGVyKGNhbGxiYWNrLCBhc3luY0ZuKVxuXG4gICAgICAgIGNvbnN0IG9sZEZuID0gY29tcG9zZWRGblxuXG4gICAgICAgIGNvbXBvc2VkRm4gPSBldmVudCA9PiBuZXdGbihvbGRGbihldmVudCkpXG5cbiAgICAgICAgcmV0dXJuIGNsZWFyRm5cbiAgICAgIH0pXG4gIH1cbn1cbi8qKlxuICogVXNlIHRvIGRpcmVjdGx5IGNvbmZpZ3VyZSB0aGUgQnVtYmxlU3RyZWFtLlxuICogVXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBhc3luYyBtZXRob2QuXG4gKlxuICogQGNhbGxiYWNrIGRpcmVjdENhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSB2YWx1ZSBCdW1ibGVTdHJlYW0gdXNlcyBpbnRlcm5hbGx5LlxuICogQHBhcmFtIHthbnl9IHBheWxvYWQucmVzdWx0IC0gVGhlIHZhbHVlIHRvIHBhc3MgdG8gdGhlIG5leHQgbWV0aG9kIGNhbGxiYWNrLlxuICogQHBhcmFtIHtBcnJheX0gcGF5bG9hZC5hcmdzIC0gQW4gYXJyYXkgdG8gcGFzcyB0byBlYWNoIG1ldGhvZCBjYWxsYmFjay5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcGF5bG9hZC51c2UgLSBXaWxsIGNhdXNlIG1ldGhvZCBjYWxsYmFjayB0byBza2lwIGlmIGZhbHNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBCdW1ibGVTdHJlYW0oKHtkaXJlY3R9KSA9PiB7XG4gKiAgIC8vIEltbWVkaWF0ZWx5IGV4ZWN1dGUgY29tcG9zZWQgY2FsbGJhY2tcbiAqICAgZGlyZWN0KHtcbiAqICAgICByZXN1bHQ6IDEyMyxcbiAqICAgICBhcmdzOiBbMSwgMiwgM10sXG4gKiAgICAgdXNlOiB0cnVlLFxuICogICB9KVxuICpcbiAqICAgLy8gQ29uZmlndXJlIGNsZWFyRm5cbiAqICAgcmV0dXJuICgpID0+IGNsZWFyKClcbiAqIH0pXG4gKi9cbiIsImltcG9ydCB7IEJ1bWJsZVN0cmVhbSB9IGZyb20gJy4vZXZlbnQtc3RyZWFtJ1xuXG4vKipcbiAqIExpc3RlbiB0byBvbmUgb3IgbXVsdGlwbGUgZXZlbnRzIG9uIGEgRE9NIEVsZW1lbnQuXG4gKlxuICogQG1lbWJlcm9mIGxpc3RlblRvXG4gKiBAZnVuY3Rpb24gbGlzdGVuVG9DaHJvbWVFdmVudFxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50T2JqZWN0IC0gQSBET00gRWxlbWVudC5cbiAqIEBwYXJhbSB7Li4uYW55fSBbYXJnc10gLSBBZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBzcHJlYWQgaW50byBFdmVudC5hZGRMaXN0ZW5lcigpLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIEJ1bWJsZVN0cmVhbSBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IG15RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215ZGl2JylcbiAqIGxpc3RlblRvRG9tRXZlbnQobXlEaXYsICdjbGljaycpXG4gKiAgIC5tYXAoKGV2ZW50KSA9PiB7fSlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlkaXYnKVxuICogbGlzdGVuVG9Eb21FdmVudChteURpdiwgWydjbGljaycsICdrZXlwcmVzcyddKVxuICogICAubWFwKChldmVudCkgPT4ge30pXG4gKi9cbmNvbnN0IGxpc3RlblRvQ2hyb21lRXZlbnQgPSAoZXZlbnRPYmplY3QsIC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIEJ1bWJsZVN0cmVhbShjYWxsYmFjayA9PiB7XG4gICAgZXZlbnRPYmplY3QuYWRkTGlzdGVuZXIoY2FsbGJhY2ssIC4uLmFyZ3MpXG4gICAgcmV0dXJuICgpID0+IGV2ZW50T2JqZWN0LnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKVxuICB9KVxufVxuXG4vKipcbiAqIExpc3RlbiB0byBvbmUgb3IgbXVsdGlwbGUgZXZlbnRzIG9uIGEgRE9NIEVsZW1lbnQuXG4gKlxuICogQG1lbWJlcm9mIGxpc3RlblRvXG4gKiBAZnVuY3Rpb24gbGlzdGVuVG9Eb21FdmVudFxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCAtIEEgRE9NIEVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ3xBcnJheTxzdHJpbmc+fSBldmVudCAtIEFuIGV2ZW50IHN0cmluZyBvciBhbiBhcnJheSBvZiBldmVudCBzdHJpbmdzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIEJ1bWJsZVN0cmVhbSBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IG15RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215ZGl2JylcbiAqIGxpc3RlblRvRG9tRXZlbnQobXlEaXYsICdjbGljaycpXG4gKiAgIC5tYXAoKGV2ZW50KSA9PiB7fSlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlkaXYnKVxuICogbGlzdGVuVG9Eb21FdmVudChteURpdiwgWydjbGljaycsICdrZXlwcmVzcyddKVxuICogICAubWFwKChldmVudCkgPT4ge30pXG4gKi9cbmNvbnN0IGxpc3RlblRvRG9tRXZlbnQgPSAodGFyZ2V0LCBldmVudCkgPT4ge1xuICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGV2ZW50LmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKSxcbiAgICAgIClcblxuICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgIGV2ZW50LmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spLFxuICAgICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaylcbiAgICAgIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIE1hcCByZXNwb25zZXMgdG8gZXZlbnRzLiBVc2VzIEJ1bWJsZVN0cmVhbSBpbnRlcm5hbGx5LlxuICpcbiAqIEBmdW5jdGlvbiBsaXN0ZW5Ub1xuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCAtIEVpdGhlciBDaHJvbWUgQVBJIEV2ZW50IG9yIERPTSBFbGVtZW50LlxuICogQHBhcmFtICB7Li4uYW55fSBbYXJnc10gLSBFdmVudCBzdHJpbmcgb3IgYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgQnVtYmxlU3RyZWFtIG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogbGlzdGVuVG8oY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlKS5tYXAoKHtncmVldGluZ30pID0+IHtcbiAqICAgaWYoZ3JlZXRpbmcgPT09ICdoZWxsbycpIHtcbiAqICAgICByZXR1cm4gKHtncmVldGluZzogJ2dvb2RieWUnfSlcbiAqICAgfVxuICogfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBsaXN0ZW5UbyA9ICh0YXJnZXQsIC4uLmFyZ3MpID0+IHtcbiAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgcmV0dXJuIGxpc3RlblRvRG9tRXZlbnQodGFyZ2V0LCBhcmdzWzBdKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5Ub0Nocm9tZUV2ZW50KHRhcmdldCwgLi4uYXJncylcbiAgfVxufVxubGlzdGVuVG8uZG9tRXZlbnQgPSBsaXN0ZW5Ub0RvbUV2ZW50XG5saXN0ZW5Uby5jaHJvbWVFdmVudCA9IGxpc3RlblRvQ2hyb21lRXZlbnRcbiIsImltcG9ydCB7IGxpc3RlblRvIH0gZnJvbSAnLi9saXN0ZW4tdG8nXG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGZpcnN0IHRpbWUgdGhlIGV2ZW50IG9jY3Vycy4gVGhlIGV2ZW50IGxpc3RlbmVyIGlzIHJlbW92ZWQgYWZ0ZXIgdGhlIFByb21pc2UgcmVzb2x2ZXMuXG4gKlxuICogQHJldHVybnMge1Byb21pc2U8ZXZlbnRSZXN1bHRzPn0gUmVzb2x2ZXMgd2l0aCB3aGF0ZXZlciB0aGUgZXZlbnQgcGFzc2VzIHRoZSBjYWxsYmFjay5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgZXZlbnRQcm9taXNlID0gRXZlbnRQcm9taXNlKGNocm9tZS5zb21lRXZlbnQpXG4gKlxuICogZXZlbnRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICogICAvLyBUaGlzIHdpbGwgb25seSBiZSBjYWxsZWRcbiAqICAgLy8gdGhlIGZpcnN0IHRpbWUgdGhlIGV2ZW50IG9jY3Vycy5cbiAqIH0pXG4gKi9cbmV4cG9ydCBjb25zdCBFdmVudFByb21pc2UgPSAoLi4uYXJncykgPT5cbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5UbyguLi5hcmdzKVxuICAgICAgICAuZm9yRWFjaChyZXNvbHZlKVxuICAgICAgICAuY2F0Y2gocmVqZWN0KVxuICAgICAgICAuY2xlYXIoKCkgPT4gdHJ1ZSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbiIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWwpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZhbClcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwtP1xcZD9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHdlZWtzP3x3fHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKFxuICAgIHN0clxuICApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICd3ZWVrcyc6XG4gICAgY2FzZSAnd2Vlayc6XG4gICAgY2FzZSAndyc6XG4gICAgICByZXR1cm4gbiAqIHc7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICB2YXIgbXNBYnMgPSBNYXRoLmFicyhtcyk7XG4gIGlmIChtc0FicyA+PSBkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgfVxuICBpZiAobXNBYnMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgfVxuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICB2YXIgbXNBYnMgPSBNYXRoLmFicyhtcyk7XG4gIGlmIChtc0FicyA+PSBkKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGQsICdkYXknKTtcbiAgfVxuICBpZiAobXNBYnMgPj0gaCkge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBoLCAnaG91cicpO1xuICB9XG4gIGlmIChtc0FicyA+PSBtKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIG0sICdtaW51dGUnKTtcbiAgfVxuICBpZiAobXNBYnMgPj0gcykge1xuICAgIHJldHVybiBwbHVyYWwobXMsIG1zQWJzLCBzLCAnc2Vjb25kJyk7XG4gIH1cbiAgcmV0dXJuIG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBtc0FicywgbiwgbmFtZSkge1xuICB2YXIgaXNQbHVyYWwgPSBtc0FicyA+PSBuICogMS41O1xuICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG4pICsgJyAnICsgbmFtZSArIChpc1BsdXJhbCA/ICdzJyA6ICcnKTtcbn1cbiIsImltcG9ydCBtcyBmcm9tICdtcydcblxuLyoqXG4gKiBUaGVuYWJsZSBzZXRUaW1lb3V0LiBVc2VzIFByb21pc2UgaW50ZXJuYWxseS5cbiAqIFRoZSBQcm9taXNlIHJlc29sdmVzIHdpdGggdW5kZWZpbmVkLlxuICpcbiAqIEB0b2RvIENvdWxkIGJlIHJlZmFjdG9yZWQgdG8gdXNlIGFuIGVtcHR5IHByb21pc2VcbiAqXG4gKiBAbWVtYmVyb2ZcbiAqIEBmdW5jdGlvbiB0aW1lb3V0XG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHRpbWUgLSBTdHJpbmcgZGVzY3JpcHRpb24gb2YgdGltZSBvciBtaWxsaXNlY29uZHMgaWYgbnVtYmVyLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIHRoZW5hYmxlIG9iamVjdCBmb3IgY2hhaW5pbmcuXG4gKlxuICogQGV4YW1wbGVcbiAqIHRpbWVvdXQoJzEwcycpLnRoZW4oKCkgPT4ge1xuICogICBjb25zb2xlLmxvZygnSXQgaGFzIGJlZW4gMTAgc2Vjb25kcyEnKVxuICogfSlcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gVXNlIGFyZ3VtZW50IGRlZmF1bHRzIHRvIHBhc3NcbiAqIC8vIHZhbHVlcyB3aGVuIHRoZSBwcm9taXNlIHJlc29sdmVzLlxuICogdGltZW91dCgnMTBzJykudGhlbigocmVzdWx0ID0gNSkgPT4ge1xuICogICBjb25zb2xlLmxvZygnVGhlIHJlc3VsdCBpcycsIHJlc3VsdClcbiAqIH0pIC8vIFRoZSByZXN1bHQgaXMgNVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBDYWxsIHJlc29sdmUgdG8gcmVzb2x2ZSB0aGUgcHJvbWlzZSBpbW1lZGlhdGVseS5cbiAqIC8vIFRoZSBwcm9taXNlIHdpbGwgcmVzb2x2ZSB3aXRoIHRoZSB2YWx1ZSB5b3UgcGFzcyB0byBpdC5cbiAqIHRpbWVvdXQoJzEwcycpLnRoZW4oKHJlc3VsdCA9IDUpID0+IHtcbiAqICAgY29uc29sZS5sb2coJ1RoZSByZXN1bHQgaXMnLCByZXN1bHQpXG4gKiB9KS5yZXNvbHZlKDYpIC8vIFRoZSByZXN1bHQgaXMgNlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dCh0aW1lKSB7XG4gIGNvbnN0IG1pbGxpc2Vjb25kcyA9IHR5cGVvZiB0aW1lID09PSAnc3RyaW5nJyA/IG1zKHRpbWUpIDogdGltZVxuXG4gIGxldCB0aW1lb3V0SWRcbiAgbGV0IHByb21pc2VSZXNvbHZlXG4gIGxldCBwcm9taXNlUmVqZWN0XG5cbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHByb21pc2VSZXNvbHZlID0geCA9PiByZXNvbHZlKHgpXG4gICAgICBwcm9taXNlUmVqZWN0ID0geCA9PiByZWplY3QoeClcblxuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHJvbWlzZVJlc29sdmUgPSAoKSA9PiB7fVxuICAgICAgICAgIHByb21pc2VSZWplY3QgPSAoKSA9PiB7fVxuXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9XG4gICAgICB9LCBtaWxsaXNlY29uZHMpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG5cbiAgY29uc3QgbWV0aG9kcyA9IHtcbiAgICAvKipcbiAgICAgKiBBZGQgYW5vdGhlciBmdW5jdGlvbiB0byB0aGUgUHJvbWlzZSBjaGFpbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtZXRob2RzIG9iamVjdFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aW1lb3V0KCc1cycpLnRoZW4oKCkgPT4ge1xuICAgICAqICAgY29uc29sZS5sb2coJzUgc2Vjb25kcyBoYXZlIHBhc3NlZC4nKVxuICAgICAqIH0pXG4gICAgICovXG4gICAgdGhlbjogZm4gPT4ge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihmbilcbiAgICAgIHJldHVybiBtZXRob2RzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhdGNoIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtZXRob2RzIG9iamVjdFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aW1lb3V0KCc1cycpXG4gICAgICogICAudGhlbigoKSA9PiB7XG4gICAgICogICAgIHRocm93ICdObywgbm8gcXVpZXJvLidcbiAgICAgKiAgIH0pXG4gICAgICogICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKCdKdXN0IGRvIGl0LicpXG4gICAgICogICB9KVxuICAgICAqL1xuICAgIGNhdGNoOiBmbiA9PiB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS5jYXRjaChmbilcbiAgICAgIHJldHVybiBtZXRob2RzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgdGhlIHRpbWVyLlxuICAgICAqIFRoZSBwcm9taXNlIHdpbGwgcmVtYWluIHBlbmRpbmcsXG4gICAgICogYW5kIGNhbiBiZSByZXNvbHZlZCBhbmQgcmVqZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHRpbWVyID0gdGltZW91dCgnNXMnKVxuICAgICAqIHRpbWVyLmNsZWFyKClcbiAgICAgKi9cbiAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIHRpbWVvdXQgYW5kIHJlc29sdmUgdGhlIHByb21pc2UgaW1tZWRpYXRlbHkgd2l0aCB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIHJlc29sdmVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHBhc3MgdG8gcmVzb2x2ZSgpLlxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9IFJldHVybnMgdW5kZWZpbmVkXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRpbWVvdXQoJzVzJykucmVzb2x2ZSgnRG9uZSEnKVxuICAgICAqL1xuICAgIHJlc29sdmU6IHggPT4ge1xuICAgICAgbWV0aG9kcy5jbGVhcigpXG4gICAgICBwcm9taXNlUmVzb2x2ZSh4KVxuICAgICAgcmV0dXJuIG1ldGhvZHNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIHRpbWVvdXQgYW5kIHJlc29sdmUgdGhlIHByb21pc2UgaW1tZWRpYXRlbHkgd2l0aCB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIHJlamVjdFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gcGFzcyB0byByZWplY3QoKS5cbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfSBSZXR1cm5zIHVuZGVmaW5lZFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aW1lb3V0KCc1cycpLnJlamVjdCgnTm8gc291cCBmb3IgeW91IScpXG4gICAgICovXG4gICAgcmVqZWN0OiB4ID0+IHtcbiAgICAgIG1ldGhvZHMuY2xlYXIoKVxuICAgICAgcHJvbWlzZVJlamVjdCh4KVxuICAgICAgcmV0dXJuIG1ldGhvZHNcbiAgICB9LFxuXG4gICAgLyoqIFRoZSBpZCByZXR1cm5lZCBieSBzZXRUaW1lb3V0ICovXG4gICAgdGltZW91dElkXG4gIH1cblxuICByZXR1cm4gbWV0aG9kc1xufVxuIiwiaW1wb3J0IHsgdGltZW91dCB9IGZyb20gJy4vdGltZW91dCdcblxuLyoqXG4gKiBBIFByb21pc2UgYmFzZWQgZGVib3VuY2UgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB3aXRoIHRydWVcbiAqIG9ubHkgYWZ0ZXIgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBjYWxsZWRcbiAqIGZvciBhIGNlcnRhaW4gYW1vdW50IG9mIHRpbWUuXG4gKiBXaGVuIHRoZSBkZWJvdW5jZXIgaXMgY2FsbGVkIGEgc2Vjb25kIHRpbWUsXG4gKiB0aGUgZmlyc3QgcHJvbWlzZSBpbW1lZGlhdGVseSByZXNvbHZlcyB0byBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCopOmJvb2xlYW58c3RyaW5nfG51bWJlcn0gZGVib3VuY2VDYWxsYmFjayAtIENhbGxiYWNrIGZvciBlYWNoIHRpbWUgdGhlIGRlYm91bmNlciBpcyBjYWxsZWQuXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oKik6VGltZW91dFByb21pc2U8Ym9vbGVhbj59IFJldHVybnMgYSBkZWJvdW5jZXIgZnVuY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIERlYm91bmNlIGZvciA1bXNcbiAqIGNvbnN0IGRlYm91bmNlciA9IGRlYm91bmNlKCgpID0+IDUpXG4gKiBkZWJvdW5jZXIoKS50aGVuKCkgLy8gUmVzb2x2ZXMgdG8gZmFsc2VcbiAqIGRlYm91bmNlcigpLnRoZW4oKSAvLyBSZXNvbHZlcyB0byB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGRlYm91bmNlciA9IGRlYm91bmNlKHRleHQgPT4ge1xuICogICBpZiAodGV4dCA9PT0gJycpIHtcbiAqICAgICAvLyBSZXNvbHZlIGJvdGggdGhlIHBlbmRpbmcgcHJvbWlzZVxuICogICAgIC8vIGFuZCB0aGlzIG9uZSB0byBmYWxzZVxuICogICAgIHJldHVybiBmYWxzZVxuICogICB9XG4gKiAgIGlmICh0ZXh0LmluY2x1ZGVzKCdcXG4nKSkge1xuICogICAgIC8vIFJlc29sdmUgYm90aCBwcm9taXNlcyB0byB0cnVlXG4gKiAgICAgcmV0dXJuIHRydWVcbiAqICAgfSBlbHNlIHtcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBwcmV2IHByb21pc2UgdG8gZmFsc2VcbiAqICAgICAvLyBBbmQgcmVzb2x2ZSB0aGUgY3VycmVudCBwcm9taXNlIGluIDVtc1xuICogICAgIHJldHVybiA1XG4gKiAgIH1cbiAqIH0pXG4gKlxuICogZGVib3VuY2VyKCdzdGlsbCB0eXBpbmcnKSAvLyBEZWJvdW5jZVxuICogZGVib3VuY2VyKCcnKSAvLyBEb24ndCBjb250aW51ZSwgbm8gaW5wdXRcbiAqIGRlYm91bmNlcignZG9uZSB0eXBpbmdcXG4nKSAvLyBSZXNvbHZlIGltbWVkaWF0ZWx5XG4gKi9cbmV4cG9ydCBjb25zdCBkZWJvdW5jZSA9IGZuID0+IHtcbiAgbGV0IHByb21pc2UgPSBudWxsXG5cbiAgcmV0dXJuIHggPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKHgpXG5cbiAgICAvLyBoYW5kbGUgb2xkIHByb21pc2VcbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgcHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgICAgcHJvbWlzZSA9IG51bGxcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgbmV3IHByb21pc2VcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gdGltZW91dCgwKS5yZXNvbHZlKHJlc3VsdClcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZSA9IHRpbWVvdXQocmVzdWx0KS50aGVuKCh4ID0gdHJ1ZSkgPT4geClcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgbXMgZnJvbSAnbXMnXG5pbXBvcnQgeyBCdW1ibGVTdHJlYW0gfSBmcm9tICcuLi9ldmVudC1zdHJlYW0nXG5cbi8qKlxuICogTWFwcGFibGUgc2V0SW50ZXJ2YWwuIFVzZXMgQnVtYmxlU3RyZWFtIGludGVybmFsbHkuXG4gKlxuICogQGZ1bmN0aW9uIGludGVydmFsXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZSAtIFJlcHJlc2VudHMgdGltZSBiZXR3ZWVuIGludGVydmFscy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSBCdW1ibGVTdHJlYW1DaGFpbiBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGludGVydmFsKCcxMHMnKS5mb3JFYWNoKCh4KSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKHgsICd0aW1lcycpXG4gKiB9KVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJ2YWwodGltZSkge1xuICBjb25zdCBtaWxsaXNlY29uZHMgPSB0eXBlb2YgdGltZSA9PT0gJ3N0cmluZycgPyBtcyh0aW1lKSA6IHRpbWVcblxuICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICAvLyBDcmVhdGUgY291bnRlclxuICAgIGxldCBjb3VudCA9IDBcblxuICAgIC8vIFN0YXJ0IGludGVydmFsLCBwYXNzIGNvdW50IHRvIGNhbGxiYWNrLCBpbmNyZW1lbnQgY291bnRcbiAgICBjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKGNvdW50KVxuICAgICAgY291bnQrK1xuICAgIH0sIG1pbGxpc2Vjb25kcylcblxuICAgIC8vIFJldHVybiBmdW5jdGlvbiB0byBzdG9wIGludGVydmFsXG4gICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwoaWQpXG4gIH0pXG59XG4iLCJpbXBvcnQgeyB0aW1lb3V0IH0gZnJvbSAnLi90aW1lb3V0J1xuXG4vKipcbiAqIEB0b2RvXG4gKiBUaHJvdHRsZSBzaG91bGQgcmVzb2x2ZSB0aGUgbW9zdCByZWNlbnQgcHJvbWlzZSxcbiAqIG5vdCB0aGUgZmlyc3QgcHJvbWlzZS4gU2VlIHRoZSBmaXJzdCBleGFtcGxlLlxuICpcbiAqIEEgUHJvbWlzZSBiYXNlZCB0aHJvdHRsZSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHdpdGggdHJ1ZVxuICogYWZ0ZXIgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUuIFdoZW4gdGhlIHRob3R0bGVyIGlzIGNhbGxlZFxuICogYSBzZWNvbmQgdGltZSBiZWZvcmUgdGhlIGZpcnN0IHByb21pc2UgcmVzb2x2ZXMsXG4gKiB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpbW1lZGlhdGVseSByZXNvbHZlcyB0byBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCopOmJvb2xlYW58c3RyaW5nfG51bWJlcn0gZm4gLSBDYWxsYmFjayBmb3IgZWFjaCB0aW1lIHRoZSB0aHJvdHRsZXIgaXMgY2FsbGVkLlxuICogQHJldHVybnMge2Z1bmN0aW9uKCopOlRpbWVvdXRQcm9taXNlPGJvb2xlYW4+fSBSZXR1cm5zIGEgdGhyb3R0bGVyIGZ1bmN0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBEZWJvdW5jZSBmb3IgNW1zXG4gKiBjb25zdCB0aHJvdHRsZXIgPSB0aHJvdHRsZSgoKSA9PiA1KVxuICogdGhyb3R0bGVyKCkudGhlbigpIC8vIFJlc29sdmVzIHRvIHRydWUgYWZ0ZXIgNW1zXG4gKiB0aHJvdHRsZXIoKS50aGVuKCkgLy8gUmVzb2x2ZXMgdG8gZmFsc2Ugbm93XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHRocm90dGxlciA9IHRocm90dGxlKHRleHQgPT4ge1xuICogICBpZiAodGV4dCA9PT0gJycpIHtcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBwcmV2aW91cyB0byBmYWxzZSBub3dcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBjdXJyZW50IHByb21pc2UgdG8gZmFsc2Ugbm93XG4gKiAgICAgLy8gQ2xlYXIgdGhlIHRpbWVvdXRcbiAqICAgICByZXR1cm4gZmFsc2VcbiAqICAgfVxuICogICBpZiAodGV4dC5pbmNsdWRlcygnXFxuJykpIHtcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBwcmV2aW91cyBwcm9taXNlIHRvIGZhbHNlIG5vd1xuICogICAgIC8vIGFuZCB0aGUgY3VycmVudCBwcm9taXNlIHRvIHRydWUgbm93XG4gKiAgICAgLy8gQ2xlYXIgdGhlIHRpbWVvdXRcbiAqICAgICByZXR1cm4gdHJ1ZVxuICogICB9IGVsc2Uge1xuICogICAgIC8vIFJlc29sdmUgdGhlIHByZXZpb3VzIHByb21pc2UgdG8gZmFsc2Ugbm93XG4gKiAgICAgLy8gUmVzb2x2ZSB0aGUgY3VycmVudCBwcm9taXNlIHRvIHRydWUgYWZ0ZXIgNW1zXG4gKiAgICAgcmV0dXJuIDVcbiAqICAgfVxuICogfSlcbiAqXG4gKiB0aHJvdHRsZXIoJ3N0aWxsIHR5cGluZycpIC8vIFJlc29sdmUgZXZlcnkgNW1zXG4gKiB0aHJvdHRsZXIoJycpIC8vIFJlc29sdmUgYm90aCB0byBmYWxzZSBub3dcbiAqIHRocm90dGxlcignZG9uZSB0eXBpbmdcXG4nKSAvLyBSZXNvbHZlIGJvdGggdG8gdHJ1ZSBub3dcbiAqL1xuZXhwb3J0IGNvbnN0IHRocm90dGxlID0gZm4gPT4ge1xuICBsZXQgcHJvbWlzZSA9IG51bGxcblxuICByZXR1cm4geCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gZm4oeClcblxuICAgIC8vIGhhbmRsZSBvbGQgcHJvbWlzZVxuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgcHJvbWlzZSA9IHRpbWVvdXQocmVzdWx0KVxuICAgICAgICAvLyBDbGVhbiB1cCBwcm9taXNlXG4gICAgICAgIC50aGVuKCh4ID0gdHJ1ZSkgPT4ge1xuICAgICAgICAgIHByb21pc2UgPSBudWxsXG4gICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgfSlcblxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdib29sZWFuJykge1xuICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3VsdClcbiAgICB9XG5cbiAgICByZXR1cm4gdGltZW91dCgwKS5yZXNvbHZlKGZhbHNlKVxuICB9XG59XG4iLCIvKiogVXNlZCB0byBtYXAgYWxpYXNlcyB0byB0aGVpciByZWFsIG5hbWVzLiAqL1xuZXhwb3J0cy5hbGlhc1RvUmVhbCA9IHtcblxuICAvLyBMb2Rhc2ggYWxpYXNlcy5cbiAgJ2VhY2gnOiAnZm9yRWFjaCcsXG4gICdlYWNoUmlnaHQnOiAnZm9yRWFjaFJpZ2h0JyxcbiAgJ2VudHJpZXMnOiAndG9QYWlycycsXG4gICdlbnRyaWVzSW4nOiAndG9QYWlyc0luJyxcbiAgJ2V4dGVuZCc6ICdhc3NpZ25JbicsXG4gICdleHRlbmRBbGwnOiAnYXNzaWduSW5BbGwnLFxuICAnZXh0ZW5kQWxsV2l0aCc6ICdhc3NpZ25JbkFsbFdpdGgnLFxuICAnZXh0ZW5kV2l0aCc6ICdhc3NpZ25JbldpdGgnLFxuICAnZmlyc3QnOiAnaGVhZCcsXG5cbiAgLy8gTWV0aG9kcyB0aGF0IGFyZSBjdXJyaWVkIHZhcmlhbnRzIG9mIG90aGVycy5cbiAgJ2NvbmZvcm1zJzogJ2NvbmZvcm1zVG8nLFxuICAnbWF0Y2hlcyc6ICdpc01hdGNoJyxcbiAgJ3Byb3BlcnR5JzogJ2dldCcsXG5cbiAgLy8gUmFtZGEgYWxpYXNlcy5cbiAgJ19fJzogJ3BsYWNlaG9sZGVyJyxcbiAgJ0YnOiAnc3R1YkZhbHNlJyxcbiAgJ1QnOiAnc3R1YlRydWUnLFxuICAnYWxsJzogJ2V2ZXJ5JyxcbiAgJ2FsbFBhc3MnOiAnb3ZlckV2ZXJ5JyxcbiAgJ2Fsd2F5cyc6ICdjb25zdGFudCcsXG4gICdhbnknOiAnc29tZScsXG4gICdhbnlQYXNzJzogJ292ZXJTb21lJyxcbiAgJ2FwcGx5JzogJ3NwcmVhZCcsXG4gICdhc3NvYyc6ICdzZXQnLFxuICAnYXNzb2NQYXRoJzogJ3NldCcsXG4gICdjb21wbGVtZW50JzogJ25lZ2F0ZScsXG4gICdjb21wb3NlJzogJ2Zsb3dSaWdodCcsXG4gICdjb250YWlucyc6ICdpbmNsdWRlcycsXG4gICdkaXNzb2MnOiAndW5zZXQnLFxuICAnZGlzc29jUGF0aCc6ICd1bnNldCcsXG4gICdkcm9wTGFzdCc6ICdkcm9wUmlnaHQnLFxuICAnZHJvcExhc3RXaGlsZSc6ICdkcm9wUmlnaHRXaGlsZScsXG4gICdlcXVhbHMnOiAnaXNFcXVhbCcsXG4gICdpZGVudGljYWwnOiAnZXEnLFxuICAnaW5kZXhCeSc6ICdrZXlCeScsXG4gICdpbml0JzogJ2luaXRpYWwnLFxuICAnaW52ZXJ0T2JqJzogJ2ludmVydCcsXG4gICdqdXh0JzogJ292ZXInLFxuICAnb21pdEFsbCc6ICdvbWl0JyxcbiAgJ25BcnknOiAnYXJ5JyxcbiAgJ3BhdGgnOiAnZ2V0JyxcbiAgJ3BhdGhFcSc6ICdtYXRjaGVzUHJvcGVydHknLFxuICAncGF0aE9yJzogJ2dldE9yJyxcbiAgJ3BhdGhzJzogJ2F0JyxcbiAgJ3BpY2tBbGwnOiAncGljaycsXG4gICdwaXBlJzogJ2Zsb3cnLFxuICAncGx1Y2snOiAnbWFwJyxcbiAgJ3Byb3AnOiAnZ2V0JyxcbiAgJ3Byb3BFcSc6ICdtYXRjaGVzUHJvcGVydHknLFxuICAncHJvcE9yJzogJ2dldE9yJyxcbiAgJ3Byb3BzJzogJ2F0JyxcbiAgJ3N5bW1ldHJpY0RpZmZlcmVuY2UnOiAneG9yJyxcbiAgJ3N5bW1ldHJpY0RpZmZlcmVuY2VCeSc6ICd4b3JCeScsXG4gICdzeW1tZXRyaWNEaWZmZXJlbmNlV2l0aCc6ICd4b3JXaXRoJyxcbiAgJ3Rha2VMYXN0JzogJ3Rha2VSaWdodCcsXG4gICd0YWtlTGFzdFdoaWxlJzogJ3Rha2VSaWdodFdoaWxlJyxcbiAgJ3VuYXBwbHknOiAncmVzdCcsXG4gICd1bm5lc3QnOiAnZmxhdHRlbicsXG4gICd1c2VXaXRoJzogJ292ZXJBcmdzJyxcbiAgJ3doZXJlJzogJ2NvbmZvcm1zVG8nLFxuICAnd2hlcmVFcSc6ICdpc01hdGNoJyxcbiAgJ3ppcE9iaic6ICd6aXBPYmplY3QnXG59O1xuXG4vKiogVXNlZCB0byBtYXAgYXJ5IHRvIG1ldGhvZCBuYW1lcy4gKi9cbmV4cG9ydHMuYXJ5TWV0aG9kID0ge1xuICAnMSc6IFtcbiAgICAnYXNzaWduQWxsJywgJ2Fzc2lnbkluQWxsJywgJ2F0dGVtcHQnLCAnY2FzdEFycmF5JywgJ2NlaWwnLCAnY3JlYXRlJyxcbiAgICAnY3VycnknLCAnY3VycnlSaWdodCcsICdkZWZhdWx0c0FsbCcsICdkZWZhdWx0c0RlZXBBbGwnLCAnZmxvb3InLCAnZmxvdycsXG4gICAgJ2Zsb3dSaWdodCcsICdmcm9tUGFpcnMnLCAnaW52ZXJ0JywgJ2l0ZXJhdGVlJywgJ21lbW9pemUnLCAnbWV0aG9kJywgJ21lcmdlQWxsJyxcbiAgICAnbWV0aG9kT2YnLCAnbWl4aW4nLCAnbnRoQXJnJywgJ292ZXInLCAnb3ZlckV2ZXJ5JywgJ292ZXJTb21lJywncmVzdCcsICdyZXZlcnNlJyxcbiAgICAncm91bmQnLCAncnVuSW5Db250ZXh0JywgJ3NwcmVhZCcsICd0ZW1wbGF0ZScsICd0cmltJywgJ3RyaW1FbmQnLCAndHJpbVN0YXJ0JyxcbiAgICAndW5pcXVlSWQnLCAnd29yZHMnLCAnemlwQWxsJ1xuICBdLFxuICAnMic6IFtcbiAgICAnYWRkJywgJ2FmdGVyJywgJ2FyeScsICdhc3NpZ24nLCAnYXNzaWduQWxsV2l0aCcsICdhc3NpZ25JbicsICdhc3NpZ25JbkFsbFdpdGgnLFxuICAgICdhdCcsICdiZWZvcmUnLCAnYmluZCcsICdiaW5kQWxsJywgJ2JpbmRLZXknLCAnY2h1bmsnLCAnY2xvbmVEZWVwV2l0aCcsXG4gICAgJ2Nsb25lV2l0aCcsICdjb25jYXQnLCAnY29uZm9ybXNUbycsICdjb3VudEJ5JywgJ2N1cnJ5TicsICdjdXJyeVJpZ2h0TicsXG4gICAgJ2RlYm91bmNlJywgJ2RlZmF1bHRzJywgJ2RlZmF1bHRzRGVlcCcsICdkZWZhdWx0VG8nLCAnZGVsYXknLCAnZGlmZmVyZW5jZScsXG4gICAgJ2RpdmlkZScsICdkcm9wJywgJ2Ryb3BSaWdodCcsICdkcm9wUmlnaHRXaGlsZScsICdkcm9wV2hpbGUnLCAnZW5kc1dpdGgnLCAnZXEnLFxuICAgICdldmVyeScsICdmaWx0ZXInLCAnZmluZCcsICdmaW5kSW5kZXgnLCAnZmluZEtleScsICdmaW5kTGFzdCcsICdmaW5kTGFzdEluZGV4JyxcbiAgICAnZmluZExhc3RLZXknLCAnZmxhdE1hcCcsICdmbGF0TWFwRGVlcCcsICdmbGF0dGVuRGVwdGgnLCAnZm9yRWFjaCcsXG4gICAgJ2ZvckVhY2hSaWdodCcsICdmb3JJbicsICdmb3JJblJpZ2h0JywgJ2Zvck93bicsICdmb3JPd25SaWdodCcsICdnZXQnLFxuICAgICdncm91cEJ5JywgJ2d0JywgJ2d0ZScsICdoYXMnLCAnaGFzSW4nLCAnaW5jbHVkZXMnLCAnaW5kZXhPZicsICdpbnRlcnNlY3Rpb24nLFxuICAgICdpbnZlcnRCeScsICdpbnZva2UnLCAnaW52b2tlTWFwJywgJ2lzRXF1YWwnLCAnaXNNYXRjaCcsICdqb2luJywgJ2tleUJ5JyxcbiAgICAnbGFzdEluZGV4T2YnLCAnbHQnLCAnbHRlJywgJ21hcCcsICdtYXBLZXlzJywgJ21hcFZhbHVlcycsICdtYXRjaGVzUHJvcGVydHknLFxuICAgICdtYXhCeScsICdtZWFuQnknLCAnbWVyZ2UnLCAnbWVyZ2VBbGxXaXRoJywgJ21pbkJ5JywgJ211bHRpcGx5JywgJ250aCcsICdvbWl0JyxcbiAgICAnb21pdEJ5JywgJ292ZXJBcmdzJywgJ3BhZCcsICdwYWRFbmQnLCAncGFkU3RhcnQnLCAncGFyc2VJbnQnLCAncGFydGlhbCcsXG4gICAgJ3BhcnRpYWxSaWdodCcsICdwYXJ0aXRpb24nLCAncGljaycsICdwaWNrQnknLCAncHJvcGVydHlPZicsICdwdWxsJywgJ3B1bGxBbGwnLFxuICAgICdwdWxsQXQnLCAncmFuZG9tJywgJ3JhbmdlJywgJ3JhbmdlUmlnaHQnLCAncmVhcmcnLCAncmVqZWN0JywgJ3JlbW92ZScsXG4gICAgJ3JlcGVhdCcsICdyZXN0RnJvbScsICdyZXN1bHQnLCAnc2FtcGxlU2l6ZScsICdzb21lJywgJ3NvcnRCeScsICdzb3J0ZWRJbmRleCcsXG4gICAgJ3NvcnRlZEluZGV4T2YnLCAnc29ydGVkTGFzdEluZGV4JywgJ3NvcnRlZExhc3RJbmRleE9mJywgJ3NvcnRlZFVuaXFCeScsXG4gICAgJ3NwbGl0JywgJ3NwcmVhZEZyb20nLCAnc3RhcnRzV2l0aCcsICdzdWJ0cmFjdCcsICdzdW1CeScsICd0YWtlJywgJ3Rha2VSaWdodCcsXG4gICAgJ3Rha2VSaWdodFdoaWxlJywgJ3Rha2VXaGlsZScsICd0YXAnLCAndGhyb3R0bGUnLCAndGhydScsICd0aW1lcycsICd0cmltQ2hhcnMnLFxuICAgICd0cmltQ2hhcnNFbmQnLCAndHJpbUNoYXJzU3RhcnQnLCAndHJ1bmNhdGUnLCAndW5pb24nLCAndW5pcUJ5JywgJ3VuaXFXaXRoJyxcbiAgICAndW5zZXQnLCAndW56aXBXaXRoJywgJ3dpdGhvdXQnLCAnd3JhcCcsICd4b3InLCAnemlwJywgJ3ppcE9iamVjdCcsXG4gICAgJ3ppcE9iamVjdERlZXAnXG4gIF0sXG4gICczJzogW1xuICAgICdhc3NpZ25JbldpdGgnLCAnYXNzaWduV2l0aCcsICdjbGFtcCcsICdkaWZmZXJlbmNlQnknLCAnZGlmZmVyZW5jZVdpdGgnLFxuICAgICdmaW5kRnJvbScsICdmaW5kSW5kZXhGcm9tJywgJ2ZpbmRMYXN0RnJvbScsICdmaW5kTGFzdEluZGV4RnJvbScsICdnZXRPcicsXG4gICAgJ2luY2x1ZGVzRnJvbScsICdpbmRleE9mRnJvbScsICdpblJhbmdlJywgJ2ludGVyc2VjdGlvbkJ5JywgJ2ludGVyc2VjdGlvbldpdGgnLFxuICAgICdpbnZva2VBcmdzJywgJ2ludm9rZUFyZ3NNYXAnLCAnaXNFcXVhbFdpdGgnLCAnaXNNYXRjaFdpdGgnLCAnZmxhdE1hcERlcHRoJyxcbiAgICAnbGFzdEluZGV4T2ZGcm9tJywgJ21lcmdlV2l0aCcsICdvcmRlckJ5JywgJ3BhZENoYXJzJywgJ3BhZENoYXJzRW5kJyxcbiAgICAncGFkQ2hhcnNTdGFydCcsICdwdWxsQWxsQnknLCAncHVsbEFsbFdpdGgnLCAncmFuZ2VTdGVwJywgJ3JhbmdlU3RlcFJpZ2h0JyxcbiAgICAncmVkdWNlJywgJ3JlZHVjZVJpZ2h0JywgJ3JlcGxhY2UnLCAnc2V0JywgJ3NsaWNlJywgJ3NvcnRlZEluZGV4QnknLFxuICAgICdzb3J0ZWRMYXN0SW5kZXhCeScsICd0cmFuc2Zvcm0nLCAndW5pb25CeScsICd1bmlvbldpdGgnLCAndXBkYXRlJywgJ3hvckJ5JyxcbiAgICAneG9yV2l0aCcsICd6aXBXaXRoJ1xuICBdLFxuICAnNCc6IFtcbiAgICAnZmlsbCcsICdzZXRXaXRoJywgJ3VwZGF0ZVdpdGgnXG4gIF1cbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBhcnkgdG8gcmVhcmcgY29uZmlncy4gKi9cbmV4cG9ydHMuYXJ5UmVhcmcgPSB7XG4gICcyJzogWzEsIDBdLFxuICAnMyc6IFsyLCAwLCAxXSxcbiAgJzQnOiBbMywgMiwgMCwgMV1cbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBtZXRob2QgbmFtZXMgdG8gdGhlaXIgaXRlcmF0ZWUgYXJ5LiAqL1xuZXhwb3J0cy5pdGVyYXRlZUFyeSA9IHtcbiAgJ2Ryb3BSaWdodFdoaWxlJzogMSxcbiAgJ2Ryb3BXaGlsZSc6IDEsXG4gICdldmVyeSc6IDEsXG4gICdmaWx0ZXInOiAxLFxuICAnZmluZCc6IDEsXG4gICdmaW5kRnJvbSc6IDEsXG4gICdmaW5kSW5kZXgnOiAxLFxuICAnZmluZEluZGV4RnJvbSc6IDEsXG4gICdmaW5kS2V5JzogMSxcbiAgJ2ZpbmRMYXN0JzogMSxcbiAgJ2ZpbmRMYXN0RnJvbSc6IDEsXG4gICdmaW5kTGFzdEluZGV4JzogMSxcbiAgJ2ZpbmRMYXN0SW5kZXhGcm9tJzogMSxcbiAgJ2ZpbmRMYXN0S2V5JzogMSxcbiAgJ2ZsYXRNYXAnOiAxLFxuICAnZmxhdE1hcERlZXAnOiAxLFxuICAnZmxhdE1hcERlcHRoJzogMSxcbiAgJ2ZvckVhY2gnOiAxLFxuICAnZm9yRWFjaFJpZ2h0JzogMSxcbiAgJ2ZvckluJzogMSxcbiAgJ2ZvckluUmlnaHQnOiAxLFxuICAnZm9yT3duJzogMSxcbiAgJ2Zvck93blJpZ2h0JzogMSxcbiAgJ21hcCc6IDEsXG4gICdtYXBLZXlzJzogMSxcbiAgJ21hcFZhbHVlcyc6IDEsXG4gICdwYXJ0aXRpb24nOiAxLFxuICAncmVkdWNlJzogMixcbiAgJ3JlZHVjZVJpZ2h0JzogMixcbiAgJ3JlamVjdCc6IDEsXG4gICdyZW1vdmUnOiAxLFxuICAnc29tZSc6IDEsXG4gICd0YWtlUmlnaHRXaGlsZSc6IDEsXG4gICd0YWtlV2hpbGUnOiAxLFxuICAndGltZXMnOiAxLFxuICAndHJhbnNmb3JtJzogMlxufTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byBpdGVyYXRlZSByZWFyZyBjb25maWdzLiAqL1xuZXhwb3J0cy5pdGVyYXRlZVJlYXJnID0ge1xuICAnbWFwS2V5cyc6IFsxXSxcbiAgJ3JlZHVjZVJpZ2h0JzogWzEsIDBdXG59O1xuXG4vKiogVXNlZCB0byBtYXAgbWV0aG9kIG5hbWVzIHRvIHJlYXJnIGNvbmZpZ3MuICovXG5leHBvcnRzLm1ldGhvZFJlYXJnID0ge1xuICAnYXNzaWduSW5BbGxXaXRoJzogWzEsIDBdLFxuICAnYXNzaWduSW5XaXRoJzogWzEsIDIsIDBdLFxuICAnYXNzaWduQWxsV2l0aCc6IFsxLCAwXSxcbiAgJ2Fzc2lnbldpdGgnOiBbMSwgMiwgMF0sXG4gICdkaWZmZXJlbmNlQnknOiBbMSwgMiwgMF0sXG4gICdkaWZmZXJlbmNlV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ2dldE9yJzogWzIsIDEsIDBdLFxuICAnaW50ZXJzZWN0aW9uQnknOiBbMSwgMiwgMF0sXG4gICdpbnRlcnNlY3Rpb25XaXRoJzogWzEsIDIsIDBdLFxuICAnaXNFcXVhbFdpdGgnOiBbMSwgMiwgMF0sXG4gICdpc01hdGNoV2l0aCc6IFsyLCAxLCAwXSxcbiAgJ21lcmdlQWxsV2l0aCc6IFsxLCAwXSxcbiAgJ21lcmdlV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ3BhZENoYXJzJzogWzIsIDEsIDBdLFxuICAncGFkQ2hhcnNFbmQnOiBbMiwgMSwgMF0sXG4gICdwYWRDaGFyc1N0YXJ0JzogWzIsIDEsIDBdLFxuICAncHVsbEFsbEJ5JzogWzIsIDEsIDBdLFxuICAncHVsbEFsbFdpdGgnOiBbMiwgMSwgMF0sXG4gICdyYW5nZVN0ZXAnOiBbMSwgMiwgMF0sXG4gICdyYW5nZVN0ZXBSaWdodCc6IFsxLCAyLCAwXSxcbiAgJ3NldFdpdGgnOiBbMywgMSwgMiwgMF0sXG4gICdzb3J0ZWRJbmRleEJ5JzogWzIsIDEsIDBdLFxuICAnc29ydGVkTGFzdEluZGV4QnknOiBbMiwgMSwgMF0sXG4gICd1bmlvbkJ5JzogWzEsIDIsIDBdLFxuICAndW5pb25XaXRoJzogWzEsIDIsIDBdLFxuICAndXBkYXRlV2l0aCc6IFszLCAxLCAyLCAwXSxcbiAgJ3hvckJ5JzogWzEsIDIsIDBdLFxuICAneG9yV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ3ppcFdpdGgnOiBbMSwgMiwgMF1cbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBtZXRob2QgbmFtZXMgdG8gc3ByZWFkIGNvbmZpZ3MuICovXG5leHBvcnRzLm1ldGhvZFNwcmVhZCA9IHtcbiAgJ2Fzc2lnbkFsbCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAnYXNzaWduQWxsV2l0aCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAnYXNzaWduSW5BbGwnOiB7ICdzdGFydCc6IDAgfSxcbiAgJ2Fzc2lnbkluQWxsV2l0aCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAnZGVmYXVsdHNBbGwnOiB7ICdzdGFydCc6IDAgfSxcbiAgJ2RlZmF1bHRzRGVlcEFsbCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAnaW52b2tlQXJncyc6IHsgJ3N0YXJ0JzogMiB9LFxuICAnaW52b2tlQXJnc01hcCc6IHsgJ3N0YXJ0JzogMiB9LFxuICAnbWVyZ2VBbGwnOiB7ICdzdGFydCc6IDAgfSxcbiAgJ21lcmdlQWxsV2l0aCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAncGFydGlhbCc6IHsgJ3N0YXJ0JzogMSB9LFxuICAncGFydGlhbFJpZ2h0JzogeyAnc3RhcnQnOiAxIH0sXG4gICd3aXRob3V0JzogeyAnc3RhcnQnOiAxIH0sXG4gICd6aXBBbGwnOiB7ICdzdGFydCc6IDAgfVxufTtcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgbWV0aG9kcyB3aGljaCBtdXRhdGUgYXJyYXlzIG9yIG9iamVjdHMuICovXG5leHBvcnRzLm11dGF0ZSA9IHtcbiAgJ2FycmF5Jzoge1xuICAgICdmaWxsJzogdHJ1ZSxcbiAgICAncHVsbCc6IHRydWUsXG4gICAgJ3B1bGxBbGwnOiB0cnVlLFxuICAgICdwdWxsQWxsQnknOiB0cnVlLFxuICAgICdwdWxsQWxsV2l0aCc6IHRydWUsXG4gICAgJ3B1bGxBdCc6IHRydWUsXG4gICAgJ3JlbW92ZSc6IHRydWUsXG4gICAgJ3JldmVyc2UnOiB0cnVlXG4gIH0sXG4gICdvYmplY3QnOiB7XG4gICAgJ2Fzc2lnbic6IHRydWUsXG4gICAgJ2Fzc2lnbkFsbCc6IHRydWUsXG4gICAgJ2Fzc2lnbkFsbFdpdGgnOiB0cnVlLFxuICAgICdhc3NpZ25Jbic6IHRydWUsXG4gICAgJ2Fzc2lnbkluQWxsJzogdHJ1ZSxcbiAgICAnYXNzaWduSW5BbGxXaXRoJzogdHJ1ZSxcbiAgICAnYXNzaWduSW5XaXRoJzogdHJ1ZSxcbiAgICAnYXNzaWduV2l0aCc6IHRydWUsXG4gICAgJ2RlZmF1bHRzJzogdHJ1ZSxcbiAgICAnZGVmYXVsdHNBbGwnOiB0cnVlLFxuICAgICdkZWZhdWx0c0RlZXAnOiB0cnVlLFxuICAgICdkZWZhdWx0c0RlZXBBbGwnOiB0cnVlLFxuICAgICdtZXJnZSc6IHRydWUsXG4gICAgJ21lcmdlQWxsJzogdHJ1ZSxcbiAgICAnbWVyZ2VBbGxXaXRoJzogdHJ1ZSxcbiAgICAnbWVyZ2VXaXRoJzogdHJ1ZSxcbiAgfSxcbiAgJ3NldCc6IHtcbiAgICAnc2V0JzogdHJ1ZSxcbiAgICAnc2V0V2l0aCc6IHRydWUsXG4gICAgJ3Vuc2V0JzogdHJ1ZSxcbiAgICAndXBkYXRlJzogdHJ1ZSxcbiAgICAndXBkYXRlV2l0aCc6IHRydWVcbiAgfVxufTtcblxuLyoqIFVzZWQgdG8gbWFwIHJlYWwgbmFtZXMgdG8gdGhlaXIgYWxpYXNlcy4gKi9cbmV4cG9ydHMucmVhbFRvQWxpYXMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICBvYmplY3QgPSBleHBvcnRzLmFsaWFzVG9SZWFsLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICByZXN1bHRbdmFsdWVdLnB1c2goa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W3ZhbHVlXSA9IFtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufSgpKTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byBvdGhlciBuYW1lcy4gKi9cbmV4cG9ydHMucmVtYXAgPSB7XG4gICdhc3NpZ25BbGwnOiAnYXNzaWduJyxcbiAgJ2Fzc2lnbkFsbFdpdGgnOiAnYXNzaWduV2l0aCcsXG4gICdhc3NpZ25JbkFsbCc6ICdhc3NpZ25JbicsXG4gICdhc3NpZ25JbkFsbFdpdGgnOiAnYXNzaWduSW5XaXRoJyxcbiAgJ2N1cnJ5Tic6ICdjdXJyeScsXG4gICdjdXJyeVJpZ2h0Tic6ICdjdXJyeVJpZ2h0JyxcbiAgJ2RlZmF1bHRzQWxsJzogJ2RlZmF1bHRzJyxcbiAgJ2RlZmF1bHRzRGVlcEFsbCc6ICdkZWZhdWx0c0RlZXAnLFxuICAnZmluZEZyb20nOiAnZmluZCcsXG4gICdmaW5kSW5kZXhGcm9tJzogJ2ZpbmRJbmRleCcsXG4gICdmaW5kTGFzdEZyb20nOiAnZmluZExhc3QnLFxuICAnZmluZExhc3RJbmRleEZyb20nOiAnZmluZExhc3RJbmRleCcsXG4gICdnZXRPcic6ICdnZXQnLFxuICAnaW5jbHVkZXNGcm9tJzogJ2luY2x1ZGVzJyxcbiAgJ2luZGV4T2ZGcm9tJzogJ2luZGV4T2YnLFxuICAnaW52b2tlQXJncyc6ICdpbnZva2UnLFxuICAnaW52b2tlQXJnc01hcCc6ICdpbnZva2VNYXAnLFxuICAnbGFzdEluZGV4T2ZGcm9tJzogJ2xhc3RJbmRleE9mJyxcbiAgJ21lcmdlQWxsJzogJ21lcmdlJyxcbiAgJ21lcmdlQWxsV2l0aCc6ICdtZXJnZVdpdGgnLFxuICAncGFkQ2hhcnMnOiAncGFkJyxcbiAgJ3BhZENoYXJzRW5kJzogJ3BhZEVuZCcsXG4gICdwYWRDaGFyc1N0YXJ0JzogJ3BhZFN0YXJ0JyxcbiAgJ3Byb3BlcnR5T2YnOiAnZ2V0JyxcbiAgJ3JhbmdlU3RlcCc6ICdyYW5nZScsXG4gICdyYW5nZVN0ZXBSaWdodCc6ICdyYW5nZVJpZ2h0JyxcbiAgJ3Jlc3RGcm9tJzogJ3Jlc3QnLFxuICAnc3ByZWFkRnJvbSc6ICdzcHJlYWQnLFxuICAndHJpbUNoYXJzJzogJ3RyaW0nLFxuICAndHJpbUNoYXJzRW5kJzogJ3RyaW1FbmQnLFxuICAndHJpbUNoYXJzU3RhcnQnOiAndHJpbVN0YXJ0JyxcbiAgJ3ppcEFsbCc6ICd6aXAnXG59O1xuXG4vKiogVXNlZCB0byB0cmFjayBtZXRob2RzIHRoYXQgc2tpcCBmaXhpbmcgdGhlaXIgYXJpdHkuICovXG5leHBvcnRzLnNraXBGaXhlZCA9IHtcbiAgJ2Nhc3RBcnJheSc6IHRydWUsXG4gICdmbG93JzogdHJ1ZSxcbiAgJ2Zsb3dSaWdodCc6IHRydWUsXG4gICdpdGVyYXRlZSc6IHRydWUsXG4gICdtaXhpbic6IHRydWUsXG4gICdyZWFyZyc6IHRydWUsXG4gICdydW5JbkNvbnRleHQnOiB0cnVlXG59O1xuXG4vKiogVXNlZCB0byB0cmFjayBtZXRob2RzIHRoYXQgc2tpcCByZWFycmFuZ2luZyBhcmd1bWVudHMuICovXG5leHBvcnRzLnNraXBSZWFyZyA9IHtcbiAgJ2FkZCc6IHRydWUsXG4gICdhc3NpZ24nOiB0cnVlLFxuICAnYXNzaWduSW4nOiB0cnVlLFxuICAnYmluZCc6IHRydWUsXG4gICdiaW5kS2V5JzogdHJ1ZSxcbiAgJ2NvbmNhdCc6IHRydWUsXG4gICdkaWZmZXJlbmNlJzogdHJ1ZSxcbiAgJ2RpdmlkZSc6IHRydWUsXG4gICdlcSc6IHRydWUsXG4gICdndCc6IHRydWUsXG4gICdndGUnOiB0cnVlLFxuICAnaXNFcXVhbCc6IHRydWUsXG4gICdsdCc6IHRydWUsXG4gICdsdGUnOiB0cnVlLFxuICAnbWF0Y2hlc1Byb3BlcnR5JzogdHJ1ZSxcbiAgJ21lcmdlJzogdHJ1ZSxcbiAgJ211bHRpcGx5JzogdHJ1ZSxcbiAgJ292ZXJBcmdzJzogdHJ1ZSxcbiAgJ3BhcnRpYWwnOiB0cnVlLFxuICAncGFydGlhbFJpZ2h0JzogdHJ1ZSxcbiAgJ3Byb3BlcnR5T2YnOiB0cnVlLFxuICAncmFuZG9tJzogdHJ1ZSxcbiAgJ3JhbmdlJzogdHJ1ZSxcbiAgJ3JhbmdlUmlnaHQnOiB0cnVlLFxuICAnc3VidHJhY3QnOiB0cnVlLFxuICAnemlwJzogdHJ1ZSxcbiAgJ3ppcE9iamVjdCc6IHRydWUsXG4gICd6aXBPYmplY3REZWVwJzogdHJ1ZVxufTtcbiIsIi8qKlxuICogVGhlIGRlZmF1bHQgYXJndW1lbnQgcGxhY2Vob2xkZXIgdmFsdWUgZm9yIG1ldGhvZHMuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBtYXBwaW5nID0gcmVxdWlyZSgnLi9fbWFwcGluZycpLFxuICAgIGZhbGxiYWNrSG9sZGVyID0gcmVxdWlyZSgnLi9wbGFjZWhvbGRlcicpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlLiAqL1xudmFyIHB1c2ggPSBBcnJheS5wcm90b3R5cGUucHVzaDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24sIHdpdGggYW4gYXJpdHkgb2YgYG5gLCB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlXG4gKiBhcmd1bWVudHMgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgYXJpdHkgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlQXJpdHkoZnVuYywgbikge1xuICByZXR1cm4gbiA9PSAyXG4gICAgPyBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTsgfVxuICAgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7IH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2AsIHdpdGggdXAgdG8gYG5gIGFyZ3VtZW50cywgaWdub3JpbmdcbiAqIGFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgYXJpdHkgY2FwLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBcnkoZnVuYywgbikge1xuICByZXR1cm4gbiA9PSAyXG4gICAgPyBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBmdW5jKGEsIGIpOyB9XG4gICAgOiBmdW5jdGlvbihhKSB7IHJldHVybiBmdW5jKGEpOyB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheShhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICByZXN1bHRbbGVuZ3RoXSA9IGFycmF5W2xlbmd0aF07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBjbG9uZXMgYSBnaXZlbiBvYmplY3QgdXNpbmcgdGhlIGFzc2lnbm1lbnQgYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBhc3NpZ25tZW50IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2xvbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVDbG9uZXIoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIGZ1bmMoe30sIG9iamVjdCk7XG4gIH07XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNwcmVhZGAgd2hpY2ggZmxhdHRlbnMgdGhlIHNwcmVhZCBhcnJheSBpbnRvXG4gKiB0aGUgYXJndW1lbnRzIG9mIHRoZSBpbnZva2VkIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gc3ByZWFkIGFyZ3VtZW50cyBvdmVyLlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgc3ByZWFkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGZsYXRTcHJlYWQoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICBsYXN0SW5kZXggPSBsZW5ndGggLSAxLFxuICAgICAgICBhcmdzID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgYXJnc1tsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgfVxuICAgIHZhciBhcnJheSA9IGFyZ3Nbc3RhcnRdLFxuICAgICAgICBvdGhlckFyZ3MgPSBhcmdzLnNsaWNlKDAsIHN0YXJ0KTtcblxuICAgIGlmIChhcnJheSkge1xuICAgICAgcHVzaC5hcHBseShvdGhlckFyZ3MsIGFycmF5KTtcbiAgICB9XG4gICAgaWYgKHN0YXJ0ICE9IGxhc3RJbmRleCkge1xuICAgICAgcHVzaC5hcHBseShvdGhlckFyZ3MsIGFyZ3Muc2xpY2Uoc3RhcnQgKyAxKSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIGFuZCB1c2VzIGBjbG9uZXJgIHRvIGNsb25lIHRoZSBmaXJzdFxuICogYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9uZXIgVGhlIGZ1bmN0aW9uIHRvIGNsb25lIGFyZ3VtZW50cy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGltbXV0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gd3JhcEltbXV0YWJsZShmdW5jLCBjbG9uZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIGFyZ3NbbGVuZ3RoXSA9IGFyZ3VtZW50c1tsZW5ndGhdO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gYXJnc1swXSA9IGNsb25lci5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBjb252ZXJ0YCB3aGljaCBhY2NlcHRzIGEgYHV0aWxgIG9iamVjdCBvZiBtZXRob2RzXG4gKiByZXF1aXJlZCB0byBwZXJmb3JtIGNvbnZlcnNpb25zLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB1dGlsIFRoZSB1dGlsIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jYXA9dHJ1ZV0gU3BlY2lmeSBjYXBwaW5nIGl0ZXJhdGVlIGFyZ3VtZW50cy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY3Vycnk9dHJ1ZV0gU3BlY2lmeSBjdXJyeWluZy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZml4ZWQ9dHJ1ZV0gU3BlY2lmeSBmaXhlZCBhcml0eS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuaW1tdXRhYmxlPXRydWVdIFNwZWNpZnkgaW1tdXRhYmxlIG9wZXJhdGlvbnMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnJlYXJnPXRydWVdIFNwZWNpZnkgcmVhcnJhbmdpbmcgYXJndW1lbnRzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufE9iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIGZ1bmN0aW9uIG9yIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYmFzZUNvbnZlcnQodXRpbCwgbmFtZSwgZnVuYywgb3B0aW9ucykge1xuICB2YXIgaXNMaWIgPSB0eXBlb2YgbmFtZSA9PSAnZnVuY3Rpb24nLFxuICAgICAgaXNPYmogPSBuYW1lID09PSBPYmplY3QobmFtZSk7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgb3B0aW9ucyA9IGZ1bmM7XG4gICAgZnVuYyA9IG5hbWU7XG4gICAgbmFtZSA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgfVxuICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXG4gIHZhciBjb25maWcgPSB7XG4gICAgJ2NhcCc6ICdjYXAnIGluIG9wdGlvbnMgPyBvcHRpb25zLmNhcCA6IHRydWUsXG4gICAgJ2N1cnJ5JzogJ2N1cnJ5JyBpbiBvcHRpb25zID8gb3B0aW9ucy5jdXJyeSA6IHRydWUsXG4gICAgJ2ZpeGVkJzogJ2ZpeGVkJyBpbiBvcHRpb25zID8gb3B0aW9ucy5maXhlZCA6IHRydWUsXG4gICAgJ2ltbXV0YWJsZSc6ICdpbW11dGFibGUnIGluIG9wdGlvbnMgPyBvcHRpb25zLmltbXV0YWJsZSA6IHRydWUsXG4gICAgJ3JlYXJnJzogJ3JlYXJnJyBpbiBvcHRpb25zID8gb3B0aW9ucy5yZWFyZyA6IHRydWVcbiAgfTtcblxuICB2YXIgZGVmYXVsdEhvbGRlciA9IGlzTGliID8gZnVuYyA6IGZhbGxiYWNrSG9sZGVyLFxuICAgICAgZm9yY2VDdXJyeSA9ICgnY3VycnknIGluIG9wdGlvbnMpICYmIG9wdGlvbnMuY3VycnksXG4gICAgICBmb3JjZUZpeGVkID0gKCdmaXhlZCcgaW4gb3B0aW9ucykgJiYgb3B0aW9ucy5maXhlZCxcbiAgICAgIGZvcmNlUmVhcmcgPSAoJ3JlYXJnJyBpbiBvcHRpb25zKSAmJiBvcHRpb25zLnJlYXJnLFxuICAgICAgcHJpc3RpbmUgPSBpc0xpYiA/IGZ1bmMucnVuSW5Db250ZXh0KCkgOiB1bmRlZmluZWQ7XG5cbiAgdmFyIGhlbHBlcnMgPSBpc0xpYiA/IGZ1bmMgOiB7XG4gICAgJ2FyeSc6IHV0aWwuYXJ5LFxuICAgICdhc3NpZ24nOiB1dGlsLmFzc2lnbixcbiAgICAnY2xvbmUnOiB1dGlsLmNsb25lLFxuICAgICdjdXJyeSc6IHV0aWwuY3VycnksXG4gICAgJ2ZvckVhY2gnOiB1dGlsLmZvckVhY2gsXG4gICAgJ2lzQXJyYXknOiB1dGlsLmlzQXJyYXksXG4gICAgJ2lzRXJyb3InOiB1dGlsLmlzRXJyb3IsXG4gICAgJ2lzRnVuY3Rpb24nOiB1dGlsLmlzRnVuY3Rpb24sXG4gICAgJ2lzV2Vha01hcCc6IHV0aWwuaXNXZWFrTWFwLFxuICAgICdpdGVyYXRlZSc6IHV0aWwuaXRlcmF0ZWUsXG4gICAgJ2tleXMnOiB1dGlsLmtleXMsXG4gICAgJ3JlYXJnJzogdXRpbC5yZWFyZyxcbiAgICAndG9JbnRlZ2VyJzogdXRpbC50b0ludGVnZXIsXG4gICAgJ3RvUGF0aCc6IHV0aWwudG9QYXRoXG4gIH07XG5cbiAgdmFyIGFyeSA9IGhlbHBlcnMuYXJ5LFxuICAgICAgYXNzaWduID0gaGVscGVycy5hc3NpZ24sXG4gICAgICBjbG9uZSA9IGhlbHBlcnMuY2xvbmUsXG4gICAgICBjdXJyeSA9IGhlbHBlcnMuY3VycnksXG4gICAgICBlYWNoID0gaGVscGVycy5mb3JFYWNoLFxuICAgICAgaXNBcnJheSA9IGhlbHBlcnMuaXNBcnJheSxcbiAgICAgIGlzRXJyb3IgPSBoZWxwZXJzLmlzRXJyb3IsXG4gICAgICBpc0Z1bmN0aW9uID0gaGVscGVycy5pc0Z1bmN0aW9uLFxuICAgICAgaXNXZWFrTWFwID0gaGVscGVycy5pc1dlYWtNYXAsXG4gICAgICBrZXlzID0gaGVscGVycy5rZXlzLFxuICAgICAgcmVhcmcgPSBoZWxwZXJzLnJlYXJnLFxuICAgICAgdG9JbnRlZ2VyID0gaGVscGVycy50b0ludGVnZXIsXG4gICAgICB0b1BhdGggPSBoZWxwZXJzLnRvUGF0aDtcblxuICB2YXIgYXJ5TWV0aG9kS2V5cyA9IGtleXMobWFwcGluZy5hcnlNZXRob2QpO1xuXG4gIHZhciB3cmFwcGVycyA9IHtcbiAgICAnY2FzdEFycmF5JzogZnVuY3Rpb24oY2FzdEFycmF5KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgPyBjYXN0QXJyYXkoY2xvbmVBcnJheSh2YWx1ZSkpXG4gICAgICAgICAgOiBjYXN0QXJyYXkuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9LFxuICAgICdpdGVyYXRlZSc6IGZ1bmN0aW9uKGl0ZXJhdGVlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmdW5jID0gYXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgYXJpdHkgPSBhcmd1bWVudHNbMV0sXG4gICAgICAgICAgICByZXN1bHQgPSBpdGVyYXRlZShmdW5jLCBhcml0eSksXG4gICAgICAgICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gICAgICAgIGlmIChjb25maWcuY2FwICYmIHR5cGVvZiBhcml0eSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgIGFyaXR5ID0gYXJpdHkgPiAyID8gKGFyaXR5IC0gMikgOiAxO1xuICAgICAgICAgIHJldHVybiAobGVuZ3RoICYmIGxlbmd0aCA8PSBhcml0eSkgPyByZXN1bHQgOiBiYXNlQXJ5KHJlc3VsdCwgYXJpdHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH0sXG4gICAgJ21peGluJzogZnVuY3Rpb24obWl4aW4pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSB0aGlzO1xuICAgICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgICByZXR1cm4gbWl4aW4oZnVuYywgT2JqZWN0KHNvdXJjZSkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYWlycyA9IFtdO1xuICAgICAgICBlYWNoKGtleXMoc291cmNlKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgaWYgKGlzRnVuY3Rpb24oc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICBwYWlycy5wdXNoKFtrZXksIGZ1bmMucHJvdG90eXBlW2tleV1dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1peGluKGZ1bmMsIE9iamVjdChzb3VyY2UpKTtcblxuICAgICAgICBlYWNoKHBhaXJzLCBmdW5jdGlvbihwYWlyKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gcGFpclsxXTtcbiAgICAgICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgICAgIGZ1bmMucHJvdG90eXBlW3BhaXJbMF1dID0gdmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBmdW5jLnByb3RvdHlwZVtwYWlyWzBdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgIH07XG4gICAgfSxcbiAgICAnbnRoQXJnJzogZnVuY3Rpb24obnRoQXJnKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obikge1xuICAgICAgICB2YXIgYXJpdHkgPSBuIDwgMCA/IDEgOiAodG9JbnRlZ2VyKG4pICsgMSk7XG4gICAgICAgIHJldHVybiBjdXJyeShudGhBcmcobiksIGFyaXR5KTtcbiAgICAgIH07XG4gICAgfSxcbiAgICAncmVhcmcnOiBmdW5jdGlvbihyZWFyZykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGZ1bmMsIGluZGV4ZXMpIHtcbiAgICAgICAgdmFyIGFyaXR5ID0gaW5kZXhlcyA/IGluZGV4ZXMubGVuZ3RoIDogMDtcbiAgICAgICAgcmV0dXJuIGN1cnJ5KHJlYXJnKGZ1bmMsIGluZGV4ZXMpLCBhcml0eSk7XG4gICAgICB9O1xuICAgIH0sXG4gICAgJ3J1bkluQ29udGV4dCc6IGZ1bmN0aW9uKHJ1bkluQ29udGV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VDb252ZXJ0KHV0aWwsIHJ1bkluQ29udGV4dChjb250ZXh0KSwgb3B0aW9ucyk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ2FzdHMgYGZ1bmNgIHRvIGEgZnVuY3Rpb24gd2l0aCBhbiBhcml0eSBjYXBwZWQgaXRlcmF0ZWUgaWYgbmVlZGVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYXN0IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FzdENhcChuYW1lLCBmdW5jKSB7XG4gICAgaWYgKGNvbmZpZy5jYXApIHtcbiAgICAgIHZhciBpbmRleGVzID0gbWFwcGluZy5pdGVyYXRlZVJlYXJnW25hbWVdO1xuICAgICAgaWYgKGluZGV4ZXMpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdGVlUmVhcmcoZnVuYywgaW5kZXhlcyk7XG4gICAgICB9XG4gICAgICB2YXIgbiA9ICFpc0xpYiAmJiBtYXBwaW5nLml0ZXJhdGVlQXJ5W25hbWVdO1xuICAgICAgaWYgKG4pIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdGVlQXJ5KGZ1bmMsIG4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYXN0cyBgZnVuY2AgdG8gYSBjdXJyaWVkIGZ1bmN0aW9uIGlmIG5lZWRlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGluc3BlY3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGluc3BlY3QuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FzdCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNhc3RDdXJyeShuYW1lLCBmdW5jLCBuKSB7XG4gICAgcmV0dXJuIChmb3JjZUN1cnJ5IHx8IChjb25maWcuY3VycnkgJiYgbiA+IDEpKVxuICAgICAgPyBjdXJyeShmdW5jLCBuKVxuICAgICAgOiBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIENhc3RzIGBmdW5jYCB0byBhIGZpeGVkIGFyaXR5IGZ1bmN0aW9uIGlmIG5lZWRlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGluc3BlY3QuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGluc3BlY3QuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBjYXAuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FzdCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNhc3RGaXhlZChuYW1lLCBmdW5jLCBuKSB7XG4gICAgaWYgKGNvbmZpZy5maXhlZCAmJiAoZm9yY2VGaXhlZCB8fCAhbWFwcGluZy5za2lwRml4ZWRbbmFtZV0pKSB7XG4gICAgICB2YXIgZGF0YSA9IG1hcHBpbmcubWV0aG9kU3ByZWFkW25hbWVdLFxuICAgICAgICAgIHN0YXJ0ID0gZGF0YSAmJiBkYXRhLnN0YXJ0O1xuXG4gICAgICByZXR1cm4gc3RhcnQgID09PSB1bmRlZmluZWQgPyBhcnkoZnVuYywgbikgOiBmbGF0U3ByZWFkKGZ1bmMsIHN0YXJ0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cblxuICAvKipcbiAgICogQ2FzdHMgYGZ1bmNgIHRvIGFuIHJlYXJnZWQgZnVuY3Rpb24gaWYgbmVlZGVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIGFyaXR5IG9mIGBmdW5jYC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYXN0IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FzdFJlYXJnKG5hbWUsIGZ1bmMsIG4pIHtcbiAgICByZXR1cm4gKGNvbmZpZy5yZWFyZyAmJiBuID4gMSAmJiAoZm9yY2VSZWFyZyB8fCAhbWFwcGluZy5za2lwUmVhcmdbbmFtZV0pKVxuICAgICAgPyByZWFyZyhmdW5jLCBtYXBwaW5nLm1ldGhvZFJlYXJnW25hbWVdIHx8IG1hcHBpbmcuYXJ5UmVhcmdbbl0pXG4gICAgICA6IGZ1bmM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNsb25lIG9mIGBvYmplY3RgIGJ5IGBwYXRoYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICAgKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjbG9uZSBieS5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIGNsb25lQnlQYXRoKG9iamVjdCwgcGF0aCkge1xuICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG5cbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDEsXG4gICAgICAgIHJlc3VsdCA9IGNsb25lKE9iamVjdChvYmplY3QpKSxcbiAgICAgICAgbmVzdGVkID0gcmVzdWx0O1xuXG4gICAgd2hpbGUgKG5lc3RlZCAhPSBudWxsICYmICsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBrZXkgPSBwYXRoW2luZGV4XSxcbiAgICAgICAgICB2YWx1ZSA9IG5lc3RlZFtrZXldO1xuXG4gICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJlxuICAgICAgICAgICEoaXNGdW5jdGlvbih2YWx1ZSkgfHwgaXNFcnJvcih2YWx1ZSkgfHwgaXNXZWFrTWFwKHZhbHVlKSkpIHtcbiAgICAgICAgbmVzdGVkW2tleV0gPSBjbG9uZShpbmRleCA9PSBsYXN0SW5kZXggPyB2YWx1ZSA6IE9iamVjdCh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgbmVzdGVkID0gbmVzdGVkW2tleV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYGxvZGFzaGAgdG8gYW4gaW1tdXRhYmxlIGF1dG8tY3VycmllZCBpdGVyYXRlZS1maXJzdCBkYXRhLWxhc3RcbiAgICogdmVyc2lvbiB3aXRoIGNvbnZlcnNpb24gYG9wdGlvbnNgIGFwcGxpZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LiBTZWUgYGJhc2VDb252ZXJ0YCBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNvbnZlcnRlZCBgbG9kYXNoYC5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbnZlcnRMaWIob3B0aW9ucykge1xuICAgIHJldHVybiBfLnJ1bkluQ29udGV4dC5jb252ZXJ0KG9wdGlvbnMpKHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgY29udmVydGVyIGZ1bmN0aW9uIGZvciBgZnVuY2Agb2YgYG5hbWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29udmVydGVyIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQ29udmVydGVyKG5hbWUsIGZ1bmMpIHtcbiAgICB2YXIgcmVhbE5hbWUgPSBtYXBwaW5nLmFsaWFzVG9SZWFsW25hbWVdIHx8IG5hbWUsXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtYXBwaW5nLnJlbWFwW3JlYWxOYW1lXSB8fCByZWFsTmFtZSxcbiAgICAgICAgb2xkT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIG5ld1V0aWwgPSBpc0xpYiA/IHByaXN0aW5lIDogaGVscGVycyxcbiAgICAgICAgICBuZXdGdW5jID0gaXNMaWIgPyBwcmlzdGluZVttZXRob2ROYW1lXSA6IGZ1bmMsXG4gICAgICAgICAgbmV3T3B0aW9ucyA9IGFzc2lnbihhc3NpZ24oe30sIG9sZE9wdGlvbnMpLCBvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIGJhc2VDb252ZXJ0KG5ld1V0aWwsIHJlYWxOYW1lLCBuZXdGdW5jLCBuZXdPcHRpb25zKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXRzIGl0ZXJhdGVlLCB3aXRoIHVwIHRvIGBuYFxuICAgKiBhcmd1bWVudHMsIGlnbm9yaW5nIGFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGl0ZXJhdGVlIGFyZ3VtZW50cyBmb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBjYXAuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gaXRlcmF0ZWVBcnkoZnVuYywgbikge1xuICAgIHJldHVybiBvdmVyQXJnKGZ1bmMsIGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nID8gYmFzZUFyeShmdW5jLCBuKSA6IGZ1bmM7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIHRvIGludm9rZSBpdHMgaXRlcmF0ZWUgd2l0aCBhcmd1bWVudHNcbiAgICogYXJyYW5nZWQgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgYGluZGV4ZXNgIHdoZXJlIHRoZSBhcmd1bWVudCB2YWx1ZSBhdFxuICAgKiB0aGUgZmlyc3QgaW5kZXggaXMgcHJvdmlkZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LCB0aGUgYXJndW1lbnQgdmFsdWUgYXRcbiAgICogdGhlIHNlY29uZCBpbmRleCBpcyBwcm92aWRlZCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50LCBhbmQgc28gb24uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlYXJyYW5nZSBpdGVyYXRlZSBhcmd1bWVudHMgZm9yLlxuICAgKiBAcGFyYW0ge251bWJlcltdfSBpbmRleGVzIFRoZSBhcnJhbmdlZCBhcmd1bWVudCBpbmRleGVzLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGl0ZXJhdGVlUmVhcmcoZnVuYywgaW5kZXhlcykge1xuICAgIHJldHVybiBvdmVyQXJnKGZ1bmMsIGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHZhciBuID0gaW5kZXhlcy5sZW5ndGg7XG4gICAgICByZXR1cm4gYmFzZUFyaXR5KHJlYXJnKGJhc2VBcnkoZnVuYywgbiksIGluZGV4ZXMpLCBuKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBmaXJzdCBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmdW5jKCk7XG4gICAgICB9XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgYXJnc1tsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBjb25maWcucmVhcmcgPyAwIDogKGxlbmd0aCAtIDEpO1xuICAgICAgYXJnc1tpbmRleF0gPSB0cmFuc2Zvcm0oYXJnc1tpbmRleF0pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCBhbmQgYXBwbHlzIHRoZSBjb252ZXJzaW9uc1xuICAgKiBydWxlcyBieSBgbmFtZWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNvbnZlcnRlZCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHdyYXAobmFtZSwgZnVuYywgcGxhY2Vob2xkZXIpIHtcbiAgICB2YXIgcmVzdWx0LFxuICAgICAgICByZWFsTmFtZSA9IG1hcHBpbmcuYWxpYXNUb1JlYWxbbmFtZV0gfHwgbmFtZSxcbiAgICAgICAgd3JhcHBlZCA9IGZ1bmMsXG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVyc1tyZWFsTmFtZV07XG5cbiAgICBpZiAod3JhcHBlcikge1xuICAgICAgd3JhcHBlZCA9IHdyYXBwZXIoZnVuYyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNvbmZpZy5pbW11dGFibGUpIHtcbiAgICAgIGlmIChtYXBwaW5nLm11dGF0ZS5hcnJheVtyZWFsTmFtZV0pIHtcbiAgICAgICAgd3JhcHBlZCA9IHdyYXBJbW11dGFibGUoZnVuYywgY2xvbmVBcnJheSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtYXBwaW5nLm11dGF0ZS5vYmplY3RbcmVhbE5hbWVdKSB7XG4gICAgICAgIHdyYXBwZWQgPSB3cmFwSW1tdXRhYmxlKGZ1bmMsIGNyZWF0ZUNsb25lcihmdW5jKSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtYXBwaW5nLm11dGF0ZS5zZXRbcmVhbE5hbWVdKSB7XG4gICAgICAgIHdyYXBwZWQgPSB3cmFwSW1tdXRhYmxlKGZ1bmMsIGNsb25lQnlQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWFjaChhcnlNZXRob2RLZXlzLCBmdW5jdGlvbihhcnlLZXkpIHtcbiAgICAgIGVhY2gobWFwcGluZy5hcnlNZXRob2RbYXJ5S2V5XSwgZnVuY3Rpb24ob3RoZXJOYW1lKSB7XG4gICAgICAgIGlmIChyZWFsTmFtZSA9PSBvdGhlck5hbWUpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IG1hcHBpbmcubWV0aG9kU3ByZWFkW3JlYWxOYW1lXSxcbiAgICAgICAgICAgICAgYWZ0ZXJSZWFyZyA9IGRhdGEgJiYgZGF0YS5hZnRlclJlYXJnO1xuXG4gICAgICAgICAgcmVzdWx0ID0gYWZ0ZXJSZWFyZ1xuICAgICAgICAgICAgPyBjYXN0Rml4ZWQocmVhbE5hbWUsIGNhc3RSZWFyZyhyZWFsTmFtZSwgd3JhcHBlZCwgYXJ5S2V5KSwgYXJ5S2V5KVxuICAgICAgICAgICAgOiBjYXN0UmVhcmcocmVhbE5hbWUsIGNhc3RGaXhlZChyZWFsTmFtZSwgd3JhcHBlZCwgYXJ5S2V5KSwgYXJ5S2V5KTtcblxuICAgICAgICAgIHJlc3VsdCA9IGNhc3RDYXAocmVhbE5hbWUsIHJlc3VsdCk7XG4gICAgICAgICAgcmVzdWx0ID0gY2FzdEN1cnJ5KHJlYWxOYW1lLCByZXN1bHQsIGFyeUtleSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAhcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgcmVzdWx0IHx8IChyZXN1bHQgPSB3cmFwcGVkKTtcbiAgICBpZiAocmVzdWx0ID09IGZ1bmMpIHtcbiAgICAgIHJlc3VsdCA9IGZvcmNlQ3VycnkgPyBjdXJyeShyZXN1bHQsIDEpIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXN1bHQuY29udmVydCA9IGNyZWF0ZUNvbnZlcnRlcihyZWFsTmFtZSwgZnVuYyk7XG4gICAgcmVzdWx0LnBsYWNlaG9sZGVyID0gZnVuYy5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGlmICghaXNPYmopIHtcbiAgICByZXR1cm4gd3JhcChuYW1lLCBmdW5jLCBkZWZhdWx0SG9sZGVyKTtcbiAgfVxuICB2YXIgXyA9IGZ1bmM7XG5cbiAgLy8gQ29udmVydCBtZXRob2RzIGJ5IGFyeSBjYXAuXG4gIHZhciBwYWlycyA9IFtdO1xuICBlYWNoKGFyeU1ldGhvZEtleXMsIGZ1bmN0aW9uKGFyeUtleSkge1xuICAgIGVhY2gobWFwcGluZy5hcnlNZXRob2RbYXJ5S2V5XSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbWFwcGluZy5yZW1hcFtrZXldIHx8IGtleV07XG4gICAgICBpZiAoZnVuYykge1xuICAgICAgICBwYWlycy5wdXNoKFtrZXksIHdyYXAoa2V5LCBmdW5jLCBfKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvLyBDb252ZXJ0IHJlbWFpbmluZyBtZXRob2RzLlxuICBlYWNoKGtleXMoXyksIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmdW5jID0gX1trZXldO1xuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gcGFpcnMubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmIChwYWlyc1tsZW5ndGhdWzBdID09IGtleSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuYy5jb252ZXJ0ID0gY3JlYXRlQ29udmVydGVyKGtleSwgZnVuYyk7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIGZ1bmNdKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFzc2lnbiB0byBgX2AgbGVhdmluZyBgXy5wcm90b3R5cGVgIHVuY2hhbmdlZCB0byBhbGxvdyBjaGFpbmluZy5cbiAgZWFjaChwYWlycywgZnVuY3Rpb24ocGFpcikge1xuICAgIF9bcGFpclswXV0gPSBwYWlyWzFdO1xuICB9KTtcblxuICBfLmNvbnZlcnQgPSBjb252ZXJ0TGliO1xuICBfLnBsYWNlaG9sZGVyID0gXztcblxuICAvLyBBc3NpZ24gYWxpYXNlcy5cbiAgZWFjaChrZXlzKF8pLCBmdW5jdGlvbihrZXkpIHtcbiAgICBlYWNoKG1hcHBpbmcucmVhbFRvQWxpYXNba2V5XSB8fCBbXSwgZnVuY3Rpb24oYWxpYXMpIHtcbiAgICAgIF9bYWxpYXNdID0gX1trZXldO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gXztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ29udmVydDtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKlxuICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsInZhciBjb3JlSnNEYXRhID0gcmVxdWlyZSgnLi9fY29yZUpzRGF0YScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFza2VkO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc01hc2tlZCA9IHJlcXVpcmUoJy4vX2lzTWFza2VkJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hdGl2ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwidmFyIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyk7XG5cbi8qKiBVc2VkIHRvIHN0b3JlIGZ1bmN0aW9uIG1ldGFkYXRhLiAqL1xudmFyIG1ldGFNYXAgPSBXZWFrTWFwICYmIG5ldyBXZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ldGFNYXA7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgbWV0YU1hcCA9IHJlcXVpcmUoJy4vX21ldGFNYXAnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0RGF0YWAgd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXNzb2NpYXRlIG1ldGFkYXRhIHdpdGguXG4gKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1ldGFkYXRhLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXREYXRhID0gIW1ldGFNYXAgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIGRhdGEpIHtcbiAgbWV0YU1hcC5zZXQoZnVuYywgZGF0YSk7XG4gIHJldHVybiBmdW5jO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0RGF0YTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gaW5zdGFuY2Ugb2YgYEN0b3JgIHJlZ2FyZGxlc3Mgb2ZcbiAqIHdoZXRoZXIgaXQgd2FzIGludm9rZWQgYXMgcGFydCBvZiBhIGBuZXdgIGV4cHJlc3Npb24gb3IgYnkgYGNhbGxgIG9yIGBhcHBseWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IEN0b3IgVGhlIGNvbnN0cnVjdG9yIHRvIHdyYXAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVDdG9yKEN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIC8vIFVzZSBhIGBzd2l0Y2hgIHN0YXRlbWVudCB0byB3b3JrIHdpdGggY2xhc3MgY29uc3RydWN0b3JzLiBTZWVcbiAgICAvLyBodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWZ1bmN0aW9uLW9iamVjdHMtY2FsbC10aGlzYXJndW1lbnQtYXJndW1lbnRzbGlzdFxuICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEN0b3I7XG4gICAgICBjYXNlIDE6IHJldHVybiBuZXcgQ3RvcihhcmdzWzBdKTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDdG9yKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbmV3IEN0b3IoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICBjYXNlIDQ6IHJldHVybiBuZXcgQ3RvcihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgICAgIGNhc2UgNTogcmV0dXJuIG5ldyBDdG9yKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbmV3IEN0b3IoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSwgYXJnc1s1XSk7XG4gICAgICBjYXNlIDc6IHJldHVybiBuZXcgQ3RvcihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdLCBhcmdzWzVdLCBhcmdzWzZdKTtcbiAgICB9XG4gICAgdmFyIHRoaXNCaW5kaW5nID0gYmFzZUNyZWF0ZShDdG9yLnByb3RvdHlwZSksXG4gICAgICAgIHJlc3VsdCA9IEN0b3IuYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MpO1xuXG4gICAgLy8gTWltaWMgdGhlIGNvbnN0cnVjdG9yJ3MgYHJldHVybmAgYmVoYXZpb3IuXG4gICAgLy8gU2VlIGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDEzLjIuMiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogdGhpc0JpbmRpbmc7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQ3RvcjtcbiIsInZhciBjcmVhdGVDdG9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQ3RvcicpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGZ1bmN0aW9uIG1ldGFkYXRhLiAqL1xudmFyIFdSQVBfQklORF9GTEFHID0gMTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gaW52b2tlIGl0IHdpdGggdGhlIG9wdGlvbmFsIGB0aGlzYFxuICogYmluZGluZyBvZiBgdGhpc0FyZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBjcmVhdGVXcmFwYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJpbmQoZnVuYywgYml0bWFzaywgdGhpc0FyZykge1xuICB2YXIgaXNCaW5kID0gYml0bWFzayAmIFdSQVBfQklORF9GTEFHLFxuICAgICAgQ3RvciA9IGNyZWF0ZUN0b3IoZnVuYyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgZm4gPSAodGhpcyAmJiB0aGlzICE9PSByb290ICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IEN0b3IgOiBmdW5jO1xuICAgIHJldHVybiBmbi5hcHBseShpc0JpbmQgPyB0aGlzQXJnIDogdGhpcywgYXJndW1lbnRzKTtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCaW5kO1xuIiwiLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuIiwiLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgcGFydGlhbGx5IGFwcGxpZWQgYXJndW1lbnRzLFxuICogcGxhY2Vob2xkZXJzLCBhbmQgcHJvdmlkZWQgYXJndW1lbnRzIGludG8gYSBzaW5nbGUgYXJyYXkgb2YgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBwcm92aWRlZCBhcmd1bWVudHMuXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFscyBUaGUgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhvc2UgcHJvdmlkZWQuXG4gKiBAcGFyYW0ge0FycmF5fSBob2xkZXJzIFRoZSBgcGFydGlhbHNgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW1zIHtib29sZWFufSBbaXNDdXJyaWVkXSBTcGVjaWZ5IGNvbXBvc2luZyBmb3IgYSBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgY29tcG9zZWQgYXJndW1lbnRzLlxuICovXG5mdW5jdGlvbiBjb21wb3NlQXJncyhhcmdzLCBwYXJ0aWFscywgaG9sZGVycywgaXNDdXJyaWVkKSB7XG4gIHZhciBhcmdzSW5kZXggPSAtMSxcbiAgICAgIGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCxcbiAgICAgIGhvbGRlcnNMZW5ndGggPSBob2xkZXJzLmxlbmd0aCxcbiAgICAgIGxlZnRJbmRleCA9IC0xLFxuICAgICAgbGVmdExlbmd0aCA9IHBhcnRpYWxzLmxlbmd0aCxcbiAgICAgIHJhbmdlTGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3NMZW5ndGggLSBob2xkZXJzTGVuZ3RoLCAwKSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlZnRMZW5ndGggKyByYW5nZUxlbmd0aCksXG4gICAgICBpc1VuY3VycmllZCA9ICFpc0N1cnJpZWQ7XG5cbiAgd2hpbGUgKCsrbGVmdEluZGV4IDwgbGVmdExlbmd0aCkge1xuICAgIHJlc3VsdFtsZWZ0SW5kZXhdID0gcGFydGlhbHNbbGVmdEluZGV4XTtcbiAgfVxuICB3aGlsZSAoKythcmdzSW5kZXggPCBob2xkZXJzTGVuZ3RoKSB7XG4gICAgaWYgKGlzVW5jdXJyaWVkIHx8IGFyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtob2xkZXJzW2FyZ3NJbmRleF1dID0gYXJnc1thcmdzSW5kZXhdO1xuICAgIH1cbiAgfVxuICB3aGlsZSAocmFuZ2VMZW5ndGgtLSkge1xuICAgIHJlc3VsdFtsZWZ0SW5kZXgrK10gPSBhcmdzW2FyZ3NJbmRleCsrXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvc2VBcmdzO1xuIiwiLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgY29tcG9zZUFyZ3NgIGV4Y2VwdCB0aGF0IHRoZSBhcmd1bWVudHMgY29tcG9zaXRpb25cbiAqIGlzIHRhaWxvcmVkIGZvciBgXy5wYXJ0aWFsUmlnaHRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBwcm92aWRlZCBhcmd1bWVudHMuXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFscyBUaGUgYXJndW1lbnRzIHRvIGFwcGVuZCB0byB0aG9zZSBwcm92aWRlZC5cbiAqIEBwYXJhbSB7QXJyYXl9IGhvbGRlcnMgVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbXMge2Jvb2xlYW59IFtpc0N1cnJpZWRdIFNwZWNpZnkgY29tcG9zaW5nIGZvciBhIGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBjb21wb3NlZCBhcmd1bWVudHMuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VBcmdzUmlnaHQoYXJncywgcGFydGlhbHMsIGhvbGRlcnMsIGlzQ3VycmllZCkge1xuICB2YXIgYXJnc0luZGV4ID0gLTEsXG4gICAgICBhcmdzTGVuZ3RoID0gYXJncy5sZW5ndGgsXG4gICAgICBob2xkZXJzSW5kZXggPSAtMSxcbiAgICAgIGhvbGRlcnNMZW5ndGggPSBob2xkZXJzLmxlbmd0aCxcbiAgICAgIHJpZ2h0SW5kZXggPSAtMSxcbiAgICAgIHJpZ2h0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgcmFuZ2VMZW5ndGggPSBuYXRpdmVNYXgoYXJnc0xlbmd0aCAtIGhvbGRlcnNMZW5ndGgsIDApLFxuICAgICAgcmVzdWx0ID0gQXJyYXkocmFuZ2VMZW5ndGggKyByaWdodExlbmd0aCksXG4gICAgICBpc1VuY3VycmllZCA9ICFpc0N1cnJpZWQ7XG5cbiAgd2hpbGUgKCsrYXJnc0luZGV4IDwgcmFuZ2VMZW5ndGgpIHtcbiAgICByZXN1bHRbYXJnc0luZGV4XSA9IGFyZ3NbYXJnc0luZGV4XTtcbiAgfVxuICB2YXIgb2Zmc2V0ID0gYXJnc0luZGV4O1xuICB3aGlsZSAoKytyaWdodEluZGV4IDwgcmlnaHRMZW5ndGgpIHtcbiAgICByZXN1bHRbb2Zmc2V0ICsgcmlnaHRJbmRleF0gPSBwYXJ0aWFsc1tyaWdodEluZGV4XTtcbiAgfVxuICB3aGlsZSAoKytob2xkZXJzSW5kZXggPCBob2xkZXJzTGVuZ3RoKSB7XG4gICAgaWYgKGlzVW5jdXJyaWVkIHx8IGFyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtvZmZzZXQgKyBob2xkZXJzW2hvbGRlcnNJbmRleF1dID0gYXJnc1thcmdzSW5kZXgrK107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZUFyZ3NSaWdodDtcbiIsIi8qKlxuICogR2V0cyB0aGUgbnVtYmVyIG9mIGBwbGFjZWhvbGRlcmAgb2NjdXJyZW5jZXMgaW4gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgcGxhY2Vob2xkZXIgY291bnQuXG4gKi9cbmZ1bmN0aW9uIGNvdW50SG9sZGVycyhhcnJheSwgcGxhY2Vob2xkZXIpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IDA7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGFycmF5W2xlbmd0aF0gPT09IHBsYWNlaG9sZGVyKSB7XG4gICAgICArK3Jlc3VsdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3VudEhvbGRlcnM7XG4iLCIvKipcbiAqIFRoZSBmdW5jdGlvbiB3aG9zZSBwcm90b3R5cGUgY2hhaW4gc2VxdWVuY2Ugd3JhcHBlcnMgaW5oZXJpdCBmcm9tLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGJhc2VMb2Rhc2goKSB7XG4gIC8vIE5vIG9wZXJhdGlvbiBwZXJmb3JtZWQuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUxvZGFzaDtcbiIsInZhciBiYXNlQ3JlYXRlID0gcmVxdWlyZSgnLi9fYmFzZUNyZWF0ZScpLFxuICAgIGJhc2VMb2Rhc2ggPSByZXF1aXJlKCcuL19iYXNlTG9kYXNoJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHRoZSBtYXhpbXVtIGxlbmd0aCBhbmQgaW5kZXggb2YgYW4gYXJyYXkuICovXG52YXIgTUFYX0FSUkFZX0xFTkdUSCA9IDQyOTQ5NjcyOTU7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGxhenkgd3JhcHBlciBvYmplY3Qgd2hpY2ggd3JhcHMgYHZhbHVlYCB0byBlbmFibGUgbGF6eSBldmFsdWF0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gKi9cbmZ1bmN0aW9uIExhenlXcmFwcGVyKHZhbHVlKSB7XG4gIHRoaXMuX193cmFwcGVkX18gPSB2YWx1ZTtcbiAgdGhpcy5fX2FjdGlvbnNfXyA9IFtdO1xuICB0aGlzLl9fZGlyX18gPSAxO1xuICB0aGlzLl9fZmlsdGVyZWRfXyA9IGZhbHNlO1xuICB0aGlzLl9faXRlcmF0ZWVzX18gPSBbXTtcbiAgdGhpcy5fX3Rha2VDb3VudF9fID0gTUFYX0FSUkFZX0xFTkdUSDtcbiAgdGhpcy5fX3ZpZXdzX18gPSBbXTtcbn1cblxuLy8gRW5zdXJlIGBMYXp5V3JhcHBlcmAgaXMgYW4gaW5zdGFuY2Ugb2YgYGJhc2VMb2Rhc2hgLlxuTGF6eVdyYXBwZXIucHJvdG90eXBlID0gYmFzZUNyZWF0ZShiYXNlTG9kYXNoLnByb3RvdHlwZSk7XG5MYXp5V3JhcHBlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMYXp5V3JhcHBlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBMYXp5V3JhcHBlcjtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8ubm9vcCk7XG4gKiAvLyA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWRdXG4gKi9cbmZ1bmN0aW9uIG5vb3AoKSB7XG4gIC8vIE5vIG9wZXJhdGlvbiBwZXJmb3JtZWQuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbm9vcDtcbiIsInZhciBtZXRhTWFwID0gcmVxdWlyZSgnLi9fbWV0YU1hcCcpLFxuICAgIG5vb3AgPSByZXF1aXJlKCcuL25vb3AnKTtcblxuLyoqXG4gKiBHZXRzIG1ldGFkYXRhIGZvciBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1ldGFkYXRhIGZvciBgZnVuY2AuXG4gKi9cbnZhciBnZXREYXRhID0gIW1ldGFNYXAgPyBub29wIDogZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gbWV0YU1hcC5nZXQoZnVuYyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERhdGE7XG4iLCIvKiogVXNlZCB0byBsb29rdXAgdW5taW5pZmllZCBmdW5jdGlvbiBuYW1lcy4gKi9cbnZhciByZWFsTmFtZXMgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSByZWFsTmFtZXM7XG4iLCJ2YXIgcmVhbE5hbWVzID0gcmVxdWlyZSgnLi9fcmVhbE5hbWVzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmFtZSBvZiBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZnVuY3Rpb24gbmFtZS5cbiAqL1xuZnVuY3Rpb24gZ2V0RnVuY05hbWUoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gKGZ1bmMubmFtZSArICcnKSxcbiAgICAgIGFycmF5ID0gcmVhbE5hbWVzW3Jlc3VsdF0sXG4gICAgICBsZW5ndGggPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlYWxOYW1lcywgcmVzdWx0KSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGRhdGEgPSBhcnJheVtsZW5ndGhdLFxuICAgICAgICBvdGhlckZ1bmMgPSBkYXRhLmZ1bmM7XG4gICAgaWYgKG90aGVyRnVuYyA9PSBudWxsIHx8IG90aGVyRnVuYyA9PSBmdW5jKSB7XG4gICAgICByZXR1cm4gZGF0YS5uYW1lO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEZ1bmNOYW1lO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgYmFzZUxvZGFzaCA9IHJlcXVpcmUoJy4vX2Jhc2VMb2Rhc2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBjb25zdHJ1Y3RvciBmb3IgY3JlYXRpbmcgYGxvZGFzaGAgd3JhcHBlciBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwLlxuICogQHBhcmFtIHtib29sZWFufSBbY2hhaW5BbGxdIEVuYWJsZSBleHBsaWNpdCBtZXRob2QgY2hhaW4gc2VxdWVuY2VzLlxuICovXG5mdW5jdGlvbiBMb2Rhc2hXcmFwcGVyKHZhbHVlLCBjaGFpbkFsbCkge1xuICB0aGlzLl9fd3JhcHBlZF9fID0gdmFsdWU7XG4gIHRoaXMuX19hY3Rpb25zX18gPSBbXTtcbiAgdGhpcy5fX2NoYWluX18gPSAhIWNoYWluQWxsO1xuICB0aGlzLl9faW5kZXhfXyA9IDA7XG4gIHRoaXMuX192YWx1ZXNfXyA9IHVuZGVmaW5lZDtcbn1cblxuTG9kYXNoV3JhcHBlci5wcm90b3R5cGUgPSBiYXNlQ3JlYXRlKGJhc2VMb2Rhc2gucHJvdG90eXBlKTtcbkxvZGFzaFdyYXBwZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTG9kYXNoV3JhcHBlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2Rhc2hXcmFwcGVyO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcbiIsInZhciBMYXp5V3JhcHBlciA9IHJlcXVpcmUoJy4vX0xhenlXcmFwcGVyJyksXG4gICAgTG9kYXNoV3JhcHBlciA9IHJlcXVpcmUoJy4vX0xvZGFzaFdyYXBwZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHdyYXBwZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gd3JhcHBlciBUaGUgd3JhcHBlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB3cmFwcGVyLlxuICovXG5mdW5jdGlvbiB3cmFwcGVyQ2xvbmUod3JhcHBlcikge1xuICBpZiAod3JhcHBlciBpbnN0YW5jZW9mIExhenlXcmFwcGVyKSB7XG4gICAgcmV0dXJuIHdyYXBwZXIuY2xvbmUoKTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gbmV3IExvZGFzaFdyYXBwZXIod3JhcHBlci5fX3dyYXBwZWRfXywgd3JhcHBlci5fX2NoYWluX18pO1xuICByZXN1bHQuX19hY3Rpb25zX18gPSBjb3B5QXJyYXkod3JhcHBlci5fX2FjdGlvbnNfXyk7XG4gIHJlc3VsdC5fX2luZGV4X18gID0gd3JhcHBlci5fX2luZGV4X187XG4gIHJlc3VsdC5fX3ZhbHVlc19fID0gd3JhcHBlci5fX3ZhbHVlc19fO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXJDbG9uZTtcbiIsInZhciBMYXp5V3JhcHBlciA9IHJlcXVpcmUoJy4vX0xhenlXcmFwcGVyJyksXG4gICAgTG9kYXNoV3JhcHBlciA9IHJlcXVpcmUoJy4vX0xvZGFzaFdyYXBwZXInKSxcbiAgICBiYXNlTG9kYXNoID0gcmVxdWlyZSgnLi9fYmFzZUxvZGFzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpLFxuICAgIHdyYXBwZXJDbG9uZSA9IHJlcXVpcmUoJy4vX3dyYXBwZXJDbG9uZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgbG9kYXNoYCBvYmplY3Qgd2hpY2ggd3JhcHMgYHZhbHVlYCB0byBlbmFibGUgaW1wbGljaXQgbWV0aG9kXG4gKiBjaGFpbiBzZXF1ZW5jZXMuIE1ldGhvZHMgdGhhdCBvcGVyYXRlIG9uIGFuZCByZXR1cm4gYXJyYXlzLCBjb2xsZWN0aW9ucyxcbiAqIGFuZCBmdW5jdGlvbnMgY2FuIGJlIGNoYWluZWQgdG9nZXRoZXIuIE1ldGhvZHMgdGhhdCByZXRyaWV2ZSBhIHNpbmdsZSB2YWx1ZVxuICogb3IgbWF5IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZSB3aWxsIGF1dG9tYXRpY2FsbHkgZW5kIHRoZSBjaGFpbiBzZXF1ZW5jZVxuICogYW5kIHJldHVybiB0aGUgdW53cmFwcGVkIHZhbHVlLiBPdGhlcndpc2UsIHRoZSB2YWx1ZSBtdXN0IGJlIHVud3JhcHBlZFxuICogd2l0aCBgXyN2YWx1ZWAuXG4gKlxuICogRXhwbGljaXQgY2hhaW4gc2VxdWVuY2VzLCB3aGljaCBtdXN0IGJlIHVud3JhcHBlZCB3aXRoIGBfI3ZhbHVlYCwgbWF5IGJlXG4gKiBlbmFibGVkIHVzaW5nIGBfLmNoYWluYC5cbiAqXG4gKiBUaGUgZXhlY3V0aW9uIG9mIGNoYWluZWQgbWV0aG9kcyBpcyBsYXp5LCB0aGF0IGlzLCBpdCdzIGRlZmVycmVkIHVudGlsXG4gKiBgXyN2YWx1ZWAgaXMgaW1wbGljaXRseSBvciBleHBsaWNpdGx5IGNhbGxlZC5cbiAqXG4gKiBMYXp5IGV2YWx1YXRpb24gYWxsb3dzIHNldmVyYWwgbWV0aG9kcyB0byBzdXBwb3J0IHNob3J0Y3V0IGZ1c2lvbi5cbiAqIFNob3J0Y3V0IGZ1c2lvbiBpcyBhbiBvcHRpbWl6YXRpb24gdG8gbWVyZ2UgaXRlcmF0ZWUgY2FsbHM7IHRoaXMgYXZvaWRzXG4gKiB0aGUgY3JlYXRpb24gb2YgaW50ZXJtZWRpYXRlIGFycmF5cyBhbmQgY2FuIGdyZWF0bHkgcmVkdWNlIHRoZSBudW1iZXIgb2ZcbiAqIGl0ZXJhdGVlIGV4ZWN1dGlvbnMuIFNlY3Rpb25zIG9mIGEgY2hhaW4gc2VxdWVuY2UgcXVhbGlmeSBmb3Igc2hvcnRjdXRcbiAqIGZ1c2lvbiBpZiB0aGUgc2VjdGlvbiBpcyBhcHBsaWVkIHRvIGFuIGFycmF5IGFuZCBpdGVyYXRlZXMgYWNjZXB0IG9ubHlcbiAqIG9uZSBhcmd1bWVudC4gVGhlIGhldXJpc3RpYyBmb3Igd2hldGhlciBhIHNlY3Rpb24gcXVhbGlmaWVzIGZvciBzaG9ydGN1dFxuICogZnVzaW9uIGlzIHN1YmplY3QgdG8gY2hhbmdlLlxuICpcbiAqIENoYWluaW5nIGlzIHN1cHBvcnRlZCBpbiBjdXN0b20gYnVpbGRzIGFzIGxvbmcgYXMgdGhlIGBfI3ZhbHVlYCBtZXRob2QgaXNcbiAqIGRpcmVjdGx5IG9yIGluZGlyZWN0bHkgaW5jbHVkZWQgaW4gdGhlIGJ1aWxkLlxuICpcbiAqIEluIGFkZGl0aW9uIHRvIGxvZGFzaCBtZXRob2RzLCB3cmFwcGVycyBoYXZlIGBBcnJheWAgYW5kIGBTdHJpbmdgIG1ldGhvZHMuXG4gKlxuICogVGhlIHdyYXBwZXIgYEFycmF5YCBtZXRob2RzIGFyZTpcbiAqIGBjb25jYXRgLCBgam9pbmAsIGBwb3BgLCBgcHVzaGAsIGBzaGlmdGAsIGBzb3J0YCwgYHNwbGljZWAsIGFuZCBgdW5zaGlmdGBcbiAqXG4gKiBUaGUgd3JhcHBlciBgU3RyaW5nYCBtZXRob2RzIGFyZTpcbiAqIGByZXBsYWNlYCBhbmQgYHNwbGl0YFxuICpcbiAqIFRoZSB3cmFwcGVyIG1ldGhvZHMgdGhhdCBzdXBwb3J0IHNob3J0Y3V0IGZ1c2lvbiBhcmU6XG4gKiBgYXRgLCBgY29tcGFjdGAsIGBkcm9wYCwgYGRyb3BSaWdodGAsIGBkcm9wV2hpbGVgLCBgZmlsdGVyYCwgYGZpbmRgLFxuICogYGZpbmRMYXN0YCwgYGhlYWRgLCBgaW5pdGlhbGAsIGBsYXN0YCwgYG1hcGAsIGByZWplY3RgLCBgcmV2ZXJzZWAsIGBzbGljZWAsXG4gKiBgdGFpbGAsIGB0YWtlYCwgYHRha2VSaWdodGAsIGB0YWtlUmlnaHRXaGlsZWAsIGB0YWtlV2hpbGVgLCBhbmQgYHRvQXJyYXlgXG4gKlxuICogVGhlIGNoYWluYWJsZSB3cmFwcGVyIG1ldGhvZHMgYXJlOlxuICogYGFmdGVyYCwgYGFyeWAsIGBhc3NpZ25gLCBgYXNzaWduSW5gLCBgYXNzaWduSW5XaXRoYCwgYGFzc2lnbldpdGhgLCBgYXRgLFxuICogYGJlZm9yZWAsIGBiaW5kYCwgYGJpbmRBbGxgLCBgYmluZEtleWAsIGBjYXN0QXJyYXlgLCBgY2hhaW5gLCBgY2h1bmtgLFxuICogYGNvbW1pdGAsIGBjb21wYWN0YCwgYGNvbmNhdGAsIGBjb25mb3Jtc2AsIGBjb25zdGFudGAsIGBjb3VudEJ5YCwgYGNyZWF0ZWAsXG4gKiBgY3VycnlgLCBgZGVib3VuY2VgLCBgZGVmYXVsdHNgLCBgZGVmYXVsdHNEZWVwYCwgYGRlZmVyYCwgYGRlbGF5YCxcbiAqIGBkaWZmZXJlbmNlYCwgYGRpZmZlcmVuY2VCeWAsIGBkaWZmZXJlbmNlV2l0aGAsIGBkcm9wYCwgYGRyb3BSaWdodGAsXG4gKiBgZHJvcFJpZ2h0V2hpbGVgLCBgZHJvcFdoaWxlYCwgYGV4dGVuZGAsIGBleHRlbmRXaXRoYCwgYGZpbGxgLCBgZmlsdGVyYCxcbiAqIGBmbGF0TWFwYCwgYGZsYXRNYXBEZWVwYCwgYGZsYXRNYXBEZXB0aGAsIGBmbGF0dGVuYCwgYGZsYXR0ZW5EZWVwYCxcbiAqIGBmbGF0dGVuRGVwdGhgLCBgZmxpcGAsIGBmbG93YCwgYGZsb3dSaWdodGAsIGBmcm9tUGFpcnNgLCBgZnVuY3Rpb25zYCxcbiAqIGBmdW5jdGlvbnNJbmAsIGBncm91cEJ5YCwgYGluaXRpYWxgLCBgaW50ZXJzZWN0aW9uYCwgYGludGVyc2VjdGlvbkJ5YCxcbiAqIGBpbnRlcnNlY3Rpb25XaXRoYCwgYGludmVydGAsIGBpbnZlcnRCeWAsIGBpbnZva2VNYXBgLCBgaXRlcmF0ZWVgLCBga2V5QnlgLFxuICogYGtleXNgLCBga2V5c0luYCwgYG1hcGAsIGBtYXBLZXlzYCwgYG1hcFZhbHVlc2AsIGBtYXRjaGVzYCwgYG1hdGNoZXNQcm9wZXJ0eWAsXG4gKiBgbWVtb2l6ZWAsIGBtZXJnZWAsIGBtZXJnZVdpdGhgLCBgbWV0aG9kYCwgYG1ldGhvZE9mYCwgYG1peGluYCwgYG5lZ2F0ZWAsXG4gKiBgbnRoQXJnYCwgYG9taXRgLCBgb21pdEJ5YCwgYG9uY2VgLCBgb3JkZXJCeWAsIGBvdmVyYCwgYG92ZXJBcmdzYCxcbiAqIGBvdmVyRXZlcnlgLCBgb3ZlclNvbWVgLCBgcGFydGlhbGAsIGBwYXJ0aWFsUmlnaHRgLCBgcGFydGl0aW9uYCwgYHBpY2tgLFxuICogYHBpY2tCeWAsIGBwbGFudGAsIGBwcm9wZXJ0eWAsIGBwcm9wZXJ0eU9mYCwgYHB1bGxgLCBgcHVsbEFsbGAsIGBwdWxsQWxsQnlgLFxuICogYHB1bGxBbGxXaXRoYCwgYHB1bGxBdGAsIGBwdXNoYCwgYHJhbmdlYCwgYHJhbmdlUmlnaHRgLCBgcmVhcmdgLCBgcmVqZWN0YCxcbiAqIGByZW1vdmVgLCBgcmVzdGAsIGByZXZlcnNlYCwgYHNhbXBsZVNpemVgLCBgc2V0YCwgYHNldFdpdGhgLCBgc2h1ZmZsZWAsXG4gKiBgc2xpY2VgLCBgc29ydGAsIGBzb3J0QnlgLCBgc3BsaWNlYCwgYHNwcmVhZGAsIGB0YWlsYCwgYHRha2VgLCBgdGFrZVJpZ2h0YCxcbiAqIGB0YWtlUmlnaHRXaGlsZWAsIGB0YWtlV2hpbGVgLCBgdGFwYCwgYHRocm90dGxlYCwgYHRocnVgLCBgdG9BcnJheWAsXG4gKiBgdG9QYWlyc2AsIGB0b1BhaXJzSW5gLCBgdG9QYXRoYCwgYHRvUGxhaW5PYmplY3RgLCBgdHJhbnNmb3JtYCwgYHVuYXJ5YCxcbiAqIGB1bmlvbmAsIGB1bmlvbkJ5YCwgYHVuaW9uV2l0aGAsIGB1bmlxYCwgYHVuaXFCeWAsIGB1bmlxV2l0aGAsIGB1bnNldGAsXG4gKiBgdW5zaGlmdGAsIGB1bnppcGAsIGB1bnppcFdpdGhgLCBgdXBkYXRlYCwgYHVwZGF0ZVdpdGhgLCBgdmFsdWVzYCxcbiAqIGB2YWx1ZXNJbmAsIGB3aXRob3V0YCwgYHdyYXBgLCBgeG9yYCwgYHhvckJ5YCwgYHhvcldpdGhgLCBgemlwYCxcbiAqIGB6aXBPYmplY3RgLCBgemlwT2JqZWN0RGVlcGAsIGFuZCBgemlwV2l0aGBcbiAqXG4gKiBUaGUgd3JhcHBlciBtZXRob2RzIHRoYXQgYXJlICoqbm90KiogY2hhaW5hYmxlIGJ5IGRlZmF1bHQgYXJlOlxuICogYGFkZGAsIGBhdHRlbXB0YCwgYGNhbWVsQ2FzZWAsIGBjYXBpdGFsaXplYCwgYGNlaWxgLCBgY2xhbXBgLCBgY2xvbmVgLFxuICogYGNsb25lRGVlcGAsIGBjbG9uZURlZXBXaXRoYCwgYGNsb25lV2l0aGAsIGBjb25mb3Jtc1RvYCwgYGRlYnVycmAsXG4gKiBgZGVmYXVsdFRvYCwgYGRpdmlkZWAsIGBlYWNoYCwgYGVhY2hSaWdodGAsIGBlbmRzV2l0aGAsIGBlcWAsIGBlc2NhcGVgLFxuICogYGVzY2FwZVJlZ0V4cGAsIGBldmVyeWAsIGBmaW5kYCwgYGZpbmRJbmRleGAsIGBmaW5kS2V5YCwgYGZpbmRMYXN0YCxcbiAqIGBmaW5kTGFzdEluZGV4YCwgYGZpbmRMYXN0S2V5YCwgYGZpcnN0YCwgYGZsb29yYCwgYGZvckVhY2hgLCBgZm9yRWFjaFJpZ2h0YCxcbiAqIGBmb3JJbmAsIGBmb3JJblJpZ2h0YCwgYGZvck93bmAsIGBmb3JPd25SaWdodGAsIGBnZXRgLCBgZ3RgLCBgZ3RlYCwgYGhhc2AsXG4gKiBgaGFzSW5gLCBgaGVhZGAsIGBpZGVudGl0eWAsIGBpbmNsdWRlc2AsIGBpbmRleE9mYCwgYGluUmFuZ2VgLCBgaW52b2tlYCxcbiAqIGBpc0FyZ3VtZW50c2AsIGBpc0FycmF5YCwgYGlzQXJyYXlCdWZmZXJgLCBgaXNBcnJheUxpa2VgLCBgaXNBcnJheUxpa2VPYmplY3RgLFxuICogYGlzQm9vbGVhbmAsIGBpc0J1ZmZlcmAsIGBpc0RhdGVgLCBgaXNFbGVtZW50YCwgYGlzRW1wdHlgLCBgaXNFcXVhbGAsXG4gKiBgaXNFcXVhbFdpdGhgLCBgaXNFcnJvcmAsIGBpc0Zpbml0ZWAsIGBpc0Z1bmN0aW9uYCwgYGlzSW50ZWdlcmAsIGBpc0xlbmd0aGAsXG4gKiBgaXNNYXBgLCBgaXNNYXRjaGAsIGBpc01hdGNoV2l0aGAsIGBpc05hTmAsIGBpc05hdGl2ZWAsIGBpc05pbGAsIGBpc051bGxgLFxuICogYGlzTnVtYmVyYCwgYGlzT2JqZWN0YCwgYGlzT2JqZWN0TGlrZWAsIGBpc1BsYWluT2JqZWN0YCwgYGlzUmVnRXhwYCxcbiAqIGBpc1NhZmVJbnRlZ2VyYCwgYGlzU2V0YCwgYGlzU3RyaW5nYCwgYGlzVW5kZWZpbmVkYCwgYGlzVHlwZWRBcnJheWAsXG4gKiBgaXNXZWFrTWFwYCwgYGlzV2Vha1NldGAsIGBqb2luYCwgYGtlYmFiQ2FzZWAsIGBsYXN0YCwgYGxhc3RJbmRleE9mYCxcbiAqIGBsb3dlckNhc2VgLCBgbG93ZXJGaXJzdGAsIGBsdGAsIGBsdGVgLCBgbWF4YCwgYG1heEJ5YCwgYG1lYW5gLCBgbWVhbkJ5YCxcbiAqIGBtaW5gLCBgbWluQnlgLCBgbXVsdGlwbHlgLCBgbm9Db25mbGljdGAsIGBub29wYCwgYG5vd2AsIGBudGhgLCBgcGFkYCxcbiAqIGBwYWRFbmRgLCBgcGFkU3RhcnRgLCBgcGFyc2VJbnRgLCBgcG9wYCwgYHJhbmRvbWAsIGByZWR1Y2VgLCBgcmVkdWNlUmlnaHRgLFxuICogYHJlcGVhdGAsIGByZXN1bHRgLCBgcm91bmRgLCBgcnVuSW5Db250ZXh0YCwgYHNhbXBsZWAsIGBzaGlmdGAsIGBzaXplYCxcbiAqIGBzbmFrZUNhc2VgLCBgc29tZWAsIGBzb3J0ZWRJbmRleGAsIGBzb3J0ZWRJbmRleEJ5YCwgYHNvcnRlZExhc3RJbmRleGAsXG4gKiBgc29ydGVkTGFzdEluZGV4QnlgLCBgc3RhcnRDYXNlYCwgYHN0YXJ0c1dpdGhgLCBgc3R1YkFycmF5YCwgYHN0dWJGYWxzZWAsXG4gKiBgc3R1Yk9iamVjdGAsIGBzdHViU3RyaW5nYCwgYHN0dWJUcnVlYCwgYHN1YnRyYWN0YCwgYHN1bWAsIGBzdW1CeWAsXG4gKiBgdGVtcGxhdGVgLCBgdGltZXNgLCBgdG9GaW5pdGVgLCBgdG9JbnRlZ2VyYCwgYHRvSlNPTmAsIGB0b0xlbmd0aGAsXG4gKiBgdG9Mb3dlcmAsIGB0b051bWJlcmAsIGB0b1NhZmVJbnRlZ2VyYCwgYHRvU3RyaW5nYCwgYHRvVXBwZXJgLCBgdHJpbWAsXG4gKiBgdHJpbUVuZGAsIGB0cmltU3RhcnRgLCBgdHJ1bmNhdGVgLCBgdW5lc2NhcGVgLCBgdW5pcXVlSWRgLCBgdXBwZXJDYXNlYCxcbiAqIGB1cHBlckZpcnN0YCwgYHZhbHVlYCwgYW5kIGB3b3Jkc2BcbiAqXG4gKiBAbmFtZSBfXG4gKiBAY29uc3RydWN0b3JcbiAqIEBjYXRlZ29yeSBTZXFcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAgaW4gYSBgbG9kYXNoYCBpbnN0YW5jZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICogICByZXR1cm4gbiAqIG47XG4gKiB9XG4gKlxuICogdmFyIHdyYXBwZWQgPSBfKFsxLCAyLCAzXSk7XG4gKlxuICogLy8gUmV0dXJucyBhbiB1bndyYXBwZWQgdmFsdWUuXG4gKiB3cmFwcGVkLnJlZHVjZShfLmFkZCk7XG4gKiAvLyA9PiA2XG4gKlxuICogLy8gUmV0dXJucyBhIHdyYXBwZWQgdmFsdWUuXG4gKiB2YXIgc3F1YXJlcyA9IHdyYXBwZWQubWFwKHNxdWFyZSk7XG4gKlxuICogXy5pc0FycmF5KHNxdWFyZXMpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoc3F1YXJlcy52YWx1ZSgpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gbG9kYXNoKHZhbHVlKSB7XG4gIGlmIChpc09iamVjdExpa2UodmFsdWUpICYmICFpc0FycmF5KHZhbHVlKSAmJiAhKHZhbHVlIGluc3RhbmNlb2YgTGF6eVdyYXBwZXIpKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTG9kYXNoV3JhcHBlcikge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ19fd3JhcHBlZF9fJykpIHtcbiAgICAgIHJldHVybiB3cmFwcGVyQ2xvbmUodmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IExvZGFzaFdyYXBwZXIodmFsdWUpO1xufVxuXG4vLyBFbnN1cmUgd3JhcHBlcnMgYXJlIGluc3RhbmNlcyBvZiBgYmFzZUxvZGFzaGAuXG5sb2Rhc2gucHJvdG90eXBlID0gYmFzZUxvZGFzaC5wcm90b3R5cGU7XG5sb2Rhc2gucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbG9kYXNoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvZGFzaDtcbiIsInZhciBMYXp5V3JhcHBlciA9IHJlcXVpcmUoJy4vX0xhenlXcmFwcGVyJyksXG4gICAgZ2V0RGF0YSA9IHJlcXVpcmUoJy4vX2dldERhdGEnKSxcbiAgICBnZXRGdW5jTmFtZSA9IHJlcXVpcmUoJy4vX2dldEZ1bmNOYW1lJyksXG4gICAgbG9kYXNoID0gcmVxdWlyZSgnLi93cmFwcGVyTG9kYXNoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgYSBsYXp5IGNvdW50ZXJwYXJ0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaGFzIGEgbGF6eSBjb3VudGVycGFydCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGF6aWFibGUoZnVuYykge1xuICB2YXIgZnVuY05hbWUgPSBnZXRGdW5jTmFtZShmdW5jKSxcbiAgICAgIG90aGVyID0gbG9kYXNoW2Z1bmNOYW1lXTtcblxuICBpZiAodHlwZW9mIG90aGVyICE9ICdmdW5jdGlvbicgfHwgIShmdW5jTmFtZSBpbiBMYXp5V3JhcHBlci5wcm90b3R5cGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChmdW5jID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBkYXRhID0gZ2V0RGF0YShvdGhlcik7XG4gIHJldHVybiAhIWRhdGEgJiYgZnVuYyA9PT0gZGF0YVswXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xhemlhYmxlO1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xudmFyIEhPVF9DT1VOVCA9IDgwMCxcbiAgICBIT1RfU1BBTiA9IDE2O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG4gKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcbiAqIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcbiAgdmFyIGNvdW50ID0gMCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcbiAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblxuICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuIiwidmFyIGJhc2VTZXREYXRhID0gcmVxdWlyZSgnLi9fYmFzZVNldERhdGEnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyBtZXRhZGF0YSBmb3IgYGZ1bmNgLlxuICpcbiAqICoqTm90ZToqKiBJZiB0aGlzIGZ1bmN0aW9uIGJlY29tZXMgaG90LCBpLmUuIGlzIGludm9rZWQgYSBsb3QgaW4gYSBzaG9ydFxuICogcGVyaW9kIG9mIHRpbWUsIGl0IHdpbGwgdHJpcCBpdHMgYnJlYWtlciBhbmQgdHJhbnNpdGlvbiB0byBhbiBpZGVudGl0eVxuICogZnVuY3Rpb24gdG8gYXZvaWQgZ2FyYmFnZSBjb2xsZWN0aW9uIHBhdXNlcyBpbiBWOC4gU2VlXG4gKiBbVjggaXNzdWUgMjA3MF0oaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjA3MClcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFzc29jaWF0ZSBtZXRhZGF0YSB3aXRoLlxuICogQHBhcmFtIHsqfSBkYXRhIFRoZSBtZXRhZGF0YS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXREYXRhID0gc2hvcnRPdXQoYmFzZVNldERhdGEpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldERhdGE7XG4iLCIvKiogVXNlZCB0byBtYXRjaCB3cmFwIGRldGFpbCBjb21tZW50cy4gKi9cbnZhciByZVdyYXBEZXRhaWxzID0gL1xce1xcblxcL1xcKiBcXFt3cmFwcGVkIHdpdGggKC4rKVxcXSBcXCovLFxuICAgIHJlU3BsaXREZXRhaWxzID0gLyw/ICYgLztcblxuLyoqXG4gKiBFeHRyYWN0cyB3cmFwcGVyIGRldGFpbHMgZnJvbSB0aGUgYHNvdXJjZWAgYm9keSBjb21tZW50LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc291cmNlIFRoZSBzb3VyY2UgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgd3JhcHBlciBkZXRhaWxzLlxuICovXG5mdW5jdGlvbiBnZXRXcmFwRGV0YWlscyhzb3VyY2UpIHtcbiAgdmFyIG1hdGNoID0gc291cmNlLm1hdGNoKHJlV3JhcERldGFpbHMpO1xuICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXS5zcGxpdChyZVNwbGl0RGV0YWlscykgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRXcmFwRGV0YWlscztcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIHdyYXAgZGV0YWlsIGNvbW1lbnRzLiAqL1xudmFyIHJlV3JhcENvbW1lbnQgPSAvXFx7KD86XFxuXFwvXFwqIFxcW3dyYXBwZWQgd2l0aCAuK1xcXSBcXCpcXC8pP1xcbj8vO1xuXG4vKipcbiAqIEluc2VydHMgd3JhcHBlciBgZGV0YWlsc2AgaW4gYSBjb21tZW50IGF0IHRoZSB0b3Agb2YgdGhlIGBzb3VyY2VgIGJvZHkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2UgVGhlIHNvdXJjZSB0byBtb2RpZnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IGRldGFpbHMgVGhlIGRldGFpbHMgdG8gaW5zZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgbW9kaWZpZWQgc291cmNlLlxuICovXG5mdW5jdGlvbiBpbnNlcnRXcmFwRGV0YWlscyhzb3VyY2UsIGRldGFpbHMpIHtcbiAgdmFyIGxlbmd0aCA9IGRldGFpbHMubGVuZ3RoO1xuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGxlbmd0aCAtIDE7XG4gIGRldGFpbHNbbGFzdEluZGV4XSA9IChsZW5ndGggPiAxID8gJyYgJyA6ICcnKSArIGRldGFpbHNbbGFzdEluZGV4XTtcbiAgZGV0YWlscyA9IGRldGFpbHMuam9pbihsZW5ndGggPiAyID8gJywgJyA6ICcgJyk7XG4gIHJldHVybiBzb3VyY2UucmVwbGFjZShyZVdyYXBDb21tZW50LCAne1xcbi8qIFt3cmFwcGVkIHdpdGggJyArIGRldGFpbHMgKyAnXSAqL1xcbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFdyYXBEZXRhaWxzO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwidmFyIGNvbnN0YW50ID0gcmVxdWlyZSgnLi9jb25zdGFudCcpLFxuICAgIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuIiwidmFyIGJhc2VTZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VTZXRUb1N0cmluZycpLFxuICAgIHNob3J0T3V0ID0gcmVxdWlyZSgnLi9fc2hvcnRPdXQnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZXRUb1N0cmluZztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblxuICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZEluZGV4O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcbiAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcbiIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG4iLCJ2YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmNsdWRlc2AgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBzcGVjaWZ5aW5nIGFuIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHRhcmdldGAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCAwKSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5SW5jbHVkZXM7XG4iLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXJyYXlJbmNsdWRlcyA9IHJlcXVpcmUoJy4vX2FycmF5SW5jbHVkZXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9CSU5EX0ZMQUcgPSAxLFxuICAgIFdSQVBfQklORF9LRVlfRkxBRyA9IDIsXG4gICAgV1JBUF9DVVJSWV9GTEFHID0gOCxcbiAgICBXUkFQX0NVUlJZX1JJR0hUX0ZMQUcgPSAxNixcbiAgICBXUkFQX1BBUlRJQUxfRkxBRyA9IDMyLFxuICAgIFdSQVBfUEFSVElBTF9SSUdIVF9GTEFHID0gNjQsXG4gICAgV1JBUF9BUllfRkxBRyA9IDEyOCxcbiAgICBXUkFQX1JFQVJHX0ZMQUcgPSAyNTYsXG4gICAgV1JBUF9GTElQX0ZMQUcgPSA1MTI7XG5cbi8qKiBVc2VkIHRvIGFzc29jaWF0ZSB3cmFwIG1ldGhvZHMgd2l0aCB0aGVpciBiaXQgZmxhZ3MuICovXG52YXIgd3JhcEZsYWdzID0gW1xuICBbJ2FyeScsIFdSQVBfQVJZX0ZMQUddLFxuICBbJ2JpbmQnLCBXUkFQX0JJTkRfRkxBR10sXG4gIFsnYmluZEtleScsIFdSQVBfQklORF9LRVlfRkxBR10sXG4gIFsnY3VycnknLCBXUkFQX0NVUlJZX0ZMQUddLFxuICBbJ2N1cnJ5UmlnaHQnLCBXUkFQX0NVUlJZX1JJR0hUX0ZMQUddLFxuICBbJ2ZsaXAnLCBXUkFQX0ZMSVBfRkxBR10sXG4gIFsncGFydGlhbCcsIFdSQVBfUEFSVElBTF9GTEFHXSxcbiAgWydwYXJ0aWFsUmlnaHQnLCBXUkFQX1BBUlRJQUxfUklHSFRfRkxBR10sXG4gIFsncmVhcmcnLCBXUkFQX1JFQVJHX0ZMQUddXG5dO1xuXG4vKipcbiAqIFVwZGF0ZXMgd3JhcHBlciBgZGV0YWlsc2AgYmFzZWQgb24gYGJpdG1hc2tgIGZsYWdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7QXJyYXl9IGRldGFpbHMgVGhlIGRldGFpbHMgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgY3JlYXRlV3JhcGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgZGV0YWlsc2AuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVdyYXBEZXRhaWxzKGRldGFpbHMsIGJpdG1hc2spIHtcbiAgYXJyYXlFYWNoKHdyYXBGbGFncywgZnVuY3Rpb24ocGFpcikge1xuICAgIHZhciB2YWx1ZSA9ICdfLicgKyBwYWlyWzBdO1xuICAgIGlmICgoYml0bWFzayAmIHBhaXJbMV0pICYmICFhcnJheUluY2x1ZGVzKGRldGFpbHMsIHZhbHVlKSkge1xuICAgICAgZGV0YWlscy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGV0YWlscy5zb3J0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlV3JhcERldGFpbHM7XG4iLCJ2YXIgZ2V0V3JhcERldGFpbHMgPSByZXF1aXJlKCcuL19nZXRXcmFwRGV0YWlscycpLFxuICAgIGluc2VydFdyYXBEZXRhaWxzID0gcmVxdWlyZSgnLi9faW5zZXJ0V3JhcERldGFpbHMnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyksXG4gICAgdXBkYXRlV3JhcERldGFpbHMgPSByZXF1aXJlKCcuL191cGRhdGVXcmFwRGV0YWlscycpO1xuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGB3cmFwcGVyYCB0byBtaW1pYyB0aGUgc291cmNlIG9mIGByZWZlcmVuY2VgXG4gKiB3aXRoIHdyYXBwZXIgZGV0YWlscyBpbiBhIGNvbW1lbnQgYXQgdGhlIHRvcCBvZiB0aGUgc291cmNlIGJvZHkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHdyYXBwZXIgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZmVyZW5jZSBUaGUgcmVmZXJlbmNlIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgY3JlYXRlV3JhcGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgd3JhcHBlcmAuXG4gKi9cbmZ1bmN0aW9uIHNldFdyYXBUb1N0cmluZyh3cmFwcGVyLCByZWZlcmVuY2UsIGJpdG1hc2spIHtcbiAgdmFyIHNvdXJjZSA9IChyZWZlcmVuY2UgKyAnJyk7XG4gIHJldHVybiBzZXRUb1N0cmluZyh3cmFwcGVyLCBpbnNlcnRXcmFwRGV0YWlscyhzb3VyY2UsIHVwZGF0ZVdyYXBEZXRhaWxzKGdldFdyYXBEZXRhaWxzKHNvdXJjZSksIGJpdG1hc2spKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0V3JhcFRvU3RyaW5nO1xuIiwidmFyIGlzTGF6aWFibGUgPSByZXF1aXJlKCcuL19pc0xhemlhYmxlJyksXG4gICAgc2V0RGF0YSA9IHJlcXVpcmUoJy4vX3NldERhdGEnKSxcbiAgICBzZXRXcmFwVG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRXcmFwVG9TdHJpbmcnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9CSU5EX0ZMQUcgPSAxLFxuICAgIFdSQVBfQklORF9LRVlfRkxBRyA9IDIsXG4gICAgV1JBUF9DVVJSWV9CT1VORF9GTEFHID0gNCxcbiAgICBXUkFQX0NVUlJZX0ZMQUcgPSA4LFxuICAgIFdSQVBfUEFSVElBTF9GTEFHID0gMzIsXG4gICAgV1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUcgPSA2NDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gY29udGludWUgY3VycnlpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBjcmVhdGVXcmFwYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gd3JhcEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgYGZ1bmNgIHdyYXBwZXIuXG4gKiBAcGFyYW0geyp9IHBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZCB0b1xuICogIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc10gVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdQb3NdIFRoZSBhcmd1bWVudCBwb3NpdGlvbnMgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJ5XSBUaGUgYXJpdHkgY2FwIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHldIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVSZWN1cnJ5KGZ1bmMsIGJpdG1hc2ssIHdyYXBGdW5jLCBwbGFjZWhvbGRlciwgdGhpc0FyZywgcGFydGlhbHMsIGhvbGRlcnMsIGFyZ1BvcywgYXJ5LCBhcml0eSkge1xuICB2YXIgaXNDdXJyeSA9IGJpdG1hc2sgJiBXUkFQX0NVUlJZX0ZMQUcsXG4gICAgICBuZXdIb2xkZXJzID0gaXNDdXJyeSA/IGhvbGRlcnMgOiB1bmRlZmluZWQsXG4gICAgICBuZXdIb2xkZXJzUmlnaHQgPSBpc0N1cnJ5ID8gdW5kZWZpbmVkIDogaG9sZGVycyxcbiAgICAgIG5ld1BhcnRpYWxzID0gaXNDdXJyeSA/IHBhcnRpYWxzIDogdW5kZWZpbmVkLFxuICAgICAgbmV3UGFydGlhbHNSaWdodCA9IGlzQ3VycnkgPyB1bmRlZmluZWQgOiBwYXJ0aWFscztcblxuICBiaXRtYXNrIHw9IChpc0N1cnJ5ID8gV1JBUF9QQVJUSUFMX0ZMQUcgOiBXUkFQX1BBUlRJQUxfUklHSFRfRkxBRyk7XG4gIGJpdG1hc2sgJj0gfihpc0N1cnJ5ID8gV1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUcgOiBXUkFQX1BBUlRJQUxfRkxBRyk7XG5cbiAgaWYgKCEoYml0bWFzayAmIFdSQVBfQ1VSUllfQk9VTkRfRkxBRykpIHtcbiAgICBiaXRtYXNrICY9IH4oV1JBUF9CSU5EX0ZMQUcgfCBXUkFQX0JJTkRfS0VZX0ZMQUcpO1xuICB9XG4gIHZhciBuZXdEYXRhID0gW1xuICAgIGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIG5ld1BhcnRpYWxzLCBuZXdIb2xkZXJzLCBuZXdQYXJ0aWFsc1JpZ2h0LFxuICAgIG5ld0hvbGRlcnNSaWdodCwgYXJnUG9zLCBhcnksIGFyaXR5XG4gIF07XG5cbiAgdmFyIHJlc3VsdCA9IHdyYXBGdW5jLmFwcGx5KHVuZGVmaW5lZCwgbmV3RGF0YSk7XG4gIGlmIChpc0xhemlhYmxlKGZ1bmMpKSB7XG4gICAgc2V0RGF0YShyZXN1bHQsIG5ld0RhdGEpO1xuICB9XG4gIHJlc3VsdC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuICByZXR1cm4gc2V0V3JhcFRvU3RyaW5nKHJlc3VsdCwgZnVuYywgYml0bWFzayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmVjdXJyeTtcbiIsIi8qKlxuICogR2V0cyB0aGUgYXJndW1lbnQgcGxhY2Vob2xkZXIgdmFsdWUgZm9yIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwbGFjZWhvbGRlciB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0SG9sZGVyKGZ1bmMpIHtcbiAgdmFyIG9iamVjdCA9IGZ1bmM7XG4gIHJldHVybiBvYmplY3QucGxhY2Vob2xkZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0SG9sZGVyO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIFJlb3JkZXIgYGFycmF5YCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCBpbmRleGVzIHdoZXJlIHRoZSBlbGVtZW50IGF0XG4gKiB0aGUgZmlyc3QgaW5kZXggaXMgYXNzaWduZWQgYXMgdGhlIGZpcnN0IGVsZW1lbnQsIHRoZSBlbGVtZW50IGF0XG4gKiB0aGUgc2Vjb25kIGluZGV4IGlzIGFzc2lnbmVkIGFzIHRoZSBzZWNvbmQgZWxlbWVudCwgYW5kIHNvIG9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcmVvcmRlci5cbiAqIEBwYXJhbSB7QXJyYXl9IGluZGV4ZXMgVGhlIGFycmFuZ2VkIGFycmF5IGluZGV4ZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gcmVvcmRlcihhcnJheSwgaW5kZXhlcykge1xuICB2YXIgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gbmF0aXZlTWluKGluZGV4ZXMubGVuZ3RoLCBhcnJMZW5ndGgpLFxuICAgICAgb2xkQXJyYXkgPSBjb3B5QXJyYXkoYXJyYXkpO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHZhciBpbmRleCA9IGluZGV4ZXNbbGVuZ3RoXTtcbiAgICBhcnJheVtsZW5ndGhdID0gaXNJbmRleChpbmRleCwgYXJyTGVuZ3RoKSA/IG9sZEFycmF5W2luZGV4XSA6IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVvcmRlcjtcbiIsIi8qKiBVc2VkIGFzIHRoZSBpbnRlcm5hbCBhcmd1bWVudCBwbGFjZWhvbGRlci4gKi9cbnZhciBQTEFDRUhPTERFUiA9ICdfX2xvZGFzaF9wbGFjZWhvbGRlcl9fJztcblxuLyoqXG4gKiBSZXBsYWNlcyBhbGwgYHBsYWNlaG9sZGVyYCBlbGVtZW50cyBpbiBgYXJyYXlgIHdpdGggYW4gaW50ZXJuYWwgcGxhY2Vob2xkZXJcbiAqIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIHRoZWlyIGluZGV4ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0geyp9IHBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciB0byByZXBsYWNlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZUhvbGRlcnMoYXJyYXksIHBsYWNlaG9sZGVyKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHZhbHVlID09PSBwbGFjZWhvbGRlciB8fCB2YWx1ZSA9PT0gUExBQ0VIT0xERVIpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IFBMQUNFSE9MREVSO1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwbGFjZUhvbGRlcnM7XG4iLCJ2YXIgY29tcG9zZUFyZ3MgPSByZXF1aXJlKCcuL19jb21wb3NlQXJncycpLFxuICAgIGNvbXBvc2VBcmdzUmlnaHQgPSByZXF1aXJlKCcuL19jb21wb3NlQXJnc1JpZ2h0JyksXG4gICAgY291bnRIb2xkZXJzID0gcmVxdWlyZSgnLi9fY291bnRIb2xkZXJzJyksXG4gICAgY3JlYXRlQ3RvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUN0b3InKSxcbiAgICBjcmVhdGVSZWN1cnJ5ID0gcmVxdWlyZSgnLi9fY3JlYXRlUmVjdXJyeScpLFxuICAgIGdldEhvbGRlciA9IHJlcXVpcmUoJy4vX2dldEhvbGRlcicpLFxuICAgIHJlb3JkZXIgPSByZXF1aXJlKCcuL19yZW9yZGVyJyksXG4gICAgcmVwbGFjZUhvbGRlcnMgPSByZXF1aXJlKCcuL19yZXBsYWNlSG9sZGVycycpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGZ1bmN0aW9uIG1ldGFkYXRhLiAqL1xudmFyIFdSQVBfQklORF9GTEFHID0gMSxcbiAgICBXUkFQX0JJTkRfS0VZX0ZMQUcgPSAyLFxuICAgIFdSQVBfQ1VSUllfRkxBRyA9IDgsXG4gICAgV1JBUF9DVVJSWV9SSUdIVF9GTEFHID0gMTYsXG4gICAgV1JBUF9BUllfRkxBRyA9IDEyOCxcbiAgICBXUkFQX0ZMSVBfRkxBRyA9IDUxMjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gaW52b2tlIGl0IHdpdGggb3B0aW9uYWwgYHRoaXNgXG4gKiBiaW5kaW5nIG9mIGB0aGlzQXJnYCwgcGFydGlhbCBhcHBsaWNhdGlvbiwgYW5kIGN1cnJ5aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZnVuYyBUaGUgZnVuY3Rpb24gb3IgbWV0aG9kIG5hbWUgdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxzXSBUaGUgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhvc2UgcHJvdmlkZWQgdG9cbiAqICB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHBhcmFtIHtBcnJheX0gW2hvbGRlcnNdIFRoZSBgcGFydGlhbHNgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNSaWdodF0gVGhlIGFyZ3VtZW50cyB0byBhcHBlbmQgdG8gdGhvc2UgcHJvdmlkZWRcbiAqICB0byB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHBhcmFtIHtBcnJheX0gW2hvbGRlcnNSaWdodF0gVGhlIGBwYXJ0aWFsc1JpZ2h0YCBwbGFjZWhvbGRlciBpbmRleGVzLlxuICogQHBhcmFtIHtBcnJheX0gW2FyZ1Bvc10gVGhlIGFyZ3VtZW50IHBvc2l0aW9ucyBvZiB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcnldIFRoZSBhcml0eSBjYXAgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcml0eV0gVGhlIGFyaXR5IG9mIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUh5YnJpZChmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycywgcGFydGlhbHNSaWdodCwgaG9sZGVyc1JpZ2h0LCBhcmdQb3MsIGFyeSwgYXJpdHkpIHtcbiAgdmFyIGlzQXJ5ID0gYml0bWFzayAmIFdSQVBfQVJZX0ZMQUcsXG4gICAgICBpc0JpbmQgPSBiaXRtYXNrICYgV1JBUF9CSU5EX0ZMQUcsXG4gICAgICBpc0JpbmRLZXkgPSBiaXRtYXNrICYgV1JBUF9CSU5EX0tFWV9GTEFHLFxuICAgICAgaXNDdXJyaWVkID0gYml0bWFzayAmIChXUkFQX0NVUlJZX0ZMQUcgfCBXUkFQX0NVUlJZX1JJR0hUX0ZMQUcpLFxuICAgICAgaXNGbGlwID0gYml0bWFzayAmIFdSQVBfRkxJUF9GTEFHLFxuICAgICAgQ3RvciA9IGlzQmluZEtleSA/IHVuZGVmaW5lZCA6IGNyZWF0ZUN0b3IoZnVuYyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgYXJncyA9IEFycmF5KGxlbmd0aCksXG4gICAgICAgIGluZGV4ID0gbGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIGFyZ3NbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICB9XG4gICAgaWYgKGlzQ3VycmllZCkge1xuICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZ2V0SG9sZGVyKHdyYXBwZXIpLFxuICAgICAgICAgIGhvbGRlcnNDb3VudCA9IGNvdW50SG9sZGVycyhhcmdzLCBwbGFjZWhvbGRlcik7XG4gICAgfVxuICAgIGlmIChwYXJ0aWFscykge1xuICAgICAgYXJncyA9IGNvbXBvc2VBcmdzKGFyZ3MsIHBhcnRpYWxzLCBob2xkZXJzLCBpc0N1cnJpZWQpO1xuICAgIH1cbiAgICBpZiAocGFydGlhbHNSaWdodCkge1xuICAgICAgYXJncyA9IGNvbXBvc2VBcmdzUmlnaHQoYXJncywgcGFydGlhbHNSaWdodCwgaG9sZGVyc1JpZ2h0LCBpc0N1cnJpZWQpO1xuICAgIH1cbiAgICBsZW5ndGggLT0gaG9sZGVyc0NvdW50O1xuICAgIGlmIChpc0N1cnJpZWQgJiYgbGVuZ3RoIDwgYXJpdHkpIHtcbiAgICAgIHZhciBuZXdIb2xkZXJzID0gcmVwbGFjZUhvbGRlcnMoYXJncywgcGxhY2Vob2xkZXIpO1xuICAgICAgcmV0dXJuIGNyZWF0ZVJlY3VycnkoXG4gICAgICAgIGZ1bmMsIGJpdG1hc2ssIGNyZWF0ZUh5YnJpZCwgd3JhcHBlci5wbGFjZWhvbGRlciwgdGhpc0FyZyxcbiAgICAgICAgYXJncywgbmV3SG9sZGVycywgYXJnUG9zLCBhcnksIGFyaXR5IC0gbGVuZ3RoXG4gICAgICApO1xuICAgIH1cbiAgICB2YXIgdGhpc0JpbmRpbmcgPSBpc0JpbmQgPyB0aGlzQXJnIDogdGhpcyxcbiAgICAgICAgZm4gPSBpc0JpbmRLZXkgPyB0aGlzQmluZGluZ1tmdW5jXSA6IGZ1bmM7XG5cbiAgICBsZW5ndGggPSBhcmdzLmxlbmd0aDtcbiAgICBpZiAoYXJnUG9zKSB7XG4gICAgICBhcmdzID0gcmVvcmRlcihhcmdzLCBhcmdQb3MpO1xuICAgIH0gZWxzZSBpZiAoaXNGbGlwICYmIGxlbmd0aCA+IDEpIHtcbiAgICAgIGFyZ3MucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBpZiAoaXNBcnkgJiYgYXJ5IDwgbGVuZ3RoKSB7XG4gICAgICBhcmdzLmxlbmd0aCA9IGFyeTtcbiAgICB9XG4gICAgaWYgKHRoaXMgJiYgdGhpcyAhPT0gcm9vdCAmJiB0aGlzIGluc3RhbmNlb2Ygd3JhcHBlcikge1xuICAgICAgZm4gPSBDdG9yIHx8IGNyZWF0ZUN0b3IoZm4pO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MpO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUh5YnJpZDtcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5JyksXG4gICAgY3JlYXRlQ3RvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUN0b3InKSxcbiAgICBjcmVhdGVIeWJyaWQgPSByZXF1aXJlKCcuL19jcmVhdGVIeWJyaWQnKSxcbiAgICBjcmVhdGVSZWN1cnJ5ID0gcmVxdWlyZSgnLi9fY3JlYXRlUmVjdXJyeScpLFxuICAgIGdldEhvbGRlciA9IHJlcXVpcmUoJy4vX2dldEhvbGRlcicpLFxuICAgIHJlcGxhY2VIb2xkZXJzID0gcmVxdWlyZSgnLi9fcmVwbGFjZUhvbGRlcnMnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBlbmFibGUgY3VycnlpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBjcmVhdGVXcmFwYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtudW1iZXJ9IGFyaXR5IFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVDdXJyeShmdW5jLCBiaXRtYXNrLCBhcml0eSkge1xuICB2YXIgQ3RvciA9IGNyZWF0ZUN0b3IoZnVuYyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgYXJncyA9IEFycmF5KGxlbmd0aCksXG4gICAgICAgIGluZGV4ID0gbGVuZ3RoLFxuICAgICAgICBwbGFjZWhvbGRlciA9IGdldEhvbGRlcih3cmFwcGVyKTtcblxuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICBhcmdzW2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgfVxuICAgIHZhciBob2xkZXJzID0gKGxlbmd0aCA8IDMgJiYgYXJnc1swXSAhPT0gcGxhY2Vob2xkZXIgJiYgYXJnc1tsZW5ndGggLSAxXSAhPT0gcGxhY2Vob2xkZXIpXG4gICAgICA/IFtdXG4gICAgICA6IHJlcGxhY2VIb2xkZXJzKGFyZ3MsIHBsYWNlaG9sZGVyKTtcblxuICAgIGxlbmd0aCAtPSBob2xkZXJzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoIDwgYXJpdHkpIHtcbiAgICAgIHJldHVybiBjcmVhdGVSZWN1cnJ5KFxuICAgICAgICBmdW5jLCBiaXRtYXNrLCBjcmVhdGVIeWJyaWQsIHdyYXBwZXIucGxhY2Vob2xkZXIsIHVuZGVmaW5lZCxcbiAgICAgICAgYXJncywgaG9sZGVycywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGFyaXR5IC0gbGVuZ3RoKTtcbiAgICB9XG4gICAgdmFyIGZuID0gKHRoaXMgJiYgdGhpcyAhPT0gcm9vdCAmJiB0aGlzIGluc3RhbmNlb2Ygd3JhcHBlcikgPyBDdG9yIDogZnVuYztcbiAgICByZXR1cm4gYXBwbHkoZm4sIHRoaXMsIGFyZ3MpO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUN1cnJ5O1xuIiwidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKSxcbiAgICBjcmVhdGVDdG9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQ3RvcicpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGZ1bmN0aW9uIG1ldGFkYXRhLiAqL1xudmFyIFdSQVBfQklORF9GTEFHID0gMTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gaW52b2tlIGl0IHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nXG4gKiBvZiBgdGhpc0FyZ2AgYW5kIGBwYXJ0aWFsc2AgcHJlcGVuZGVkIHRvIHRoZSBhcmd1bWVudHMgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBjcmVhdGVXcmFwYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJ0aWFscyBUaGUgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhvc2UgcHJvdmlkZWQgdG9cbiAqICB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUGFydGlhbChmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscykge1xuICB2YXIgaXNCaW5kID0gYml0bWFzayAmIFdSQVBfQklORF9GTEFHLFxuICAgICAgQ3RvciA9IGNyZWF0ZUN0b3IoZnVuYyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgYXJnc0luZGV4ID0gLTEsXG4gICAgICAgIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICBsZWZ0SW5kZXggPSAtMSxcbiAgICAgICAgbGVmdExlbmd0aCA9IHBhcnRpYWxzLmxlbmd0aCxcbiAgICAgICAgYXJncyA9IEFycmF5KGxlZnRMZW5ndGggKyBhcmdzTGVuZ3RoKSxcbiAgICAgICAgZm4gPSAodGhpcyAmJiB0aGlzICE9PSByb290ICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IEN0b3IgOiBmdW5jO1xuXG4gICAgd2hpbGUgKCsrbGVmdEluZGV4IDwgbGVmdExlbmd0aCkge1xuICAgICAgYXJnc1tsZWZ0SW5kZXhdID0gcGFydGlhbHNbbGVmdEluZGV4XTtcbiAgICB9XG4gICAgd2hpbGUgKGFyZ3NMZW5ndGgtLSkge1xuICAgICAgYXJnc1tsZWZ0SW5kZXgrK10gPSBhcmd1bWVudHNbKythcmdzSW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gYXBwbHkoZm4sIGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzLCBhcmdzKTtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVQYXJ0aWFsO1xuIiwidmFyIGNvbXBvc2VBcmdzID0gcmVxdWlyZSgnLi9fY29tcG9zZUFyZ3MnKSxcbiAgICBjb21wb3NlQXJnc1JpZ2h0ID0gcmVxdWlyZSgnLi9fY29tcG9zZUFyZ3NSaWdodCcpLFxuICAgIHJlcGxhY2VIb2xkZXJzID0gcmVxdWlyZSgnLi9fcmVwbGFjZUhvbGRlcnMnKTtcblxuLyoqIFVzZWQgYXMgdGhlIGludGVybmFsIGFyZ3VtZW50IHBsYWNlaG9sZGVyLiAqL1xudmFyIFBMQUNFSE9MREVSID0gJ19fbG9kYXNoX3BsYWNlaG9sZGVyX18nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBmdW5jdGlvbiBtZXRhZGF0YS4gKi9cbnZhciBXUkFQX0JJTkRfRkxBRyA9IDEsXG4gICAgV1JBUF9CSU5EX0tFWV9GTEFHID0gMixcbiAgICBXUkFQX0NVUlJZX0JPVU5EX0ZMQUcgPSA0LFxuICAgIFdSQVBfQ1VSUllfRkxBRyA9IDgsXG4gICAgV1JBUF9BUllfRkxBRyA9IDEyOCxcbiAgICBXUkFQX1JFQVJHX0ZMQUcgPSAyNTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBNZXJnZXMgdGhlIGZ1bmN0aW9uIG1ldGFkYXRhIG9mIGBzb3VyY2VgIGludG8gYGRhdGFgLlxuICpcbiAqIE1lcmdpbmcgbWV0YWRhdGEgcmVkdWNlcyB0aGUgbnVtYmVyIG9mIHdyYXBwZXJzIHVzZWQgdG8gaW52b2tlIGEgZnVuY3Rpb24uXG4gKiBUaGlzIGlzIHBvc3NpYmxlIGJlY2F1c2UgbWV0aG9kcyBsaWtlIGBfLmJpbmRgLCBgXy5jdXJyeWAsIGFuZCBgXy5wYXJ0aWFsYFxuICogbWF5IGJlIGFwcGxpZWQgcmVnYXJkbGVzcyBvZiBleGVjdXRpb24gb3JkZXIuIE1ldGhvZHMgbGlrZSBgXy5hcnlgIGFuZFxuICogYF8ucmVhcmdgIG1vZGlmeSBmdW5jdGlvbiBhcmd1bWVudHMsIG1ha2luZyB0aGUgb3JkZXIgaW4gd2hpY2ggdGhleSBhcmVcbiAqIGV4ZWN1dGVkIGltcG9ydGFudCwgcHJldmVudGluZyB0aGUgbWVyZ2luZyBvZiBtZXRhZGF0YS4gSG93ZXZlciwgd2UgbWFrZVxuICogYW4gZXhjZXB0aW9uIGZvciBhIHNhZmUgY29tYmluZWQgY2FzZSB3aGVyZSBjdXJyaWVkIGZ1bmN0aW9ucyBoYXZlIGBfLmFyeWBcbiAqIGFuZCBvciBgXy5yZWFyZ2AgYXBwbGllZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gZGF0YSBUaGUgZGVzdGluYXRpb24gbWV0YWRhdGEuXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIHNvdXJjZSBtZXRhZGF0YS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgZGF0YWAuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlRGF0YShkYXRhLCBzb3VyY2UpIHtcbiAgdmFyIGJpdG1hc2sgPSBkYXRhWzFdLFxuICAgICAgc3JjQml0bWFzayA9IHNvdXJjZVsxXSxcbiAgICAgIG5ld0JpdG1hc2sgPSBiaXRtYXNrIHwgc3JjQml0bWFzayxcbiAgICAgIGlzQ29tbW9uID0gbmV3Qml0bWFzayA8IChXUkFQX0JJTkRfRkxBRyB8IFdSQVBfQklORF9LRVlfRkxBRyB8IFdSQVBfQVJZX0ZMQUcpO1xuXG4gIHZhciBpc0NvbWJvID1cbiAgICAoKHNyY0JpdG1hc2sgPT0gV1JBUF9BUllfRkxBRykgJiYgKGJpdG1hc2sgPT0gV1JBUF9DVVJSWV9GTEFHKSkgfHxcbiAgICAoKHNyY0JpdG1hc2sgPT0gV1JBUF9BUllfRkxBRykgJiYgKGJpdG1hc2sgPT0gV1JBUF9SRUFSR19GTEFHKSAmJiAoZGF0YVs3XS5sZW5ndGggPD0gc291cmNlWzhdKSkgfHxcbiAgICAoKHNyY0JpdG1hc2sgPT0gKFdSQVBfQVJZX0ZMQUcgfCBXUkFQX1JFQVJHX0ZMQUcpKSAmJiAoc291cmNlWzddLmxlbmd0aCA8PSBzb3VyY2VbOF0pICYmIChiaXRtYXNrID09IFdSQVBfQ1VSUllfRkxBRykpO1xuXG4gIC8vIEV4aXQgZWFybHkgaWYgbWV0YWRhdGEgY2FuJ3QgYmUgbWVyZ2VkLlxuICBpZiAoIShpc0NvbW1vbiB8fCBpc0NvbWJvKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYHRoaXNBcmdgIGlmIGF2YWlsYWJsZS5cbiAgaWYgKHNyY0JpdG1hc2sgJiBXUkFQX0JJTkRfRkxBRykge1xuICAgIGRhdGFbMl0gPSBzb3VyY2VbMl07XG4gICAgLy8gU2V0IHdoZW4gY3VycnlpbmcgYSBib3VuZCBmdW5jdGlvbi5cbiAgICBuZXdCaXRtYXNrIHw9IGJpdG1hc2sgJiBXUkFQX0JJTkRfRkxBRyA/IDAgOiBXUkFQX0NVUlJZX0JPVU5EX0ZMQUc7XG4gIH1cbiAgLy8gQ29tcG9zZSBwYXJ0aWFsIGFyZ3VtZW50cy5cbiAgdmFyIHZhbHVlID0gc291cmNlWzNdO1xuICBpZiAodmFsdWUpIHtcbiAgICB2YXIgcGFydGlhbHMgPSBkYXRhWzNdO1xuICAgIGRhdGFbM10gPSBwYXJ0aWFscyA/IGNvbXBvc2VBcmdzKHBhcnRpYWxzLCB2YWx1ZSwgc291cmNlWzRdKSA6IHZhbHVlO1xuICAgIGRhdGFbNF0gPSBwYXJ0aWFscyA/IHJlcGxhY2VIb2xkZXJzKGRhdGFbM10sIFBMQUNFSE9MREVSKSA6IHNvdXJjZVs0XTtcbiAgfVxuICAvLyBDb21wb3NlIHBhcnRpYWwgcmlnaHQgYXJndW1lbnRzLlxuICB2YWx1ZSA9IHNvdXJjZVs1XTtcbiAgaWYgKHZhbHVlKSB7XG4gICAgcGFydGlhbHMgPSBkYXRhWzVdO1xuICAgIGRhdGFbNV0gPSBwYXJ0aWFscyA/IGNvbXBvc2VBcmdzUmlnaHQocGFydGlhbHMsIHZhbHVlLCBzb3VyY2VbNl0pIDogdmFsdWU7XG4gICAgZGF0YVs2XSA9IHBhcnRpYWxzID8gcmVwbGFjZUhvbGRlcnMoZGF0YVs1XSwgUExBQ0VIT0xERVIpIDogc291cmNlWzZdO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYGFyZ1Bvc2AgaWYgYXZhaWxhYmxlLlxuICB2YWx1ZSA9IHNvdXJjZVs3XTtcbiAgaWYgKHZhbHVlKSB7XG4gICAgZGF0YVs3XSA9IHZhbHVlO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYGFyeWAgaWYgaXQncyBzbWFsbGVyLlxuICBpZiAoc3JjQml0bWFzayAmIFdSQVBfQVJZX0ZMQUcpIHtcbiAgICBkYXRhWzhdID0gZGF0YVs4XSA9PSBudWxsID8gc291cmNlWzhdIDogbmF0aXZlTWluKGRhdGFbOF0sIHNvdXJjZVs4XSk7XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgYXJpdHlgIGlmIG9uZSBpcyBub3QgcHJvdmlkZWQuXG4gIGlmIChkYXRhWzldID09IG51bGwpIHtcbiAgICBkYXRhWzldID0gc291cmNlWzldO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYGZ1bmNgIGFuZCBtZXJnZSBiaXRtYXNrcy5cbiAgZGF0YVswXSA9IHNvdXJjZVswXTtcbiAgZGF0YVsxXSA9IG5ld0JpdG1hc2s7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2VEYXRhO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgZmluaXRlIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTIuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvRmluaXRlKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b0Zpbml0ZShJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9GaW5pdGUoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gSU5GSU5JVFkgfHwgdmFsdWUgPT09IC1JTkZJTklUWSkge1xuICAgIHZhciBzaWduID0gKHZhbHVlIDwgMCA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gdmFsdWUgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRmluaXRlO1xuIiwidmFyIHRvRmluaXRlID0gcmVxdWlyZSgnLi90b0Zpbml0ZScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHRvRmluaXRlKHZhbHVlKSxcbiAgICAgIHJlbWFpbmRlciA9IHJlc3VsdCAlIDE7XG5cbiAgcmV0dXJuIHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvSW50ZWdlcjtcbiIsInZhciBiYXNlU2V0RGF0YSA9IHJlcXVpcmUoJy4vX2Jhc2VTZXREYXRhJyksXG4gICAgY3JlYXRlQmluZCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJpbmQnKSxcbiAgICBjcmVhdGVDdXJyeSA9IHJlcXVpcmUoJy4vX2NyZWF0ZUN1cnJ5JyksXG4gICAgY3JlYXRlSHlicmlkID0gcmVxdWlyZSgnLi9fY3JlYXRlSHlicmlkJyksXG4gICAgY3JlYXRlUGFydGlhbCA9IHJlcXVpcmUoJy4vX2NyZWF0ZVBhcnRpYWwnKSxcbiAgICBnZXREYXRhID0gcmVxdWlyZSgnLi9fZ2V0RGF0YScpLFxuICAgIG1lcmdlRGF0YSA9IHJlcXVpcmUoJy4vX21lcmdlRGF0YScpLFxuICAgIHNldERhdGEgPSByZXF1aXJlKCcuL19zZXREYXRhJyksXG4gICAgc2V0V3JhcFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0V3JhcFRvU3RyaW5nJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9CSU5EX0ZMQUcgPSAxLFxuICAgIFdSQVBfQklORF9LRVlfRkxBRyA9IDIsXG4gICAgV1JBUF9DVVJSWV9GTEFHID0gOCxcbiAgICBXUkFQX0NVUlJZX1JJR0hUX0ZMQUcgPSAxNixcbiAgICBXUkFQX1BBUlRJQUxfRkxBRyA9IDMyLFxuICAgIFdSQVBfUEFSVElBTF9SSUdIVF9GTEFHID0gNjQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBlaXRoZXIgY3VycmllcyBvciBpbnZva2VzIGBmdW5jYCB3aXRoIG9wdGlvbmFsXG4gKiBgdGhpc2AgYmluZGluZyBhbmQgcGFydGlhbGx5IGFwcGxpZWQgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZnVuYyBUaGUgZnVuY3Rpb24gb3IgbWV0aG9kIG5hbWUgdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogICAgMSAtIGBfLmJpbmRgXG4gKiAgICAyIC0gYF8uYmluZEtleWBcbiAqICAgIDQgLSBgXy5jdXJyeWAgb3IgYF8uY3VycnlSaWdodGAgb2YgYSBib3VuZCBmdW5jdGlvblxuICogICAgOCAtIGBfLmN1cnJ5YFxuICogICAxNiAtIGBfLmN1cnJ5UmlnaHRgXG4gKiAgIDMyIC0gYF8ucGFydGlhbGBcbiAqICAgNjQgLSBgXy5wYXJ0aWFsUmlnaHRgXG4gKiAgMTI4IC0gYF8ucmVhcmdgXG4gKiAgMjU2IC0gYF8uYXJ5YFxuICogIDUxMiAtIGBfLmZsaXBgXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxzXSBUaGUgYXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICogQHBhcmFtIHtBcnJheX0gW2hvbGRlcnNdIFRoZSBgcGFydGlhbHNgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJnUG9zXSBUaGUgYXJndW1lbnQgcG9zaXRpb25zIG9mIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyeV0gVGhlIGFyaXR5IGNhcCBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5XSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlV3JhcChmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycywgYXJnUG9zLCBhcnksIGFyaXR5KSB7XG4gIHZhciBpc0JpbmRLZXkgPSBiaXRtYXNrICYgV1JBUF9CSU5EX0tFWV9GTEFHO1xuICBpZiAoIWlzQmluZEtleSAmJiB0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBsZW5ndGggPSBwYXJ0aWFscyA/IHBhcnRpYWxzLmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgYml0bWFzayAmPSB+KFdSQVBfUEFSVElBTF9GTEFHIHwgV1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUcpO1xuICAgIHBhcnRpYWxzID0gaG9sZGVycyA9IHVuZGVmaW5lZDtcbiAgfVxuICBhcnkgPSBhcnkgPT09IHVuZGVmaW5lZCA/IGFyeSA6IG5hdGl2ZU1heCh0b0ludGVnZXIoYXJ5KSwgMCk7XG4gIGFyaXR5ID0gYXJpdHkgPT09IHVuZGVmaW5lZCA/IGFyaXR5IDogdG9JbnRlZ2VyKGFyaXR5KTtcbiAgbGVuZ3RoIC09IGhvbGRlcnMgPyBob2xkZXJzLmxlbmd0aCA6IDA7XG5cbiAgaWYgKGJpdG1hc2sgJiBXUkFQX1BBUlRJQUxfUklHSFRfRkxBRykge1xuICAgIHZhciBwYXJ0aWFsc1JpZ2h0ID0gcGFydGlhbHMsXG4gICAgICAgIGhvbGRlcnNSaWdodCA9IGhvbGRlcnM7XG5cbiAgICBwYXJ0aWFscyA9IGhvbGRlcnMgPSB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGRhdGEgPSBpc0JpbmRLZXkgPyB1bmRlZmluZWQgOiBnZXREYXRhKGZ1bmMpO1xuXG4gIHZhciBuZXdEYXRhID0gW1xuICAgIGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzLCBob2xkZXJzLCBwYXJ0aWFsc1JpZ2h0LCBob2xkZXJzUmlnaHQsXG4gICAgYXJnUG9zLCBhcnksIGFyaXR5XG4gIF07XG5cbiAgaWYgKGRhdGEpIHtcbiAgICBtZXJnZURhdGEobmV3RGF0YSwgZGF0YSk7XG4gIH1cbiAgZnVuYyA9IG5ld0RhdGFbMF07XG4gIGJpdG1hc2sgPSBuZXdEYXRhWzFdO1xuICB0aGlzQXJnID0gbmV3RGF0YVsyXTtcbiAgcGFydGlhbHMgPSBuZXdEYXRhWzNdO1xuICBob2xkZXJzID0gbmV3RGF0YVs0XTtcbiAgYXJpdHkgPSBuZXdEYXRhWzldID0gbmV3RGF0YVs5XSA9PT0gdW5kZWZpbmVkXG4gICAgPyAoaXNCaW5kS2V5ID8gMCA6IGZ1bmMubGVuZ3RoKVxuICAgIDogbmF0aXZlTWF4KG5ld0RhdGFbOV0gLSBsZW5ndGgsIDApO1xuXG4gIGlmICghYXJpdHkgJiYgYml0bWFzayAmIChXUkFQX0NVUlJZX0ZMQUcgfCBXUkFQX0NVUlJZX1JJR0hUX0ZMQUcpKSB7XG4gICAgYml0bWFzayAmPSB+KFdSQVBfQ1VSUllfRkxBRyB8IFdSQVBfQ1VSUllfUklHSFRfRkxBRyk7XG4gIH1cbiAgaWYgKCFiaXRtYXNrIHx8IGJpdG1hc2sgPT0gV1JBUF9CSU5EX0ZMQUcpIHtcbiAgICB2YXIgcmVzdWx0ID0gY3JlYXRlQmluZChmdW5jLCBiaXRtYXNrLCB0aGlzQXJnKTtcbiAgfSBlbHNlIGlmIChiaXRtYXNrID09IFdSQVBfQ1VSUllfRkxBRyB8fCBiaXRtYXNrID09IFdSQVBfQ1VSUllfUklHSFRfRkxBRykge1xuICAgIHJlc3VsdCA9IGNyZWF0ZUN1cnJ5KGZ1bmMsIGJpdG1hc2ssIGFyaXR5KTtcbiAgfSBlbHNlIGlmICgoYml0bWFzayA9PSBXUkFQX1BBUlRJQUxfRkxBRyB8fCBiaXRtYXNrID09IChXUkFQX0JJTkRfRkxBRyB8IFdSQVBfUEFSVElBTF9GTEFHKSkgJiYgIWhvbGRlcnMubGVuZ3RoKSB7XG4gICAgcmVzdWx0ID0gY3JlYXRlUGFydGlhbChmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscyk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gY3JlYXRlSHlicmlkLmFwcGx5KHVuZGVmaW5lZCwgbmV3RGF0YSk7XG4gIH1cbiAgdmFyIHNldHRlciA9IGRhdGEgPyBiYXNlU2V0RGF0YSA6IHNldERhdGE7XG4gIHJldHVybiBzZXRXcmFwVG9TdHJpbmcoc2V0dGVyKHJlc3VsdCwgbmV3RGF0YSksIGZ1bmMsIGJpdG1hc2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVdyYXA7XG4iLCJ2YXIgY3JlYXRlV3JhcCA9IHJlcXVpcmUoJy4vX2NyZWF0ZVdyYXAnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9BUllfRkxBRyA9IDEyODtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCwgd2l0aCB1cCB0byBgbmAgYXJndW1lbnRzLFxuICogaWdub3JpbmcgYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gW249ZnVuYy5sZW5ndGhdIFRoZSBhcml0eSBjYXAuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLm1hcChbJzYnLCAnOCcsICcxMCddLCBfLmFyeShwYXJzZUludCwgMSkpO1xuICogLy8gPT4gWzYsIDgsIDEwXVxuICovXG5mdW5jdGlvbiBhcnkoZnVuYywgbiwgZ3VhcmQpIHtcbiAgbiA9IGd1YXJkID8gdW5kZWZpbmVkIDogbjtcbiAgbiA9IChmdW5jICYmIG4gPT0gbnVsbCkgPyBmdW5jLmxlbmd0aCA6IG47XG4gIHJldHVybiBjcmVhdGVXcmFwKGZ1bmMsIFdSQVBfQVJZX0ZMQUcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJ5O1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduVmFsdWU7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyk7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIC8vIFVzZSBgdXRpbC50eXBlc2AgZm9yIE5vZGUuanMgMTArLlxuICAgIHZhciB0eXBlcyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlICYmIGZyZWVNb2R1bGUucmVxdWlyZSgndXRpbCcpLnR5cGVzO1xuXG4gICAgaWYgKHR5cGVzKSB7XG4gICAgICByZXR1cm4gdHlwZXM7XG4gICAgfVxuXG4gICAgLy8gTGVnYWN5IGBwcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKWAgZm9yIE5vZGUuanMgPCAxMC5cbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5hc3NpZ25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ24ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5cyhzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ247XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlRGVsZXRlO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUdldDtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlSGFzO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlU2V0O1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrRGVsZXRlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrR2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0hhcztcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hEZWxldGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoR2V0O1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEhhcztcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaFNldDtcbiIsInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIEhhc2ggPSByZXF1aXJlKCcuL19IYXNoJyksXG4gICAgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUNsZWFyO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5YWJsZTtcbiIsInZhciBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hcERhdGE7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVEZWxldGU7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlR2V0O1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVIYXM7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlU2V0O1xuIiwidmFyIG1hcENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19tYXBDYWNoZUNsZWFyJyksXG4gICAgbWFwQ2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19tYXBDYWNoZURlbGV0ZScpLFxuICAgIG1hcENhY2hlR2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVHZXQnKSxcbiAgICBtYXBDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX21hcENhY2hlSGFzJyksXG4gICAgbWFwQ2FjaGVTZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBDYWNoZTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIHN0YWNrQ2xlYXIgPSByZXF1aXJlKCcuL19zdGFja0NsZWFyJyksXG4gICAgc3RhY2tEZWxldGUgPSByZXF1aXJlKCcuL19zdGFja0RlbGV0ZScpLFxuICAgIHN0YWNrR2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tHZXQnKSxcbiAgICBzdGFja0hhcyA9IHJlcXVpcmUoJy4vX3N0YWNrSGFzJyksXG4gICAgc3RhY2tTZXQgPSByZXF1aXJlKCcuL19zdGFja1NldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuICogW2BPYmplY3Qua2V5c2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZXhjZXB0IHRoYXQgaXQgaW5jbHVkZXMgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gbmF0aXZlS2V5c0luKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzSW47XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXNJbiA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXNJbicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNJbmAgd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5c0luKG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5c0luKG9iamVjdCk7XG4gIH1cbiAgdmFyIGlzUHJvdG8gPSBpc1Byb3RvdHlwZShvYmplY3QpLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzSW47XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5c0luID0gcmVxdWlyZSgnLi9fYmFzZUtleXNJbicpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0LCB0cnVlKSA6IGJhc2VLZXlzSW4ob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbkluYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduSW4ob2JqZWN0LCBzb3VyY2UpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBjb3B5T2JqZWN0KHNvdXJjZSwga2V5c0luKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbkluO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIGFsbG9jVW5zYWZlID0gQnVmZmVyID8gQnVmZmVyLmFsbG9jVW5zYWZlIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiAgYGJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWZmZXIgVGhlIGJ1ZmZlciB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUJ1ZmZlcihidWZmZXIsIGlzRGVlcCkge1xuICBpZiAoaXNEZWVwKSB7XG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZSgpO1xuICB9XG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gYWxsb2NVbnNhZmUgPyBhbGxvY1Vuc2FmZShsZW5ndGgpIDogbmV3IGJ1ZmZlci5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVCdWZmZXI7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlGaWx0ZXI7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJBcnJheTtcbiIsInZhciBhcnJheUZpbHRlciA9IHJlcXVpcmUoJy4vX2FycmF5RmlsdGVyJyksXG4gICAgc3R1YkFycmF5ID0gcmVxdWlyZSgnLi9zdHViQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheUZpbHRlcihuYXRpdmVHZXRTeW1ib2xzKG9iamVjdCksIGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgIHJldHVybiBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHM7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpO1xuXG4vKipcbiAqIENvcGllcyBvd24gc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGdldFByb3RvdHlwZSA9IG92ZXJBcmcoT2JqZWN0LmdldFByb3RvdHlwZU9mLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFByb3RvdHlwZTtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAgZ2V0U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9sc0luJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBhbmQgaW5oZXJpdGVkIHN5bWJvbHMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgZnJvbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyB0by5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlTeW1ib2xzSW4oc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9sc0luO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0luLCBnZXRTeW1ib2xzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXNJbjtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBuZXcgYXJyYXkuY29uc3RydWN0b3IobGVuZ3RoKTtcblxuICAvLyBBZGQgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgLlxuICBpZiAobGVuZ3RoICYmIHR5cGVvZiBhcnJheVswXSA9PSAnc3RyaW5nJyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCAnaW5kZXgnKSkge1xuICAgIHJlc3VsdC5pbmRleCA9IGFycmF5LmluZGV4O1xuICAgIHJlc3VsdC5pbnB1dCA9IGFycmF5LmlucHV0O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQXJyYXk7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIFVpbnQ4QXJyYXkgPSByZXF1aXJlKCcuL19VaW50OEFycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheUJ1ZmZlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IGFycmF5QnVmZmVyIFRoZSBhcnJheSBidWZmZXIgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7QXJyYXlCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBhcnJheSBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyBhcnJheUJ1ZmZlci5jb25zdHJ1Y3RvcihhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgbmV3IFVpbnQ4QXJyYXkocmVzdWx0KS5zZXQobmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUFycmF5QnVmZmVyO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBkYXRhVmlld2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhVmlldyBUaGUgZGF0YSB2aWV3IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBkYXRhIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGF0YVZpZXcoZGF0YVZpZXcsIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcihkYXRhVmlldy5idWZmZXIpIDogZGF0YVZpZXcuYnVmZmVyO1xuICByZXR1cm4gbmV3IGRhdGFWaWV3LmNvbnN0cnVjdG9yKGJ1ZmZlciwgZGF0YVZpZXcuYnl0ZU9mZnNldCwgZGF0YVZpZXcuYnl0ZUxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVEYXRhVmlldztcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgcmVnZXhwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHJlZ2V4cCBUaGUgcmVnZXhwIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHJlZ2V4cC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVSZWdFeHAocmVnZXhwKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgcmVnZXhwLmNvbnN0cnVjdG9yKHJlZ2V4cC5zb3VyY2UsIHJlRmxhZ3MuZXhlYyhyZWdleHApKTtcbiAgcmVzdWx0Lmxhc3RJbmRleCA9IHJlZ2V4cC5sYXN0SW5kZXg7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVSZWdFeHA7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYHN5bWJvbGAgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc3ltYm9sIFRoZSBzeW1ib2wgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHN5bWJvbCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU3ltYm9sKHN5bWJvbCkge1xuICByZXR1cm4gc3ltYm9sVmFsdWVPZiA/IE9iamVjdChzeW1ib2xWYWx1ZU9mLmNhbGwoc3ltYm9sKSkgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVN5bWJvbDtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lVHlwZWRBcnJheTtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU3ltYm9sID0gcmVxdWlyZSgnLi9fY2xvbmVTeW1ib2wnKSxcbiAgICBjbG9uZVR5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19jbG9uZVR5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE1hcGAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgYFNldGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUJ5VGFnKG9iamVjdCwgdGFnLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3I7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG4iLCJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWFwYCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG1hcCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNNYXAodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSBtYXBUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWFwO1xuIiwidmFyIGJhc2VJc01hcCA9IHJlcXVpcmUoJy4vX2Jhc2VJc01hcCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNNYXAgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc01hcDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE1hcGAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNNYXAobmV3IE1hcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc01hcChuZXcgV2Vha01hcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNNYXAgPSBub2RlSXNNYXAgPyBiYXNlVW5hcnkobm9kZUlzTWFwKSA6IGJhc2VJc01hcDtcblxubW9kdWxlLmV4cG9ydHMgPSBpc01hcDtcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNTZXRgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc2V0LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1NldCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IHNldFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNTZXQ7XG4iLCJ2YXIgYmFzZUlzU2V0ID0gcmVxdWlyZSgnLi9fYmFzZUlzU2V0JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1NldCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzU2V0O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU2V0YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NldChuZXcgU2V0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2V0KG5ldyBXZWFrU2V0KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1NldCA9IG5vZGVJc1NldCA/IGJhc2VVbmFyeShub2RlSXNTZXQpIDogYmFzZUlzU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2V0O1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ24nKSxcbiAgICBiYXNlQXNzaWduSW4gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduSW4nKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgY29weVN5bWJvbHMgPSByZXF1aXJlKCcuL19jb3B5U3ltYm9scycpLFxuICAgIGNvcHlTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19jb3B5U3ltYm9sc0luJyksXG4gICAgZ2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXMnKSxcbiAgICBnZXRBbGxLZXlzSW4gPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzSW4nKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpbml0Q2xvbmVBcnJheSA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUFycmF5JyksXG4gICAgaW5pdENsb25lQnlUYWcgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVCeVRhZycpLFxuICAgIGluaXRDbG9uZU9iamVjdCA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZU9iamVjdCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc01hcCA9IHJlcXVpcmUoJy4vaXNNYXAnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1NldCA9IHJlcXVpcmUoJy4vaXNTZXQnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMSxcbiAgICBDTE9ORV9GTEFUX0ZMQUcgPSAyLFxuICAgIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgc3VwcG9ydGVkIGJ5IGBfLmNsb25lYC4gKi9cbnZhciBjbG9uZWFibGVUYWdzID0ge307XG5jbG9uZWFibGVUYWdzW2FyZ3NUYWddID0gY2xvbmVhYmxlVGFnc1thcnJheVRhZ10gPVxuY2xvbmVhYmxlVGFnc1thcnJheUJ1ZmZlclRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGFWaWV3VGFnXSA9XG5jbG9uZWFibGVUYWdzW2Jvb2xUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9XG5jbG9uZWFibGVUYWdzW2Zsb2F0MzJUYWddID0gY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDhUYWddID0gY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW21hcFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tudW1iZXJUYWddID0gY2xvbmVhYmxlVGFnc1tvYmplY3RUYWddID1cbmNsb25lYWJsZVRhZ3NbcmVnZXhwVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc2V0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3N0cmluZ1RhZ10gPSBjbG9uZWFibGVUYWdzW3N5bWJvbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPVxuY2xvbmVhYmxlVGFnc1t1aW50MTZUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbmNsb25lYWJsZVRhZ3NbZXJyb3JUYWddID0gY2xvbmVhYmxlVGFnc1tmdW5jVGFnXSA9XG5jbG9uZWFibGVUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIGFuZCBgXy5jbG9uZURlZXBgIHdoaWNoIHRyYWNrc1xuICogdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBEZWVwIGNsb25lXG4gKiAgMiAtIEZsYXR0ZW4gaW5oZXJpdGVkIHByb3BlcnRpZXNcbiAqICA0IC0gQ2xvbmUgc3ltYm9sc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIHBhcmVudCBvYmplY3Qgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBhbmQgdGhlaXIgY2xvbmUgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGlzRGVlcCA9IGJpdG1hc2sgJiBDTE9ORV9ERUVQX0ZMQUcsXG4gICAgICBpc0ZsYXQgPSBiaXRtYXNrICYgQ0xPTkVfRkxBVF9GTEFHLFxuICAgICAgaXNGdWxsID0gYml0bWFzayAmIENMT05FX1NZTUJPTFNfRkxBRztcblxuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICByZXN1bHQgPSAoaXNGbGF0IHx8IGlzRnVuYykgPyB7fSA6IGluaXRDbG9uZU9iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gaXNGbGF0XG4gICAgICAgICAgPyBjb3B5U3ltYm9sc0luKHZhbHVlLCBiYXNlQXNzaWduSW4ocmVzdWx0LCB2YWx1ZSkpXG4gICAgICAgICAgOiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoaXNTZXQodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSkge1xuICAgICAgcmVzdWx0LmFkZChiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN1YlZhbHVlLCB2YWx1ZSwgc3RhY2spKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoaXNNYXAodmFsdWUpKSB7XG4gICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBrZXlzRnVuYyA9IGlzRnVsbFxuICAgID8gKGlzRmxhdCA/IGdldEFsbEtleXNJbiA6IGdldEFsbEtleXMpXG4gICAgOiAoaXNGbGF0ID8ga2V5c0luIDoga2V5cyk7XG5cbiAgdmFyIHByb3BzID0gaXNBcnIgPyB1bmRlZmluZWQgOiBrZXlzRnVuYyh2YWx1ZSk7XG4gIGFycmF5RWFjaChwcm9wcyB8fCB2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3ViVmFsdWU7XG4gICAgICBzdWJWYWx1ZSA9IHZhbHVlW2tleV07XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgYXNzaWduVmFsdWUocmVzdWx0LCBrZXksIGJhc2VDbG9uZShzdWJWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2spKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNsb25lO1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX1NZTUJPTFNfRkxBRyA9IDQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYHZhbHVlYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGVcbiAqIFtzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobV0oaHR0cHM6Ly9tZG4uaW8vU3RydWN0dXJlZF9jbG9uZV9hbGdvcml0aG0pXG4gKiBhbmQgc3VwcG9ydHMgY2xvbmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLCBkYXRlIG9iamVjdHMsIG1hcHMsXG4gKiBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLCBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWRcbiAqIGFycmF5cy4gVGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhcmUgY2xvbmVkXG4gKiBhcyBwbGFpbiBvYmplY3RzLiBBbiBlbXB0eSBvYmplY3QgaXMgcmV0dXJuZWQgZm9yIHVuY2xvbmVhYmxlIHZhbHVlcyBzdWNoXG4gKiBhcyBlcnJvciBvYmplY3RzLCBmdW5jdGlvbnMsIERPTSBub2RlcywgYW5kIFdlYWtNYXBzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKiBAc2VlIF8uY2xvbmVEZWVwXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ2EnOiAxIH0sIHsgJ2InOiAyIH1dO1xuICpcbiAqIHZhciBzaGFsbG93ID0gXy5jbG9uZShvYmplY3RzKTtcbiAqIGNvbnNvbGUubG9nKHNoYWxsb3dbMF0gPT09IG9iamVjdHNbMF0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjbG9uZSh2YWx1ZSkge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBDTE9ORV9TWU1CT0xTX0ZMQUcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xuIiwidmFyIGNyZWF0ZVdyYXAgPSByZXF1aXJlKCcuL19jcmVhdGVXcmFwJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGZ1bmN0aW9uIG1ldGFkYXRhLiAqL1xudmFyIFdSQVBfQ1VSUllfRkxBRyA9IDg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBhcmd1bWVudHMgb2YgYGZ1bmNgIGFuZCBlaXRoZXIgaW52b2tlc1xuICogYGZ1bmNgIHJldHVybmluZyBpdHMgcmVzdWx0LCBpZiBhdCBsZWFzdCBgYXJpdHlgIG51bWJlciBvZiBhcmd1bWVudHMgaGF2ZVxuICogYmVlbiBwcm92aWRlZCwgb3IgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyB0aGUgcmVtYWluaW5nIGBmdW5jYFxuICogYXJndW1lbnRzLCBhbmQgc28gb24uIFRoZSBhcml0eSBvZiBgZnVuY2AgbWF5IGJlIHNwZWNpZmllZCBpZiBgZnVuYy5sZW5ndGhgXG4gKiBpcyBub3Qgc3VmZmljaWVudC5cbiAqXG4gKiBUaGUgYF8uY3VycnkucGxhY2Vob2xkZXJgIHZhbHVlLCB3aGljaCBkZWZhdWx0cyB0byBgX2AgaW4gbW9ub2xpdGhpYyBidWlsZHMsXG4gKiBtYXkgYmUgdXNlZCBhcyBhIHBsYWNlaG9sZGVyIGZvciBwcm92aWRlZCBhcmd1bWVudHMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGRvZXNuJ3Qgc2V0IHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IG9mIGN1cnJpZWQgZnVuY3Rpb25zLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5PWZ1bmMubGVuZ3RoXSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhYmMgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG4gKiAgIHJldHVybiBbYSwgYiwgY107XG4gKiB9O1xuICpcbiAqIHZhciBjdXJyaWVkID0gXy5jdXJyeShhYmMpO1xuICpcbiAqIGN1cnJpZWQoMSkoMikoMyk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqXG4gKiBjdXJyaWVkKDEsIDIpKDMpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogY3VycmllZCgxLCAyLCAzKTtcbiAqIC8vID0+IFsxLCAyLCAzXVxuICpcbiAqIC8vIEN1cnJpZWQgd2l0aCBwbGFjZWhvbGRlcnMuXG4gKiBjdXJyaWVkKDEpKF8sIDMpKDIpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKi9cbmZ1bmN0aW9uIGN1cnJ5KGZ1bmMsIGFyaXR5LCBndWFyZCkge1xuICBhcml0eSA9IGd1YXJkID8gdW5kZWZpbmVkIDogYXJpdHk7XG4gIHZhciByZXN1bHQgPSBjcmVhdGVXcmFwKGZ1bmMsIFdSQVBfQ1VSUllfRkxBRywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGFyaXR5KTtcbiAgcmVzdWx0LnBsYWNlaG9sZGVyID0gY3VycnkucGxhY2Vob2xkZXI7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEFzc2lnbiBkZWZhdWx0IHBsYWNlaG9sZGVycy5cbmN1cnJ5LnBsYWNlaG9sZGVyID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0gY3Vycnk7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBpbmZlciB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IuICovXG52YXIgb2JqZWN0Q3RvclN0cmluZyA9IGZ1bmNUb1N0cmluZy5jYWxsKE9iamVjdCk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIHRoYXQgaXMsIGFuIG9iamVjdCBjcmVhdGVkIGJ5IHRoZVxuICogYE9iamVjdGAgY29uc3RydWN0b3Igb3Igb25lIHdpdGggYSBgW1tQcm90b3R5cGVdXWAgb2YgYG51bGxgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC44LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqIH1cbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QobmV3IEZvbyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzUGxhaW5PYmplY3QoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdExpa2UodmFsdWUpIHx8IGJhc2VHZXRUYWcodmFsdWUpICE9IG9iamVjdFRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcHJvdG8gPSBnZXRQcm90b3R5cGUodmFsdWUpO1xuICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgQ3RvciA9IGhhc093blByb3BlcnR5LmNhbGwocHJvdG8sICdjb25zdHJ1Y3RvcicpICYmIHByb3RvLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yIGluc3RhbmNlb2YgQ3RvciAmJlxuICAgIGZ1bmNUb1N0cmluZy5jYWxsKEN0b3IpID09IG9iamVjdEN0b3JTdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQbGFpbk9iamVjdDtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vaXNQbGFpbk9iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZG9tRXhjVGFnID0gJ1tvYmplY3QgRE9NRXhjZXB0aW9uXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFuIGBFcnJvcmAsIGBFdmFsRXJyb3JgLCBgUmFuZ2VFcnJvcmAsIGBSZWZlcmVuY2VFcnJvcmAsXG4gKiBgU3ludGF4RXJyb3JgLCBgVHlwZUVycm9yYCwgb3IgYFVSSUVycm9yYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gZXJyb3Igb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFcnJvcihuZXcgRXJyb3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFcnJvcihFcnJvcik7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Vycm9yKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3RMaWtlKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZXJyb3JUYWcgfHwgdGFnID09IGRvbUV4Y1RhZyB8fFxuICAgICh0eXBlb2YgdmFsdWUubWVzc2FnZSA9PSAnc3RyaW5nJyAmJiB0eXBlb2YgdmFsdWUubmFtZSA9PSAnc3RyaW5nJyAmJiAhaXNQbGFpbk9iamVjdCh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXJyb3I7XG4iLCJ2YXIgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBXZWFrTWFwYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB3ZWFrIG1hcCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzV2Vha01hcChuZXcgV2Vha01hcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1dlYWtNYXAobmV3IE1hcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1dlYWtNYXAodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgZ2V0VGFnKHZhbHVlKSA9PSB3ZWFrTWFwVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzV2Vha01hcDtcbiIsIi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBhZGRcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQGFsaWFzIHB1c2hcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlQWRkKHZhbHVlKSB7XG4gIHRoaXMuX19kYXRhX18uc2V0KHZhbHVlLCBIQVNIX1VOREVGSU5FRCk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldENhY2hlQWRkO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUhhcyh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldENhY2hlSGFzO1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKSxcbiAgICBzZXRDYWNoZUFkZCA9IHJlcXVpcmUoJy4vX3NldENhY2hlQWRkJyksXG4gICAgc2V0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19zZXRDYWNoZUhhcycpO1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA9PSBudWxsID8gMCA6IHZhbHVlcy5sZW5ndGg7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0Q2FjaGU7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5U29tZTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhY2hlSGFzO1xuIiwidmFyIFNldENhY2hlID0gcmVxdWlyZSgnLi9fU2V0Q2FjaGUnKSxcbiAgICBhcnJheVNvbWUgPSByZXF1aXJlKCcuL19hcnJheVNvbWUnKSxcbiAgICBjYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2NhY2hlSGFzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChhcnJheSk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBDT01QQVJFX1VOT1JERVJFRF9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxBcnJheXM7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcFRvQXJyYXk7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvQXJyYXk7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKSxcbiAgICBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vX2VxdWFsQXJyYXlzJyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBDT01QQVJFX1VOT1JERVJFRF9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQnlUYWc7XG4iLCJ2YXIgZ2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBnZXRBbGxLZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGdldEFsbEtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vX2VxdWFsQXJyYXlzJyksXG4gICAgZXF1YWxCeVRhZyA9IHJlcXVpcmUoJy4vX2VxdWFsQnlUYWcnKSxcbiAgICBlcXVhbE9iamVjdHMgPSByZXF1aXJlKCcuL19lcXVhbE9iamVjdHMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gb2JqSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvYmplY3QpLFxuICAgICAgb3RoVGFnID0gb3RoSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvdGhlcik7XG5cbiAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuXG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT0gb3RoVGFnO1xuXG4gIGlmIChpc1NhbWVUYWcgJiYgaXNCdWZmZXIob2JqZWN0KSkge1xuICAgIGlmICghaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9iaklzQXJyID0gdHJ1ZTtcbiAgICBvYmpJc09iaiA9IGZhbHNlO1xuICB9XG4gIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICByZXR1cm4gKG9iaklzQXJyIHx8IGlzVHlwZWRBcnJheShvYmplY3QpKVxuICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKVxuICAgICAgOiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gIH1cbiAgaWYgKCEoYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHKSkge1xuICAgIHZhciBvYmpJc1dyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgIHZhciBvYmpVbndyYXBwZWQgPSBvYmpJc1dyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCxcbiAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9ialVud3JhcHBlZCwgb3RoVW53cmFwcGVkLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHJldHVybiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWxEZWVwO1xuIiwidmFyIGJhc2VJc0VxdWFsRGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsRGVlcCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdExpa2UodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBiYXNlSXNFcXVhbCwgc3RhY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0VxdWFsO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hdGNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7QXJyYXl9IG1hdGNoRGF0YSBUaGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3MgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gbWF0Y2hEYXRhLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IGluZGV4LFxuICAgICAgbm9DdXN0b21pemVyID0gIWN1c3RvbWl6ZXI7XG5cbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuICFsZW5ndGg7XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIGlmICgobm9DdXN0b21pemVyICYmIGRhdGFbMl0pXG4gICAgICAgICAgPyBkYXRhWzFdICE9PSBvYmplY3RbZGF0YVswXV1cbiAgICAgICAgICA6ICEoZGF0YVswXSBpbiBvYmplY3QpXG4gICAgICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIHZhciBrZXkgPSBkYXRhWzBdLFxuICAgICAgICBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBzcmNWYWx1ZSA9IGRhdGFbMV07XG5cbiAgICBpZiAobm9DdXN0b21pemVyICYmIGRhdGFbMl0pIHtcbiAgICAgIGlmIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhY2sgPSBuZXcgU3RhY2s7XG4gICAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICghKHJlc3VsdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgfCBDT01QQVJFX1VOT1JERVJFRF9GTEFHLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgICAgIDogcmVzdWx0XG4gICAgICAgICAgKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc01hdGNoO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaWYgc3VpdGFibGUgZm9yIHN0cmljdFxuICogIGVxdWFsaXR5IGNvbXBhcmlzb25zLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlICYmICFpc09iamVjdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpY3RDb21wYXJhYmxlO1xuIiwidmFyIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBtYXRjaCBkYXRhIG9mIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBnZXRNYXRjaERhdGEob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBrZXlzKG9iamVjdCksXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHZhciBrZXkgPSByZXN1bHRbbGVuZ3RoXSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgIHJlc3VsdFtsZW5ndGhdID0gW2tleSwgdmFsdWUsIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSldO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWF0Y2hEYXRhO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYG1hdGNoZXNQcm9wZXJ0eWAgZm9yIHNvdXJjZSB2YWx1ZXMgc3VpdGFibGVcbiAqIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBzcmNWYWx1ZSBUaGUgdmFsdWUgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZShrZXksIHNyY1ZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdFtrZXldID09PSBzcmNWYWx1ZSAmJlxuICAgICAgKHNyY1ZhbHVlICE9PSB1bmRlZmluZWQgfHwgKGtleSBpbiBPYmplY3Qob2JqZWN0KSkpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlO1xuIiwidmFyIGJhc2VJc01hdGNoID0gcmVxdWlyZSgnLi9fYmFzZUlzTWF0Y2gnKSxcbiAgICBnZXRNYXRjaERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXRjaERhdGEnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc2Agd2hpY2ggZG9lc24ndCBjbG9uZSBgc291cmNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzKHNvdXJjZSkge1xuICB2YXIgbWF0Y2hEYXRhID0gZ2V0TWF0Y2hEYXRhKHNvdXJjZSk7XG4gIGlmIChtYXRjaERhdGEubGVuZ3RoID09IDEgJiYgbWF0Y2hEYXRhWzBdWzJdKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKG1hdGNoRGF0YVswXVswXSwgbWF0Y2hEYXRhWzBdWzFdKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PT0gc291cmNlIHx8IGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sXG4gICAgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5KHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8XG4gICAgICB2YWx1ZSA9PSBudWxsIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAob2JqZWN0ICE9IG51bGwgJiYgdmFsdWUgaW4gT2JqZWN0KG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGNsZWFyYCwgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemU7XG4iLCJ2YXIgbWVtb2l6ZSA9IHJlcXVpcmUoJy4vbWVtb2l6ZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgbWF4aW11bSBtZW1vaXplIGNhY2hlIHNpemUuICovXG52YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzXG4gKiBjYWNoZSB3aGVuIGl0IGV4Y2VlZHMgYE1BWF9NRU1PSVpFX1NJWkVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZUNhcHBlZChmdW5jKSB7XG4gIHZhciByZXN1bHQgPSBtZW1vaXplKGZ1bmMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChjYWNoZS5zaXplID09PSBNQVhfTUVNT0laRV9TSVpFKSB7XG4gICAgICBjYWNoZS5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9KTtcblxuICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZUNhcHBlZDtcbiIsInZhciBtZW1vaXplQ2FwcGVkID0gcmVxdWlyZSgnLi9fbWVtb2l6ZUNhcHBlZCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwkKSkvZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IG1lbW9pemVDYXBwZWQoZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKHN0cmluZy5jaGFyQ29kZUF0KDApID09PSA0NiAvKiAuICovKSB7XG4gICAgcmVzdWx0LnB1c2goJycpO1xuICB9XG4gIHN0cmluZy5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uKG1hdGNoLCBudW1iZXIsIHF1b3RlLCBzdWJTdHJpbmcpIHtcbiAgICByZXN1bHQucHVzaChxdW90ZSA/IHN1YlN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgJyQxJykgOiAobnVtYmVyIHx8IG1hdGNoKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVG9QYXRoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1hcDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnRvU3RyaW5nIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbnZlcnQgdmFsdWVzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgcmV0dXJuIGFycmF5TWFwKHZhbHVlLCBiYXNlVG9TdHJpbmcpICsgJyc7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1N0cmluZztcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gaXNLZXkodmFsdWUsIG9iamVjdCkgPyBbdmFsdWVdIDogc3RyaW5nVG9QYXRoKHRvU3RyaW5nKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZ2V0YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZmF1bHQgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldDtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBgb2JqZWN0YC4gSWYgdGhlIHJlc29sdmVkIHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTtcbiAqXG4gKiBfLmdldChvYmplY3QsICdhWzBdLmIuYycpO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsdWUgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5oYXNJbmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhc0luKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBrZXkgaW4gT2JqZWN0KG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhc0luO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogb2JqZWN0Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1BhdGg7XG4iLCJ2YXIgYmFzZUhhc0luID0gcmVxdWlyZSgnLi9fYmFzZUhhc0luJyksXG4gICAgaGFzUGF0aCA9IHJlcXVpcmUoJy4vX2hhc1BhdGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IG9yIGluaGVyaXRlZCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXNJbihvYmplY3QsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsICdhLmInKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsICdiJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXNJbihvYmplY3QsIHBhdGgpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBiYXNlSGFzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc0luO1xuIiwidmFyIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKSxcbiAgICBnZXQgPSByZXF1aXJlKCcuL2dldCcpLFxuICAgIGhhc0luID0gcmVxdWlyZSgnLi9oYXNJbicpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc1Byb3BlcnR5YCB3aGljaCBkb2Vzbid0IGNsb25lIGBzcmNWYWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgaWYgKGlzS2V5KHBhdGgpICYmIGlzU3RyaWN0Q29tcGFyYWJsZShzcmNWYWx1ZSkpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUodG9LZXkocGF0aCksIHNyY1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIG9ialZhbHVlID0gZ2V0KG9iamVjdCwgcGF0aCk7XG4gICAgcmV0dXJuIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9ialZhbHVlID09PSBzcmNWYWx1ZSlcbiAgICAgID8gaGFzSW4ob2JqZWN0LCBwYXRoKVxuICAgICAgOiBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIENPTVBBUkVfUEFSVElBTF9GTEFHIHwgQ09NUEFSRV9VTk9SREVSRURfRkxBRyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXNQcm9wZXJ0eTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUHJvcGVydHlgIHdoaWNoIHN1cHBvcnRzIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5RGVlcChwYXRoKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eURlZXA7XG4iLCJ2YXIgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5JyksXG4gICAgYmFzZVByb3BlcnR5RGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eURlZXAnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBhIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFtcbiAqICAgeyAnYSc6IHsgJ2InOiAyIH0gfSxcbiAqICAgeyAnYSc6IHsgJ2InOiAxIH0gfVxuICogXTtcbiAqXG4gKiBfLm1hcChvYmplY3RzLCBfLnByb3BlcnR5KCdhLmInKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqXG4gKiBfLm1hcChfLnNvcnRCeShvYmplY3RzLCBfLnByb3BlcnR5KFsnYScsICdiJ10pKSwgJ2EuYicpO1xuICogLy8gPT4gWzEsIDJdXG4gKi9cbmZ1bmN0aW9uIHByb3BlcnR5KHBhdGgpIHtcbiAgcmV0dXJuIGlzS2V5KHBhdGgpID8gYmFzZVByb3BlcnR5KHRvS2V5KHBhdGgpKSA6IGJhc2VQcm9wZXJ0eURlZXAocGF0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvcGVydHk7XG4iLCJ2YXIgYmFzZU1hdGNoZXMgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlcycpLFxuICAgIGJhc2VNYXRjaGVzUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlc1Byb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHByb3BlcnR5ID0gcmVxdWlyZSgnLi9wcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLml0ZXJhdGVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBbdmFsdWU9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYW4gaXRlcmF0ZWUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGl0ZXJhdGVlLlxuICovXG5mdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUpIHtcbiAgLy8gRG9uJ3Qgc3RvcmUgdGhlIGB0eXBlb2ZgIHJlc3VsdCBpbiBhIHZhcmlhYmxlIHRvIGF2b2lkIGEgSklUIGJ1ZyBpbiBTYWZhcmkgOS5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTYwMzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSlcbiAgICAgID8gYmFzZU1hdGNoZXNQcm9wZXJ0eSh2YWx1ZVswXSwgdmFsdWVbMV0pXG4gICAgICA6IGJhc2VNYXRjaGVzKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gcHJvcGVydHkodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJdGVyYXRlZTtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGFyZ3VtZW50cyBvZiB0aGUgY3JlYXRlZFxuICogZnVuY3Rpb24uIElmIGBmdW5jYCBpcyBhIHByb3BlcnR5IG5hbWUsIHRoZSBjcmVhdGVkIGZ1bmN0aW9uIHJldHVybnMgdGhlXG4gKiBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBnaXZlbiBlbGVtZW50LiBJZiBgZnVuY2AgaXMgYW4gYXJyYXkgb3Igb2JqZWN0LCB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJucyBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgY29udGFpbiB0aGUgZXF1aXZhbGVudFxuICogc291cmNlIHByb3BlcnRpZXMsIG90aGVyd2lzZSBpdCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDQuMC4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gW2Z1bmM9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBjYWxsYmFjay5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICogXTtcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIF8uaXRlcmF0ZWUoeyAndXNlcic6ICdiYXJuZXknLCAnYWN0aXZlJzogdHJ1ZSB9KSk7XG4gKiAvLyA9PiBbeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH1dXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIF8uaXRlcmF0ZWUoWyd1c2VyJywgJ2ZyZWQnXSkpO1xuICogLy8gPT4gW3sgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XVxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5tYXAodXNlcnMsIF8uaXRlcmF0ZWUoJ3VzZXInKSk7XG4gKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAqXG4gKiAvLyBDcmVhdGUgY3VzdG9tIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKiBfLml0ZXJhdGVlID0gXy53cmFwKF8uaXRlcmF0ZWUsIGZ1bmN0aW9uKGl0ZXJhdGVlLCBmdW5jKSB7XG4gKiAgIHJldHVybiAhXy5pc1JlZ0V4cChmdW5jKSA/IGl0ZXJhdGVlKGZ1bmMpIDogZnVuY3Rpb24oc3RyaW5nKSB7XG4gKiAgICAgcmV0dXJuIGZ1bmMudGVzdChzdHJpbmcpO1xuICogICB9O1xuICogfSk7XG4gKlxuICogXy5maWx0ZXIoWydhYmMnLCAnZGVmJ10sIC9lZi8pO1xuICogLy8gPT4gWydkZWYnXVxuICovXG5mdW5jdGlvbiBpdGVyYXRlZShmdW5jKSB7XG4gIHJldHVybiBiYXNlSXRlcmF0ZWUodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJyA/IGZ1bmMgOiBiYXNlQ2xvbmUoZnVuYywgQ0xPTkVfREVFUF9GTEFHKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXRlcmF0ZWU7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcHJlYWRhYmxlU3ltYm9sID0gU3ltYm9sID8gU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGZsYXR0ZW5hYmxlIGBhcmd1bWVudHNgIG9iamVjdCBvciBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmbGF0dGVuYWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0ZsYXR0ZW5hYmxlKHZhbHVlKSB7XG4gIHJldHVybiBpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkgfHxcbiAgICAhIShzcHJlYWRhYmxlU3ltYm9sICYmIHZhbHVlICYmIHZhbHVlW3NwcmVhZGFibGVTeW1ib2xdKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0ZsYXR0ZW5hYmxlO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzRmxhdHRlbmFibGUgPSByZXF1aXJlKCcuL19pc0ZsYXR0ZW5hYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmxhdHRlbmAgd2l0aCBzdXBwb3J0IGZvciByZXN0cmljdGluZyBmbGF0dGVuaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZXB0aCBUaGUgbWF4aW11bSByZWN1cnNpb24gZGVwdGguXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcmVkaWNhdGU9aXNGbGF0dGVuYWJsZV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU3RyaWN0XSBSZXN0cmljdCB0byB2YWx1ZXMgdGhhdCBwYXNzIGBwcmVkaWNhdGVgIGNoZWNrcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHQ9W11dIFRoZSBpbml0aWFsIHJlc3VsdCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGRlcHRoLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBpc0ZsYXR0ZW5hYmxlKTtcbiAgcmVzdWx0IHx8IChyZXN1bHQgPSBbXSk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKGRlcHRoID4gMCAmJiBwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICBpZiAoZGVwdGggPiAxKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIGJhc2VGbGF0dGVuKHZhbHVlLCBkZXB0aCAtIDEsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVB1c2gocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNTdHJpY3QpIHtcbiAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGbGF0dGVuO1xuIiwidmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKTtcblxuLyoqXG4gKiBGbGF0dGVucyBgYXJyYXlgIGEgc2luZ2xlIGxldmVsIGRlZXAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5mbGF0dGVuKFsxLCBbMiwgWzMsIFs0XV0sIDVdXSk7XG4gKiAvLyA9PiBbMSwgMiwgWzMsIFs0XV0sIDVdXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICByZXR1cm4gbGVuZ3RoID8gYmFzZUZsYXR0ZW4oYXJyYXksIDEpIDogW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlbjtcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJy4vZmxhdHRlbicpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggZmxhdHRlbnMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZmxhdFJlc3QoZnVuYykge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgdW5kZWZpbmVkLCBmbGF0dGVuKSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0UmVzdDtcbiIsInZhciBjcmVhdGVXcmFwID0gcmVxdWlyZSgnLi9fY3JlYXRlV3JhcCcpLFxuICAgIGZsYXRSZXN0ID0gcmVxdWlyZSgnLi9fZmxhdFJlc3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9SRUFSR19GTEFHID0gMjU2O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggYXJndW1lbnRzIGFycmFuZ2VkIGFjY29yZGluZ1xuICogdG8gdGhlIHNwZWNpZmllZCBgaW5kZXhlc2Agd2hlcmUgdGhlIGFyZ3VtZW50IHZhbHVlIGF0IHRoZSBmaXJzdCBpbmRleCBpc1xuICogcHJvdmlkZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LCB0aGUgYXJndW1lbnQgdmFsdWUgYXQgdGhlIHNlY29uZCBpbmRleCBpc1xuICogcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCwgYW5kIHNvIG9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVhcnJhbmdlIGFyZ3VtZW50cyBmb3IuXG4gKiBAcGFyYW0gey4uLihudW1iZXJ8bnVtYmVyW10pfSBpbmRleGVzIFRoZSBhcnJhbmdlZCBhcmd1bWVudCBpbmRleGVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciByZWFyZ2VkID0gXy5yZWFyZyhmdW5jdGlvbihhLCBiLCBjKSB7XG4gKiAgIHJldHVybiBbYSwgYiwgY107XG4gKiB9LCBbMiwgMCwgMV0pO1xuICpcbiAqIHJlYXJnZWQoJ2InLCAnYycsICdhJylcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXVxuICovXG52YXIgcmVhcmcgPSBmbGF0UmVzdChmdW5jdGlvbihmdW5jLCBpbmRleGVzKSB7XG4gIHJldHVybiBjcmVhdGVXcmFwKGZ1bmMsIFdSQVBfUkVBUkdfRkxBRywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgaW5kZXhlcyk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSByZWFyZztcbiIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpLFxuICAgIHN0cmluZ1RvUGF0aCA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvUGF0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9QYXRoKCdhLmIuYycpO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddXG4gKlxuICogXy50b1BhdGgoJ2FbMF0uYi5jJyk7XG4gKiAvLyA9PiBbJ2EnLCAnMCcsICdiJywgJ2MnXVxuICovXG5mdW5jdGlvbiB0b1BhdGgodmFsdWUpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGFycmF5TWFwKHZhbHVlLCB0b0tleSk7XG4gIH1cbiAgcmV0dXJuIGlzU3ltYm9sKHZhbHVlKSA/IFt2YWx1ZV0gOiBjb3B5QXJyYXkoc3RyaW5nVG9QYXRoKHRvU3RyaW5nKHZhbHVlKSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGF0aDtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAnYXJ5JzogcmVxdWlyZSgnLi4vYXJ5JyksXG4gICdhc3NpZ24nOiByZXF1aXJlKCcuLi9fYmFzZUFzc2lnbicpLFxuICAnY2xvbmUnOiByZXF1aXJlKCcuLi9jbG9uZScpLFxuICAnY3VycnknOiByZXF1aXJlKCcuLi9jdXJyeScpLFxuICAnZm9yRWFjaCc6IHJlcXVpcmUoJy4uL19hcnJheUVhY2gnKSxcbiAgJ2lzQXJyYXknOiByZXF1aXJlKCcuLi9pc0FycmF5JyksXG4gICdpc0Vycm9yJzogcmVxdWlyZSgnLi4vaXNFcnJvcicpLFxuICAnaXNGdW5jdGlvbic6IHJlcXVpcmUoJy4uL2lzRnVuY3Rpb24nKSxcbiAgJ2lzV2Vha01hcCc6IHJlcXVpcmUoJy4uL2lzV2Vha01hcCcpLFxuICAnaXRlcmF0ZWUnOiByZXF1aXJlKCcuLi9pdGVyYXRlZScpLFxuICAna2V5cyc6IHJlcXVpcmUoJy4uL19iYXNlS2V5cycpLFxuICAncmVhcmcnOiByZXF1aXJlKCcuLi9yZWFyZycpLFxuICAndG9JbnRlZ2VyJzogcmVxdWlyZSgnLi4vdG9JbnRlZ2VyJyksXG4gICd0b1BhdGgnOiByZXF1aXJlKCcuLi90b1BhdGgnKVxufTtcbiIsInZhciBiYXNlQ29udmVydCA9IHJlcXVpcmUoJy4vX2Jhc2VDb252ZXJ0JyksXG4gICAgdXRpbCA9IHJlcXVpcmUoJy4vX3V0aWwnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2Agb2YgYG5hbWVgIHRvIGFuIGltbXV0YWJsZSBhdXRvLWN1cnJpZWQgaXRlcmF0ZWUtZmlyc3QgZGF0YS1sYXN0XG4gKiB2ZXJzaW9uIHdpdGggY29udmVyc2lvbiBgb3B0aW9uc2AgYXBwbGllZC4gSWYgYG5hbWVgIGlzIGFuIG9iamVjdCBpdHMgbWV0aG9kc1xuICogd2lsbCBiZSBjb252ZXJ0ZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZnVuY10gVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC4gU2VlIGBiYXNlQ29udmVydGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbnxPYmplY3R9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBmdW5jdGlvbiBvciBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnQobmFtZSwgZnVuYywgb3B0aW9ucykge1xuICByZXR1cm4gYmFzZUNvbnZlcnQodXRpbCwgbmFtZSwgZnVuYywgb3B0aW9ucyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29udmVydDtcbiIsInZhciBMb2Rhc2hXcmFwcGVyID0gcmVxdWlyZSgnLi9fTG9kYXNoV3JhcHBlcicpLFxuICAgIGZsYXRSZXN0ID0gcmVxdWlyZSgnLi9fZmxhdFJlc3QnKSxcbiAgICBnZXREYXRhID0gcmVxdWlyZSgnLi9fZ2V0RGF0YScpLFxuICAgIGdldEZ1bmNOYW1lID0gcmVxdWlyZSgnLi9fZ2V0RnVuY05hbWUnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNMYXppYWJsZSA9IHJlcXVpcmUoJy4vX2lzTGF6aWFibGUnKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9DVVJSWV9GTEFHID0gOCxcbiAgICBXUkFQX1BBUlRJQUxfRkxBRyA9IDMyLFxuICAgIFdSQVBfQVJZX0ZMQUcgPSAxMjgsXG4gICAgV1JBUF9SRUFSR19GTEFHID0gMjU2O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5mbG93YCBvciBgXy5mbG93UmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZsb3cgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZsb3coZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmbGF0UmVzdChmdW5jdGlvbihmdW5jcykge1xuICAgIHZhciBsZW5ndGggPSBmdW5jcy5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gbGVuZ3RoLFxuICAgICAgICBwcmVyZXEgPSBMb2Rhc2hXcmFwcGVyLnByb3RvdHlwZS50aHJ1O1xuXG4gICAgaWYgKGZyb21SaWdodCkge1xuICAgICAgZnVuY3MucmV2ZXJzZSgpO1xuICAgIH1cbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgdmFyIGZ1bmMgPSBmdW5jc1tpbmRleF07XG4gICAgICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgICB9XG4gICAgICBpZiAocHJlcmVxICYmICF3cmFwcGVyICYmIGdldEZ1bmNOYW1lKGZ1bmMpID09ICd3cmFwcGVyJykge1xuICAgICAgICB2YXIgd3JhcHBlciA9IG5ldyBMb2Rhc2hXcmFwcGVyKFtdLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaW5kZXggPSB3cmFwcGVyID8gaW5kZXggOiBsZW5ndGg7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGZ1bmMgPSBmdW5jc1tpbmRleF07XG5cbiAgICAgIHZhciBmdW5jTmFtZSA9IGdldEZ1bmNOYW1lKGZ1bmMpLFxuICAgICAgICAgIGRhdGEgPSBmdW5jTmFtZSA9PSAnd3JhcHBlcicgPyBnZXREYXRhKGZ1bmMpIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoZGF0YSAmJiBpc0xhemlhYmxlKGRhdGFbMF0pICYmXG4gICAgICAgICAgICBkYXRhWzFdID09IChXUkFQX0FSWV9GTEFHIHwgV1JBUF9DVVJSWV9GTEFHIHwgV1JBUF9QQVJUSUFMX0ZMQUcgfCBXUkFQX1JFQVJHX0ZMQUcpICYmXG4gICAgICAgICAgICAhZGF0YVs0XS5sZW5ndGggJiYgZGF0YVs5XSA9PSAxXG4gICAgICAgICAgKSB7XG4gICAgICAgIHdyYXBwZXIgPSB3cmFwcGVyW2dldEZ1bmNOYW1lKGRhdGFbMF0pXS5hcHBseSh3cmFwcGVyLCBkYXRhWzNdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZXIgPSAoZnVuYy5sZW5ndGggPT0gMSAmJiBpc0xhemlhYmxlKGZ1bmMpKVxuICAgICAgICAgID8gd3JhcHBlcltmdW5jTmFtZV0oKVxuICAgICAgICAgIDogd3JhcHBlci50aHJ1KGZ1bmMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICB2YWx1ZSA9IGFyZ3NbMF07XG5cbiAgICAgIGlmICh3cmFwcGVyICYmIGFyZ3MubGVuZ3RoID09IDEgJiYgaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHdyYXBwZXIucGxhbnQodmFsdWUpLnZhbHVlKCk7XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICAgIHJlc3VsdCA9IGxlbmd0aCA/IGZ1bmNzW2luZGV4XS5hcHBseSh0aGlzLCBhcmdzKSA6IHZhbHVlO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICByZXN1bHQgPSBmdW5jc1tpbmRleF0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGbG93O1xuIiwidmFyIGNyZWF0ZUZsb3cgPSByZXF1aXJlKCcuL19jcmVhdGVGbG93Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcmVzdWx0IG9mIGludm9raW5nIHRoZSBnaXZlbiBmdW5jdGlvbnNcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLCB3aGVyZSBlYWNoIHN1Y2Nlc3NpdmVcbiAqIGludm9jYXRpb24gaXMgc3VwcGxpZWQgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgcHJldmlvdXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Li4uKEZ1bmN0aW9ufEZ1bmN0aW9uW10pfSBbZnVuY3NdIFRoZSBmdW5jdGlvbnMgdG8gaW52b2tlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29tcG9zaXRlIGZ1bmN0aW9uLlxuICogQHNlZSBfLmZsb3dSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICogICByZXR1cm4gbiAqIG47XG4gKiB9XG4gKlxuICogdmFyIGFkZFNxdWFyZSA9IF8uZmxvdyhbXy5hZGQsIHNxdWFyZV0pO1xuICogYWRkU3F1YXJlKDEsIDIpO1xuICogLy8gPT4gOVxuICovXG52YXIgZmxvdyA9IGNyZWF0ZUZsb3coKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmbG93O1xuIiwidmFyIGNvbnZlcnQgPSByZXF1aXJlKCcuL2NvbnZlcnQnKSxcbiAgICBmdW5jID0gY29udmVydCgnZmxvdycsIHJlcXVpcmUoJy4uL2Zsb3cnKSk7XG5cbmZ1bmMucGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL3BsYWNlaG9sZGVyJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmM7XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAqIGVxdWl2YWxlbnQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLFxuICogZGF0ZSBvYmplY3RzLCBlcnJvciBvYmplY3RzLCBtYXBzLCBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLFxuICogc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkIGFycmF5cy4gYE9iamVjdGAgb2JqZWN0cyBhcmUgY29tcGFyZWRcbiAqIGJ5IHRoZWlyIG93biwgbm90IGluaGVyaXRlZCwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBGdW5jdGlvbnMgYW5kIERPTVxuICogbm9kZXMgYXJlIGNvbXBhcmVkIGJ5IHN0cmljdCBlcXVhbGl0eSwgaS5lLiBgPT09YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5pc0VxdWFsKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIG9iamVjdCA9PT0gb3RoZXI7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VxdWFsKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VxdWFsO1xuIiwidmFyIGNvbnZlcnQgPSByZXF1aXJlKCcuL2NvbnZlcnQnKSxcbiAgICBmdW5jID0gY29udmVydCgnaXNFcXVhbCcsIHJlcXVpcmUoJy4uL2lzRXF1YWwnKSk7XG5cbmZ1bmMucGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL3BsYWNlaG9sZGVyJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmM7XG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0gQk9PTEVBTiAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5leHBvcnQgY29uc3Qgbm90ID0gZm4gPT4gKC4uLngpID0+ICFmbiguLi54KVxuZXhwb3J0IGNvbnN0IGJvb2wgPSBmbiA9PiAoLi4ueCkgPT4gISFmbiguLi54KVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0gQ09OU09MRSAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5leHBvcnQgY29uc3QgbG9nID0gbXNnID0+IHggPT4ge1xuICBjb25zb2xlLmxvZyhtc2csIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBjb25zdCBlcnJvciA9IG1zZyA9PiB4ID0+IHtcbiAgY29uc29sZS5lcnJvcihtc2csIHgpXG4gIHJldHVybiB4XG59XG4iLCJpbXBvcnQgZmxvdyBmcm9tICdsb2Rhc2gvZnAvZmxvdydcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC9mcC9pc0VxdWFsJ1xuaW1wb3J0IHsgbm90IH0gZnJvbSAnLi9vcGVyYXRvcnMnXG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBhbiBvcGVyYXRpb24gb24gdGhlIGZpcnN0IGFyZ3VtZW50cyBmcm9tIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxscy5cbiAqIE5vdGU6IFRoZSBzdGF0ZSBtYWludGFpbmVkIGJ5IHRoaXMgZnVuY3Rpb24gbWVhbnMgdGhhdCBpdCBzaG91bGQgYmUgY29tcG9zZWQgb3V0c2lkZSB0aGUgZmluYWwgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihhLCBiKX0gZm4gLSBDYWxsYmFja1xuICogQHJldHVybnMge2Z1bmN0aW9uKGEpfSBDYWxscyB0aGUgY2FsbGJhY2sgd2l0aCBib3RoIHRoZSBmaXJzdCBhcmd1bWVudCBmcm9tIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxscy5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gU2V0IHVwIHdpdGhQcmV2IHRvIHJldHVybiB0cnVlXG4gKiAvLyBpZiBwcmV2aW91cyBhbmQgY3VycmVudCBhcmd1bWVudHMgYXJlIG5vdCBlcXVhbFxuICogY29uc3QgaGFzQ2hhbmdlZCA9IHdpdGhQcmV2KG5vdChpc0VxdWFsKSlcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gUHJldmlvdXMgY2FsbCBhcmd1bWVudCBpcyB1bmRlZmluZWRcbiAqIGhhc0NoYW5nZWQoNSkgLy8gLT4gdHJ1ZVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBQcmV2aW91cyBhbmQgY3VycmVudCBjYWxscyB3aXRoIHNhbWUgYXJndW1lbnRzXG4gKiBoYXNDaGFuZ2VkKDUpIC8vIC0+IHRydWVcbiAqIGhhc0NoYW5nZWQoNSkgLy8gLT4gZmFsc2VcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gUHJldmlvdXMgYW5kIGN1cnJlbnQgY2FsbHMgd2l0aCBkaWZmZXJlbnQgYXJndW1lbnRzXG4gKiBoYXNDaGFuZ2VkKDUpIC8vIC0+IHRydWVcbiAqIGhhc0NoYW5nZWQoNikgLy8gLT4gdHJ1ZVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBQcmV2aW91cyBjYWxsIGFyZ3VtZW50IGlzIHVuZGVmaW5lZFxuICogaGFzQ2hhbmdlZCh1bmRlZmluZWQpIC8vIC0+IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCB3aXRoUHJldiA9IChmbiwgaW5pdGlhbFZhbHVlKSA9PiB7XG4gIGxldCBwcmV2aW91cyA9IGluaXRpYWxWYWx1ZVxuXG4gIHJldHVybiBjdXJyZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBmbihwcmV2aW91cywgY3VycmVudClcblxuICAgIC8vIFNhdmUgY3VycmVudCB2YWx1ZSBmb3IgbmV4dCBjYWxsXG4gICAgcHJldmlvdXMgPSBjdXJyZW50XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSByZWR1Y2VyIGZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYW4gb3BlcmF0aW9uIG9uIHRoZSBmaXJzdCBjdXJyZW50IGFyZ3VtZW50IGFuZCBwcmV2aW91cyByZXN1bHQuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihhLCBiKX0gZm4gLSBDYWxsYmFja1xuICogQHJldHVybnMge2Z1bmN0aW9uKGEpfSBDYWxscyB0aGUgY2FsbGJhY2sgd2l0aCBib3RoIHRoZSBjdXJyZW50IGFyZ3VtZW50IGFuZCB0aGUgcHJldmlvdXMgcmVzdWx0XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFNldCB1cCB3aXRoUHJldiB0byByZXR1cm4gdHJ1ZVxuICogLy8gaWYgcHJldmlvdXMgYW5kIGN1cnJlbnQgYXJndW1lbnRzIGFyZSBub3QgZXF1YWxcbiAqIGNvbnN0IHN1bSA9IHdpdGhQcmV2UmVzdWx0KGFkZCwgMClcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQWRkIHRvIGluaXRpYWwgdmFsdWVcbiAqIHN1bSg1KSAvLyAtPiA1XG4gKiAvLyBBZGQgdG8gcHJldmlvdXMgcmVzdWx0XG4gKiBzdW0oNikgLy8gLT4gMTFcbiAqL1xuZXhwb3J0IGNvbnN0IHdpdGhQcmV2UmVzdWx0ID0gKGZuLCBpbml0aWFsVmFsdWUpID0+IHtcbiAgbGV0IHByZXZpb3VzID0gaW5pdGlhbFZhbHVlXG5cbiAgcmV0dXJuIGN1cnJlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKHByZXZpb3VzLCBjdXJyZW50KVxuXG4gICAgLy8gU2F2ZSBjdXJyZW50IHJlc3VsdCBmb3IgbmV4dCBjYWxsXG4gICAgcHJldmlvdXMgPSByZXN1bHRcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYW4gb3BlcmF0aW9uIG9uIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxsIGFyZ3VtZW50c1xuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oQXJyYXk8YT4sIEFycmF5PGI+KX0gZm4gLSBDYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufSBDYWxscyB0aGUgY2FsbGJhY2sgd2l0aCBib3RoIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxsIGFyZ3VtZW50c1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2dQcmV2QW5kQ3VycmVudEFyZ3MgPSB3aXRoUHJldkFyZ3MoKHByZXYsIGN1cnJlbnQpID0+IHtcbiAqICAgY29uc29sZS5sb2coJ3ByZXZpb3VzIGFyZ3M6JywgcHJldilcbiAqICAgY29uc29sZS5sb2coJ2N1cnJlbnQgYXJnczonLCBjdXJyZW50KVxuICogfSwgWzEsIDIsIDNdKVxuICpcbiAqIGxpc3RlblRvKGV2ZW50KVxuICogICAuZm9yRWFjaChsb2dQcmV2QW5kQ3VycmVudEFyZ3MpXG4gKlxuICogLy8gRmlyc3QgZXZlbnQ6XG4gKiAvLyBwcmV2aW91cyBhcmdzOiBbMSwgMiwgM11cbiAqIC8vIGN1cnJlbnQgYXJnczogWzQsIDUsIDZdXG4gKlxuICogLy8gU2Vjb25kIGV2ZW50OlxuICogLy8gcHJldmlvdXMgYXJnczogWzQsIDUsIDZdXG4gKiAvLyBjdXJyZW50IGFyZ3M6IFs3LCA4LCA5XVxuICovXG5leHBvcnQgY29uc3Qgd2l0aFByZXZBcmdzID0gKGZuLCAuLi5pbml0aWFsVmFsdWVzKSA9PiB7XG4gIGxldCBwcmV2aW91cyA9IGluaXRpYWxWYWx1ZXNcblxuICByZXR1cm4gKC4uLmN1cnJlbnQpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBmbihwcmV2aW91cywgY3VycmVudClcblxuICAgIC8vIFNhdmUgY3VycmVudCByZXN1bHQgZm9yIG5leHQgY2FsbFxuICAgIHByZXZpb3VzID0gY3VycmVudFxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG5cbndpdGhQcmV2LnJlc3VsdCA9IHdpdGhQcmV2UmVzdWx0XG53aXRoUHJldi5hcmdzID0gd2l0aFByZXZBcmdzXG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhpc1xuICogY2FsbCdzIGFyZ3VtZW50IGlzIGRpZmZlcmVudCB0aGFuIHRoZSBsYXN0IGNhbGwuXG4gKiBNYWludGFpbnMgb3duIHN0YXRlIHVzaW5nIGEgY2xvc3VyZS5cbiAqIEluc3RhbnRpYXRlIGZvciBlYWNoIHBsYWNlIHlvdSB1c2UgaXQuXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBJbnN0YW5jZSBvZiBoYXNDaGFuZ2VkXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGhhc0NoYW5nZWQgPSBjcmVhdGVIYXNDaGFuZ2VkKClcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXBvc2VIYXNDaGFuZ2VkID0gZm4gPT5cbiAgZmxvdyhcbiAgICBmbixcbiAgICB3aXRoUHJldihub3QoaXNFcXVhbCkpLFxuICApXG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogICAgICAgICAgICAgIEJVTUJMRSBFVkVOVCBTVFJFQU0gICAgICAgICAgICAgKi9cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmV4cG9ydCB7IEJ1bWJsZVN0cmVhbSB9IGZyb20gJy4vZXZlbnQtc3RyZWFtJ1xuZXhwb3J0IHsgbGlzdGVuVG8gfSBmcm9tICcuL2xpc3Rlbi10bydcbmV4cG9ydCB7IEV2ZW50UHJvbWlzZSB9IGZyb20gJy4vZXZlbnQtcHJvbWlzZSdcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qICAgICAgICAgICAgICAgICAgICBUSU1FUlMgICAgICAgICAgICAgICAgICAgICovXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5leHBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJy4vdGltZXJzL2RlYm91bmNlJ1xuZXhwb3J0IHsgaW50ZXJ2YWwgfSBmcm9tICcuL3RpbWVycy9pbnRlcnZhbCdcbi8vIFRocm90dGxlIGlzIG5vdCByZWFkeVxuZXhwb3J0IHsgdGhyb3R0bGUgfSBmcm9tICcuL3RpbWVycy90aHJvdHRsZSdcbmV4cG9ydCB7IHRpbWVvdXQgfSBmcm9tICcuL3RpbWVycy90aW1lb3V0J1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogICAgICAgICAgICAgICAgICAgIEhFTFBFUlMgICAgICAgICAgICAgICAgICAgKi9cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmV4cG9ydCB7IHdpdGhQcmV2LCBjb21wb3NlSGFzQ2hhbmdlZCB9IGZyb20gJy4vaGVscGVycy93aXRoLXByZXYnXG5leHBvcnQgeyBsb2csIG5vdCwgYm9vbCwgZXJyb3IgfSBmcm9tICcuL2hlbHBlcnMvb3BlcmF0b3JzJ1xuIl0sIm5hbWVzIjpbIm1hcCIsIndyYXBwZXJzLm1hcCIsImZvckVhY2giLCJ3cmFwcGVycy5mb3JFYWNoIiwiZmlsdGVyIiwid3JhcHBlcnMuZmlsdGVyIiwiY2xlYXIiLCJ3cmFwcGVycy5jbGVhciIsImhhbmRsZUVycm9yIiwid3JhcHBlcnMuaGFuZGxlRXJyb3IiLCJhd2FpdE1hcCIsIndyYXBwZXJzLmF3YWl0TWFwIiwiYXdhaXRGaWx0ZXIiLCJ3cmFwcGVycy5hd2FpdEZpbHRlciIsImZhbGxiYWNrSG9sZGVyIiwibWFwcGluZyIsInBsYWNlaG9sZGVyIiwiZ2xvYmFsIiwiZnJlZUdsb2JhbCIsInJvb3QiLCJTeW1ib2wiLCJvYmplY3RQcm90byIsIm5hdGl2ZU9iamVjdFRvU3RyaW5nIiwic3ltVG9TdHJpbmdUYWciLCJnZXRSYXdUYWciLCJvYmplY3RUb1N0cmluZyIsImlzT2JqZWN0IiwiYmFzZUdldFRhZyIsImNvcmVKc0RhdGEiLCJmdW5jUHJvdG8iLCJmdW5jVG9TdHJpbmciLCJoYXNPd25Qcm9wZXJ0eSIsImlzTWFza2VkIiwiaXNGdW5jdGlvbiIsInRvU291cmNlIiwiZ2V0VmFsdWUiLCJiYXNlSXNOYXRpdmUiLCJnZXROYXRpdmUiLCJXZWFrTWFwIiwibWV0YU1hcCIsImlkZW50aXR5IiwiYmFzZUNyZWF0ZSIsImNyZWF0ZUN0b3IiLCJuYXRpdmVNYXgiLCJiYXNlTG9kYXNoIiwibm9vcCIsInJlYWxOYW1lcyIsIkxhenlXcmFwcGVyIiwiTG9kYXNoV3JhcHBlciIsImNvcHlBcnJheSIsImlzT2JqZWN0TGlrZSIsImlzQXJyYXkiLCJ3cmFwcGVyQ2xvbmUiLCJnZXRGdW5jTmFtZSIsImxvZGFzaCIsImdldERhdGEiLCJzaG9ydE91dCIsImJhc2VTZXREYXRhIiwiZGVmaW5lUHJvcGVydHkiLCJjb25zdGFudCIsImJhc2VTZXRUb1N0cmluZyIsInN0cmljdEluZGV4T2YiLCJiYXNlRmluZEluZGV4IiwiYmFzZUlzTmFOIiwiYmFzZUluZGV4T2YiLCJXUkFQX0JJTkRfRkxBRyIsImFycmF5RWFjaCIsImFycmF5SW5jbHVkZXMiLCJzZXRUb1N0cmluZyIsImluc2VydFdyYXBEZXRhaWxzIiwidXBkYXRlV3JhcERldGFpbHMiLCJnZXRXcmFwRGV0YWlscyIsIldSQVBfQklORF9LRVlfRkxBRyIsIldSQVBfQ1VSUllfRkxBRyIsIldSQVBfUEFSVElBTF9GTEFHIiwiV1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUciLCJpc0xhemlhYmxlIiwic2V0RGF0YSIsInNldFdyYXBUb1N0cmluZyIsImlzSW5kZXgiLCJXUkFQX0NVUlJZX1JJR0hUX0ZMQUciLCJXUkFQX0FSWV9GTEFHIiwiV1JBUF9GTElQX0ZMQUciLCJnZXRIb2xkZXIiLCJjb3VudEhvbGRlcnMiLCJjb21wb3NlQXJncyIsImNvbXBvc2VBcmdzUmlnaHQiLCJyZXBsYWNlSG9sZGVycyIsImNyZWF0ZVJlY3VycnkiLCJyZW9yZGVyIiwiY3JlYXRlSHlicmlkIiwiYXBwbHkiLCJQTEFDRUhPTERFUiIsIldSQVBfQ1VSUllfQk9VTkRfRkxBRyIsIldSQVBfUkVBUkdfRkxBRyIsIm5hdGl2ZU1pbiIsImlzU3ltYm9sIiwidG9OdW1iZXIiLCJ0b0Zpbml0ZSIsInRvSW50ZWdlciIsIm1lcmdlRGF0YSIsImNyZWF0ZUJpbmQiLCJjcmVhdGVDdXJyeSIsImNyZWF0ZVBhcnRpYWwiLCJjcmVhdGVXcmFwIiwiZXEiLCJiYXNlQXNzaWduVmFsdWUiLCJhc3NpZ25WYWx1ZSIsImJhc2VJc0FyZ3VtZW50cyIsInN0dWJGYWxzZSIsIk1BWF9TQUZFX0lOVEVHRVIiLCJhcmdzVGFnIiwiZnVuY1RhZyIsImlzTGVuZ3RoIiwibm9kZVV0aWwiLCJiYXNlVW5hcnkiLCJiYXNlSXNUeXBlZEFycmF5IiwiaXNBcmd1bWVudHMiLCJpc0J1ZmZlciIsImlzVHlwZWRBcnJheSIsImJhc2VUaW1lcyIsIm92ZXJBcmciLCJpc1Byb3RvdHlwZSIsIm5hdGl2ZUtleXMiLCJpc0FycmF5TGlrZSIsImFycmF5TGlrZUtleXMiLCJiYXNlS2V5cyIsImNvcHlPYmplY3QiLCJrZXlzIiwiYXNzb2NJbmRleE9mIiwibGlzdENhY2hlQ2xlYXIiLCJsaXN0Q2FjaGVEZWxldGUiLCJsaXN0Q2FjaGVHZXQiLCJsaXN0Q2FjaGVIYXMiLCJsaXN0Q2FjaGVTZXQiLCJMaXN0Q2FjaGUiLCJuYXRpdmVDcmVhdGUiLCJIQVNIX1VOREVGSU5FRCIsImhhc2hDbGVhciIsImhhc2hEZWxldGUiLCJoYXNoR2V0IiwiaGFzaEhhcyIsImhhc2hTZXQiLCJIYXNoIiwiTWFwIiwiaXNLZXlhYmxlIiwiZ2V0TWFwRGF0YSIsIm1hcENhY2hlQ2xlYXIiLCJtYXBDYWNoZURlbGV0ZSIsIm1hcENhY2hlR2V0IiwibWFwQ2FjaGVIYXMiLCJtYXBDYWNoZVNldCIsIk1hcENhY2hlIiwic3RhY2tDbGVhciIsInN0YWNrRGVsZXRlIiwic3RhY2tHZXQiLCJzdGFja0hhcyIsInN0YWNrU2V0IiwibmF0aXZlS2V5c0luIiwia2V5c0luIiwiYmFzZUtleXNJbiIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwic3R1YkFycmF5IiwiYXJyYXlGaWx0ZXIiLCJnZXRTeW1ib2xzIiwibmF0aXZlR2V0U3ltYm9scyIsImFycmF5UHVzaCIsImdldFByb3RvdHlwZSIsImdldFN5bWJvbHNJbiIsImJhc2VHZXRBbGxLZXlzIiwiUHJvbWlzZSIsIm1hcFRhZyIsIm9iamVjdFRhZyIsInNldFRhZyIsIndlYWtNYXBUYWciLCJkYXRhVmlld1RhZyIsIkRhdGFWaWV3IiwiU2V0IiwiVWludDhBcnJheSIsImNsb25lQXJyYXlCdWZmZXIiLCJib29sVGFnIiwiZGF0ZVRhZyIsIm51bWJlclRhZyIsInJlZ2V4cFRhZyIsInN0cmluZ1RhZyIsInN5bWJvbFRhZyIsImFycmF5QnVmZmVyVGFnIiwiZmxvYXQzMlRhZyIsImZsb2F0NjRUYWciLCJpbnQ4VGFnIiwiaW50MTZUYWciLCJpbnQzMlRhZyIsInVpbnQ4VGFnIiwidWludDhDbGFtcGVkVGFnIiwidWludDE2VGFnIiwidWludDMyVGFnIiwiY2xvbmVEYXRhVmlldyIsImNsb25lVHlwZWRBcnJheSIsImNsb25lUmVnRXhwIiwiY2xvbmVTeW1ib2wiLCJnZXRUYWciLCJiYXNlSXNNYXAiLCJiYXNlSXNTZXQiLCJhcnJheVRhZyIsImVycm9yVGFnIiwiZ2VuVGFnIiwiaW5pdENsb25lQXJyYXkiLCJjbG9uZUJ1ZmZlciIsImluaXRDbG9uZU9iamVjdCIsImNvcHlTeW1ib2xzSW4iLCJiYXNlQXNzaWduSW4iLCJjb3B5U3ltYm9scyIsImJhc2VBc3NpZ24iLCJpbml0Q2xvbmVCeVRhZyIsIlN0YWNrIiwiaXNTZXQiLCJpc01hcCIsImdldEFsbEtleXNJbiIsImdldEFsbEtleXMiLCJDTE9ORV9TWU1CT0xTX0ZMQUciLCJiYXNlQ2xvbmUiLCJpc1BsYWluT2JqZWN0Iiwic2V0Q2FjaGVBZGQiLCJzZXRDYWNoZUhhcyIsIlNldENhY2hlIiwiYXJyYXlTb21lIiwiY2FjaGVIYXMiLCJDT01QQVJFX1BBUlRJQUxfRkxBRyIsIkNPTVBBUkVfVU5PUkRFUkVEX0ZMQUciLCJzeW1ib2xQcm90byIsInN5bWJvbFZhbHVlT2YiLCJtYXBUb0FycmF5Iiwic2V0VG9BcnJheSIsImVxdWFsQXJyYXlzIiwiZXF1YWxCeVRhZyIsImVxdWFsT2JqZWN0cyIsImJhc2VJc0VxdWFsRGVlcCIsImJhc2VJc0VxdWFsIiwiaXNTdHJpY3RDb21wYXJhYmxlIiwiZ2V0TWF0Y2hEYXRhIiwibWF0Y2hlc1N0cmljdENvbXBhcmFibGUiLCJiYXNlSXNNYXRjaCIsIkZVTkNfRVJST1JfVEVYVCIsIm1lbW9pemUiLCJtZW1vaXplQ2FwcGVkIiwiSU5GSU5JVFkiLCJhcnJheU1hcCIsImJhc2VUb1N0cmluZyIsImlzS2V5Iiwic3RyaW5nVG9QYXRoIiwidG9TdHJpbmciLCJjYXN0UGF0aCIsInRvS2V5IiwiYmFzZUdldCIsImhhc1BhdGgiLCJiYXNlSGFzSW4iLCJnZXQiLCJoYXNJbiIsImJhc2VQcm9wZXJ0eSIsImJhc2VQcm9wZXJ0eURlZXAiLCJiYXNlTWF0Y2hlc1Byb3BlcnR5IiwiYmFzZU1hdGNoZXMiLCJwcm9wZXJ0eSIsIkNMT05FX0RFRVBfRkxBRyIsImJhc2VJdGVyYXRlZSIsImlzRmxhdHRlbmFibGUiLCJiYXNlRmxhdHRlbiIsIm92ZXJSZXN0IiwiZmxhdHRlbiIsImZsYXRSZXN0IiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNiIsInJlcXVpcmUkJDciLCJyZXF1aXJlJCQ4IiwicmVxdWlyZSQkOSIsInJlcXVpcmUkJDEwIiwicmVxdWlyZSQkMTEiLCJyZXF1aXJlJCQxMiIsInJlcXVpcmUkJDEzIiwiYmFzZUNvbnZlcnQiLCJ1dGlsIiwiY3JlYXRlRmxvdyIsImNvbnZlcnQiLCJmdW5jIiwiZmxvdyIsImlzRXF1YWwiXSwibWFwcGluZ3MiOiJBQUFPLE1BQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUs7RUFDNUQsSUFBSTtJQUNGLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO01BQ2pCLE9BQU87UUFDTCxHQUFHO1FBQ0gsSUFBSTtRQUNKLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztPQUM1QjtLQUNGLE1BQU07TUFDTCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0tBQ3BDO0dBQ0YsQ0FBQyxPQUFPLEtBQUssRUFBRTtJQUNkLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtHQUM1QjtDQUNGOztBQ2RNLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFD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QUFFLENBQUMsQ0FBQztFQUM3QixhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN4QixhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN4QixjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3JCLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3hCLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQzFCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3hCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDM0IsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3ZCLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQzFCLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDOUIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDcEIsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQzFC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Q25ELEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUQsS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDckUsS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzlFLEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEY7SUFDRCxJQUFJLFdBQVcsR0FBR2UsV0FBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDOzs7O0lBSTNDLE9BQU9mLFVBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcs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
