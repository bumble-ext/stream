'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ms = _interopDefault(require('ms'));
var flow = _interopDefault(require('lodash/fp/flow'));
var isEqual = _interopDefault(require('lodash/fp/isEqual'));

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
  flow(
    fn,
    withPrev(not(isEqual)),
  );

/* ============================================ */

exports.BumbleStream = BumbleStream;
exports.listenTo = listenTo;
exports.EventPromise = EventPromise;
exports.debounce = debounce;
exports.interval = interval;
exports.throttle = throttle;
exports.timeout = timeout;
exports.withPrev = withPrev;
exports.composeHasChanged = composeHasChanged;
exports.log = log;
exports.not = not;
exports.bool = bool;
exports.error = error;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLWNqcy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3dyYXBwZXJzL21hcC5qcyIsIi4uL3NyYy93cmFwcGVycy9maWx0ZXIuanMiLCIuLi9zcmMvd3JhcHBlcnMvY2xlYXIuanMiLCIuLi9zcmMvd3JhcHBlcnMvZm9yLWVhY2guanMiLCIuLi9zcmMvd3JhcHBlcnMvYXdhaXQtZmlsdGVyLmpzIiwiLi4vc3JjL3dyYXBwZXJzL2F3YWl0LW1hcC5qcyIsIi4uL3NyYy93cmFwcGVycy9oYW5kbGUtZXJyb3IuanMiLCIuLi9zcmMvZXZlbnQtc3RyZWFtLmpzIiwiLi4vc3JjL2xpc3Rlbi10by5qcyIsIi4uL3NyYy9ldmVudC1wcm9taXNlLmpzIiwiLi4vc3JjL3RpbWVycy90aW1lb3V0LmpzIiwiLi4vc3JjL3RpbWVycy9kZWJvdW5jZS5qcyIsIi4uL3NyYy90aW1lcnMvaW50ZXJ2YWwuanMiLCIuLi9zcmMvdGltZXJzL3Rocm90dGxlLmpzIiwiLi4vc3JjL2hlbHBlcnMvb3BlcmF0b3JzLmpzIiwiLi4vc3JjL2hlbHBlcnMvd2l0aC1wcmV2LmpzIiwiLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG1hcCA9IG1hcEZuID0+ICh7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9KSA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKHVzZSAmJiAhZXJyb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVzZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgcmVzdWx0OiBtYXBGbihyZXN1bHQsIGFyZ3MpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7IGVycm9yLCB1c2UsIGFyZ3MgfVxuICB9XG59XG4iLCJleHBvcnQgY29uc3QgZmlsdGVyID0gcHJlZEZuID0+ICh7XG4gIHVzZSxcbiAgZXJyb3IsXG4gIHJlc3VsdCxcbiAgYXJnc1xufSkgPT4ge1xuICB0cnkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHsgdXNlOiBmYWxzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gICAgfSBlbHNlIGlmICh1c2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVzZTogcHJlZEZuKHJlc3VsdCwgYXJncyksXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgYXJnc1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyB1c2UsIHJlc3VsdCwgZXJyb3IsIGFyZ3MgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBlcnJvciwgdXNlLCBhcmdzIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IGNsZWFyID0gY2xlYXJGbiA9PiBwcmVkRm4gPT4gKHtcbiAgdXNlLFxuICBlcnJvcixcbiAgcmVzdWx0LFxuICBhcmdzXG59KSA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKHVzZSAmJiAhZXJyb3IgJiYgcHJlZEZuKHJlc3VsdCwgYXJncykpIHtcbiAgICAgIGNsZWFyRm4oKVxuICAgIH1cblxuICAgIHJldHVybiB7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHsgZXJyb3IsIHVzZSwgYXJncyB9XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBmb3JFYWNoID0gZm9yRWFjaEZuID0+ICh7XG4gIHVzZSxcbiAgcmVzdWx0LFxuICBlcnJvcixcbiAgYXJnc1xufSkgPT4ge1xuICB0cnkge1xuICAgIGlmICh1c2UgJiYgIWVycm9yKSB7XG4gICAgICBmb3JFYWNoRm4ocmVzdWx0LCBhcmdzKVxuICAgIH1cblxuICAgIHJldHVybiB7IHVzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHsgZXJyb3IsIHVzZSwgYXJncyB9XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBhd2FpdEZpbHRlciA9IChjYWxsYmFjaywgYXN5bmNGbikgPT4gKHtcbiAgdXNlLFxuICByZXN1bHQsXG4gIGVycm9yLFxuICBhcmdzXG59KSA9PiB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBlcnJvcjogY2FsbGJhY2suZGlyZWN0KHtcbiAgICAgICAgdXNlOiBmYWxzZSxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFyZ3NcbiAgICAgIH0pLFxuICAgICAgdXNlOiBmYWxzZSxcbiAgICAgIGFyZ3NcbiAgICB9XG4gIH0gZWxzZSBpZiAodXNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogUHJvbWlzZS5yZXNvbHZlKHJlc3VsdClcbiAgICAgICAgLnRoZW4ociA9PiBhc3luY0ZuKHIsIGFyZ3MpKVxuICAgICAgICAudGhlbih1c2UgPT4gKHtcbiAgICAgICAgICB1c2U6ICEhdXNlLFxuICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICBhcmdzXG4gICAgICAgIH0pKVxuICAgICAgICAuY2F0Y2goZSA9PiAoe1xuICAgICAgICAgIHVzZSxcbiAgICAgICAgICBlcnJvcjogZSxcbiAgICAgICAgICBhcmdzXG4gICAgICAgIH0pKVxuICAgICAgICAudGhlbihjYWxsYmFjay5kaXJlY3QpLFxuICAgICAgdXNlLFxuICAgICAgYXJnc1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBjYWxsYmFjay5kaXJlY3Qoe1xuICAgICAgICB1c2UsXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgYXJnc1xuICAgICAgfSksXG4gICAgICB1c2UsXG4gICAgICBhcmdzXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgY29uc3QgYXdhaXRNYXAgPSAoY2FsbGJhY2ssIGFzeW5jRm4pID0+ICh7XG4gIHVzZSxcbiAgcmVzdWx0LFxuICBlcnJvcixcbiAgYXJnc1xufSkgPT4ge1xuICBpZiAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IGNhbGxiYWNrLmRpcmVjdCh7XG4gICAgICAgIHVzZSxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFyZ3NcbiAgICAgIH0pLFxuICAgICAgdXNlLFxuICAgICAgYXJnc1xuICAgIH1cbiAgfSBlbHNlIGlmICh1c2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBQcm9taXNlLnJlc29sdmUocmVzdWx0KVxuICAgICAgICAudGhlbihyID0+IGFzeW5jRm4ociwgYXJncykpXG4gICAgICAgIC50aGVuKHIgPT4gKHsgdXNlLCBhcmdzLCByZXN1bHQ6IHIgfSkpXG4gICAgICAgIC5jYXRjaChlID0+ICh7XG4gICAgICAgICAgdXNlLFxuICAgICAgICAgIGVycm9yOiBlLFxuICAgICAgICAgIGFyZ3NcbiAgICAgICAgfSkpXG4gICAgICAgIC50aGVuKGNhbGxiYWNrLmRpcmVjdCksXG4gICAgICB1c2UsXG4gICAgICBhcmdzXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IGNhbGxiYWNrLmRpcmVjdCh7XG4gICAgICAgIHVzZSxcbiAgICAgICAgcmVzdWx0LFxuICAgICAgICBhcmdzXG4gICAgICB9KSxcbiAgICAgIHVzZSxcbiAgICAgIGFyZ3NcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBoYW5kbGVFcnJvciA9IGNhdGNoRm4gPT4gKHtcbiAgdXNlLFxuICBlcnJvcixcbiAgcmVzdWx0LFxuICBhcmdzXG59KSA9PiB7XG4gIHRyeSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IGNhdGNoRm4oZXJyb3IsIGFyZ3MpLFxuICAgICAgICB1c2UsXG4gICAgICAgIGFyZ3NcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdXNlLCByZXN1bHQsIGFyZ3MgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBlcnJvciwgdXNlLCBhcmdzIH1cbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgd3JhcHBlcnMgZnJvbSAnLi93cmFwcGVycy9tYWluJ1xuXG4vKipcbiAqIEEgY29uZmlndXJhYmxlIEFQSSB3aXRoIGZhbWlsaWFyIG1ldGhvZHMgdGhhdCBjb21wb3NlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBjYW4gYmUgcGFzc2VkIHRvIGFuIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIFRoZSBhdHRhY2ggZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGNsZWFyIGZ1bmN0aW9uOiBhIGZ1bmN0aW9uIHRoYXQgcmVtb3ZlcyB0aGUgbGlzdGVuZXIuXG4gKlxuICogQGZ1bmN0aW9uIEJ1bWJsZVN0cmVhbVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBQYXNzIHRvIGFuIGV2ZW50IGxpc3RlbmVyLlxuICogQHBhcmFtIHtkaXJlY3RDYWxsYmFja30gY2FsbGJhY2suZGlyZWN0IC0gVXNlIHRvIGRpcmVjdGx5IGNvbmZpZ3VyZSBhIHN0cmVhbS5cbiAqIEByZXR1cm5zIHtCdW1ibGVTdHJlYW1DaGFpbn0gQW4gb2JqZWN0IHdpdGggZmFtaWxpYXIgbWV0aG9kIG5hbWVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsaXN0ZW5Ub0Nocm9tZUV2ZW50ID0gKGV2ZW50T2JqZWN0KSA9PiB7XG4gKiAgIHJldHVybiBCdW1ibGVTdHJlYW0oY2FsbGJhY2sgPT4ge1xuICogICAgIC8vIEFkZCB0aGUgY29tcG9zZWQgY2FsbGJhY2sgdG8gdGhlIGV2ZW50IGxpc3RlbmVycy5cbiAqICAgICBldmVudE9iamVjdC5hZGRMaXN0ZW5lcihjYWxsYmFjaylcbiAqICAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGNhbGxiYWNrXG4gKiAgICAgLy8gZnJvbSB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gKiAgICAgcmV0dXJuICgpID0+IGV2ZW50T2JqZWN0LnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKVxuICogICB9KVxuICogfVxuICpcbiAqIEBleGFtcGxlXG4gKiBmdW5jdGlvbiBpbnRlcnZhbCh0aW1lKSB7XG4gKiAgIGNvbnN0IG1pbGxpc2Vjb25kcyA9IG1zKHRpbWUpXG4gKlxuICogICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAqICAgICAvLyBDcmVhdGUgY291bnRlclxuICogICAgIGxldCBjb3VudCA9IDBcbiAqXG4gKiAgICAgLy8gU3RhcnQgaW50ZXJ2YWwsIHBhc3MgY291bnQgdG8gY2FsbGJhY2ssIGluY3JlbWVudCBjb3VudFxuICogICAgIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICogICAgICAgY2FsbGJhY2soY291bnQpXG4gKiAgICAgICBjb3VudCsrXG4gKiAgICAgfSwgbWlsbGlzZWNvbmRzKVxuICpcbiAqICAgICAvLyBSZXR1cm4gZnVuY3Rpb24gdG8gc3RvcCBpbnRlcnZhbFxuICogICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKGlkKVxuICogICB9KVxuICogfVxuICovXG5leHBvcnQgZnVuY3Rpb24gQnVtYmxlU3RyZWFtKGF0dGFjaEZuLCAuLi5hcmdzKSB7XG4gIGxldCBjb21wb3NlZEZuID0geCA9PiB4XG5cbiAgLy8gdXNlZCBieSBjb21wb3NlQ2xlYXIoKVxuICBjb25zdCBjbGVhckZuID0gYXR0YWNoRm4oY2FsbGJhY2ssIC4uLmFyZ3MpXG5cbiAgY2FsbGJhY2suZGlyZWN0ID0gZGlyZWN0XG5cbiAgLyoqXG4gICAqIE1hcCBjaGFuZ2VzIHJlc3VsdCB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIG1hcEZuLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIG1hcFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIFRoZSByZXR1cm4gdmFsdWUgaXMgcGFzc2VkIHRvIHRoZSBuZXh0IG1ldGhvZC5cbiAgICogQHJldHVybnMge0J1bWJsZVN0cmVhbUNoYWlufVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAubWFwKCgpID0+IDEpXG4gICAqICAgLm1hcCgoeCkgPT4geCArIDEpXG4gICAqICAgLm1hcCgoeCkgPT4ge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGJlIDInLCB4KVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBtYXAgPSBjb21wb3NlKHdyYXBwZXJzLm1hcClcblxuICAvKipcbiAgICogVXNlIGZvciBlZmZlY3RzLiBGb3JFYWNoIGRvZXMgbm90IHBhc3MgaXRzIHJldHVybiB2YWx1ZSB0byB0aGUgbmV4dCBmdW5jdGlvbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEJ1bWJsZVN0cmVhbUNoYWluXG4gICAqIEBmdW5jdGlvbiBmb3JFYWNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIHJldHVybiB2YWx1ZSBpcyBpZ25vcmVkLlxuICAgKiBAcmV0dXJucyB7bWV0aG9kc30gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAubWFwKCgpID0+IDEpXG4gICAqICAgLmZvckVhY2goKHgpID0+IHtcbiAgICogICAgIGNvbnN0IGNvdW50ID0geCArIDFcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBiZSAyJywgY291bnQpXG4gICAqICAgICByZXR1cm4gY291bnRcbiAgICogICB9KVxuICAgKiAgIC5tYXAoKHgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBiZSAxJywgeClcbiAgICogICB9KVxuICAgKi9cbiAgY29uc3QgZm9yRWFjaCA9IGNvbXBvc2Uod3JhcHBlcnMuZm9yRWFjaClcblxuICAvKipcbiAgICogRmlsdGVyIHN0b3BzIGZ1cnRoZXIgbWFwcGluZ1xuICAgKiBhbmQgcmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZVxuICAgKiBpZiB0aGUgcHJlZGljYXRlIHJldHVybnMgZmFsc2UuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBCdW1ibGVTdHJlYW1DaGFpblxuICAgKiBAZnVuY3Rpb24gZmlsdGVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRGbiAtIFByZWRpY2F0ZS5cbiAgICogQHJldHVybnMge09iamVjdH0gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAvLyBUaGlzIHdpbGwgc2tpcCB0aGUgZmlyc3QgMiBpbnRlcnZhbHNcbiAgICogICAuZmlsdGVyKCh4KSA9PiB4ID4gMilcbiAgICogICAuZm9yRWFjaCgoeCkgPT4ge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGJlIDMnLCB4KVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBmaWx0ZXIgPSBjb21wb3NlKHdyYXBwZXJzLmZpbHRlcilcblxuICAvKipcbiAgICogQ2xlYXIgcmVtb3ZlcyB0aGUgZXZlbnQgbGlzdGVuZXIgYW5kXG4gICAqIGNvbnRpbnVlcyBkb3duIHRoZSBtYXAgY2hhaW5cbiAgICogaWYgdGhlIHByZWRpY2F0ZSByZXR1cm5zIHRydWUuXG4gICAqXG4gICAqIEl0IGNhbGxzIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBhdHRhY2hGbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEJ1bWJsZVN0cmVhbUNoYWluXG4gICAqIEBmdW5jdGlvbiBjbGVhclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZEZuXSAtIFByZWRpY2F0ZS5cbiAgICogQHJldHVybnMge09iamVjdH0gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAvLyBUaGlzIHdpbGwgY2xlYXIgdGhlIGludGVydmFsIG9uIHRoZSAzcmQgdGltZS5cbiAgICogICAuY2xlYXIoKHgpID0+IHggPiAyKVxuICAgKiAgIC5mb3JFYWNoKCgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdJIHdpbGwgbG9nIHRocmVlIHRpbWVzLicpXG4gICAqICAgfSlcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW50ZXJ2YWwoJzEwcycpXG4gICAqICAgLy8gVGhpcyB3aWxsIGNsZWFyIHRoZSBpbnRlcnZhbCBpbW1lZGlhdGVseS5cbiAgICogICAuY2xlYXIoKVxuICAgKiAgIC5mb3JFYWNoKCgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdJIHdpbGwgbmV2ZXIgbG9nLicpXG4gICAqICAgfSlcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgY2xlYXIgPSBpbnRlcnZhbCgnMTBzJykuY2xlYXJcbiAgICogLy9UaGlzIHdpbGwgY2xlYXIgdGhlIGludGVydmFsIHdoZW4gc29tZXRoaW5nIGZhaWxzIHRvIGxvYWQuXG4gICAqIHdpbmRvdy5vbmVycm9yID0gKGUpID0+IGNsZWFyKClcbiAgICpcbiAgICovXG4gIGNvbnN0IGNsZWFyID0gcHJlZEZuID0+XG4gICAgcHJlZEZuXG4gICAgICA/IGNvbXBvc2Uod3JhcHBlcnMuY2xlYXIoKCkgPT4gY2xlYXJGbigpKSkocHJlZEZuKVxuICAgICAgOiBjbGVhckZuKClcblxuICAvKipcbiAgICogQ2F0Y2ggY291bGQgY2F1c2UgYSBjYWxsIHRvIGZpbHRlciB0byBiZSBza2lwcGVkLlxuICAgKiBJZiB0aGlzIGhhcHBlbnMsIHRoZSBjaGFpbiBjb3VsZCBiZWdpbiB0byBleGVjdXRlIGFnYWluLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGNhdGNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gQ2FsbGVkIHdoZW4gYW4gZXJyb3IgaXMgZW5jb3VudGVyZWQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEJ1bWJsZVN0cmVhbSBtZXRob2RzIG9iamVjdC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW50ZXJ2YWwoJzEwcycpXG4gICAqICAgLm1hcCgoKSA9PiB7XG4gICAqICAgICBuZXcgRXJyb3IoJ0Jvb20hJylcbiAgICogICB9KVxuICAgKiAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGUgbmV4dCBsaW5lIHdpbGwgc2F5IFwiQm9vbSFcIicpXG4gICAqICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAqICAgfSlcbiAgICpcbiAgICovXG4gIGNvbnN0IGhhbmRsZUVycm9yID0gY29tcG9zZSh3cmFwcGVycy5oYW5kbGVFcnJvcilcblxuICAvKipcbiAgICogTWFwIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUHJvbWlzZS5cbiAgICogQ29tcG9zZXMgYSBuZXcgQnVtYmxlU3RyZWFtIGNhbGxiYWNrXG4gICAqIHRvIHBhc3MgdG8gdGhlIHJldHVybmVkIFByb21pc2UudGhlbigpLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGF3YWl0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGFzeW5jRm4gLSBBc3luYyBGdW5jdGlvbi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIEJ1bWJsZVN0cmVhbUNoYWluIG9iamVjdC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogbGlzdGVuVG8od2luZG93LCAnb25sb2FkJylcbiAgICogICAubWFwKCgpID0+ICdodHRwczovL3d3dy5nb29nbGUuY29tJylcbiAgICogICAuYXdhaXQoZmV0Y2gpXG4gICAqICAgLm1hcCgocmVzcG9uc2UpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm9rKVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBhd2FpdE1hcCA9IGNvbXBvc2VBc3luYyh3cmFwcGVycy5hd2FpdE1hcClcblxuICAvKipcbiAgICogRXZhbHVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJlZGljYXRlIFByb21pc2VcbiAgICogYW5kIHN0b3BzIGZ1cnRoZXIgZXhlY3V0aW9uIGlmIHRoZSBQcm9taXNlIHJlc29sdmVzIHRvIGZhbHNlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGF3YWl0RmlsdGVyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKik6IGJvb2xlYW59IGFzeW5jUHJlZEZuIC0gQXN5bmMgUHJlZGljYXRlIEZ1bmN0aW9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgQnVtYmxlU3RyZWFtQ2hhaW4gb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBsaXN0ZW5Ubyh3aW5kb3csICdvbmxvYWQnKVxuICAgKiAgIC5tYXAoKCkgPT4gJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20nKVxuICAgKiAgIC5hd2FpdC5maWx0ZXIoZmV0Y2gpXG4gICAqICAgLm1hcCgocmVzcG9uc2UpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm9rKVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBhd2FpdEZpbHRlciA9IGNvbXBvc2VBc3luYyh3cmFwcGVycy5hd2FpdEZpbHRlcilcblxuICAvKipcbiAgICogVGhlIEJ1bWJsZVN0cmVhbUNoYWluIGNvbXBvc2VzIGEgY2FsbGJhY2sgdXNpbmdcbiAgICogdGhlIGZhbWlsaWFyIEpTIEFycmF5IGhpZ2hlciBvcmRlciBmdW5jdGlvbiBjaGFpbiBwYXR0ZXJuLlxuICAgKlxuICAgKiBAbWVtYmVyIHtPYmplY3R9XG4gICAqIEBuYW1lc3BhY2UgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICovXG4gIGNvbnN0IG1ldGhvZHMgPSB7XG4gICAgbWFwLFxuICAgIGZpbHRlcixcbiAgICBmb3JFYWNoLFxuICAgIGNhdGNoOiBoYW5kbGVFcnJvcixcbiAgICBjbGVhcixcbiAgICBhd2FpdDogYXdhaXRNYXAsXG4gICAgYXdhaXRNYXAsXG4gICAgYXdhaXRGaWx0ZXIsXG4gIH1cblxuICByZXR1cm4gbWV0aG9kc1xuXG4gIGZ1bmN0aW9uIGNhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gaGFuZGxlVW5jYXVnaHRFcnJvcihcbiAgICAgIGNvbXBvc2VkRm4oe1xuICAgICAgICByZXN1bHQ6IGFyZ3NbMF0sXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHVzZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpcmVjdChwYXlsb2FkKSB7XG4gICAgcmV0dXJuIGhhbmRsZVVuY2F1Z2h0RXJyb3IoY29tcG9zZWRGbihwYXlsb2FkKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVVuY2F1Z2h0RXJyb3IoeyByZXN1bHQsIGVycm9yIH0pIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGVycm9yKS50aGVuKGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmNhdWdodCBhc3luYyBlcnJvciBpbiBCdW1ibGVTdHJlYW0nKVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVbmNhdWdodCBlcnJvciBpbiBCdW1ibGVTdHJlYW0nKVxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29tcG9zZSh3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZuID0+IHtcbiAgICAgIGNvbnN0IG5ld0ZuID0gd3JhcHBlcihmbilcbiAgICAgIGNvbnN0IG9sZEZuID0gY29tcG9zZWRGblxuXG4gICAgICBjb21wb3NlZEZuID0gZXZlbnQgPT4gbmV3Rm4ob2xkRm4oZXZlbnQpKVxuXG4gICAgICByZXR1cm4gbWV0aG9kc1xuICAgIH1cbiAgfVxuXG4gIC8qIEdvZXMgaW50byBCdW1ibGVTdHJlYW0gKi9cbiAgZnVuY3Rpb24gY29tcG9zZUFzeW5jKHdyYXBwZXIpIHtcbiAgICByZXR1cm4gYXN5bmNGbiA9PlxuICAgICAgQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICAgICAgY29uc3QgbmV3Rm4gPSB3cmFwcGVyKGNhbGxiYWNrLCBhc3luY0ZuKVxuXG4gICAgICAgIGNvbnN0IG9sZEZuID0gY29tcG9zZWRGblxuXG4gICAgICAgIGNvbXBvc2VkRm4gPSBldmVudCA9PiBuZXdGbihvbGRGbihldmVudCkpXG5cbiAgICAgICAgcmV0dXJuIGNsZWFyRm5cbiAgICAgIH0pXG4gIH1cbn1cbi8qKlxuICogVXNlIHRvIGRpcmVjdGx5IGNvbmZpZ3VyZSB0aGUgQnVtYmxlU3RyZWFtLlxuICogVXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBhc3luYyBtZXRob2QuXG4gKlxuICogQGNhbGxiYWNrIGRpcmVjdENhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSB2YWx1ZSBCdW1ibGVTdHJlYW0gdXNlcyBpbnRlcm5hbGx5LlxuICogQHBhcmFtIHthbnl9IHBheWxvYWQucmVzdWx0IC0gVGhlIHZhbHVlIHRvIHBhc3MgdG8gdGhlIG5leHQgbWV0aG9kIGNhbGxiYWNrLlxuICogQHBhcmFtIHtBcnJheX0gcGF5bG9hZC5hcmdzIC0gQW4gYXJyYXkgdG8gcGFzcyB0byBlYWNoIG1ldGhvZCBjYWxsYmFjay5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcGF5bG9hZC51c2UgLSBXaWxsIGNhdXNlIG1ldGhvZCBjYWxsYmFjayB0byBza2lwIGlmIGZhbHNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBCdW1ibGVTdHJlYW0oKHtkaXJlY3R9KSA9PiB7XG4gKiAgIC8vIEltbWVkaWF0ZWx5IGV4ZWN1dGUgY29tcG9zZWQgY2FsbGJhY2tcbiAqICAgZGlyZWN0KHtcbiAqICAgICByZXN1bHQ6IDEyMyxcbiAqICAgICBhcmdzOiBbMSwgMiwgM10sXG4gKiAgICAgdXNlOiB0cnVlLFxuICogICB9KVxuICpcbiAqICAgLy8gQ29uZmlndXJlIGNsZWFyRm5cbiAqICAgcmV0dXJuICgpID0+IGNsZWFyKClcbiAqIH0pXG4gKi9cbiIsImltcG9ydCB7IEJ1bWJsZVN0cmVhbSB9IGZyb20gJy4vZXZlbnQtc3RyZWFtJ1xuXG4vKipcbiAqIExpc3RlbiB0byBvbmUgb3IgbXVsdGlwbGUgZXZlbnRzIG9uIGEgRE9NIEVsZW1lbnQuXG4gKlxuICogQG1lbWJlcm9mIGxpc3RlblRvXG4gKiBAZnVuY3Rpb24gbGlzdGVuVG9DaHJvbWVFdmVudFxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50T2JqZWN0IC0gQSBET00gRWxlbWVudC5cbiAqIEBwYXJhbSB7Li4uYW55fSBbYXJnc10gLSBBZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBzcHJlYWQgaW50byBFdmVudC5hZGRMaXN0ZW5lcigpLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIEJ1bWJsZVN0cmVhbSBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IG15RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215ZGl2JylcbiAqIGxpc3RlblRvRG9tRXZlbnQobXlEaXYsICdjbGljaycpXG4gKiAgIC5tYXAoKGV2ZW50KSA9PiB7fSlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlkaXYnKVxuICogbGlzdGVuVG9Eb21FdmVudChteURpdiwgWydjbGljaycsICdrZXlwcmVzcyddKVxuICogICAubWFwKChldmVudCkgPT4ge30pXG4gKi9cbmNvbnN0IGxpc3RlblRvQ2hyb21lRXZlbnQgPSAoZXZlbnRPYmplY3QsIC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIEJ1bWJsZVN0cmVhbShjYWxsYmFjayA9PiB7XG4gICAgZXZlbnRPYmplY3QuYWRkTGlzdGVuZXIoY2FsbGJhY2ssIC4uLmFyZ3MpXG4gICAgcmV0dXJuICgpID0+IGV2ZW50T2JqZWN0LnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKVxuICB9KVxufVxuXG4vKipcbiAqIExpc3RlbiB0byBvbmUgb3IgbXVsdGlwbGUgZXZlbnRzIG9uIGEgRE9NIEVsZW1lbnQuXG4gKlxuICogQG1lbWJlcm9mIGxpc3RlblRvXG4gKiBAZnVuY3Rpb24gbGlzdGVuVG9Eb21FdmVudFxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCAtIEEgRE9NIEVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ3xBcnJheTxzdHJpbmc+fSBldmVudCAtIEFuIGV2ZW50IHN0cmluZyBvciBhbiBhcnJheSBvZiBldmVudCBzdHJpbmdzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIEJ1bWJsZVN0cmVhbSBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IG15RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215ZGl2JylcbiAqIGxpc3RlblRvRG9tRXZlbnQobXlEaXYsICdjbGljaycpXG4gKiAgIC5tYXAoKGV2ZW50KSA9PiB7fSlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlkaXYnKVxuICogbGlzdGVuVG9Eb21FdmVudChteURpdiwgWydjbGljaycsICdrZXlwcmVzcyddKVxuICogICAubWFwKChldmVudCkgPT4ge30pXG4gKi9cbmNvbnN0IGxpc3RlblRvRG9tRXZlbnQgPSAodGFyZ2V0LCBldmVudCkgPT4ge1xuICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGV2ZW50LmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKSxcbiAgICAgIClcblxuICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgIGV2ZW50LmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spLFxuICAgICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaylcbiAgICAgIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIE1hcCByZXNwb25zZXMgdG8gZXZlbnRzLiBVc2VzIEJ1bWJsZVN0cmVhbSBpbnRlcm5hbGx5LlxuICpcbiAqIEBmdW5jdGlvbiBsaXN0ZW5Ub1xuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCAtIEVpdGhlciBDaHJvbWUgQVBJIEV2ZW50IG9yIERPTSBFbGVtZW50LlxuICogQHBhcmFtICB7Li4uYW55fSBbYXJnc10gLSBFdmVudCBzdHJpbmcgb3IgYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgQnVtYmxlU3RyZWFtIG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogbGlzdGVuVG8oY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlKS5tYXAoKHtncmVldGluZ30pID0+IHtcbiAqICAgaWYoZ3JlZXRpbmcgPT09ICdoZWxsbycpIHtcbiAqICAgICByZXR1cm4gKHtncmVldGluZzogJ2dvb2RieWUnfSlcbiAqICAgfVxuICogfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBsaXN0ZW5UbyA9ICh0YXJnZXQsIC4uLmFyZ3MpID0+IHtcbiAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgcmV0dXJuIGxpc3RlblRvRG9tRXZlbnQodGFyZ2V0LCBhcmdzWzBdKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5Ub0Nocm9tZUV2ZW50KHRhcmdldCwgLi4uYXJncylcbiAgfVxufVxubGlzdGVuVG8uZG9tRXZlbnQgPSBsaXN0ZW5Ub0RvbUV2ZW50XG5saXN0ZW5Uby5jaHJvbWVFdmVudCA9IGxpc3RlblRvQ2hyb21lRXZlbnRcbiIsImltcG9ydCB7IGxpc3RlblRvIH0gZnJvbSAnLi9saXN0ZW4tdG8nXG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGZpcnN0IHRpbWUgdGhlIGV2ZW50IG9jY3Vycy4gVGhlIGV2ZW50IGxpc3RlbmVyIGlzIHJlbW92ZWQgYWZ0ZXIgdGhlIFByb21pc2UgcmVzb2x2ZXMuXG4gKlxuICogQHJldHVybnMge1Byb21pc2U8ZXZlbnRSZXN1bHRzPn0gUmVzb2x2ZXMgd2l0aCB3aGF0ZXZlciB0aGUgZXZlbnQgcGFzc2VzIHRoZSBjYWxsYmFjay5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgZXZlbnRQcm9taXNlID0gRXZlbnRQcm9taXNlKGNocm9tZS5zb21lRXZlbnQpXG4gKlxuICogZXZlbnRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICogICAvLyBUaGlzIHdpbGwgb25seSBiZSBjYWxsZWRcbiAqICAgLy8gdGhlIGZpcnN0IHRpbWUgdGhlIGV2ZW50IG9jY3Vycy5cbiAqIH0pXG4gKi9cbmV4cG9ydCBjb25zdCBFdmVudFByb21pc2UgPSAoLi4uYXJncykgPT5cbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5UbyguLi5hcmdzKVxuICAgICAgICAuZm9yRWFjaChyZXNvbHZlKVxuICAgICAgICAuY2F0Y2gocmVqZWN0KVxuICAgICAgICAuY2xlYXIoKCkgPT4gdHJ1ZSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbiIsImltcG9ydCBtcyBmcm9tICdtcydcblxuLyoqXG4gKiBUaGVuYWJsZSBzZXRUaW1lb3V0LiBVc2VzIFByb21pc2UgaW50ZXJuYWxseS5cbiAqIFRoZSBQcm9taXNlIHJlc29sdmVzIHdpdGggdW5kZWZpbmVkLlxuICpcbiAqIEB0b2RvIENvdWxkIGJlIHJlZmFjdG9yZWQgdG8gdXNlIGFuIGVtcHR5IHByb21pc2VcbiAqXG4gKiBAbWVtYmVyb2ZcbiAqIEBmdW5jdGlvbiB0aW1lb3V0XG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IHRpbWUgLSBTdHJpbmcgZGVzY3JpcHRpb24gb2YgdGltZSBvciBtaWxsaXNlY29uZHMgaWYgbnVtYmVyLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIHRoZW5hYmxlIG9iamVjdCBmb3IgY2hhaW5pbmcuXG4gKlxuICogQGV4YW1wbGVcbiAqIHRpbWVvdXQoJzEwcycpLnRoZW4oKCkgPT4ge1xuICogICBjb25zb2xlLmxvZygnSXQgaGFzIGJlZW4gMTAgc2Vjb25kcyEnKVxuICogfSlcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gVXNlIGFyZ3VtZW50IGRlZmF1bHRzIHRvIHBhc3NcbiAqIC8vIHZhbHVlcyB3aGVuIHRoZSBwcm9taXNlIHJlc29sdmVzLlxuICogdGltZW91dCgnMTBzJykudGhlbigocmVzdWx0ID0gNSkgPT4ge1xuICogICBjb25zb2xlLmxvZygnVGhlIHJlc3VsdCBpcycsIHJlc3VsdClcbiAqIH0pIC8vIFRoZSByZXN1bHQgaXMgNVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBDYWxsIHJlc29sdmUgdG8gcmVzb2x2ZSB0aGUgcHJvbWlzZSBpbW1lZGlhdGVseS5cbiAqIC8vIFRoZSBwcm9taXNlIHdpbGwgcmVzb2x2ZSB3aXRoIHRoZSB2YWx1ZSB5b3UgcGFzcyB0byBpdC5cbiAqIHRpbWVvdXQoJzEwcycpLnRoZW4oKHJlc3VsdCA9IDUpID0+IHtcbiAqICAgY29uc29sZS5sb2coJ1RoZSByZXN1bHQgaXMnLCByZXN1bHQpXG4gKiB9KS5yZXNvbHZlKDYpIC8vIFRoZSByZXN1bHQgaXMgNlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dCh0aW1lKSB7XG4gIGNvbnN0IG1pbGxpc2Vjb25kcyA9IHR5cGVvZiB0aW1lID09PSAnc3RyaW5nJyA/IG1zKHRpbWUpIDogdGltZVxuXG4gIGxldCB0aW1lb3V0SWRcbiAgbGV0IHByb21pc2VSZXNvbHZlXG4gIGxldCBwcm9taXNlUmVqZWN0XG5cbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHByb21pc2VSZXNvbHZlID0geCA9PiByZXNvbHZlKHgpXG4gICAgICBwcm9taXNlUmVqZWN0ID0geCA9PiByZWplY3QoeClcblxuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHJvbWlzZVJlc29sdmUgPSAoKSA9PiB7fVxuICAgICAgICAgIHByb21pc2VSZWplY3QgPSAoKSA9PiB7fVxuXG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9XG4gICAgICB9LCBtaWxsaXNlY29uZHMpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG5cbiAgY29uc3QgbWV0aG9kcyA9IHtcbiAgICAvKipcbiAgICAgKiBBZGQgYW5vdGhlciBmdW5jdGlvbiB0byB0aGUgUHJvbWlzZSBjaGFpbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtZXRob2RzIG9iamVjdFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aW1lb3V0KCc1cycpLnRoZW4oKCkgPT4ge1xuICAgICAqICAgY29uc29sZS5sb2coJzUgc2Vjb25kcyBoYXZlIHBhc3NlZC4nKVxuICAgICAqIH0pXG4gICAgICovXG4gICAgdGhlbjogZm4gPT4ge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihmbilcbiAgICAgIHJldHVybiBtZXRob2RzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhdGNoIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtZXRob2RzIG9iamVjdFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aW1lb3V0KCc1cycpXG4gICAgICogICAudGhlbigoKSA9PiB7XG4gICAgICogICAgIHRocm93ICdObywgbm8gcXVpZXJvLidcbiAgICAgKiAgIH0pXG4gICAgICogICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKCdKdXN0IGRvIGl0LicpXG4gICAgICogICB9KVxuICAgICAqL1xuICAgIGNhdGNoOiBmbiA9PiB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS5jYXRjaChmbilcbiAgICAgIHJldHVybiBtZXRob2RzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgdGhlIHRpbWVyLlxuICAgICAqIFRoZSBwcm9taXNlIHdpbGwgcmVtYWluIHBlbmRpbmcsXG4gICAgICogYW5kIGNhbiBiZSByZXNvbHZlZCBhbmQgcmVqZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHRpbWVyID0gdGltZW91dCgnNXMnKVxuICAgICAqIHRpbWVyLmNsZWFyKClcbiAgICAgKi9cbiAgICBjbGVhcjogKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIHRpbWVvdXQgYW5kIHJlc29sdmUgdGhlIHByb21pc2UgaW1tZWRpYXRlbHkgd2l0aCB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIHJlc29sdmVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHBhc3MgdG8gcmVzb2x2ZSgpLlxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9IFJldHVybnMgdW5kZWZpbmVkXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRpbWVvdXQoJzVzJykucmVzb2x2ZSgnRG9uZSEnKVxuICAgICAqL1xuICAgIHJlc29sdmU6IHggPT4ge1xuICAgICAgbWV0aG9kcy5jbGVhcigpXG4gICAgICBwcm9taXNlUmVzb2x2ZSh4KVxuICAgICAgcmV0dXJuIG1ldGhvZHNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIHRpbWVvdXQgYW5kIHJlc29sdmUgdGhlIHByb21pc2UgaW1tZWRpYXRlbHkgd2l0aCB0aGUgcGFyYW1ldGVyIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmN0aW9uIHJlamVjdFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gcGFzcyB0byByZWplY3QoKS5cbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfSBSZXR1cm5zIHVuZGVmaW5lZFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aW1lb3V0KCc1cycpLnJlamVjdCgnTm8gc291cCBmb3IgeW91IScpXG4gICAgICovXG4gICAgcmVqZWN0OiB4ID0+IHtcbiAgICAgIG1ldGhvZHMuY2xlYXIoKVxuICAgICAgcHJvbWlzZVJlamVjdCh4KVxuICAgICAgcmV0dXJuIG1ldGhvZHNcbiAgICB9LFxuXG4gICAgLyoqIFRoZSBpZCByZXR1cm5lZCBieSBzZXRUaW1lb3V0ICovXG4gICAgdGltZW91dElkXG4gIH1cblxuICByZXR1cm4gbWV0aG9kc1xufVxuIiwiaW1wb3J0IHsgdGltZW91dCB9IGZyb20gJy4vdGltZW91dCdcblxuLyoqXG4gKiBBIFByb21pc2UgYmFzZWQgZGVib3VuY2UgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB3aXRoIHRydWVcbiAqIG9ubHkgYWZ0ZXIgdGhlIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBjYWxsZWRcbiAqIGZvciBhIGNlcnRhaW4gYW1vdW50IG9mIHRpbWUuXG4gKiBXaGVuIHRoZSBkZWJvdW5jZXIgaXMgY2FsbGVkIGEgc2Vjb25kIHRpbWUsXG4gKiB0aGUgZmlyc3QgcHJvbWlzZSBpbW1lZGlhdGVseSByZXNvbHZlcyB0byBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCopOmJvb2xlYW58c3RyaW5nfG51bWJlcn0gZGVib3VuY2VDYWxsYmFjayAtIENhbGxiYWNrIGZvciBlYWNoIHRpbWUgdGhlIGRlYm91bmNlciBpcyBjYWxsZWQuXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oKik6VGltZW91dFByb21pc2U8Ym9vbGVhbj59IFJldHVybnMgYSBkZWJvdW5jZXIgZnVuY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIERlYm91bmNlIGZvciA1bXNcbiAqIGNvbnN0IGRlYm91bmNlciA9IGRlYm91bmNlKCgpID0+IDUpXG4gKiBkZWJvdW5jZXIoKS50aGVuKCkgLy8gUmVzb2x2ZXMgdG8gZmFsc2VcbiAqIGRlYm91bmNlcigpLnRoZW4oKSAvLyBSZXNvbHZlcyB0byB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGRlYm91bmNlciA9IGRlYm91bmNlKHRleHQgPT4ge1xuICogICBpZiAodGV4dCA9PT0gJycpIHtcbiAqICAgICAvLyBSZXNvbHZlIGJvdGggdGhlIHBlbmRpbmcgcHJvbWlzZVxuICogICAgIC8vIGFuZCB0aGlzIG9uZSB0byBmYWxzZVxuICogICAgIHJldHVybiBmYWxzZVxuICogICB9XG4gKiAgIGlmICh0ZXh0LmluY2x1ZGVzKCdcXG4nKSkge1xuICogICAgIC8vIFJlc29sdmUgYm90aCBwcm9taXNlcyB0byB0cnVlXG4gKiAgICAgcmV0dXJuIHRydWVcbiAqICAgfSBlbHNlIHtcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBwcmV2IHByb21pc2UgdG8gZmFsc2VcbiAqICAgICAvLyBBbmQgcmVzb2x2ZSB0aGUgY3VycmVudCBwcm9taXNlIGluIDVtc1xuICogICAgIHJldHVybiA1XG4gKiAgIH1cbiAqIH0pXG4gKlxuICogZGVib3VuY2VyKCdzdGlsbCB0eXBpbmcnKSAvLyBEZWJvdW5jZVxuICogZGVib3VuY2VyKCcnKSAvLyBEb24ndCBjb250aW51ZSwgbm8gaW5wdXRcbiAqIGRlYm91bmNlcignZG9uZSB0eXBpbmdcXG4nKSAvLyBSZXNvbHZlIGltbWVkaWF0ZWx5XG4gKi9cbmV4cG9ydCBjb25zdCBkZWJvdW5jZSA9IGZuID0+IHtcbiAgbGV0IHByb21pc2UgPSBudWxsXG5cbiAgcmV0dXJuIHggPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKHgpXG5cbiAgICAvLyBoYW5kbGUgb2xkIHByb21pc2VcbiAgICBpZiAocHJvbWlzZSkge1xuICAgICAgcHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgICAgcHJvbWlzZSA9IG51bGxcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgbmV3IHByb21pc2VcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gdGltZW91dCgwKS5yZXNvbHZlKHJlc3VsdClcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZSA9IHRpbWVvdXQocmVzdWx0KS50aGVuKCh4ID0gdHJ1ZSkgPT4geClcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgbXMgZnJvbSAnbXMnXG5pbXBvcnQgeyBCdW1ibGVTdHJlYW0gfSBmcm9tICcuLi9ldmVudC1zdHJlYW0nXG5cbi8qKlxuICogTWFwcGFibGUgc2V0SW50ZXJ2YWwuIFVzZXMgQnVtYmxlU3RyZWFtIGludGVybmFsbHkuXG4gKlxuICogQGZ1bmN0aW9uIGludGVydmFsXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZSAtIFJlcHJlc2VudHMgdGltZSBiZXR3ZWVuIGludGVydmFscy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSBCdW1ibGVTdHJlYW1DaGFpbiBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGludGVydmFsKCcxMHMnKS5mb3JFYWNoKCh4KSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKHgsICd0aW1lcycpXG4gKiB9KVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJ2YWwodGltZSkge1xuICBjb25zdCBtaWxsaXNlY29uZHMgPSB0eXBlb2YgdGltZSA9PT0gJ3N0cmluZycgPyBtcyh0aW1lKSA6IHRpbWVcblxuICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICAvLyBDcmVhdGUgY291bnRlclxuICAgIGxldCBjb3VudCA9IDBcblxuICAgIC8vIFN0YXJ0IGludGVydmFsLCBwYXNzIGNvdW50IHRvIGNhbGxiYWNrLCBpbmNyZW1lbnQgY291bnRcbiAgICBjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKGNvdW50KVxuICAgICAgY291bnQrK1xuICAgIH0sIG1pbGxpc2Vjb25kcylcblxuICAgIC8vIFJldHVybiBmdW5jdGlvbiB0byBzdG9wIGludGVydmFsXG4gICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwoaWQpXG4gIH0pXG59XG4iLCJpbXBvcnQgeyB0aW1lb3V0IH0gZnJvbSAnLi90aW1lb3V0J1xuXG4vKipcbiAqIEB0b2RvXG4gKiBUaHJvdHRsZSBzaG91bGQgcmVzb2x2ZSB0aGUgbW9zdCByZWNlbnQgcHJvbWlzZSxcbiAqIG5vdCB0aGUgZmlyc3QgcHJvbWlzZS4gU2VlIHRoZSBmaXJzdCBleGFtcGxlLlxuICpcbiAqIEEgUHJvbWlzZSBiYXNlZCB0aHJvdHRsZSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHdpdGggdHJ1ZVxuICogYWZ0ZXIgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUuIFdoZW4gdGhlIHRob3R0bGVyIGlzIGNhbGxlZFxuICogYSBzZWNvbmQgdGltZSBiZWZvcmUgdGhlIGZpcnN0IHByb21pc2UgcmVzb2x2ZXMsXG4gKiB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpbW1lZGlhdGVseSByZXNvbHZlcyB0byBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCopOmJvb2xlYW58c3RyaW5nfG51bWJlcn0gZm4gLSBDYWxsYmFjayBmb3IgZWFjaCB0aW1lIHRoZSB0aHJvdHRsZXIgaXMgY2FsbGVkLlxuICogQHJldHVybnMge2Z1bmN0aW9uKCopOlRpbWVvdXRQcm9taXNlPGJvb2xlYW4+fSBSZXR1cm5zIGEgdGhyb3R0bGVyIGZ1bmN0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBEZWJvdW5jZSBmb3IgNW1zXG4gKiBjb25zdCB0aHJvdHRsZXIgPSB0aHJvdHRsZSgoKSA9PiA1KVxuICogdGhyb3R0bGVyKCkudGhlbigpIC8vIFJlc29sdmVzIHRvIHRydWUgYWZ0ZXIgNW1zXG4gKiB0aHJvdHRsZXIoKS50aGVuKCkgLy8gUmVzb2x2ZXMgdG8gZmFsc2Ugbm93XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHRocm90dGxlciA9IHRocm90dGxlKHRleHQgPT4ge1xuICogICBpZiAodGV4dCA9PT0gJycpIHtcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBwcmV2aW91cyB0byBmYWxzZSBub3dcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBjdXJyZW50IHByb21pc2UgdG8gZmFsc2Ugbm93XG4gKiAgICAgLy8gQ2xlYXIgdGhlIHRpbWVvdXRcbiAqICAgICByZXR1cm4gZmFsc2VcbiAqICAgfVxuICogICBpZiAodGV4dC5pbmNsdWRlcygnXFxuJykpIHtcbiAqICAgICAvLyBSZXNvbHZlIHRoZSBwcmV2aW91cyBwcm9taXNlIHRvIGZhbHNlIG5vd1xuICogICAgIC8vIGFuZCB0aGUgY3VycmVudCBwcm9taXNlIHRvIHRydWUgbm93XG4gKiAgICAgLy8gQ2xlYXIgdGhlIHRpbWVvdXRcbiAqICAgICByZXR1cm4gdHJ1ZVxuICogICB9IGVsc2Uge1xuICogICAgIC8vIFJlc29sdmUgdGhlIHByZXZpb3VzIHByb21pc2UgdG8gZmFsc2Ugbm93XG4gKiAgICAgLy8gUmVzb2x2ZSB0aGUgY3VycmVudCBwcm9taXNlIHRvIHRydWUgYWZ0ZXIgNW1zXG4gKiAgICAgcmV0dXJuIDVcbiAqICAgfVxuICogfSlcbiAqXG4gKiB0aHJvdHRsZXIoJ3N0aWxsIHR5cGluZycpIC8vIFJlc29sdmUgZXZlcnkgNW1zXG4gKiB0aHJvdHRsZXIoJycpIC8vIFJlc29sdmUgYm90aCB0byBmYWxzZSBub3dcbiAqIHRocm90dGxlcignZG9uZSB0eXBpbmdcXG4nKSAvLyBSZXNvbHZlIGJvdGggdG8gdHJ1ZSBub3dcbiAqL1xuZXhwb3J0IGNvbnN0IHRocm90dGxlID0gZm4gPT4ge1xuICBsZXQgcHJvbWlzZSA9IG51bGxcblxuICByZXR1cm4geCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gZm4oeClcblxuICAgIC8vIGhhbmRsZSBvbGQgcHJvbWlzZVxuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgcHJvbWlzZSA9IHRpbWVvdXQocmVzdWx0KVxuICAgICAgICAvLyBDbGVhbiB1cCBwcm9taXNlXG4gICAgICAgIC50aGVuKCh4ID0gdHJ1ZSkgPT4ge1xuICAgICAgICAgIHByb21pc2UgPSBudWxsXG4gICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgfSlcblxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdib29sZWFuJykge1xuICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3VsdClcbiAgICB9XG5cbiAgICByZXR1cm4gdGltZW91dCgwKS5yZXNvbHZlKGZhbHNlKVxuICB9XG59XG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0gQk9PTEVBTiAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5leHBvcnQgY29uc3Qgbm90ID0gZm4gPT4gKC4uLngpID0+ICFmbiguLi54KVxuZXhwb3J0IGNvbnN0IGJvb2wgPSBmbiA9PiAoLi4ueCkgPT4gISFmbiguLi54KVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0gQ09OU09MRSAtLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5leHBvcnQgY29uc3QgbG9nID0gbXNnID0+IHggPT4ge1xuICBjb25zb2xlLmxvZyhtc2csIHgpXG4gIHJldHVybiB4XG59XG5cbmV4cG9ydCBjb25zdCBlcnJvciA9IG1zZyA9PiB4ID0+IHtcbiAgY29uc29sZS5lcnJvcihtc2csIHgpXG4gIHJldHVybiB4XG59XG4iLCJpbXBvcnQgZmxvdyBmcm9tICdsb2Rhc2gvZnAvZmxvdydcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC9mcC9pc0VxdWFsJ1xuaW1wb3J0IHsgbm90IH0gZnJvbSAnLi9vcGVyYXRvcnMnXG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBhbiBvcGVyYXRpb24gb24gdGhlIGZpcnN0IGFyZ3VtZW50cyBmcm9tIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxscy5cbiAqIE5vdGU6IFRoZSBzdGF0ZSBtYWludGFpbmVkIGJ5IHRoaXMgZnVuY3Rpb24gbWVhbnMgdGhhdCBpdCBzaG91bGQgYmUgY29tcG9zZWQgb3V0c2lkZSB0aGUgZmluYWwgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihhLCBiKX0gZm4gLSBDYWxsYmFja1xuICogQHJldHVybnMge2Z1bmN0aW9uKGEpfSBDYWxscyB0aGUgY2FsbGJhY2sgd2l0aCBib3RoIHRoZSBmaXJzdCBhcmd1bWVudCBmcm9tIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxscy5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gU2V0IHVwIHdpdGhQcmV2IHRvIHJldHVybiB0cnVlXG4gKiAvLyBpZiBwcmV2aW91cyBhbmQgY3VycmVudCBhcmd1bWVudHMgYXJlIG5vdCBlcXVhbFxuICogY29uc3QgaGFzQ2hhbmdlZCA9IHdpdGhQcmV2KG5vdChpc0VxdWFsKSlcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gUHJldmlvdXMgY2FsbCBhcmd1bWVudCBpcyB1bmRlZmluZWRcbiAqIGhhc0NoYW5nZWQoNSkgLy8gLT4gdHJ1ZVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBQcmV2aW91cyBhbmQgY3VycmVudCBjYWxscyB3aXRoIHNhbWUgYXJndW1lbnRzXG4gKiBoYXNDaGFuZ2VkKDUpIC8vIC0+IHRydWVcbiAqIGhhc0NoYW5nZWQoNSkgLy8gLT4gZmFsc2VcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gUHJldmlvdXMgYW5kIGN1cnJlbnQgY2FsbHMgd2l0aCBkaWZmZXJlbnQgYXJndW1lbnRzXG4gKiBoYXNDaGFuZ2VkKDUpIC8vIC0+IHRydWVcbiAqIGhhc0NoYW5nZWQoNikgLy8gLT4gdHJ1ZVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBQcmV2aW91cyBjYWxsIGFyZ3VtZW50IGlzIHVuZGVmaW5lZFxuICogaGFzQ2hhbmdlZCh1bmRlZmluZWQpIC8vIC0+IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCB3aXRoUHJldiA9IChmbiwgaW5pdGlhbFZhbHVlKSA9PiB7XG4gIGxldCBwcmV2aW91cyA9IGluaXRpYWxWYWx1ZVxuXG4gIHJldHVybiBjdXJyZW50ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBmbihwcmV2aW91cywgY3VycmVudClcblxuICAgIC8vIFNhdmUgY3VycmVudCB2YWx1ZSBmb3IgbmV4dCBjYWxsXG4gICAgcHJldmlvdXMgPSBjdXJyZW50XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSByZWR1Y2VyIGZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYW4gb3BlcmF0aW9uIG9uIHRoZSBmaXJzdCBjdXJyZW50IGFyZ3VtZW50IGFuZCBwcmV2aW91cyByZXN1bHQuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihhLCBiKX0gZm4gLSBDYWxsYmFja1xuICogQHJldHVybnMge2Z1bmN0aW9uKGEpfSBDYWxscyB0aGUgY2FsbGJhY2sgd2l0aCBib3RoIHRoZSBjdXJyZW50IGFyZ3VtZW50IGFuZCB0aGUgcHJldmlvdXMgcmVzdWx0XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFNldCB1cCB3aXRoUHJldiB0byByZXR1cm4gdHJ1ZVxuICogLy8gaWYgcHJldmlvdXMgYW5kIGN1cnJlbnQgYXJndW1lbnRzIGFyZSBub3QgZXF1YWxcbiAqIGNvbnN0IHN1bSA9IHdpdGhQcmV2UmVzdWx0KGFkZCwgMClcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQWRkIHRvIGluaXRpYWwgdmFsdWVcbiAqIHN1bSg1KSAvLyAtPiA1XG4gKiAvLyBBZGQgdG8gcHJldmlvdXMgcmVzdWx0XG4gKiBzdW0oNikgLy8gLT4gMTFcbiAqL1xuZXhwb3J0IGNvbnN0IHdpdGhQcmV2UmVzdWx0ID0gKGZuLCBpbml0aWFsVmFsdWUpID0+IHtcbiAgbGV0IHByZXZpb3VzID0gaW5pdGlhbFZhbHVlXG5cbiAgcmV0dXJuIGN1cnJlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKHByZXZpb3VzLCBjdXJyZW50KVxuXG4gICAgLy8gU2F2ZSBjdXJyZW50IHJlc3VsdCBmb3IgbmV4dCBjYWxsXG4gICAgcHJldmlvdXMgPSByZXN1bHRcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYW4gb3BlcmF0aW9uIG9uIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxsIGFyZ3VtZW50c1xuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oQXJyYXk8YT4sIEFycmF5PGI+KX0gZm4gLSBDYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufSBDYWxscyB0aGUgY2FsbGJhY2sgd2l0aCBib3RoIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBjYWxsIGFyZ3VtZW50c1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsb2dQcmV2QW5kQ3VycmVudEFyZ3MgPSB3aXRoUHJldkFyZ3MoKHByZXYsIGN1cnJlbnQpID0+IHtcbiAqICAgY29uc29sZS5sb2coJ3ByZXZpb3VzIGFyZ3M6JywgcHJldilcbiAqICAgY29uc29sZS5sb2coJ2N1cnJlbnQgYXJnczonLCBjdXJyZW50KVxuICogfSwgWzEsIDIsIDNdKVxuICpcbiAqIGxpc3RlblRvKGV2ZW50KVxuICogICAuZm9yRWFjaChsb2dQcmV2QW5kQ3VycmVudEFyZ3MpXG4gKlxuICogLy8gRmlyc3QgZXZlbnQ6XG4gKiAvLyBwcmV2aW91cyBhcmdzOiBbMSwgMiwgM11cbiAqIC8vIGN1cnJlbnQgYXJnczogWzQsIDUsIDZdXG4gKlxuICogLy8gU2Vjb25kIGV2ZW50OlxuICogLy8gcHJldmlvdXMgYXJnczogWzQsIDUsIDZdXG4gKiAvLyBjdXJyZW50IGFyZ3M6IFs3LCA4LCA5XVxuICovXG5leHBvcnQgY29uc3Qgd2l0aFByZXZBcmdzID0gKGZuLCAuLi5pbml0aWFsVmFsdWVzKSA9PiB7XG4gIGxldCBwcmV2aW91cyA9IGluaXRpYWxWYWx1ZXNcblxuICByZXR1cm4gKC4uLmN1cnJlbnQpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBmbihwcmV2aW91cywgY3VycmVudClcblxuICAgIC8vIFNhdmUgY3VycmVudCByZXN1bHQgZm9yIG5leHQgY2FsbFxuICAgIHByZXZpb3VzID0gY3VycmVudFxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG5cbndpdGhQcmV2LnJlc3VsdCA9IHdpdGhQcmV2UmVzdWx0XG53aXRoUHJldi5hcmdzID0gd2l0aFByZXZBcmdzXG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhpc1xuICogY2FsbCdzIGFyZ3VtZW50IGlzIGRpZmZlcmVudCB0aGFuIHRoZSBsYXN0IGNhbGwuXG4gKiBNYWludGFpbnMgb3duIHN0YXRlIHVzaW5nIGEgY2xvc3VyZS5cbiAqIEluc3RhbnRpYXRlIGZvciBlYWNoIHBsYWNlIHlvdSB1c2UgaXQuXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBJbnN0YW5jZSBvZiBoYXNDaGFuZ2VkXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGhhc0NoYW5nZWQgPSBjcmVhdGVIYXNDaGFuZ2VkKClcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXBvc2VIYXNDaGFuZ2VkID0gZm4gPT5cbiAgZmxvdyhcbiAgICBmbixcbiAgICB3aXRoUHJldihub3QoaXNFcXVhbCkpLFxuICApXG4iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogICAgICAgICAgICAgIEJVTUJMRSBFVkVOVCBTVFJFQU0gICAgICAgICAgICAgKi9cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmV4cG9ydCB7IEJ1bWJsZVN0cmVhbSB9IGZyb20gJy4vZXZlbnQtc3RyZWFtJ1xuZXhwb3J0IHsgbGlzdGVuVG8gfSBmcm9tICcuL2xpc3Rlbi10bydcbmV4cG9ydCB7IEV2ZW50UHJvbWlzZSB9IGZyb20gJy4vZXZlbnQtcHJvbWlzZSdcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qICAgICAgICAgICAgICAgICAgICBUSU1FUlMgICAgICAgICAgICAgICAgICAgICovXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5leHBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJy4vdGltZXJzL2RlYm91bmNlJ1xuZXhwb3J0IHsgaW50ZXJ2YWwgfSBmcm9tICcuL3RpbWVycy9pbnRlcnZhbCdcbi8vIFRocm90dGxlIGlzIG5vdCByZWFkeVxuZXhwb3J0IHsgdGhyb3R0bGUgfSBmcm9tICcuL3RpbWVycy90aHJvdHRsZSdcbmV4cG9ydCB7IHRpbWVvdXQgfSBmcm9tICcuL3RpbWVycy90aW1lb3V0J1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogICAgICAgICAgICAgICAgICAgIEhFTFBFUlMgICAgICAgICAgICAgICAgICAgKi9cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmV4cG9ydCB7IHdpdGhQcmV2LCBjb21wb3NlSGFzQ2hhbmdlZCB9IGZyb20gJy4vaGVscGVycy93aXRoLXByZXYnXG5leHBvcnQgeyBsb2csIG5vdCwgYm9vbCwgZXJyb3IgfSBmcm9tICcuL2hlbHBlcnMvb3BlcmF0b3JzJ1xuIl0sIm5hbWVzIjpbIm1hcCIsIndyYXBwZXJzLm1hcCIsImZvckVhY2giLCJ3cmFwcGVycy5mb3JFYWNoIiwiZmlsdGVyIiwid3JhcHBlcnMuZmlsdGVyIiwiY2xlYXIiLCJ3cmFwcGVycy5jbGVhciIsImhhbmRsZUVycm9yIiwid3JhcHBlcnMuaGFuZGxlRXJyb3IiLCJhd2FpdE1hcCIsIndyYXBwZXJzLmF3YWl0TWFwIiwiYXdhaXRGaWx0ZXIiLCJ3cmFwcGVycy5hd2FpdEZpbHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFPLE1BQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUs7RUFDNUQsSUFBSTtJQUNGLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO01BQ2pCLE9BQU87UUFDTCxHQUFHO1FBQ0gsSUFBSTtRQUNKLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztPQUM1QjtLQUNGLE1BQU07TUFDTCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0tBQ3BDO0dBQ0YsQ0FBQyxPQUFPLEtBQUssRUFBRTtJQUNkLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtHQUM1QjtDQUNGOztBQ2RNLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDO0VBQy9CLEdBQUc7RUFDSCxLQUFLO0VBQ0wsTUFBTTtFQUNOLElBQUk7Q0FDTCxLQUFLO0VBQ0osSUFBSTtJQUNGLElBQUksS0FBSyxFQUFFO01BQ1QsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7S0FDM0MsTUFBTSxJQUFJLEdBQUcsRUFBRTtNQUNkLE9BQU87UUFDTCxHQUFHLEVBQUUsTUFB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
