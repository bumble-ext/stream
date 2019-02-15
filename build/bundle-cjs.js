'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Set the badge text for the browser action.
 * Omit the details object to clear text.
 * See the [Chrome API Docs](https://developer.chrome.com/extensions/browserAction#method-setBadgeText)
 * and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setBadgeText).
 *
 * @memberof browserAction
 * @function setBadgeText
 * @param {Object} details - Badge text options.
 * @param {string|false} details.text - The text to set on the browser action badge.
 * @param {number} [details.tabId] - Set the badge text only for the given tab. The text is reset when the user navigates this tab to a new page.
 * @returns {Promise} Resolves after badgetext has been set. Rejects if there was an error.
 *
 * @example
 * browserAction.setBadgeText({ text: 'something' })
 *
 */
const setBadgeText = ({ text, tabId } = { text: '' }) =>
  new Promise((resolve, reject) => {
    try {
      chrome.browserAction.setBadgeText(
        { text: text === false ? '' : text, tabId },
        () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve();
          }
        },
      );
    } catch (error) {
      reject(error);
    }
  });

/**
 * Set the badge background color for the browser action.
 * See the [Chrome API Docs](https://developer.chrome.com/extensions/browserAction#method-setBadgeBackgroundColor)
 * and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setBadgeBackgroundColor).
 *
 * @memberof browserAction
 * @function setBadgeColor
 * @param {Object} details - Badge text options.
 * @param {string} details.color - The hex value of the background color for the badge.
 * @param {number} [details.tabId] - Set the badge color only for the given tab.
 * @returns {Promise} Resolves after badge background color has been set. Rejects if there was an error.
 *
 * @example
 * // Bulma Red
 * browserAction.setBadgeColor({ color: '#FF3860' })
 * // Bulma Orange
 * browserAction.setBadgeColor({ color: '#FF470F' })
 * // Default - Bulma Blue
 * browserAction.setBadgeColor()
 *
 */
const setBadgeColor = (details = { color: '#209CEE' }) =>
  new Promise((resolve, reject) => {
    try {
      chrome.browserAction.setBadgeBackgroundColor(
        details,
        () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve();
          }
        },
      );
    } catch (error) {
      reject(error);
    }
  });

/**
 * Set the tooltip text for the browser action.
 * Omit the details object to use the extension name.
 * See the [Chrome API Docs](https://developer.chrome.com/extensions/browserAction#method-setTitle)
 * and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setTitle).
 *
 * @memberof browserAction
 * @function setTitle
 * @param {Object} [details] - Title text options.
 * @param {string|null} [details.title = null] - The text to set on the browser action title.
 * @param {number} [details.tabId] - Set the title text only for the given tab. The text is reset when the user navigates this tab to a new page.
 * @param {number} [details.windowId] - Set the title text only for the given window.
 * @returns {Promise} Resolves after title has been set. Rejects if there was an error.
 *
 * @example
 * browserAction.setTitle({ title: 'something' })
 *
 */
const setTitle = (details = { title: null }) =>
  new Promise((resolve, reject) => {
    try {
      chrome.browserAction.setTitle(details, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });

/**
 * Set the icon for the browser action.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/browserAction#method-setIcon)
 * and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setIcon).
 *
 * @memberof browserAction
 * @function setIcon
 * @param {Object} details - Object: {path:string, tabId(optional)}.
 * @returns {Promise} Resolves after icon has been set.
 *
 * @example
 * browserAction.setIcon({path: 'icon-16.png'})
 * */
const setIcon = details =>
  new Promise((resolve, reject) => {
    try {
      chrome.browserAction.setIcon(details, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });

// /**
//  * Disable or enable the browser action for a tab or overall.
//  * See [Chrome API Docs](https://developer.chrome.com/extensions/browserAction#method-setIcon)
//  * and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setIcon).
//  *
//  * @memberof browserAction
//  * @function setIcon
//  * @param {Object} [details] - Default disables globally
//  * @param {bool|number} [details.disable] - Boolean to disable globally, or tabId to set for a single tab.
//  * @param {bool|number} [details.enable] - Boolean to enable globally, or tabId to set for a single tab.
//  * @returns {Promise} Resolves after the operation is complete. Rejects upon failure.
//  *
//  * @example
//  * browserAction.setIcon({path: 'icon-16.png'})
//  * */
// const setDisabled = ({ disable = true, enable } = {}) =>
//   new Promise((resolve, reject) => {
//     try {
//       if (disable !== undefined) {
//         chrome.browserAction.disable(() => {
//           if (chrome.runtime.lastError) {
//             reject(chrome.runtime.lastError.message)
//           } else {
//             resolve()
//           }
//         })
//       }
//     } catch (error) {
//       reject(error)
//     }
//   })

/**
 * Set multiple browser action properties at once.
 *
 * Use browser actions to put icons in the main Google Chrome toolbar, to the right of the address bar.
 * In addition to its icon, a browser action can have a tooltip, a badge, and a popup.
 *
 * See the [Chrome API docs](https://developer.chrome.com/extensions/browserAction)
 * and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction).
 *
 * @function browserAction
 * @param {Object} details - Browser action properties to set.
 * @returns {Promise} Resolves after all properties are set, rejects with reason if a property was not set.
 *
 * @todo Implement badgeColor
 * @todo Implement title
 * @todo Implement popup
 *
 * @example
 * browserAction({
 *   badgeText: 'something',
 *   icon: 'icon2.png',
 *   // badgeColor: '#666',
 *   // title: 'browser action!',
 *   // popup: 'popup.html',
 * }).then(() => {
 *   console.log('All the browser action properties were set.')
 * }).catch((error) => {
 *   console.error('Could not set a browser action property.')
 * })
 *
 * @example
 * browserAction.set({
 *   superGalactic: true,
 * }).catch((error) => {
 *   console.error('Invalid argument: Unrecognized browser action property.')
 * })
 */
const setAll = details =>
  Promise.all(
    Object.entries(details).map(([key, value]) => {
      switch (key) {
        case 'icon':
          return setIcon({ path: value })
        case 'title':
          return setTitle({ title: value })
        case 'badgeText':
          return setBadgeText({ text: value })
        case 'badgeColor':
          return setBadgeColor({ color: value })
        default:
          return Promise.reject(
            new TypeError(
              'Invalid argument: Unrecognized browser action property:' +
                key,
            ),
          )
      }
    }),
  );

const browserAction = setAll;

Object.assign(browserAction, {
  set: setAll,
  setBadgeText,
  setBadgeColor,
  setIcon,
  setTitle,
});

/**
 * Store one or more items in the storage area, or update existing items.
 * When you store or update a value using this API, the onChanged event will fire.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-set)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set).
 *
 * @memberof storageLocal
 * @function set
 * @param {Object} values - An object containing one or more key/value pairs to be stored in storage. If an item already exists, its value will be updated.
 * @returns {Promise} Resolves on success or rejects on failure.
 *
 * @example
 * // Save primitive values or Arrays to storage.
 * local.set({ email: 'sample@gmail.com' })
 *   .then(() => {
 *     console.log('The item "email" was set.')
 *   })
 *
 * @example
 * // Storage cannot save other types,
 * // such as Function, Date, RegExp, Set, Map, ArrayBuffer and so on.
 * local.set({ dogs: new Set(['Fluffy', 'Duke', 'Baby']) })
 *   .catch((error) => {
 *     console.log('There was a problem!')
 *   })
 *
 */
const set = values => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(values, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Retrieves one or more items from the storage area.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-get)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/get).
 *
 * @memberof storageLocal
 * @function get
 * @param {string|Array<string>} keys - A string or array of key names to retrieve from storage. If keys is undefined, returns all items in storage.
 * @returns {Promise<Object>} Resolves with an object representing the values of the items or rejects on failure.
 *
 * @example
 * local.get('cats')
 *   .then(({cats}) => {
 *     console.log('Cats!', cats)
 *   })
 *
 * @example
 * local.get()
 *   .then((allItems) => {
 *     console.log('Every item in storage:', allItems)
 *   })
 *
 * @example
 * local.get(['cats', 'dogs'])
 *   .then(({cats, dogs}) => {
 *     console.log('Cats!', cats)
 *     console.log('Dogs!', dogs)
 *   })
 *
 */
const get = keys => {
  return new Promise((resolve, reject) => {
    try {
      if (!keys || !keys.length) {
        chrome.storage.local.get(null, keyValueObj => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(keyValueObj);
          }
        });
      } else {
        chrome.storage.local.get(keys, keyValueObj => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(keyValueObj);
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Removes all items from the storage area.
 *
 * See
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-clear)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/clear).
 *
 * @memberof storageLocal
 * @function clear
 * @returns {Promise} Resolves on success or rejects on failure.
 *
 * @example
 * local.clear()
 *   .then(() => {
 *     console.log('Storage was cleared.')
 *   })
 */
const clear = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Removes one or more items from the storage area.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-remove)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/remove).
 *
 * @memberof storageLocal
 * @function remove
 * @param {string|Array<string>} keys - A string, or array of strings, representing the key(s) of the item(s) to be removed.
 * @returns {Promise} Resolves on success or rejects on failure.
 *
 * @example
 * local.remove('key')
 *   .then(() => {
 *     console.log('The property "key" was removed.')
 *   })
 *
 * @example
 * local.remove(['key', 'lock'])
 *   .then(() => {
 *     console.log('The property "key" was removed.')
 *     console.log('The property "lock" was removed.')
 *   })
 *
 *
 */
const remove = keys => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(keys, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * This is a wrapper for the local Chrome extension storage API.
 * Enables extensions to store and retrieve data, and listen for changes to stored items.
 *
 * See the [Chrome API Docs](https://developer.chrome.com/extensions/storage),
 * and [MDN storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage#Properties).
 *
 * @namespace
 */
const storageLocal = {
  set,
  get,
  clear,
  remove,
};

/**
 * Store one or more items in the storage area, or update existing items.
 * When you store or update a value using this API, the onChanged event will fire.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-set)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set).
 *
 * @memberof storageSync
 * @function set
 * @param {Object} values - An object containing one or more key/value pairs to be stored in storage. If an item already exists, its value will be updated.
 * @returns {Promise} Resolves on success or rejects on failure.
 *
 * @example
 * // Save primitive values or Arrays to storage.
 * sync.set({ email: 'sample@gmail.com' })
 *   .then(() => {
 *     console.log('The item "email" was set.')
 *   })
 *
 * @example
 * // Storage cannot save other types,
 * // such as Function, Date, RegExp, Set, Map, ArrayBuffer and so on.
 * sync.set({ dogs: new Set(['Fluffy', 'Duke', 'Baby']) })
 *   .catch((error) => {
 *     console.log('There was a problem!')
 *   })
 *
 */

const set$1 = (values = {}) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.sync.set(values, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Retrieves one or more items from the storage area.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-get)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/get).
 *
 * @memberof storageSync
 * @function get
 * @param {string|Array<string>} keys - A string or array of key names to retrieve from storage.
 * @returns {Promise<Object>} Resolves with an object representing the values of the items or rejects on failure.
 *
 * @example
 * sync.get('cats')
 *   .then(({cats}) => {
 *     console.log('Cats!', cats)
 *   })
 *
 * @example
 * sync.get(['cats', 'dogs'])
 *   .then(({cats, dogs}) => {
 *     console.log('Cats!', cats)
 *     console.log('Dogs!', dogs)
 *   })
 *
 */
const get$1 = keysArray => {
  return new Promise((resolve, reject) => {
    try {
      chrome.sync.get(keysArray, keyValueObj => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(keyValueObj);
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Removes all items from the storage area.
 *
 * See
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-clear)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/clear).
 *
 * @memberof storageSync
 * @function clear
 * @returns {Promise} Resolves on success or rejects on failure.
 *
 * @example
 * sync.clear()
 *   .then(() => {
 *     console.log('Storage was cleared.')
 *   })
 *
 */
const clear$1 = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.sync.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Removes one or more items from the storage area.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/storage#method-StorageArea-remove)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/remove).
 *
 * @memberof storageSync
 * @function remove
 * @param {string|Array<string>} keys - A string, or array of strings, representing the key(s) of the item(s) to be removed.
 * @returns {Promise} Resolves on success or rejects on failure.
 *
 * @example
 * sync.remove('key')
 *   .then(() => {
 *     console.log('The property "key" was removed.')
 *   })
 *
 * @example
 * sync.remove(['key', 'lock'])
 *   .then(() => {
 *     console.log('The property "key" was removed.')
 *     console.log('The property "lock" was removed.')
 *   })
 *
 */
const remove$1 = keys => {
  return new Promise((resolve, reject) => {
    try {
      chrome.sync.remove(keys, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * This is a wrapper for the local Chrome extension storage API.
 * Enables extensions to store and retrieve data, and listen for changes to stored items.
 *
 * See the [Chrome API Docs](https://developer.chrome.com/extensions/storage),
 * and [MDN storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage#Properties).
 *
 * @namespace
 */
const storageSync = {
  set: set$1,
  get: get$1,
  clear: clear$1,
  remove: remove$1,
};

const map = mapFn => ({ use, result, error, args }) => {
  try {
    if (use && !error) {
      return {
        use,
        args,
        result: mapFn(result, args),
      }
    } else {
      return { use, result, error, args }
    }
  } catch (error) {
    return { error, use, args }
  }
};

const forEach = forEachFn => ({
  use,
  result,
  error,
  args,
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

const filter = predFn => ({
  use,
  error,
  result,
  args,
}) => {
  try {
    if (error) {
      return { use: false, result, error, args }
    } else if (use) {
      return {
        use: predFn(result, args),
        result,
        args,
      }
    } else {
      return { use, result, error, args }
    }
  } catch (error) {
    return { error, use, args }
  }
};

const clear$2 = clearFn => predFn => ({
  use,
  error,
  result,
  args,
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

const handleError = catchFn => ({
  use,
  error,
  result,
  args,
}) => {
  try {
    if (error) {
      return {
        result: catchFn(error, args),
        use,
        args,
      }
    } else {
      return { use, result, args }
    }
  } catch (error) {
    return { error, use, args }
  }
};

const awaitMap = (callback, asyncFn) => ({
  use,
  result,
  error,
  args,
}) => {
  if (error) {
    return {
      error: callback.direct({
        use,
        error,
        args,
      }),
      use,
      args,
    }
  } else if (use) {
    return {
      result: Promise.resolve(result)
        .then(r => asyncFn(r, args))
        .then(r => ({ use, args, result: r }))
        .catch(e => ({
          use,
          error: e,
          args,
        }))
        .then(callback.direct),
      use,
      args,
    }
  } else {
    return {
      result: callback.direct({
        use,
        result,
        args,
      }),
      use,
      args,
    }
  }
};

const awaitFilter = (callback, asyncFn) => ({
  use,
  result,
  error,
  args,
}) => {
  if (error) {
    return {
      error: callback.direct({
        use: false,
        error,
        args,
      }),
      use: false,
      args,
    }
  } else if (use) {
    return {
      result: Promise.resolve(result)
        .then(r => asyncFn(r, args))
        .then(use => ({
          use: !!use,
          result,
          args,
        }))
        .catch(e => ({
          use,
          error: e,
          args,
        }))
        .then(callback.direct),
      use,
      args,
    }
  } else {
    return {
      result: callback.direct({
        use,
        result,
        args,
      }),
      use,
      args,
    }
  }
};

const eventFunctor = BumbleStream;
const eventStream = BumbleStream;

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
  const clear = predFn =>
    predFn
      ? compose(clear$2(() => clearFn()))(predFn)
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
    clear,
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

// TODO: Refactor to chrome/extension-pages.js
const isBackgroundPage = () =>
  location.protocol === 'chrome-extension:' &&
  (location.pathname === '/_generated_background_page.html' ||
    location.pathname ===
      chrome.runtime.getManifest().background.page);

const isContentScript = () =>
  location.protocol !== 'chrome-extension:';

const isContextPage = () =>
  location.protocol === 'chrome-extension:' && !isBackgroundPage;

const context = {
  isBackgroundPage,
  isContentScript,
  isContextPage,
};

const not = fn => (...x) => !fn(...x);
const bool = fn => (...x) => !!fn(...x);

const log = msg => x => {
  console.log(msg, x);
  return x
};

const error = msg => x => {
  console.error(msg, x);
  return x
};

const callEach = obj => Object.values(obj).map(fn => fn());

/* ---------------- Array Utils --------------- */
const padArrayEnd = (array, length, cb) => {
  while (array.length < length) {
    array.push(cb(array.length));
  }

  return array
};

const randomArrayElement = array =>
  array[Math.floor(Math.random() * array.length)];

/**
 * Use to send messages between documents
 * (from background to content script, or vice-versa).
 *
 * @memberof message
 * @typedef {Object} Message
 * @property {string} greeting - A constant to identify the message type.
 * @property {number} [tabId] - Identifies the tab to send the message to.
 */

/**
 * Use to send message between scripts.
 * Can recognize the extension document context (background or content script).
 * Requires tabId property when sending from background page.
 *
 * @memberof message
 * @function send
 * @param {Message} message - A Message object with optional data properties.
 * @returns {Promise<Message>} Resolves if the other side responds.
 *
 * @example
 * message.send({
 *   greeting: 'hello',
 *   tabId: 1234, // Required if sending from background page.
 * })
 *   .then((response) => {
 *     console.log('They said:', response.greeting)
 *   })
 *
 */
const send = message => {
  if (isBackgroundPage()) {
    const { tabId, ...msg } = message;
    return sendToTab(tabId, msg)
  } else {
    return sendFromTab(message)
  }
};

/**
 * Send a message to the background script.
 * See [Chrome API](https://developer.chrome.com/extensions/runtime#method-sendMessage).
 * And
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage).
 *
 * @memberof message
 * @function sendFromTab
 * @param {Message} message - A Message object with optional data properties.
 * @returns {Promise<Message>} Resolves if the other side responds.
 *
 * @example
 * message.sendFromTab({ greeting: 'hello' })
 *   .then((response) => {
 *     console.log('They said', response.greeting)
 *   })
 *
 */
const sendFromTab = message =>
  new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject(err);
    }
  });

/**
 * Send a message from the background script to a tab.
 *
 * @memberof message
 * @function sendToTab
 * @param {Message} message - Must have a greeting and tabId property.
 * @returns {Promise<Message>} Resolves if the other side responds.
 *
 * @example
 * message.sendToTab({
 *   greeting: 'hello',
 *   tabId: 1234,
 * }).then((response) => {
 *   console.log('They said', response.greeting)
 * })
 */
const sendToTab = ({ tabId, ...message }) =>
  new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(tabId, message, response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    } catch (error$$1) {
      reject(error$$1);
    }
  });

/**
 * Listen for messages from other tabs/pages.
 *
 * The response Message object will be processed before it is sent:
 * - If there is no error, `message.success = true`.
 * - If there was an error, `message.success = false`
 *   and the error's message and stack will be assigned to the response object.
 * - If `response.greeting` is `undefined`,
 *   the original greeting will be assigned.
 *
 * @memberof message
 * @function listenForMessage
 * @param {boolean} [sendResponse = true] - If true, will send a response. Defaults to true.
 * @returns {BumbleStream} Returns the BumbleStream object.
 *   The final return value of the stream will be sent as a message response.
 *
 * @example
 * message.listenForMessage()
 *   .forEach(({greeting}) => {
 *     console.log('They said', greeting)
 *   })
 */
const listenForMessage = (sendResponse = true) =>
  BumbleStream(callback => {
    async function asyncCallback(message, sender) {
      // Make sure the callback returns a Promise
      return callback(message, sender)
    }

    function handleMessage(message, sender, callback) {
      asyncCallback(message, sender)
        .then(result => ({
          success: true,
          ...result,
        }))
        .catch(reason => ({
          success: false,
          reason: reason.message || reason,
          stack: reason.stack || undefined,
        }))
        .then(msg => ({
          greeting: message.greeting,
          ...msg,
        }))
        .then(callback);

      return sendResponse
    }

    chrome.runtime.onMessage.addListener(handleMessage);

    // Return a function to stop listening for the message
    return () =>
      chrome.runtime.onMessage.removeListener(handleMessage)
  });

/** @namespace */
const message = {
  send,
  sendFromTab,
  sendToTab,
  listenForMessage,
};

/**
 * Referred to as "TemplateType" on Chrome API Docs.
 * - `basic`: icon, title, message, expandedMessage, up to two buttons.
 * - `image`: icon, title, message, expandedMessage, image, up to two buttons.
 * - `list`: icon, title, message, items, up to two buttons. Users on Mac OS X only see the first items.
 * - `progress`: icon, title, message, progress, up to two buttons.
 *
 * See the [Chrome API Docs](https://developer.chrome.com/apps/notifications#type-TemplateType).
 *
 * @memberof notify
 * @typedef {('basic'|'image'|'list'|'progress')} NoteType -
 */

/**
 * Defines the notification action button.
 *
 * @memberof notify
 * @typedef {Object} NoteButton
 * @property {string} title Button title
 * @property {string} iconUrl Button icon url
 */

/**
 * Items for list notifications. Users on Mac OS X only see the first item.
 *
 * @memberof notify
 * @typedef {Object} NoteItem
 * @property {string} title Title of one item of a list notification.
 * @property {string} message Additional details about this item.
 */

/**
 * [Rich Notifications - Chrome Extensions API Docs](https://developer.chrome.com/extensions/richNotifications)
 *
 * See the [Chrome API Docs](https://developer.chrome.com/apps/notifications#type-NotificationOptions)
 *
 * @memberof notify
 * @typedef {Object} NoteOptions
 * @property {NoteType} [type]
 * @property {string} [iconUrl] A URL pointing to an icon to display in the notification. The URL can be: a data URL, a blob URL, a http or https URL, or the relative URL of a file within the extension.
 * @property {string} [title] Title of the notification
 * @property {string} [message] Main notification content
 * @property {string} [contextMessage] Alternate notification content with a lower-weight font.
 * @property {number} [priority] Priority ranges from -2 to 2. -2 is lowest priority. 2 is highest. Zero is default.
 * @property {number} [eventTime]  A timestamp for the notification in milliseconds
 * @property {Array<NoteButton>} [buttons] Text and icons for up to two notification action buttons.
 * @property {Array<NoteItem>} [items] Items for multi-item notifications. Users on Mac OS X only see the first item.
 * @property {integer} [progress] An integer between 0 and 100, used to represent the current progress in a progress indicator.
 * @property {boolean} [requireInteraction] Indicates that the notification should remain visible on screen until the user activates or dismisses the notification.
 * @property {boolean} [silent] Indicates that no sounds or vibrations should be made when the notification is being shown. This defaults to false.
 */

/**
 * Creates a desktop notification.
 * See the [Chrome API Docs](https://developer.chrome.com/apps/notifications#method-create).
 *
 * @memberof notify
 * @function create
 *
 * @param {Object} details - Details of the notification to create.
 * @param {string} [details.id] - Identifier of the notification. If not set or empty an ID will automatically be generated.
 * @param {...NoteOptions} [details.options] - Contents of the notification.
 * @param {NoteType} details.options.type - Which type of notification to display.
 * @param {string} details.options.iconUrl - Which type of notification to display.
 * @param {string} details.options.title - Title of the notification (e.g. Sender name for email).
 * @param {string} details.options.message - Main notification content.
 * @returns {Promise<{id: {string:?string}}>} Resolves to an object with the notification id, as well as the original NotificationOptions properties.
 *
 * @example
 * notify
 *   .create({
 *     type: NoteType.basic,
 *     message: 'Something to say',
 *     buttons: [{ title: 'Click here!' }],
 *     iconUrl: 'icon.png',
 *     id: item.asin,
 *   })
 */
const create = ({ id, ...options }) =>
  new Promise((resolve, reject) => {
    try {
      chrome.notifications.create(id, options, noteId => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve({ id: noteId, ...options });
        }
      });
    } catch (error) {
      reject(error);
    }
  });

/**
 * Wrapper for the chrome.notifications API. Use to create rich notifications using templates and show these notifications to users in the system tray.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/apps/notifications)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications).
 *
 * @namespace notify
 */
const notify = { create };

/**
 * Opens the options page as defined in manifest.json.
 * See
 * [Chrome API Docs](https://developer.chrome.com/extensions/runtime#method-openOptionsPage)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/openOptionsPage).
 *
 * @memberof options
 * @function open
 * @returns {Promise} Resolves after the option page opens.
 *
 * @example
 * options.open().then(() => {
 *   console.log('The options page is open.')
 * })
 *
 */
// TODO: Refactor to chrome/extension-pages.js
const open = () =>
  new Promise((resolve, reject) => {
    try {
      chrome.runtime.openOptionsPage(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });

/** @namespace */
const options = { open };

/**
 * A ProxyConfig object's mode attribute determines the overall behavior of Chrome with regards to proxy usage.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#proxy_modes).
 *
 * - `direct` mode: all connections are created directly, without any proxy involved. This mode allows no further parameters in the ProxyConfig object.
 * - `auto_detect` mode: the proxy configuration is determined by a PAC script that can be downloaded at http://wpad/wpad.dat. This mode allows no further parameters in the ProxyConfig object.
 * - `pac_script` mode: the proxy configuration is determined by a PAC script that is either retrieved from the URL specified in the proxy.PacScript object or taken literally from the data element specified in the proxy.PacScript object. Besides this, this mode allows no further parameters in the ProxyConfig object.
 * - `fixed_servers` mode: the proxy configuration is codified in a proxy.ProxyRules object. Its structure is described in Proxy rules. Besides this, the fixed_servers mode allows no further parameters in the ProxyConfig object.
 * - `system` mode: the proxy configuration is taken from the operating system. This mode allows no further parameters in the ProxyConfig object. Note that the system mode is different from setting no proxy configuration. In the latter case, Chrome falls back to the system settings only if no command-line options influence the proxy configuration.
 *
 * @memberof proxy
 * @typedef {('direct'|'auto_detect'|'pac_script'|'fixed_servers'|'system')} ProxyMode
 */

/**
 * The connection to the proxy server uses the protocol defined in the scheme attribute.
 * If no scheme is specified, the proxy connection defaults to http.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#proxy_server_objects)
 *
 * - `http`.
 * - `https`.
 * - `quic`.
 * - `socks4`.
 * - `socks5`.
 *
 * @memberof proxy
 * @typedef {('http'|'https'|'quic'|'socks4'|'socks5')} ProxyScheme
 */

/**
 * The level of control available to the extension for the proxy setting.
 *
 * - `not_controllable`
 * - `controlled_by_other_extensions`
 * - `controllable_by_this_extension`
 * - `controlled_by_this_extension`
 *
 * @memberof proxy
 * @typedef {('not_controllable'|'controlled_by_other_extensions'|'controllable_by_this_extension'|'controlled_by_this_extension')} ProxyLevelOfControl
 *
 */

/**
 * Chrome distinguishes between three different scopes of browser settings.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/types#ChromeSetting-lifecycle)
 *
 * - `regular`: settings set in the regular scope apply to regular browser windows and are inherited by incognito windows if they are not overwritten. These settings are stored to disk and remain in place until they are cleared by the governing extension, or the governing extension is disabled or uninstalled.
 * - `regular_only`: settings set in the incognito_persistent scope apply only to incognito windows. For these, they override regular settings. These settings are stored to disk and remain in place until they are cleared by the governing extension, or the governing extension is disabled or uninstalled.
 * - `incognito_persistent`: settings set in the incognito_session_only scope apply only to incognito windows. For these, they override regular and incognito_persistent settings. These settings are not stored to disk and are cleared when the last incognito window is closed. They can only be set when at least one incognito window is open.
 * - `incognito_session_only`
 *
 * @memberof proxy
 * @typedef {('regular'|'regular_only'|'incognito_persistent'|'incognito_session_only')} ProxyScope
 *
 */

/**
 * A proxy server is configured in a proxy.ProxyServer object.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#type-ProxyServer)
 *
 * @memberof proxy
 * @typedef {Object} ProxyServer
 * @property {ProxyScheme} scheme The scheme (protocol) of the proxy server itself. Defaults to 'http'.
 * @property {string} host The URI of the proxy server. This must be an ASCII hostname (in Punycode format).
 * @property {string} port The port of the proxy server. Defaults to a port that depends on the scheme.
 */

/**
 * An object encapsulating the set of proxy rules for all protocols.
 * Use either 'singleProxy' or (a subset of) 'proxyForHttp', 'proxyForHttps', 'proxyForFtp' and 'fallbackProxy'.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#type-ProxyRules)
 *
 * @memberof proxy
 * @typedef {Object} ProxyRules
 * @property {ProxyServer} singleProxy The proxy server to be used for all per-URL requests (that is http, https, and ftp).
 * @property {Mode} mode
 */

/**
 * An object encapsulating a complete proxy configuration.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#type-ProxyConfig)
 *
 * @memberof proxy
 * @typedef {Object} ProxyConfig
 * @property {ProxyRules} rules The proxy rules describing this configuration. Use this for 'fixed_servers' mode.
 * @property {Mode} mode
 */

/**
 * Create a valid ProxyServer. Params will be type coerced and trimmed.
 * The scheme will default to 'http' if none is specified.
 * The port will be derived from the scheme if it is not defined.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#type-ProxyServer).
 *
 * @memberof proxy
 * @function createProxyServer
 * @param {Object} details - Setting details
 * @param {string} details.host - The proxy server host ip. Will trim any leading or trailing whitespace.
 * @param {number} [details.port] - The proxy server port.
 * @param {ProxyScheme} [details.scheme] - The proxy server scheme.
 * @returns {ProxyServer} Valid proxy server object.
 *
 * @example
 * const server = createProxyServer({ host: '10.10.10.4' })
 *
 */
const createProxyServer = ({ host, port, scheme }) => {
  const server = {
    host: host.trim(),
  };
  if (port) {
    server.port = parseInt(port);
  }
  if (scheme) {
    server.scheme = scheme.trim();
  }
  return server
};

/**
 * Create a valid ProxyConfig.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#type-ProxyConfig.).
 *
 * @memberof proxy
 * @function createSingleProxyConfig
 * @param {Object} details - Setting details
 * @param {string} details.host - The proxy server host ip.
 * @param {number} [details.port] - The proxy server port.
 * @param {Array<string>} [details.bypassList] - List of websites to connect to without a proxy. [See the bypassList docs.](https://developer.chrome.com/extensions/proxy#bypass_list)
 * @returns {ProxyConfig} Returns an object encapsulating a complete proxy configuration.
 *
 * @example
 * const config = createSingleProxyConfig({host: '10.4.0.1'})
 *
 */
const createSingleProxyConfig = ({
  host,
  port,
  bypassList = [],
}) => ({
  mode: 'fixed_servers',
  rules: {
    singleProxy: createProxyServer({ host, port }),
    bypassList,
  },
});

/**
 * An object returned from proxy.get().
 * @memberof proxy
 * @typedef {Object} ProxySettings
 * @property {ProxyConfig} value The current ProxyConfig.
 * @property {ProxyLevelOfControl} levelOfControl The level of extension control over proxy settings.
 * @property {boolean} incognitoSpecific Whether the effective value is specific to the incognito session. This property will only be present if the incognito property in the details parameter of proxy.get() was true.
 */

/**
 * Get the current proxy settings.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#method-settings-get.).
 *
 * @memberof proxy
 * @function get
 * @param {Object} [details] - Setting details
 * @param {boolean} [details.incognito] - Whether to return the value that applies to the incognito session (default false).
 * @returns {Promise<ProxySettings>} The value of the proxy settings.
 *
 * @example
 * const proxySettingsPromise = proxy.get()
 *
 */
const get$2 = ({ incognito = false } = {}) =>
  new Promise((resolve, reject) => {
    try {
      chrome.proxy.settings.get({ incognito }, settings => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(settings);
        }
      });
    } catch (error) {
      reject(error);
    }
  });

/**
 * Sets the current proxy settings.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy#method-settings-set.).
 *
 * @memberof proxy
 * @function set
 * @param {Object} details - Setting details
 * @param {ProxyConfig} details.config - An object encapsulating a complete proxy configuration.
 * @param {ProxyScope} [details.scope] - One of the values from ProxyScope.
 * @returns {Promise} Resolves at the completion of the set operation. Rejects if there was an error.
 *
 * @example
 * proxy.set({ config: ProxyConfig }).then(() => {
 *   console.log('Now using your proxy settings.')
 * })
 *
 */
const set$2 = ({ scope = 'regular', config }) =>
  new Promise((resolve, reject) => {
    try {
      chrome.proxy.settings.set({ value: config, scope }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });

/**
 * Clears the current proxy settings and restores the default.
 *
 * @memberof proxy
 * @function clear
 * @param {Object} [details] - Setting details
 * @param {ProxyScope} [details.scope] - One of the values from ProxyScope.
 * @returns {Promise} Resolves after the default proxy settings have been restored. Rejects if there was an error.
 *
 * @example
 * proxy.clear().then(() => {
 *   console.log('Now using a direct connection.')
 * })
 *
 */
const clear$3 = ({ scope = 'regular' } = {}) =>
  new Promise((resolve, reject) => {
    try {
      chrome.proxy.settings.clear({ scope }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });

/**
 * Use the chrome.proxy API to manage Chrome's proxy settings.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/proxy)
 *
 * @namespace
 */
const proxy = {
  set: set$2,
  get: get$2,
  clear: clear$3,
  createProxyServer,
  createSingleProxyConfig,
};

/**
 * See the Tab type in the [Chrome API Docs](https://developer.chrome.com/extensions/tabs#type-Tab).
 *
 * The type tabs.Tab contains information about a tab. This provides access to information about what content is in the tab, how large the content is, what special states or restrictions are in effect, and so forth.
 *
 * @memberof tabs
 * @typedef {Object} Tab
 * @property {integer} [id]
 * @property {integer} index The zero-based index of the tab within its window.
 * @property {integer} windowId The ID of the window that contains the tab.
 * @property {integer} [openerTabId] The ID of the tab that opened this tab, if any. This property is only present if the opener tab still exists.
 * @property {boolean} highlighted Whether the tab is highlighted.
 * @property {boolean} active Whether the tab is active in its window. Does not necessarily mean the window is focused.
 * @property {boolean} pinned Whether the tab is pinned.
 * @property {boolean} [audible] Whether the tab has produced sound over the past couple of seconds (but it might not be heard if also muted). Equivalent to whether the 'speaker audio' indicator is showing.
 * @property {boolean} discarded Whether the tab is discarded. A discarded tab is one whose content has been unloaded from memory, but is still visible in the tab strip. Its content is reloaded the next time it is activated.
 * @property {boolean} autoDiscardable Whether the tab can be discarded automatically by the browser when resources are low.
 * @property {string} [url] The URL the tab is displaying.
 * @property {string} [title] The title of the tab.
 * @property {string} [favIconUrl] The URL of the tab's favicon. It may also be an empty string if the tab is loading.
 * @property {string} [status] Either loading or complete
 * @property {boolean} incognito Whether the tab is in an incognito window.
 * @property {integer} [width] The width of the tab in pixels.
 * @property {integer} [height] The height of the tab in pixels.
 * @property {string} [sessionId] The session ID used to uniquely identify a Tab obtained from the sessions API.
 *
 */

/**
 * See the [Chrome API Docs](https://developer.chrome.com/extensions/tabs#method-create)
 *
 * @memberof tabs
 * @typedef {Object} CreateProperties
 * @property {integer} [windowId] The window in which to create the new tab. Defaults to the current window.
 * @property {integer} [index] The position the tab should take in the window. The provided value is clamped to between zero and the number of tabs in the window.
 * @property {string} [url] The URL to initially navigate the tab to. Fully-qualified URLs must include a scheme (i.e., 'http://www.google.com', not 'www.google.com'). Relative URLs are relative to the current page within the extension. Defaults to the New Tab Page.
 * @property {boolean} [active = true] Whether the tab should become the active tab in the window. Does not affect whether the window is focused (see windows.update). Defaults to true.
 * @property {boolean} [pinned] Whether the tab should be pinned. Defaults to false
 * @property {integer} [openerTabId] The ID of the tab that opened this tab. If specified, the opener tab must be in the same window as the newly created tab.
 */

/**
 * Creates a new tab.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/tabs#method-create) and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create).
 *
 * @memberof tabs
 * @function create
 * @param {CreateProperties} [details] - An object with optional properties for the new tab.
 * @returns {Tab} The created tab.
 *
 * @example
 * tabs.create({
 *   url: 'http://www.google.com',
 * }).then((tab) => {
 *   console.log('The new tab id is:', tab.id)
 * })
 *
 * @example
 * tabs.create().then((tab) => {
 *   console.log('It is just a new active tab.')
 * })
 *
 */
const create$1 = details => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.create(details, tab => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(tab);
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Given a tab ID, get the tab's details as a tabs.Tab object.
 * Without the "tabs" permission, will omit `url`, `title`, and `favIconUrl`.
 *
 * See [Chrome API Docs](https://developer.chrome.com/extensions/tabs#method-get) and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/get).
 *
 * @memberof tabs
 * @function get
 * @param {number} [$0.tabId] - ID of the tab to get.
 * @returns {Promise<Tab>} A Promise that will be fulfilled with a tabs.Tab object containing information about the tab.
 *
 * @example
 * tabs.get({ tabId: 12345 })
 *   .then((tab) => {
 *     console.log(tab.status)
 *   })
 *
 * @example
 * tabs.get({ tabId: 12345 })
 *   .then((tab) => {
 *     // Requires "tabs" permission
 *     console.log(tab.title)
 *   })
 *
 */
const get$3 = ({ tabId }) => {
  return new Promise((resolve, reject) => {
    try {
      if (!tabId) {
        reject('Invalid argument: tabId not specified');
      }

      chrome.tabs.get(tabId, tab => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(tab);
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Gets all tabs that have the specified properties, or all tabs if no properties are specified.
 * Some queryInfo properties are ignored without the "tabs" permission.
 *
 * See [Chrome API Docs](https://developer.chrome.com/extensions/tabs#method-query) and [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query).
 *
 * @memberof tabs
 * @function query
 * @param {Object} [queryInfo] - Specified properties of tabs. See [Chrome queryInfo](https://developer.chrome.com/extensions/tabs#property-query-queryInfo).
 * @returns {Promise<Array<Tab>>} A Promise that will be fulfilled with an array of the queried tabs.Tab objects.
 *
 * @example
 * tabs.query({
 *   active: true,
 * }).then((tabs) => {
 *   console.log('All the active:', tabs)
 * })
 *
 * @example
 * tabs.query({
 *   // The url property requires the 'tabs' permission.
 *   url: 'https://*.google.com/*',
 * }).then((tabs) => {
 *   console.log('All the Google tabs:', tabs)
 * })
 *
 */
const query = query => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query(query, tabs => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(tabs);
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Modifies the properties of a tab. Properties that are not specified in updateProperties are not modified.
 * See [Chrome API Docs](https://developer.chrome.com/extensions/tabs#method-update)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update).
 *
 * @memberof tabs
 * @function update
 * @param {number} [$0.tabId] - Defaults to the selected tab of the current window.
 * @param {Object} ...[$0.updateProps] - Specified properties of tabs. See [Chrome updateProperties](https://developer.chrome.com/extensions/tabs#property-update-updateProperties).
 * @returns {Promise<Tab>} A Promise that will be fulfilled with a tabs.Tab object containing details about the updated tab.
 *
 * @example
 * tabs.update({
 *   tabId: 12345,
 *   url: 'http://www.google.com',
 * }).then((tab) => {
 *   console.log('The tab was updated.')
 * })
 *
 */
const update = ({ tabId, ...updateProps }) => {
  return new Promise((resolve, reject) => {
    try {
      if (tabId) {
        chrome.tabs.update(tabId, updateProps, tab => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(tab);
          }
        });
      } else {
        reject('Tab not specified');
      }
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Closes one or more tabs.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/tabs#method-remove)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/remove).
 *
 * @memberof tabs
 * @function close
 * @param {string|Array<string>} $0.tabId - The tab ID or list of tab IDs to close.
 * @returns {Promise} Resolves on success or rejects on failure with the reason.
 *
 * @example
 * tabs.close({ tabId: 12345 })
 *   .then(() => {
 *     console.log('The tab was closed.')
 *   })
 *
 * @example
 * tabs.close({ tabId: [12345, 67890] })
 *   .then(() => {
 *     console.log('Two tabs were closed.')
 *   })
 *
 */
const close = ({ tabId }) => {
  return new Promise((resolve, reject) => {
    try {
      if (tabId) {
        chrome.tabs.remove(tabId, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve();
          }
        });
      } else {
        reject('Tab not specified');
      }
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Inject JavaScript code into a page. The script will execute in its own environment, but will share the DOM of the page.
 * This requires either a
 * [host permission](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/permissions#Host_permissions)
 * or the
 * [activeTab permission](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/permissions#activeTab_permission).
 * Either the `code` or `file` property must be set in the `details` param.
 *
 * See [programmatic injection in the Chrome API Docs](https://developer.chrome.com/extensions/content_scripts#pi).
 *
 * @memberof tabs
 * @function execute
 * @param {number} [$0.tabId] - The id of the tab to inject. Defaults to the active tab.
 * @param {string} [$0.code] - JavaScript or CSS code to inject.
 * @param {string} [$0.file] - The path to the JavaScript or CSS file to inject.
 * @param {string} ...[$0.details] - [Other optional details of the script to run.](https://developer.chrome.com/extensions/tabs#property-executeScript-details).
 * @returns {Promise<Array>} Resolves with an array of the results of the script in every injected frame.
 *
 * @example
 * tabs.execute({
 *   tabId: 12345,
 *   file: 'content-script.js',
 * }).then((tab) => {
 *   console.log('')
 * })
 */
const execute = ({ tabId, ...details }) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.executeScript(tabId, details, results => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(results);
        }
      });
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * Wrapper for the chrome.tabs API. Use to interact with the browser's tab system.
 * You can use this API to create, modify, and rearrange tabs in the browser.
 *
 * See the
 * [Chrome API Docs](https://developer.chrome.com/extensions/tabs)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs).
 *
 * @namespace
 */
const tabs = {
  create: create$1,
  get: get$3,
  query,
  update,
  close,
  execute,
};

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

const eventPromise = (...args) =>
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

const when = {
  onInstalled: () => eventPromise(chrome.runtime.onInstalled),
};

const create$2 = details =>
  new Promise((resolve, reject) => {
    try {
      chrome.contextMenus.create(details, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        }

        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });

const contextMenu = { create: create$2 };

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
    timeoutId,
  };

  return methods
}

let storeReady = false;
const state = {};
let listeners = [];

/**
 * Returns copy of state object or value returned from mapping fn
 *
 * @memberof BumbleStore
 * @function getState
 * @param {string|StateSelector} keyOrFn - key name or fn :: {state} -> any
 * @returns {Promise} Resolves with the state object or the value of the state property.
 *
 * @example
 * getState('apples').then((apples) => {
 *   console.log(apples)
 * })
 */
const getState = keyOrFn => {
  if (!storeReady) {
    notConnectedError('store.getState');
  }

  if (typeof keyOrFn === 'string' && keyOrFn.length) {
    // Get only one property of state
    let value = state[keyOrFn];

    if (value && value instanceof Array) {
      // Return copy of value if array
      return [...value]
    } else if (value && value instanceof Object) {
      // Return copy of value if object
      return { ...value }
    } else {
      // Primitive value, no need to copy
      return value
    }
  } else if (typeof keyOrFn === 'function') {
    return keyOrFn({ ...state })
  } else {
    // Return copy of whole state
    return { ...state }
  }
};
/**
 * Derive a value from the current state.
 *
 * @callback StateSelector
 * @param {Object} state - The current state.
 * @returns {any} Any derived value.
 */

let shouldUpdateState = true;
let composeNextState = s => s;

/**
 * Sets state asynchronously using a state object or a function that returns an object.
 *
 * @memberof BumbleStore
 * @function setState
 * @param {string|StateAction} newStateOrFn - key name or fn :: {state} -> {state}
 * @returns {Promise<Object>} Resolves to a copy of the new state object.
 *
 * @example
 * setState({ apples: 2 })
 *   .then((state) => {
 *     console.log('Number of apples:', state.apples)
 *   })
 */
const setState = newStateOrFn => {
  if (!storeReady) {
    notConnectedError('store.setState');
  }

  return new Promise((resolve, reject) => {
    try {
      const setter = composeNextState;
      let fn;

      if (typeof newStateOrFn === 'function') {
        fn = prevState => ({
          ...prevState,
          ...newStateOrFn(prevState),
        });
      } else {
        fn = prevState => ({
          ...prevState,
          ...newStateOrFn,
        });
      }

      composeNextState = nextState => fn(setter(nextState));

      if (shouldUpdateState) {
        // Force async update of state
        // to avoid unexpected side effects
        // for multiple event listeners
        timeout(0)
          .then(() => {
            // Compose new state and assign
            const nextState = composeNextState(getState());
            Object.assign(state, nextState);
            // Clean up
            shouldUpdateState = true;
            composeNextState = s => s;
            // Pseudo fire OnStateChange
            listeners.forEach(fn => fn(getState()));
          })
          .then(resolve);

        shouldUpdateState = false;
      }

      timeout(0).then(resolve);
    } catch (error$$1) {
      reject(error$$1);
    }
  }).then(getState)
};
/**
 * Map the state object at the time setState() fires.
 *
 * @callback StateAction
 * @param {Object} state A copy of current state object.
 * @returns {Object} The new state object.
 */

/**
 * Adds a listener function to onStateChange.
 *
 * @memberof onStateChange
 * @function addListener
 * @param {Function} listener - A state property name or fn :: {state} -> any
 * @returns {undefined} Returns undefined.
 *
 * @example
 * store.onStateChange.addListener(fn)
 */
const addListener = listener => {
  if (storeReady) {
    listeners = [...listeners, listener];
  } else {
    notConnectedError('store.onStateChange.addListener');
  }
};

/**
 * Removes a listener from onStateChange.
 *
 * @memberof onStateChange
 * @function removeListener
 * @param {Function} listener - The listener function to remove.
 * @returns {undefined} Returns undefined.
 *
 * @example
 * store.onStateChange.removeListener(fn)
 */
const removeListener = listener => {
  if (storeReady) {
    listeners = listeners.filter(l => l !== listener);
  } else {
    notConnectedError('store.onStateChange.removeListener');
  }
};

/**
 * Returns true if onStateChange has the listener.
 *
 * @memberof onStateChange
 * @function haslistener
 * @param {Function} listener - Function to match.
 * @returns {boolean} Returns true if onStateChange has the listener.
 *
 * @example
 * store.onStateChange.hasListener(fn)
 */
const hasListener = listener => {
  if (storeReady) {
    listeners.some(l => l === listener);
  } else {
    notConnectedError('store.onStateChange.hasListener');
  }
};

/**
 * Returns true if function has any listeners.
 *
 * @memberof onStateChange
 * @function haslisteners
 * @returns {boolean} Returns true onStateChange has any listeners.
 *
 * @example
 * store.onStateChange.hasListeners()
 */
const hasListeners = () => !!listeners.length;

/**
 * Calls all the onStateChange listeners.
 *
 * @memberof onStateChange
 * @function fireListeners
 * @returns {undefined} Returns undefined.
 *
 * @example
 * store.onStateChange.fireListeners()
 */
const fireListeners = () =>
  listeners.forEach(fn => fn(getState()));

/** @namespace */
const onStateChange = {
  addListener,
  removeListener,
  hasListener,
  hasListeners,
  fireListeners,
};

const notConnectedError = name => {
  throw new Error(
    `${name} is not initialized. Call this function after initStore() has completed.`,
  )
};

/** @namespace BumbleStore */
const store = {
  getState,
  setState,
  onStateChange,
};

const createStore = () => {
  const invertedStorePromise = {};

  const storePromise = new Promise((resolve, reject) => {
    Object.assign(invertedStorePromise, { resolve, reject });
  });

  const initStore = initialState => {
    if (storeReady) {
      // Store has already been initialized
      throw new Error('Cannot initialize the store twice.')
    } else if (!isBackgroundPage()) {
      // Not background page
      throw new Error(
        'Must initialize the store in the background page.',
      )
    } else {
      // Assign initial state values to store state
      Object.assign(state, initialState);

      invertedStorePromise.resolve(store);
      storeReady = true;

      return store
    }
  };

  window.bumbleStore = storePromise;

  return { initStore, storePromise }
};

/**
 * Sets up state and immediately calls the callback.
 * Sets window.store as a Promise that resolves with the store after the callback completes.
 *
 * @function initStore
 * @param {Object} initialState - The initial state values.
 * @returns {BumbleStore} The initialized store.
 *
 * @example
 * const {} = store.initStore({ apples: 2 })
 *
 * @example
 * const defaultState = { apples: 2 }
 * storageLocal.get('state')
 *   .then(({state = defaultState}) => state)
 *   .then(store.initStore)
 *   .then(({ setState, getState, onStateChange }) => {
 *     console.log('Store has been initialized.')
 *   })
 */
const { initStore, storePromise } = createStore();

/**
 * Retrieves the Window object for the background page running inside the current extension.
 * See
 * [Chrome API Docs](https://developer.chrome.com/extensions/runtime#method-getBackgroundPage)
 * and
 * [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getBackgroundPage).
 *
 * @function getBackgroundPage
 * @returns {Promise} A Promise that will be fulfilled with the Window object for the background page, if there is one.
 *
 * @example
 * getBackgroundPage()
 *
 */
// TODO: Refactor to chrome/extension-pages.js
const getBackgroundPage = () =>
  new Promise((resolve, reject) => {
    try {
      chrome.runtime.getBackgroundPage(w => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(w);
        }
      });
    } catch (error) {
      reject(error);
    }
  });

const notConnectedError$1 = name => {
  throw new Error(
    `${name} is not initialized. Call this function inside connectToStore().then()`,
  )
};

// TODO: Wire up better errors when bgStore is not ready
// "bgStore is not initialized. Call this function inside connectToStore().then()"
const backgroundStore = {
  getState: () => notConnectedError$1('backgroundStore.getState'),
  setState: () => notConnectedError$1('backgroundStore.setState'),
  onStateChange: {
    addListener: () =>
      notConnectedError$1(
        'backgroundStore.onStateChange.addListener',
      ),
    removeListener: () =>
      notConnectedError$1(
        'backgroundStore.onStateChange.removeListener',
      ),
  },
};

// TODO: Test that isBackgroundPage and isContentScript works
const connectToStore = () => {
  if (isBackgroundPage()) ; else if (isContentScript()) ; else {
    return (
      getBackgroundPage()
        // Store is a promise
        .then(({ bumbleStore }) => bumbleStore)
        // Store is unwrapped after bg page initializes
        .then(store => {
          console.log('store', store);
          console.log('backgroundStore', backgroundStore);
          Object.assign(backgroundStore, store);
          return store
        })
    )
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
 *     // Resolve the initial and
 *     // current promises to false now
 *     return false
 *   }
 *   if (text.includes('\n')) {
 *     // Resolve the initial promise to true now
 *     // and the current promise to false now
 *     return true
 *   } else {
 *     // Resolve the initial promise as scheduled
 *     // Resolve the current promise to false now
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
function get$4(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$4;

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

// Must export directly

exports.browserAction = browserAction;
exports.storageLocal = storageLocal;
exports.storageSync = storageSync;
exports.message = message;
exports.notify = notify;
exports.options = options;
exports.proxy = proxy;
exports.tabs = tabs;
exports.when = when;
exports.contextMenu = contextMenu;
exports.store = store;
exports.initStore = initStore;
exports.storePromise = storePromise;
exports.connectToStore = connectToStore;
exports.backgroundStore = backgroundStore;
exports.BumbleStream = BumbleStream;
exports.eventFunctor = eventFunctor;
exports.eventStream = eventStream;
exports.timeout = timeout;
exports.interval = interval;
exports.listenTo = listenTo;
exports.debounce = debounce;
exports.throttle = throttle;
exports.withPrev = withPrev;
exports.composeHasChanged = composeHasChanged;
exports.eventPromise = eventPromise;
exports.context = context;
exports.log = log;
exports.not = not;
exports.bool = bool;
exports.error = error;
exports.callEach = callEach;
exports.padArrayEnd = padArrayEnd;
exports.randomArrayElement = randomArrayElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLWNqcy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2Nocm9tZS9jaHJvbWUuYnJvd3Nlci1hY3Rpb24uanMiLCIuLi9zcmMvY2hyb21lL2Nocm9tZS5zdG9yYWdlLmxvY2FsLmpzIiwiLi4vc3JjL2Nocm9tZS9jaHJvbWUuc3RvcmFnZS5zeW5jLmpzIiwiLi4vc3JjL2V2ZW50LXN0cmVhbS9zdHJlYW0ud3JhcHBlcnMuanMiLCIuLi9zcmMvZXZlbnQtc3RyZWFtL3N0cmVhbS5qcyIsIi4uL3NyYy91dGlscy91dGlsLmV4dGVuZC5qcyIsIi4uL3NyYy9jaHJvbWUvY2hyb21lLm1lc3NhZ2UuanMiLCIuLi9zcmMvY2hyb21lL2Nocm9tZS5ub3RpZnkuanMiLCIuLi9zcmMvY2hyb21lL2Nocm9tZS5vcHRpb25zLmpzIiwiLi4vc3JjL2Nocm9tZS9jaHJvbWUucHJveHkuanMiLCIuLi9zcmMvY2hyb21lL2Nocm9tZS50YWJzLmpzIiwiLi4vc3JjL2hlbHBlcnMvbGlzdGVuLXRvLmpzIiwiLi4vc3JjL3V0aWxzL3V0aWwuZXZlbnQtcHJvbWlzZS5qcyIsIi4uL3NyYy9jaHJvbWUvY2hyb21lLmV2ZW50cy5qcyIsIi4uL3NyYy9jaHJvbWUvY2hyb21lLmNvbnRleHQtbWVudS5qcyIsIi4uL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIi4uL3NyYy9oZWxwZXJzL3RpbWVvdXQuanMiLCIuLi9zcmMvc3RhdGUvc3RhdGUuc3RvcmUuanMiLCIuLi9zcmMvY2hyb21lL2Nocm9tZS5ydW50aW1lLmpzIiwiLi4vc3JjL3N0YXRlL3N0YXRlLmNvbm5lY3QuanMiLCIuLi9zcmMvaGVscGVycy9pbnRlcnZhbC5qcyIsIi4uL3NyYy9oZWxwZXJzL2RlYm91bmNlLmpzIiwiLi4vc3JjL2hlbHBlcnMvdGhyb3R0bGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZwL19tYXBwaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mcC9wbGFjZWhvbGRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZnAvX2Jhc2VDb252ZXJ0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcmVKc0RhdGEuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvU291cmNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWV0YU1hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXREYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCaW5kLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXBwbHkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb21wb3NlQXJncy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvbXBvc2VBcmdzUmlnaHQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3VudEhvbGRlcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTG9kYXNoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fTGF6eVdyYXBwZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vb3AuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXREYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fcmVhbE5hbWVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0RnVuY05hbWUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19Mb2Rhc2hXcmFwcGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5QXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL193cmFwcGVyQ2xvbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL3dyYXBwZXJMb2Rhc2guanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0xhemlhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2hvcnRPdXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zZXREYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0V3JhcERldGFpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pbnNlcnRXcmFwRGV0YWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvY29uc3RhbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvU3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZpbmRJbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hTi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSW5kZXhPZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5SW5jbHVkZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL191cGRhdGVXcmFwRGV0YWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFdyYXBUb1N0cmluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZVJlY3VycnkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRIb2xkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fcmVvcmRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3JlcGxhY2VIb2xkZXJzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlSHlicmlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQ3VycnkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVQYXJ0aWFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVyZ2VEYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvRmluaXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b0ludGVnZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVXcmFwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9hcnkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduVmFsdWUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5T2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkZhbHNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVHlwZWRBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJBcmcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUNsZWFyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlRGVsZXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlSGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlU2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hEZWxldGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoR2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hTZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZURlbGV0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlR2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVIYXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZVNldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcENhY2hlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tTZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXNJbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXNJbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25Jbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQnVmZmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFN5bWJvbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9scy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UHVzaC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFByb3RvdHlwZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFN5bWJvbHNJbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0QWxsS2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRBbGxLZXlzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRUYWcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVBcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1VpbnQ4QXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUFycmF5QnVmZmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVEYXRhVmlldy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTeW1ib2wuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVR5cGVkQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVCeVRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZU9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNNYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNTZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUNsb25lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9jbG9uZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvY3VycnkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzUGxhaW5PYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRXJyb3IuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzV2Vha01hcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlQWRkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0Q2FjaGVIYXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXRDYWNoZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5U29tZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NhY2hlSGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxBcnJheXMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0VG9BcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQnlUYWcuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbERlZXAuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hdGNoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNTdHJpY3RDb21wYXJhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TWF0Y2hEYXRhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWF0Y2hlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9tZW1vaXplLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVtb2l6ZUNhcHBlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmluZ1RvUGF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TWFwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRvU3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b1N0cmluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RQYXRoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9nZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNQYXRoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9oYXNJbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNYXRjaGVzUHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUHJvcGVydHkuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUHJvcGVydHlEZWVwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXRlcmF0ZWUuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0ZsYXR0ZW5hYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZsYXR0ZW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZsYXR0ZW4uanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyUmVzdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZsYXRSZXN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9yZWFyZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9QYXRoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9mcC9fdXRpbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZnAvY29udmVydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUZsb3cuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2Zsb3cuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZwL2Zsb3cuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRXF1YWwuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2ZwL2lzRXF1YWwuanMiLCIuLi9zcmMvaGVscGVycy93aXRoLXByZXYuanMiLCIuLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNldCB0aGUgYmFkZ2UgdGV4dCBmb3IgdGhlIGJyb3dzZXIgYWN0aW9uLlxuICogT21pdCB0aGUgZGV0YWlscyBvYmplY3QgdG8gY2xlYXIgdGV4dC5cbiAqIFNlZSB0aGUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL2Jyb3dzZXJBY3Rpb24jbWV0aG9kLXNldEJhZGdlVGV4dClcbiAqIGFuZCBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9icm93c2VyQWN0aW9uL3NldEJhZGdlVGV4dCkuXG4gKlxuICogQG1lbWJlcm9mIGJyb3dzZXJBY3Rpb25cbiAqIEBmdW5jdGlvbiBzZXRCYWRnZVRleHRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXRhaWxzIC0gQmFkZ2UgdGV4dCBvcHRpb25zLlxuICogQHBhcmFtIHtzdHJpbmd8ZmFsc2V9IGRldGFpbHMudGV4dCAtIFRoZSB0ZXh0IHRvIHNldCBvbiB0aGUgYnJvd3NlciBhY3Rpb24gYmFkZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW2RldGFpbHMudGFiSWRdIC0gU2V0IHRoZSBiYWRnZSB0ZXh0IG9ubHkgZm9yIHRoZSBnaXZlbiB0YWIuIFRoZSB0ZXh0IGlzIHJlc2V0IHdoZW4gdGhlIHVzZXIgbmF2aWdhdGVzIHRoaXMgdGFiIHRvIGEgbmV3IHBhZ2UuXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgYWZ0ZXIgYmFkZ2V0ZXh0IGhhcyBiZWVuIHNldC4gUmVqZWN0cyBpZiB0aGVyZSB3YXMgYW4gZXJyb3IuXG4gKlxuICogQGV4YW1wbGVcbiAqIGJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHsgdGV4dDogJ3NvbWV0aGluZycgfSlcbiAqXG4gKi9cbmNvbnN0IHNldEJhZGdlVGV4dCA9ICh7IHRleHQsIHRhYklkIH0gPSB7IHRleHQ6ICcnIH0pID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KFxuICAgICAgICB7IHRleHQ6IHRleHQgPT09IGZhbHNlID8gJycgOiB0ZXh0LCB0YWJJZCB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICApXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG5cbi8qKlxuICogU2V0IHRoZSBiYWRnZSBiYWNrZ3JvdW5kIGNvbG9yIGZvciB0aGUgYnJvd3NlciBhY3Rpb24uXG4gKiBTZWUgdGhlIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9icm93c2VyQWN0aW9uI21ldGhvZC1zZXRCYWRnZUJhY2tncm91bmRDb2xvcilcbiAqIGFuZCBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9icm93c2VyQWN0aW9uL3NldEJhZGdlQmFja2dyb3VuZENvbG9yKS5cbiAqXG4gKiBAbWVtYmVyb2YgYnJvd3NlckFjdGlvblxuICogQGZ1bmN0aW9uIHNldEJhZGdlQ29sb3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXRhaWxzIC0gQmFkZ2UgdGV4dCBvcHRpb25zLlxuICogQHBhcmFtIHtzdHJpbmd9IGRldGFpbHMuY29sb3IgLSBUaGUgaGV4IHZhbHVlIG9mIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGZvciB0aGUgYmFkZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW2RldGFpbHMudGFiSWRdIC0gU2V0IHRoZSBiYWRnZSBjb2xvciBvbmx5IGZvciB0aGUgZ2l2ZW4gdGFiLlxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIGFmdGVyIGJhZGdlIGJhY2tncm91bmQgY29sb3IgaGFzIGJlZW4gc2V0LiBSZWplY3RzIGlmIHRoZXJlIHdhcyBhbiBlcnJvci5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQnVsbWEgUmVkXG4gKiBicm93c2VyQWN0aW9uLnNldEJhZGdlQ29sb3IoeyBjb2xvcjogJyNGRjM4NjAnIH0pXG4gKiAvLyBCdWxtYSBPcmFuZ2VcbiAqIGJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VDb2xvcih7IGNvbG9yOiAnI0ZGNDcwRicgfSlcbiAqIC8vIERlZmF1bHQgLSBCdWxtYSBCbHVlXG4gKiBicm93c2VyQWN0aW9uLnNldEJhZGdlQ29sb3IoKVxuICpcbiAqL1xuY29uc3Qgc2V0QmFkZ2VDb2xvciA9IChkZXRhaWxzID0geyBjb2xvcjogJyMyMDlDRUUnIH0pID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IoXG4gICAgICAgIGRldGFpbHMsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcblxuLyoqXG4gKiBTZXQgdGhlIHRvb2x0aXAgdGV4dCBmb3IgdGhlIGJyb3dzZXIgYWN0aW9uLlxuICogT21pdCB0aGUgZGV0YWlscyBvYmplY3QgdG8gdXNlIHRoZSBleHRlbnNpb24gbmFtZS5cbiAqIFNlZSB0aGUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL2Jyb3dzZXJBY3Rpb24jbWV0aG9kLXNldFRpdGxlKVxuICogYW5kIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL2Jyb3dzZXJBY3Rpb24vc2V0VGl0bGUpLlxuICpcbiAqIEBtZW1iZXJvZiBicm93c2VyQWN0aW9uXG4gKiBAZnVuY3Rpb24gc2V0VGl0bGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGV0YWlsc10gLSBUaXRsZSB0ZXh0IG9wdGlvbnMuXG4gKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBbZGV0YWlscy50aXRsZSA9IG51bGxdIC0gVGhlIHRleHQgdG8gc2V0IG9uIHRoZSBicm93c2VyIGFjdGlvbiB0aXRsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGV0YWlscy50YWJJZF0gLSBTZXQgdGhlIHRpdGxlIHRleHQgb25seSBmb3IgdGhlIGdpdmVuIHRhYi4gVGhlIHRleHQgaXMgcmVzZXQgd2hlbiB0aGUgdXNlciBuYXZpZ2F0ZXMgdGhpcyB0YWIgdG8gYSBuZXcgcGFnZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGV0YWlscy53aW5kb3dJZF0gLSBTZXQgdGhlIHRpdGxlIHRleHQgb25seSBmb3IgdGhlIGdpdmVuIHdpbmRvdy5cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyBhZnRlciB0aXRsZSBoYXMgYmVlbiBzZXQuIFJlamVjdHMgaWYgdGhlcmUgd2FzIGFuIGVycm9yLlxuICpcbiAqIEBleGFtcGxlXG4gKiBicm93c2VyQWN0aW9uLnNldFRpdGxlKHsgdGl0bGU6ICdzb21ldGhpbmcnIH0pXG4gKlxuICovXG5jb25zdCBzZXRUaXRsZSA9IChkZXRhaWxzID0geyB0aXRsZTogbnVsbCB9KSA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5icm93c2VyQWN0aW9uLnNldFRpdGxlKGRldGFpbHMsICgpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcblxuLyoqXG4gKiBTZXQgdGhlIGljb24gZm9yIHRoZSBicm93c2VyIGFjdGlvbi5cbiAqIFNlZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvYnJvd3NlckFjdGlvbiNtZXRob2Qtc2V0SWNvbilcbiAqIGFuZCBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9icm93c2VyQWN0aW9uL3NldEljb24pLlxuICpcbiAqIEBtZW1iZXJvZiBicm93c2VyQWN0aW9uXG4gKiBAZnVuY3Rpb24gc2V0SWNvblxuICogQHBhcmFtIHtPYmplY3R9IGRldGFpbHMgLSBPYmplY3Q6IHtwYXRoOnN0cmluZywgdGFiSWQob3B0aW9uYWwpfS5cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyBhZnRlciBpY29uIGhhcyBiZWVuIHNldC5cbiAqXG4gKiBAZXhhbXBsZVxuICogYnJvd3NlckFjdGlvbi5zZXRJY29uKHtwYXRoOiAnaWNvbi0xNi5wbmcnfSlcbiAqICovXG5jb25zdCBzZXRJY29uID0gZGV0YWlscyA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5icm93c2VyQWN0aW9uLnNldEljb24oZGV0YWlscywgKCkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpXG4gICAgfVxuICB9KVxuXG4vLyAvKipcbi8vICAqIERpc2FibGUgb3IgZW5hYmxlIHRoZSBicm93c2VyIGFjdGlvbiBmb3IgYSB0YWIgb3Igb3ZlcmFsbC5cbi8vICAqIFNlZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvYnJvd3NlckFjdGlvbiNtZXRob2Qtc2V0SWNvbilcbi8vICAqIGFuZCBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9icm93c2VyQWN0aW9uL3NldEljb24pLlxuLy8gICpcbi8vICAqIEBtZW1iZXJvZiBicm93c2VyQWN0aW9uXG4vLyAgKiBAZnVuY3Rpb24gc2V0SWNvblxuLy8gICogQHBhcmFtIHtPYmplY3R9IFtkZXRhaWxzXSAtIERlZmF1bHQgZGlzYWJsZXMgZ2xvYmFsbHlcbi8vICAqIEBwYXJhbSB7Ym9vbHxudW1iZXJ9IFtkZXRhaWxzLmRpc2FibGVdIC0gQm9vbGVhbiB0byBkaXNhYmxlIGdsb2JhbGx5LCBvciB0YWJJZCB0byBzZXQgZm9yIGEgc2luZ2xlIHRhYi5cbi8vICAqIEBwYXJhbSB7Ym9vbHxudW1iZXJ9IFtkZXRhaWxzLmVuYWJsZV0gLSBCb29sZWFuIHRvIGVuYWJsZSBnbG9iYWxseSwgb3IgdGFiSWQgdG8gc2V0IGZvciBhIHNpbmdsZSB0YWIuXG4vLyAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgYWZ0ZXIgdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZS4gUmVqZWN0cyB1cG9uIGZhaWx1cmUuXG4vLyAgKlxuLy8gICogQGV4YW1wbGVcbi8vICAqIGJyb3dzZXJBY3Rpb24uc2V0SWNvbih7cGF0aDogJ2ljb24tMTYucG5nJ30pXG4vLyAgKiAqL1xuLy8gY29uc3Qgc2V0RGlzYWJsZWQgPSAoeyBkaXNhYmxlID0gdHJ1ZSwgZW5hYmxlIH0gPSB7fSkgPT5cbi8vICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICBpZiAoZGlzYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4vLyAgICAgICAgIGNocm9tZS5icm93c2VyQWN0aW9uLmRpc2FibGUoKCkgPT4ge1xuLy8gICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbi8vICAgICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgcmVzb2x2ZSgpXG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KVxuLy8gICAgICAgfVxuLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICByZWplY3QoZXJyb3IpXG4vLyAgICAgfVxuLy8gICB9KVxuXG4vKipcbiAqIFNldCBtdWx0aXBsZSBicm93c2VyIGFjdGlvbiBwcm9wZXJ0aWVzIGF0IG9uY2UuXG4gKlxuICogVXNlIGJyb3dzZXIgYWN0aW9ucyB0byBwdXQgaWNvbnMgaW4gdGhlIG1haW4gR29vZ2xlIENocm9tZSB0b29sYmFyLCB0byB0aGUgcmlnaHQgb2YgdGhlIGFkZHJlc3MgYmFyLlxuICogSW4gYWRkaXRpb24gdG8gaXRzIGljb24sIGEgYnJvd3NlciBhY3Rpb24gY2FuIGhhdmUgYSB0b29sdGlwLCBhIGJhZGdlLCBhbmQgYSBwb3B1cC5cbiAqXG4gKiBTZWUgdGhlIFtDaHJvbWUgQVBJIGRvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9icm93c2VyQWN0aW9uKVxuICogYW5kIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL2Jyb3dzZXJBY3Rpb24pLlxuICpcbiAqIEBmdW5jdGlvbiBicm93c2VyQWN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gZGV0YWlscyAtIEJyb3dzZXIgYWN0aW9uIHByb3BlcnRpZXMgdG8gc2V0LlxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIGFmdGVyIGFsbCBwcm9wZXJ0aWVzIGFyZSBzZXQsIHJlamVjdHMgd2l0aCByZWFzb24gaWYgYSBwcm9wZXJ0eSB3YXMgbm90IHNldC5cbiAqXG4gKiBAdG9kbyBJbXBsZW1lbnQgYmFkZ2VDb2xvclxuICogQHRvZG8gSW1wbGVtZW50IHRpdGxlXG4gKiBAdG9kbyBJbXBsZW1lbnQgcG9wdXBcbiAqXG4gKiBAZXhhbXBsZVxuICogYnJvd3NlckFjdGlvbih7XG4gKiAgIGJhZGdlVGV4dDogJ3NvbWV0aGluZycsXG4gKiAgIGljb246ICdpY29uMi5wbmcnLFxuICogICAvLyBiYWRnZUNvbG9yOiAnIzY2NicsXG4gKiAgIC8vIHRpdGxlOiAnYnJvd3NlciBhY3Rpb24hJyxcbiAqICAgLy8gcG9wdXA6ICdwb3B1cC5odG1sJyxcbiAqIH0pLnRoZW4oKCkgPT4ge1xuICogICBjb25zb2xlLmxvZygnQWxsIHRoZSBicm93c2VyIGFjdGlvbiBwcm9wZXJ0aWVzIHdlcmUgc2V0LicpXG4gKiB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAqICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IHNldCBhIGJyb3dzZXIgYWN0aW9uIHByb3BlcnR5LicpXG4gKiB9KVxuICpcbiAqIEBleGFtcGxlXG4gKiBicm93c2VyQWN0aW9uLnNldCh7XG4gKiAgIHN1cGVyR2FsYWN0aWM6IHRydWUsXG4gKiB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAqICAgY29uc29sZS5lcnJvcignSW52YWxpZCBhcmd1bWVudDogVW5yZWNvZ25pemVkIGJyb3dzZXIgYWN0aW9uIHByb3BlcnR5LicpXG4gKiB9KVxuICovXG5jb25zdCBzZXRBbGwgPSBkZXRhaWxzID0+XG4gIFByb21pc2UuYWxsKFxuICAgIE9iamVjdC5lbnRyaWVzKGRldGFpbHMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlICdpY29uJzpcbiAgICAgICAgICByZXR1cm4gc2V0SWNvbih7IHBhdGg6IHZhbHVlIH0pXG4gICAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgICByZXR1cm4gc2V0VGl0bGUoeyB0aXRsZTogdmFsdWUgfSlcbiAgICAgICAgY2FzZSAnYmFkZ2VUZXh0JzpcbiAgICAgICAgICByZXR1cm4gc2V0QmFkZ2VUZXh0KHsgdGV4dDogdmFsdWUgfSlcbiAgICAgICAgY2FzZSAnYmFkZ2VDb2xvcic6XG4gICAgICAgICAgcmV0dXJuIHNldEJhZGdlQ29sb3IoeyBjb2xvcjogdmFsdWUgfSlcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgICBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudDogVW5yZWNvZ25pemVkIGJyb3dzZXIgYWN0aW9uIHByb3BlcnR5OicgK1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKVxuICAgICAgfVxuICAgIH0pLFxuICApXG5cbmV4cG9ydCBjb25zdCBicm93c2VyQWN0aW9uID0gc2V0QWxsXG5cbk9iamVjdC5hc3NpZ24oYnJvd3NlckFjdGlvbiwge1xuICBzZXQ6IHNldEFsbCxcbiAgc2V0QmFkZ2VUZXh0LFxuICBzZXRCYWRnZUNvbG9yLFxuICBzZXRJY29uLFxuICBzZXRUaXRsZSxcbn0pXG4iLCIvKipcbiAqIFN0b3JlIG9uZSBvciBtb3JlIGl0ZW1zIGluIHRoZSBzdG9yYWdlIGFyZWEsIG9yIHVwZGF0ZSBleGlzdGluZyBpdGVtcy5cbiAqIFdoZW4geW91IHN0b3JlIG9yIHVwZGF0ZSBhIHZhbHVlIHVzaW5nIHRoaXMgQVBJLCB0aGUgb25DaGFuZ2VkIGV2ZW50IHdpbGwgZmlyZS5cbiAqXG4gKiBTZWUgdGhlXG4gKiBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSNtZXRob2QtU3RvcmFnZUFyZWEtc2V0KVxuICogYW5kXG4gKiBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9zdG9yYWdlL1N0b3JhZ2VBcmVhL3NldCkuXG4gKlxuICogQG1lbWJlcm9mIHN0b3JhZ2VMb2NhbFxuICogQGZ1bmN0aW9uIHNldFxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyAtIEFuIG9iamVjdCBjb250YWluaW5nIG9uZSBvciBtb3JlIGtleS92YWx1ZSBwYWlycyB0byBiZSBzdG9yZWQgaW4gc3RvcmFnZS4gSWYgYW4gaXRlbSBhbHJlYWR5IGV4aXN0cywgaXRzIHZhbHVlIHdpbGwgYmUgdXBkYXRlZC5cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyBvbiBzdWNjZXNzIG9yIHJlamVjdHMgb24gZmFpbHVyZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gU2F2ZSBwcmltaXRpdmUgdmFsdWVzIG9yIEFycmF5cyB0byBzdG9yYWdlLlxuICogbG9jYWwuc2V0KHsgZW1haWw6ICdzYW1wbGVAZ21haWwuY29tJyB9KVxuICogICAudGhlbigoKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ1RoZSBpdGVtIFwiZW1haWxcIiB3YXMgc2V0LicpXG4gKiAgIH0pXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFN0b3JhZ2UgY2Fubm90IHNhdmUgb3RoZXIgdHlwZXMsXG4gKiAvLyBzdWNoIGFzIEZ1bmN0aW9uLCBEYXRlLCBSZWdFeHAsIFNldCwgTWFwLCBBcnJheUJ1ZmZlciBhbmQgc28gb24uXG4gKiBsb2NhbC5zZXQoeyBkb2dzOiBuZXcgU2V0KFsnRmx1ZmZ5JywgJ0R1a2UnLCAnQmFieSddKSB9KVxuICogICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ1RoZXJlIHdhcyBhIHByb2JsZW0hJylcbiAqICAgfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBzZXQgPSB2YWx1ZXMgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQodmFsdWVzLCAoKSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogUmV0cmlldmVzIG9uZSBvciBtb3JlIGl0ZW1zIGZyb20gdGhlIHN0b3JhZ2UgYXJlYS5cbiAqXG4gKiBTZWUgdGhlXG4gKiBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSNtZXRob2QtU3RvcmFnZUFyZWEtZ2V0KVxuICogYW5kXG4gKiBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9zdG9yYWdlL1N0b3JhZ2VBcmVhL2dldCkuXG4gKlxuICogQG1lbWJlcm9mIHN0b3JhZ2VMb2NhbFxuICogQGZ1bmN0aW9uIGdldFxuICogQHBhcmFtIHtzdHJpbmd8QXJyYXk8c3RyaW5nPn0ga2V5cyAtIEEgc3RyaW5nIG9yIGFycmF5IG9mIGtleSBuYW1lcyB0byByZXRyaWV2ZSBmcm9tIHN0b3JhZ2UuIElmIGtleXMgaXMgdW5kZWZpbmVkLCByZXR1cm5zIGFsbCBpdGVtcyBpbiBzdG9yYWdlLlxuICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gUmVzb2x2ZXMgd2l0aCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZXMgb2YgdGhlIGl0ZW1zIG9yIHJlamVjdHMgb24gZmFpbHVyZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogbG9jYWwuZ2V0KCdjYXRzJylcbiAqICAgLnRoZW4oKHtjYXRzfSkgPT4ge1xuICogICAgIGNvbnNvbGUubG9nKCdDYXRzIScsIGNhdHMpXG4gKiAgIH0pXG4gKlxuICogQGV4YW1wbGVcbiAqIGxvY2FsLmdldCgpXG4gKiAgIC50aGVuKChhbGxJdGVtcykgPT4ge1xuICogICAgIGNvbnNvbGUubG9nKCdFdmVyeSBpdGVtIGluIHN0b3JhZ2U6JywgYWxsSXRlbXMpXG4gKiAgIH0pXG4gKlxuICogQGV4YW1wbGVcbiAqIGxvY2FsLmdldChbJ2NhdHMnLCAnZG9ncyddKVxuICogICAudGhlbigoe2NhdHMsIGRvZ3N9KSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ0NhdHMhJywgY2F0cylcbiAqICAgICBjb25zb2xlLmxvZygnRG9ncyEnLCBkb2dzKVxuICogICB9KVxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IGdldCA9IGtleXMgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWtleXMgfHwgIWtleXMubGVuZ3RoKSB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChudWxsLCBrZXlWYWx1ZU9iaiA9PiB7XG4gICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGtleVZhbHVlT2JqKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChrZXlzLCBrZXlWYWx1ZU9iaiA9PiB7XG4gICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGtleVZhbHVlT2JqKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBpdGVtcyBmcm9tIHRoZSBzdG9yYWdlIGFyZWEuXG4gKlxuICogU2VlXG4gKiBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSNtZXRob2QtU3RvcmFnZUFyZWEtY2xlYXIpXG4gKiBhbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3N0b3JhZ2UvU3RvcmFnZUFyZWEvY2xlYXIpLlxuICpcbiAqIEBtZW1iZXJvZiBzdG9yYWdlTG9jYWxcbiAqIEBmdW5jdGlvbiBjbGVhclxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIG9uIHN1Y2Nlc3Mgb3IgcmVqZWN0cyBvbiBmYWlsdXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsb2NhbC5jbGVhcigpXG4gKiAgIC50aGVuKCgpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnU3RvcmFnZSB3YXMgY2xlYXJlZC4nKVxuICogICB9KVxuICovXG5leHBvcnQgY29uc3QgY2xlYXIgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmNsZWFyKCgpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBSZW1vdmVzIG9uZSBvciBtb3JlIGl0ZW1zIGZyb20gdGhlIHN0b3JhZ2UgYXJlYS5cbiAqXG4gKiBTZWUgdGhlXG4gKiBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSNtZXRob2QtU3RvcmFnZUFyZWEtcmVtb3ZlKVxuICogYW5kXG4gKiBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9zdG9yYWdlL1N0b3JhZ2VBcmVhL3JlbW92ZSkuXG4gKlxuICogQG1lbWJlcm9mIHN0b3JhZ2VMb2NhbFxuICogQGZ1bmN0aW9uIHJlbW92ZVxuICogQHBhcmFtIHtzdHJpbmd8QXJyYXk8c3RyaW5nPn0ga2V5cyAtIEEgc3RyaW5nLCBvciBhcnJheSBvZiBzdHJpbmdzLCByZXByZXNlbnRpbmcgdGhlIGtleShzKSBvZiB0aGUgaXRlbShzKSB0byBiZSByZW1vdmVkLlxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIG9uIHN1Y2Nlc3Mgb3IgcmVqZWN0cyBvbiBmYWlsdXJlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsb2NhbC5yZW1vdmUoJ2tleScpXG4gKiAgIC50aGVuKCgpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnVGhlIHByb3BlcnR5IFwia2V5XCIgd2FzIHJlbW92ZWQuJylcbiAqICAgfSlcbiAqXG4gKiBAZXhhbXBsZVxuICogbG9jYWwucmVtb3ZlKFsna2V5JywgJ2xvY2snXSlcbiAqICAgLnRoZW4oKCkgPT4ge1xuICogICAgIGNvbnNvbGUubG9nKCdUaGUgcHJvcGVydHkgXCJrZXlcIiB3YXMgcmVtb3ZlZC4nKVxuICogICAgIGNvbnNvbGUubG9nKCdUaGUgcHJvcGVydHkgXCJsb2NrXCIgd2FzIHJlbW92ZWQuJylcbiAqICAgfSlcbiAqXG4gKlxuICovXG5leHBvcnQgY29uc3QgcmVtb3ZlID0ga2V5cyA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShrZXlzLCAoKSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogVGhpcyBpcyBhIHdyYXBwZXIgZm9yIHRoZSBsb2NhbCBDaHJvbWUgZXh0ZW5zaW9uIHN0b3JhZ2UgQVBJLlxuICogRW5hYmxlcyBleHRlbnNpb25zIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBkYXRhLCBhbmQgbGlzdGVuIGZvciBjaGFuZ2VzIHRvIHN0b3JlZCBpdGVtcy5cbiAqXG4gKiBTZWUgdGhlIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9zdG9yYWdlKSxcbiAqIGFuZCBbTUROIHN0b3JhZ2VdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3N0b3JhZ2UjUHJvcGVydGllcykuXG4gKlxuICogQG5hbWVzcGFjZVxuICovXG5leHBvcnQgY29uc3Qgc3RvcmFnZUxvY2FsID0ge1xuICBzZXQsXG4gIGdldCxcbiAgY2xlYXIsXG4gIHJlbW92ZSxcbn1cbiIsIi8qKlxuICogU3RvcmUgb25lIG9yIG1vcmUgaXRlbXMgaW4gdGhlIHN0b3JhZ2UgYXJlYSwgb3IgdXBkYXRlIGV4aXN0aW5nIGl0ZW1zLlxuICogV2hlbiB5b3Ugc3RvcmUgb3IgdXBkYXRlIGEgdmFsdWUgdXNpbmcgdGhpcyBBUEksIHRoZSBvbkNoYW5nZWQgZXZlbnQgd2lsbCBmaXJlLlxuICpcbiAqIFNlZSB0aGVcbiAqIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9zdG9yYWdlI21ldGhvZC1TdG9yYWdlQXJlYS1zZXQpXG4gKiBhbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3N0b3JhZ2UvU3RvcmFnZUFyZWEvc2V0KS5cbiAqXG4gKiBAbWVtYmVyb2Ygc3RvcmFnZVN5bmNcbiAqIEBmdW5jdGlvbiBzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBvbmUgb3IgbW9yZSBrZXkvdmFsdWUgcGFpcnMgdG8gYmUgc3RvcmVkIGluIHN0b3JhZ2UuIElmIGFuIGl0ZW0gYWxyZWFkeSBleGlzdHMsIGl0cyB2YWx1ZSB3aWxsIGJlIHVwZGF0ZWQuXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgb24gc3VjY2VzcyBvciByZWplY3RzIG9uIGZhaWx1cmUuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFNhdmUgcHJpbWl0aXZlIHZhbHVlcyBvciBBcnJheXMgdG8gc3RvcmFnZS5cbiAqIHN5bmMuc2V0KHsgZW1haWw6ICdzYW1wbGVAZ21haWwuY29tJyB9KVxuICogICAudGhlbigoKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ1RoZSBpdGVtIFwiZW1haWxcIiB3YXMgc2V0LicpXG4gKiAgIH0pXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFN0b3JhZ2UgY2Fubm90IHNhdmUgb3RoZXIgdHlwZXMsXG4gKiAvLyBzdWNoIGFzIEZ1bmN0aW9uLCBEYXRlLCBSZWdFeHAsIFNldCwgTWFwLCBBcnJheUJ1ZmZlciBhbmQgc28gb24uXG4gKiBzeW5jLnNldCh7IGRvZ3M6IG5ldyBTZXQoWydGbHVmZnknLCAnRHVrZScsICdCYWJ5J10pIH0pXG4gKiAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnVGhlcmUgd2FzIGEgcHJvYmxlbSEnKVxuICogICB9KVxuICpcbiAqL1xuXG5leHBvcnQgY29uc3Qgc2V0ID0gKHZhbHVlcyA9IHt9KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5zeW5jLnNldCh2YWx1ZXMsICgpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgb25lIG9yIG1vcmUgaXRlbXMgZnJvbSB0aGUgc3RvcmFnZSBhcmVhLlxuICpcbiAqIFNlZSB0aGVcbiAqIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9zdG9yYWdlI21ldGhvZC1TdG9yYWdlQXJlYS1nZXQpXG4gKiBhbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3N0b3JhZ2UvU3RvcmFnZUFyZWEvZ2V0KS5cbiAqXG4gKiBAbWVtYmVyb2Ygc3RvcmFnZVN5bmNcbiAqIEBmdW5jdGlvbiBnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfEFycmF5PHN0cmluZz59IGtleXMgLSBBIHN0cmluZyBvciBhcnJheSBvZiBrZXkgbmFtZXMgdG8gcmV0cmlldmUgZnJvbSBzdG9yYWdlLlxuICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gUmVzb2x2ZXMgd2l0aCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZXMgb2YgdGhlIGl0ZW1zIG9yIHJlamVjdHMgb24gZmFpbHVyZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogc3luYy5nZXQoJ2NhdHMnKVxuICogICAudGhlbigoe2NhdHN9KSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ0NhdHMhJywgY2F0cylcbiAqICAgfSlcbiAqXG4gKiBAZXhhbXBsZVxuICogc3luYy5nZXQoWydjYXRzJywgJ2RvZ3MnXSlcbiAqICAgLnRoZW4oKHtjYXRzLCBkb2dzfSkgPT4ge1xuICogICAgIGNvbnNvbGUubG9nKCdDYXRzIScsIGNhdHMpXG4gKiAgICAgY29uc29sZS5sb2coJ0RvZ3MhJywgZG9ncylcbiAqICAgfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBnZXQgPSBrZXlzQXJyYXkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUuc3luYy5nZXQoa2V5c0FycmF5LCBrZXlWYWx1ZU9iaiA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShrZXlWYWx1ZU9iailcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBpdGVtcyBmcm9tIHRoZSBzdG9yYWdlIGFyZWEuXG4gKlxuICogU2VlXG4gKiBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSNtZXRob2QtU3RvcmFnZUFyZWEtY2xlYXIpXG4gKiBhbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3N0b3JhZ2UvU3RvcmFnZUFyZWEvY2xlYXIpLlxuICpcbiAqIEBtZW1iZXJvZiBzdG9yYWdlU3luY1xuICogQGZ1bmN0aW9uIGNsZWFyXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgb24gc3VjY2VzcyBvciByZWplY3RzIG9uIGZhaWx1cmUuXG4gKlxuICogQGV4YW1wbGVcbiAqIHN5bmMuY2xlYXIoKVxuICogICAudGhlbigoKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ1N0b3JhZ2Ugd2FzIGNsZWFyZWQuJylcbiAqICAgfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBjbGVhciA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnN5bmMuY2xlYXIoKCkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFJlbW92ZXMgb25lIG9yIG1vcmUgaXRlbXMgZnJvbSB0aGUgc3RvcmFnZSBhcmVhLlxuICpcbiAqIFNlZSB0aGVcbiAqIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9zdG9yYWdlI21ldGhvZC1TdG9yYWdlQXJlYS1yZW1vdmUpXG4gKiBhbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3N0b3JhZ2UvU3RvcmFnZUFyZWEvcmVtb3ZlKS5cbiAqXG4gKiBAbWVtYmVyb2Ygc3RvcmFnZVN5bmNcbiAqIEBmdW5jdGlvbiByZW1vdmVcbiAqIEBwYXJhbSB7c3RyaW5nfEFycmF5PHN0cmluZz59IGtleXMgLSBBIHN0cmluZywgb3IgYXJyYXkgb2Ygc3RyaW5ncywgcmVwcmVzZW50aW5nIHRoZSBrZXkocykgb2YgdGhlIGl0ZW0ocykgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyBvbiBzdWNjZXNzIG9yIHJlamVjdHMgb24gZmFpbHVyZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogc3luYy5yZW1vdmUoJ2tleScpXG4gKiAgIC50aGVuKCgpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnVGhlIHByb3BlcnR5IFwia2V5XCIgd2FzIHJlbW92ZWQuJylcbiAqICAgfSlcbiAqXG4gKiBAZXhhbXBsZVxuICogc3luYy5yZW1vdmUoWydrZXknLCAnbG9jayddKVxuICogICAudGhlbigoKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ1RoZSBwcm9wZXJ0eSBcImtleVwiIHdhcyByZW1vdmVkLicpXG4gKiAgICAgY29uc29sZS5sb2coJ1RoZSBwcm9wZXJ0eSBcImxvY2tcIiB3YXMgcmVtb3ZlZC4nKVxuICogICB9KVxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZSA9IGtleXMgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUuc3luYy5yZW1vdmUoa2V5cywgKCkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFRoaXMgaXMgYSB3cmFwcGVyIGZvciB0aGUgbG9jYWwgQ2hyb21lIGV4dGVuc2lvbiBzdG9yYWdlIEFQSS5cbiAqIEVuYWJsZXMgZXh0ZW5zaW9ucyB0byBzdG9yZSBhbmQgcmV0cmlldmUgZGF0YSwgYW5kIGxpc3RlbiBmb3IgY2hhbmdlcyB0byBzdG9yZWQgaXRlbXMuXG4gKlxuICogU2VlIHRoZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvc3RvcmFnZSksXG4gKiBhbmQgW01ETiBzdG9yYWdlXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9zdG9yYWdlI1Byb3BlcnRpZXMpLlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqL1xuZXhwb3J0IGNvbnN0IHN0b3JhZ2VTeW5jID0ge1xuICBzZXQsXG4gIGdldCxcbiAgY2xlYXIsXG4gIHJlbW92ZSxcbn1cbiIsImV4cG9ydCBjb25zdCBtYXAgPSBtYXBGbiA9PiAoeyB1c2UsIHJlc3VsdCwgZXJyb3IsIGFyZ3MgfSkgPT4ge1xuICB0cnkge1xuICAgIGlmICh1c2UgJiYgIWVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1c2UsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHJlc3VsdDogbWFwRm4ocmVzdWx0LCBhcmdzKSxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdXNlLCByZXN1bHQsIGVycm9yLCBhcmdzIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHsgZXJyb3IsIHVzZSwgYXJncyB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGZvckVhY2ggPSBmb3JFYWNoRm4gPT4gKHtcbiAgdXNlLFxuICByZXN1bHQsXG4gIGVycm9yLFxuICBhcmdzLFxufSkgPT4ge1xuICB0cnkge1xuICAgIGlmICh1c2UgJiYgIWVycm9yKSB7XG4gICAgICBmb3JFYWNoRm4ocmVzdWx0LCBhcmdzKVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4geyB1c2UsIHJlc3VsdCwgZXJyb3IsIGFyZ3MgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7IGVycm9yLCB1c2UsIGFyZ3MgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXIgPSBwcmVkRm4gPT4gKHtcbiAgdXNlLFxuICBlcnJvcixcbiAgcmVzdWx0LFxuICBhcmdzLFxufSkgPT4ge1xuICB0cnkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHsgdXNlOiBmYWxzZSwgcmVzdWx0LCBlcnJvciwgYXJncyB9XG4gICAgfSBlbHNlIGlmICh1c2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVzZTogcHJlZEZuKHJlc3VsdCwgYXJncyksXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgYXJncyxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdXNlLCByZXN1bHQsIGVycm9yLCBhcmdzIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHsgZXJyb3IsIHVzZSwgYXJncyB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNsZWFyID0gY2xlYXJGbiA9PiBwcmVkRm4gPT4gKHtcbiAgdXNlLFxuICBlcnJvcixcbiAgcmVzdWx0LFxuICBhcmdzLFxufSkgPT4ge1xuICB0cnkge1xuICAgIGlmICh1c2UgJiYgIWVycm9yICYmIHByZWRGbihyZXN1bHQsIGFyZ3MpKSB7XG4gICAgICBjbGVhckZuKClcbiAgICB9XG5cbiAgICByZXR1cm4geyB1c2UsIHJlc3VsdCwgZXJyb3IsIGFyZ3MgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7IGVycm9yLCB1c2UsIGFyZ3MgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVFcnJvciA9IGNhdGNoRm4gPT4gKHtcbiAgdXNlLFxuICBlcnJvcixcbiAgcmVzdWx0LFxuICBhcmdzLFxufSkgPT4ge1xuICB0cnkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0OiBjYXRjaEZuKGVycm9yLCBhcmdzKSxcbiAgICAgICAgdXNlLFxuICAgICAgICBhcmdzLFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyB1c2UsIHJlc3VsdCwgYXJncyB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7IGVycm9yLCB1c2UsIGFyZ3MgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBhd2FpdE1hcCA9IChjYWxsYmFjaywgYXN5bmNGbikgPT4gKHtcbiAgdXNlLFxuICByZXN1bHQsXG4gIGVycm9yLFxuICBhcmdzLFxufSkgPT4ge1xuICBpZiAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IGNhbGxiYWNrLmRpcmVjdCh7XG4gICAgICAgIHVzZSxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFyZ3MsXG4gICAgICB9KSxcbiAgICAgIHVzZSxcbiAgICAgIGFyZ3MsXG4gICAgfVxuICB9IGVsc2UgaWYgKHVzZSkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IFByb21pc2UucmVzb2x2ZShyZXN1bHQpXG4gICAgICAgIC50aGVuKHIgPT4gYXN5bmNGbihyLCBhcmdzKSlcbiAgICAgICAgLnRoZW4ociA9PiAoeyB1c2UsIGFyZ3MsIHJlc3VsdDogciB9KSlcbiAgICAgICAgLmNhdGNoKGUgPT4gKHtcbiAgICAgICAgICB1c2UsXG4gICAgICAgICAgZXJyb3I6IGUsXG4gICAgICAgICAgYXJncyxcbiAgICAgICAgfSkpXG4gICAgICAgIC50aGVuKGNhbGxiYWNrLmRpcmVjdCksXG4gICAgICB1c2UsXG4gICAgICBhcmdzLFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBjYWxsYmFjay5kaXJlY3Qoe1xuICAgICAgICB1c2UsXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgYXJncyxcbiAgICAgIH0pLFxuICAgICAgdXNlLFxuICAgICAgYXJncyxcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGF3YWl0RmlsdGVyID0gKGNhbGxiYWNrLCBhc3luY0ZuKSA9PiAoe1xuICB1c2UsXG4gIHJlc3VsdCxcbiAgZXJyb3IsXG4gIGFyZ3MsXG59KSA9PiB7XG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBlcnJvcjogY2FsbGJhY2suZGlyZWN0KHtcbiAgICAgICAgdXNlOiBmYWxzZSxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGFyZ3MsXG4gICAgICB9KSxcbiAgICAgIHVzZTogZmFsc2UsXG4gICAgICBhcmdzLFxuICAgIH1cbiAgfSBlbHNlIGlmICh1c2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0OiBQcm9taXNlLnJlc29sdmUocmVzdWx0KVxuICAgICAgICAudGhlbihyID0+IGFzeW5jRm4ociwgYXJncykpXG4gICAgICAgIC50aGVuKHVzZSA9PiAoe1xuICAgICAgICAgIHVzZTogISF1c2UsXG4gICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgIGFyZ3MsXG4gICAgICAgIH0pKVxuICAgICAgICAuY2F0Y2goZSA9PiAoe1xuICAgICAgICAgIHVzZSxcbiAgICAgICAgICBlcnJvcjogZSxcbiAgICAgICAgICBhcmdzLFxuICAgICAgICB9KSlcbiAgICAgICAgLnRoZW4oY2FsbGJhY2suZGlyZWN0KSxcbiAgICAgIHVzZSxcbiAgICAgIGFyZ3MsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IGNhbGxiYWNrLmRpcmVjdCh7XG4gICAgICAgIHVzZSxcbiAgICAgICAgcmVzdWx0LFxuICAgICAgICBhcmdzLFxuICAgICAgfSksXG4gICAgICB1c2UsXG4gICAgICBhcmdzLFxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgd3JhcHBlcnMgZnJvbSAnLi9zdHJlYW0ud3JhcHBlcnMnXG5cbmV4cG9ydCBjb25zdCBldmVudEZ1bmN0b3IgPSBCdW1ibGVTdHJlYW1cbmV4cG9ydCBjb25zdCBldmVudFN0cmVhbSA9IEJ1bWJsZVN0cmVhbVxuXG4vKipcbiAqIEEgY29uZmlndXJhYmxlIEFQSSB3aXRoIGZhbWlsaWFyIG1ldGhvZHMgdGhhdCBjb21wb3NlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBjYW4gYmUgcGFzc2VkIHRvIGFuIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIFRoZSBhdHRhY2ggZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGNsZWFyIGZ1bmN0aW9uOiBhIGZ1bmN0aW9uIHRoYXQgcmVtb3ZlcyB0aGUgbGlzdGVuZXIuXG4gKlxuICogQGZ1bmN0aW9uIEJ1bWJsZVN0cmVhbVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBQYXNzIHRvIGFuIGV2ZW50IGxpc3RlbmVyLlxuICogQHBhcmFtIHtkaXJlY3RDYWxsYmFja30gY2FsbGJhY2suZGlyZWN0IC0gVXNlIHRvIGRpcmVjdGx5IGNvbmZpZ3VyZSBhIHN0cmVhbS5cbiAqIEByZXR1cm5zIHtCdW1ibGVTdHJlYW1DaGFpbn0gQW4gb2JqZWN0IHdpdGggZmFtaWxpYXIgbWV0aG9kIG5hbWVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBsaXN0ZW5Ub0Nocm9tZUV2ZW50ID0gKGV2ZW50T2JqZWN0KSA9PiB7XG4gKiAgIHJldHVybiBCdW1ibGVTdHJlYW0oY2FsbGJhY2sgPT4ge1xuICogICAgIC8vIEFkZCB0aGUgY29tcG9zZWQgY2FsbGJhY2sgdG8gdGhlIGV2ZW50IGxpc3RlbmVycy5cbiAqICAgICBldmVudE9iamVjdC5hZGRMaXN0ZW5lcihjYWxsYmFjaylcbiAqICAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGNhbGxiYWNrXG4gKiAgICAgLy8gZnJvbSB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gKiAgICAgcmV0dXJuICgpID0+IGV2ZW50T2JqZWN0LnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKVxuICogICB9KVxuICogfVxuICpcbiAqIEBleGFtcGxlXG4gKiBmdW5jdGlvbiBpbnRlcnZhbCh0aW1lKSB7XG4gKiAgIGNvbnN0IG1pbGxpc2Vjb25kcyA9IG1zKHRpbWUpXG4gKlxuICogICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAqICAgICAvLyBDcmVhdGUgY291bnRlclxuICogICAgIGxldCBjb3VudCA9IDBcbiAqXG4gKiAgICAgLy8gU3RhcnQgaW50ZXJ2YWwsIHBhc3MgY291bnQgdG8gY2FsbGJhY2ssIGluY3JlbWVudCBjb3VudFxuICogICAgIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICogICAgICAgY2FsbGJhY2soY291bnQpXG4gKiAgICAgICBjb3VudCsrXG4gKiAgICAgfSwgbWlsbGlzZWNvbmRzKVxuICpcbiAqICAgICAvLyBSZXR1cm4gZnVuY3Rpb24gdG8gc3RvcCBpbnRlcnZhbFxuICogICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKGlkKVxuICogICB9KVxuICogfVxuICovXG5leHBvcnQgZnVuY3Rpb24gQnVtYmxlU3RyZWFtKGF0dGFjaEZuLCAuLi5hcmdzKSB7XG4gIGxldCBjb21wb3NlZEZuID0geCA9PiB4XG5cbiAgLy8gdXNlZCBieSBjb21wb3NlQ2xlYXIoKVxuICBjb25zdCBjbGVhckZuID0gYXR0YWNoRm4oY2FsbGJhY2ssIC4uLmFyZ3MpXG5cbiAgY2FsbGJhY2suZGlyZWN0ID0gZGlyZWN0XG5cbiAgLyoqXG4gICAqIE1hcCBjaGFuZ2VzIHJlc3VsdCB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIG1hcEZuLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIG1hcFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIFRoZSByZXR1cm4gdmFsdWUgaXMgcGFzc2VkIHRvIHRoZSBuZXh0IG1ldGhvZC5cbiAgICogQHJldHVybnMge0J1bWJsZVN0cmVhbUNoYWlufVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAubWFwKCgpID0+IDEpXG4gICAqICAgLm1hcCgoeCkgPT4geCArIDEpXG4gICAqICAgLm1hcCgoeCkgPT4ge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGJlIDInLCB4KVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBtYXAgPSBjb21wb3NlKHdyYXBwZXJzLm1hcClcblxuICAvKipcbiAgICogVXNlIGZvciBlZmZlY3RzLiBGb3JFYWNoIGRvZXMgbm90IHBhc3MgaXRzIHJldHVybiB2YWx1ZSB0byB0aGUgbmV4dCBmdW5jdGlvbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEJ1bWJsZVN0cmVhbUNoYWluXG4gICAqIEBmdW5jdGlvbiBmb3JFYWNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gVGhlIHJldHVybiB2YWx1ZSBpcyBpZ25vcmVkLlxuICAgKiBAcmV0dXJucyB7bWV0aG9kc30gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAubWFwKCgpID0+IDEpXG4gICAqICAgLmZvckVhY2goKHgpID0+IHtcbiAgICogICAgIGNvbnN0IGNvdW50ID0geCArIDFcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBiZSAyJywgY291bnQpXG4gICAqICAgICByZXR1cm4gY291bnRcbiAgICogICB9KVxuICAgKiAgIC5tYXAoKHgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBiZSAxJywgeClcbiAgICogICB9KVxuICAgKi9cbiAgY29uc3QgZm9yRWFjaCA9IGNvbXBvc2Uod3JhcHBlcnMuZm9yRWFjaClcblxuICAvKipcbiAgICogRmlsdGVyIHN0b3BzIGZ1cnRoZXIgbWFwcGluZ1xuICAgKiBhbmQgcmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZVxuICAgKiBpZiB0aGUgcHJlZGljYXRlIHJldHVybnMgZmFsc2UuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBCdW1ibGVTdHJlYW1DaGFpblxuICAgKiBAZnVuY3Rpb24gZmlsdGVyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRGbiAtIFByZWRpY2F0ZS5cbiAgICogQHJldHVybnMge09iamVjdH0gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAvLyBUaGlzIHdpbGwgc2tpcCB0aGUgZmlyc3QgMiBpbnRlcnZhbHNcbiAgICogICAuZmlsdGVyKCh4KSA9PiB4ID4gMilcbiAgICogICAuZm9yRWFjaCgoeCkgPT4ge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGJlIDMnLCB4KVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBmaWx0ZXIgPSBjb21wb3NlKHdyYXBwZXJzLmZpbHRlcilcblxuICAvKipcbiAgICogQ2xlYXIgcmVtb3ZlcyB0aGUgZXZlbnQgbGlzdGVuZXIgYW5kXG4gICAqIGNvbnRpbnVlcyBkb3duIHRoZSBtYXAgY2hhaW5cbiAgICogaWYgdGhlIHByZWRpY2F0ZSByZXR1cm5zIHRydWUuXG4gICAqXG4gICAqIEl0IGNhbGxzIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBhdHRhY2hGbi5cbiAgICpcbiAgICogQG1lbWJlcm9mIEJ1bWJsZVN0cmVhbUNoYWluXG4gICAqIEBmdW5jdGlvbiBjbGVhclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZEZuXSAtIFByZWRpY2F0ZS5cbiAgICogQHJldHVybnMge09iamVjdH0gQnVtYmxlU3RyZWFtIG1ldGhvZHMgb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbnRlcnZhbCgnMTBzJylcbiAgICogICAvLyBUaGlzIHdpbGwgY2xlYXIgdGhlIGludGVydmFsIG9uIHRoZSAzcmQgdGltZS5cbiAgICogICAuY2xlYXIoKHgpID0+IHggPiAyKVxuICAgKiAgIC5mb3JFYWNoKCgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdJIHdpbGwgbG9nIHRocmVlIHRpbWVzLicpXG4gICAqICAgfSlcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW50ZXJ2YWwoJzEwcycpXG4gICAqICAgLy8gVGhpcyB3aWxsIGNsZWFyIHRoZSBpbnRlcnZhbCBpbW1lZGlhdGVseS5cbiAgICogICAuY2xlYXIoKVxuICAgKiAgIC5mb3JFYWNoKCgpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdJIHdpbGwgbmV2ZXIgbG9nLicpXG4gICAqICAgfSlcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgY2xlYXIgPSBpbnRlcnZhbCgnMTBzJykuY2xlYXJcbiAgICogLy9UaGlzIHdpbGwgY2xlYXIgdGhlIGludGVydmFsIHdoZW4gc29tZXRoaW5nIGZhaWxzIHRvIGxvYWQuXG4gICAqIHdpbmRvdy5vbmVycm9yID0gKGUpID0+IGNsZWFyKClcbiAgICpcbiAgICovXG4gIGNvbnN0IGNsZWFyID0gcHJlZEZuID0+XG4gICAgcHJlZEZuXG4gICAgICA/IGNvbXBvc2Uod3JhcHBlcnMuY2xlYXIoKCkgPT4gY2xlYXJGbigpKSkocHJlZEZuKVxuICAgICAgOiBjbGVhckZuKClcblxuICAvKipcbiAgICogQ2F0Y2ggY291bGQgY2F1c2UgYSBjYWxsIHRvIGZpbHRlciB0byBiZSBza2lwcGVkLlxuICAgKiBJZiB0aGlzIGhhcHBlbnMsIHRoZSBjaGFpbiBjb3VsZCBiZWdpbiB0byBleGVjdXRlIGFnYWluLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGNhdGNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0gQ2FsbGVkIHdoZW4gYW4gZXJyb3IgaXMgZW5jb3VudGVyZWQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEJ1bWJsZVN0cmVhbSBtZXRob2RzIG9iamVjdC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW50ZXJ2YWwoJzEwcycpXG4gICAqICAgLm1hcCgoKSA9PiB7XG4gICAqICAgICBuZXcgRXJyb3IoJ0Jvb20hJylcbiAgICogICB9KVxuICAgKiAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdUaGUgbmV4dCBsaW5lIHdpbGwgc2F5IFwiQm9vbSFcIicpXG4gICAqICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpXG4gICAqICAgfSlcbiAgICpcbiAgICovXG4gIGNvbnN0IGhhbmRsZUVycm9yID0gY29tcG9zZSh3cmFwcGVycy5oYW5kbGVFcnJvcilcblxuICAvKipcbiAgICogTWFwIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUHJvbWlzZS5cbiAgICogQ29tcG9zZXMgYSBuZXcgQnVtYmxlU3RyZWFtIGNhbGxiYWNrXG4gICAqIHRvIHBhc3MgdG8gdGhlIHJldHVybmVkIFByb21pc2UudGhlbigpLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGF3YWl0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGFzeW5jRm4gLSBBc3luYyBGdW5jdGlvbi5cbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIEJ1bWJsZVN0cmVhbUNoYWluIG9iamVjdC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogbGlzdGVuVG8od2luZG93LCAnb25sb2FkJylcbiAgICogICAubWFwKCgpID0+ICdodHRwczovL3d3dy5nb29nbGUuY29tJylcbiAgICogICAuYXdhaXQoZmV0Y2gpXG4gICAqICAgLm1hcCgocmVzcG9uc2UpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm9rKVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBhd2FpdE1hcCA9IGNvbXBvc2VBc3luYyh3cmFwcGVycy5hd2FpdE1hcClcblxuICAvKipcbiAgICogRXZhbHVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJlZGljYXRlIFByb21pc2VcbiAgICogYW5kIHN0b3BzIGZ1cnRoZXIgZXhlY3V0aW9uIGlmIHRoZSBQcm9taXNlIHJlc29sdmVzIHRvIGZhbHNlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICogQGZ1bmN0aW9uIGF3YWl0RmlsdGVyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKik6IGJvb2xlYW59IGFzeW5jUHJlZEZuIC0gQXN5bmMgUHJlZGljYXRlIEZ1bmN0aW9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgQnVtYmxlU3RyZWFtQ2hhaW4gb2JqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBsaXN0ZW5Ubyh3aW5kb3csICdvbmxvYWQnKVxuICAgKiAgIC5tYXAoKCkgPT4gJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20nKVxuICAgKiAgIC5hd2FpdC5maWx0ZXIoZmV0Y2gpXG4gICAqICAgLm1hcCgocmVzcG9uc2UpID0+IHtcbiAgICogICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLm9rKVxuICAgKiAgIH0pXG4gICAqXG4gICAqL1xuICBjb25zdCBhd2FpdEZpbHRlciA9IGNvbXBvc2VBc3luYyh3cmFwcGVycy5hd2FpdEZpbHRlcilcblxuICAvKipcbiAgICogVGhlIEJ1bWJsZVN0cmVhbUNoYWluIGNvbXBvc2VzIGEgY2FsbGJhY2sgdXNpbmdcbiAgICogdGhlIGZhbWlsaWFyIEpTIEFycmF5IGhpZ2hlciBvcmRlciBmdW5jdGlvbiBjaGFpbiBwYXR0ZXJuLlxuICAgKlxuICAgKiBAbWVtYmVyIHtPYmplY3R9XG4gICAqIEBuYW1lc3BhY2UgQnVtYmxlU3RyZWFtQ2hhaW5cbiAgICovXG4gIGNvbnN0IG1ldGhvZHMgPSB7XG4gICAgbWFwLFxuICAgIGZpbHRlcixcbiAgICBmb3JFYWNoLFxuICAgIGNhdGNoOiBoYW5kbGVFcnJvcixcbiAgICBjbGVhcixcbiAgICBhd2FpdDogYXdhaXRNYXAsXG4gICAgYXdhaXRNYXAsXG4gICAgYXdhaXRGaWx0ZXIsXG4gIH1cblxuICByZXR1cm4gbWV0aG9kc1xuXG4gIGZ1bmN0aW9uIGNhbGxiYWNrKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gaGFuZGxlVW5jYXVnaHRFcnJvcihcbiAgICAgIGNvbXBvc2VkRm4oe1xuICAgICAgICByZXN1bHQ6IGFyZ3NbMF0sXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHVzZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpcmVjdChwYXlsb2FkKSB7XG4gICAgcmV0dXJuIGhhbmRsZVVuY2F1Z2h0RXJyb3IoY29tcG9zZWRGbihwYXlsb2FkKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVVuY2F1Z2h0RXJyb3IoeyByZXN1bHQsIGVycm9yIH0pIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGVycm9yKS50aGVuKGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmNhdWdodCBhc3luYyBlcnJvciBpbiBCdW1ibGVTdHJlYW0nKVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVbmNhdWdodCBlcnJvciBpbiBCdW1ibGVTdHJlYW0nKVxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29tcG9zZSh3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZuID0+IHtcbiAgICAgIGNvbnN0IG5ld0ZuID0gd3JhcHBlcihmbilcbiAgICAgIGNvbnN0IG9sZEZuID0gY29tcG9zZWRGblxuXG4gICAgICBjb21wb3NlZEZuID0gZXZlbnQgPT4gbmV3Rm4ob2xkRm4oZXZlbnQpKVxuXG4gICAgICByZXR1cm4gbWV0aG9kc1xuICAgIH1cbiAgfVxuXG4gIC8qIEdvZXMgaW50byBCdW1ibGVTdHJlYW0gKi9cbiAgZnVuY3Rpb24gY29tcG9zZUFzeW5jKHdyYXBwZXIpIHtcbiAgICByZXR1cm4gYXN5bmNGbiA9PlxuICAgICAgQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICAgICAgY29uc3QgbmV3Rm4gPSB3cmFwcGVyKGNhbGxiYWNrLCBhc3luY0ZuKVxuXG4gICAgICAgIGNvbnN0IG9sZEZuID0gY29tcG9zZWRGblxuXG4gICAgICAgIGNvbXBvc2VkRm4gPSBldmVudCA9PiBuZXdGbihvbGRGbihldmVudCkpXG5cbiAgICAgICAgcmV0dXJuIGNsZWFyRm5cbiAgICAgIH0pXG4gIH1cbn1cbi8qKlxuICogVXNlIHRvIGRpcmVjdGx5IGNvbmZpZ3VyZSB0aGUgQnVtYmxlU3RyZWFtLlxuICogVXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBhc3luYyBtZXRob2QuXG4gKlxuICogQGNhbGxiYWNrIGRpcmVjdENhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIFRoZSB2YWx1ZSBCdW1ibGVTdHJlYW0gdXNlcyBpbnRlcm5hbGx5LlxuICogQHBhcmFtIHthbnl9IHBheWxvYWQucmVzdWx0IC0gVGhlIHZhbHVlIHRvIHBhc3MgdG8gdGhlIG5leHQgbWV0aG9kIGNhbGxiYWNrLlxuICogQHBhcmFtIHtBcnJheX0gcGF5bG9hZC5hcmdzIC0gQW4gYXJyYXkgdG8gcGFzcyB0byBlYWNoIG1ldGhvZCBjYWxsYmFjay5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcGF5bG9hZC51c2UgLSBXaWxsIGNhdXNlIG1ldGhvZCBjYWxsYmFjayB0byBza2lwIGlmIGZhbHNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBCdW1ibGVTdHJlYW0oKHtkaXJlY3R9KSA9PiB7XG4gKiAgIC8vIEltbWVkaWF0ZWx5IGV4ZWN1dGUgY29tcG9zZWQgY2FsbGJhY2tcbiAqICAgZGlyZWN0KHtcbiAqICAgICByZXN1bHQ6IDEyMyxcbiAqICAgICBhcmdzOiBbMSwgMiwgM10sXG4gKiAgICAgdXNlOiB0cnVlLFxuICogICB9KVxuICpcbiAqICAgLy8gQ29uZmlndXJlIGNsZWFyRm5cbiAqICAgcmV0dXJuICgpID0+IGNsZWFyKClcbiAqIH0pXG4gKi9cbiIsIi8vIFRPRE86IFJlZmFjdG9yIHRvIGNocm9tZS9leHRlbnNpb24tcGFnZXMuanNcbmV4cG9ydCBjb25zdCBpc0JhY2tncm91bmRQYWdlID0gKCkgPT5cbiAgbG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicgJiZcbiAgKGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL19nZW5lcmF0ZWRfYmFja2dyb3VuZF9wYWdlLmh0bWwnIHx8XG4gICAgbG9jYXRpb24ucGF0aG5hbWUgPT09XG4gICAgICBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLmJhY2tncm91bmQucGFnZSlcblxuZXhwb3J0IGNvbnN0IGlzQ29udGVudFNjcmlwdCA9ICgpID0+XG4gIGxvY2F0aW9uLnByb3RvY29sICE9PSAnY2hyb21lLWV4dGVuc2lvbjonXG5cbmV4cG9ydCBjb25zdCBpc0NvbnRleHRQYWdlID0gKCkgPT5cbiAgbG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicgJiYgIWlzQmFja2dyb3VuZFBhZ2VcblxuZXhwb3J0IGNvbnN0IGNvbnRleHQgPSB7XG4gIGlzQmFja2dyb3VuZFBhZ2UsXG4gIGlzQ29udGVudFNjcmlwdCxcbiAgaXNDb250ZXh0UGFnZSxcbn1cblxuZXhwb3J0IGNvbnN0IG5vdCA9IGZuID0+ICguLi54KSA9PiAhZm4oLi4ueClcbmV4cG9ydCBjb25zdCBib29sID0gZm4gPT4gKC4uLngpID0+ICEhZm4oLi4ueClcblxuZXhwb3J0IGNvbnN0IGxvZyA9IG1zZyA9PiB4ID0+IHtcbiAgY29uc29sZS5sb2cobXNnLCB4KVxuICByZXR1cm4geFxufVxuXG5leHBvcnQgY29uc3QgZXJyb3IgPSBtc2cgPT4geCA9PiB7XG4gIGNvbnNvbGUuZXJyb3IobXNnLCB4KVxuICByZXR1cm4geFxufVxuXG5leHBvcnQgY29uc3QgY2FsbEVhY2ggPSBvYmogPT4gT2JqZWN0LnZhbHVlcyhvYmopLm1hcChmbiA9PiBmbigpKVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tIEFycmF5IFV0aWxzIC0tLS0tLS0tLS0tLS0tLSAqL1xuZXhwb3J0IGNvbnN0IHBhZEFycmF5RW5kID0gKGFycmF5LCBsZW5ndGgsIGNiKSA9PiB7XG4gIHdoaWxlIChhcnJheS5sZW5ndGggPCBsZW5ndGgpIHtcbiAgICBhcnJheS5wdXNoKGNiKGFycmF5Lmxlbmd0aCkpXG4gIH1cblxuICByZXR1cm4gYXJyYXlcbn1cblxuZXhwb3J0IGNvbnN0IHJhbmRvbUFycmF5RWxlbWVudCA9IGFycmF5ID0+XG4gIGFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCldXG4iLCJpbXBvcnQgeyBCdW1ibGVTdHJlYW0gfSBmcm9tICcuLi9ldmVudC1zdHJlYW0vc3RyZWFtJ1xuaW1wb3J0IHsgaXNCYWNrZ3JvdW5kUGFnZSB9IGZyb20gJy4uL3V0aWxzL3V0aWwuZXh0ZW5kJ1xuXG4vKipcbiAqIFVzZSB0byBzZW5kIG1lc3NhZ2VzIGJldHdlZW4gZG9jdW1lbnRzXG4gKiAoZnJvbSBiYWNrZ3JvdW5kIHRvIGNvbnRlbnQgc2NyaXB0LCBvciB2aWNlLXZlcnNhKS5cbiAqXG4gKiBAbWVtYmVyb2YgbWVzc2FnZVxuICogQHR5cGVkZWYge09iamVjdH0gTWVzc2FnZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGdyZWV0aW5nIC0gQSBjb25zdGFudCB0byBpZGVudGlmeSB0aGUgbWVzc2FnZSB0eXBlLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0YWJJZF0gLSBJZGVudGlmaWVzIHRoZSB0YWIgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAqL1xuXG4vKipcbiAqIFVzZSB0byBzZW5kIG1lc3NhZ2UgYmV0d2VlbiBzY3JpcHRzLlxuICogQ2FuIHJlY29nbml6ZSB0aGUgZXh0ZW5zaW9uIGRvY3VtZW50IGNvbnRleHQgKGJhY2tncm91bmQgb3IgY29udGVudCBzY3JpcHQpLlxuICogUmVxdWlyZXMgdGFiSWQgcHJvcGVydHkgd2hlbiBzZW5kaW5nIGZyb20gYmFja2dyb3VuZCBwYWdlLlxuICpcbiAqIEBtZW1iZXJvZiBtZXNzYWdlXG4gKiBAZnVuY3Rpb24gc2VuZFxuICogQHBhcmFtIHtNZXNzYWdlfSBtZXNzYWdlIC0gQSBNZXNzYWdlIG9iamVjdCB3aXRoIG9wdGlvbmFsIGRhdGEgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtQcm9taXNlPE1lc3NhZ2U+fSBSZXNvbHZlcyBpZiB0aGUgb3RoZXIgc2lkZSByZXNwb25kcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogbWVzc2FnZS5zZW5kKHtcbiAqICAgZ3JlZXRpbmc6ICdoZWxsbycsXG4gKiAgIHRhYklkOiAxMjM0LCAvLyBSZXF1aXJlZCBpZiBzZW5kaW5nIGZyb20gYmFja2dyb3VuZCBwYWdlLlxuICogfSlcbiAqICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ1RoZXkgc2FpZDonLCByZXNwb25zZS5ncmVldGluZylcbiAqICAgfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBzZW5kID0gbWVzc2FnZSA9PiB7XG4gIGlmIChpc0JhY2tncm91bmRQYWdlKCkpIHtcbiAgICBjb25zdCB7IHRhYklkLCAuLi5tc2cgfSA9IG1lc3NhZ2VcbiAgICByZXR1cm4gc2VuZFRvVGFiKHRhYklkLCBtc2cpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNlbmRGcm9tVGFiKG1lc3NhZ2UpXG4gIH1cbn1cblxuLyoqXG4gKiBTZW5kIGEgbWVzc2FnZSB0byB0aGUgYmFja2dyb3VuZCBzY3JpcHQuXG4gKiBTZWUgW0Nocm9tZSBBUEldKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9ydW50aW1lI21ldGhvZC1zZW5kTWVzc2FnZSkuXG4gKiBBbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3J1bnRpbWUvc2VuZE1lc3NhZ2UpLlxuICpcbiAqIEBtZW1iZXJvZiBtZXNzYWdlXG4gKiBAZnVuY3Rpb24gc2VuZEZyb21UYWJcbiAqIEBwYXJhbSB7TWVzc2FnZX0gbWVzc2FnZSAtIEEgTWVzc2FnZSBvYmplY3Qgd2l0aCBvcHRpb25hbCBkYXRhIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxNZXNzYWdlPn0gUmVzb2x2ZXMgaWYgdGhlIG90aGVyIHNpZGUgcmVzcG9uZHMuXG4gKlxuICogQGV4YW1wbGVcbiAqIG1lc3NhZ2Uuc2VuZEZyb21UYWIoeyBncmVldGluZzogJ2hlbGxvJyB9KVxuICogICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnVGhleSBzYWlkJywgcmVzcG9uc2UuZ3JlZXRpbmcpXG4gKiAgIH0pXG4gKlxuICovXG5leHBvcnQgY29uc3Qgc2VuZEZyb21UYWIgPSBtZXNzYWdlID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSwgcmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2UgaWYgKCFyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKVxuICAgIH1cbiAgfSlcblxuLyoqXG4gKiBTZW5kIGEgbWVzc2FnZSBmcm9tIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdCB0byBhIHRhYi5cbiAqXG4gKiBAbWVtYmVyb2YgbWVzc2FnZVxuICogQGZ1bmN0aW9uIHNlbmRUb1RhYlxuICogQHBhcmFtIHtNZXNzYWdlfSBtZXNzYWdlIC0gTXVzdCBoYXZlIGEgZ3JlZXRpbmcgYW5kIHRhYklkIHByb3BlcnR5LlxuICogQHJldHVybnMge1Byb21pc2U8TWVzc2FnZT59IFJlc29sdmVzIGlmIHRoZSBvdGhlciBzaWRlIHJlc3BvbmRzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBtZXNzYWdlLnNlbmRUb1RhYih7XG4gKiAgIGdyZWV0aW5nOiAnaGVsbG8nLFxuICogICB0YWJJZDogMTIzNCxcbiAqIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKCdUaGV5IHNhaWQnLCByZXNwb25zZS5ncmVldGluZylcbiAqIH0pXG4gKi9cbmV4cG9ydCBjb25zdCBzZW5kVG9UYWIgPSAoeyB0YWJJZCwgLi4ubWVzc2FnZSB9KSA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCBtZXNzYWdlLCByZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICByZWplY3QocmVzcG9uc2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcblxuLyoqXG4gKiBMaXN0ZW4gZm9yIG1lc3NhZ2VzIGZyb20gb3RoZXIgdGFicy9wYWdlcy5cbiAqXG4gKiBUaGUgcmVzcG9uc2UgTWVzc2FnZSBvYmplY3Qgd2lsbCBiZSBwcm9jZXNzZWQgYmVmb3JlIGl0IGlzIHNlbnQ6XG4gKiAtIElmIHRoZXJlIGlzIG5vIGVycm9yLCBgbWVzc2FnZS5zdWNjZXNzID0gdHJ1ZWAuXG4gKiAtIElmIHRoZXJlIHdhcyBhbiBlcnJvciwgYG1lc3NhZ2Uuc3VjY2VzcyA9IGZhbHNlYFxuICogICBhbmQgdGhlIGVycm9yJ3MgbWVzc2FnZSBhbmQgc3RhY2sgd2lsbCBiZSBhc3NpZ25lZCB0byB0aGUgcmVzcG9uc2Ugb2JqZWN0LlxuICogLSBJZiBgcmVzcG9uc2UuZ3JlZXRpbmdgIGlzIGB1bmRlZmluZWRgLFxuICogICB0aGUgb3JpZ2luYWwgZ3JlZXRpbmcgd2lsbCBiZSBhc3NpZ25lZC5cbiAqXG4gKiBAbWVtYmVyb2YgbWVzc2FnZVxuICogQGZ1bmN0aW9uIGxpc3RlbkZvck1lc3NhZ2VcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NlbmRSZXNwb25zZSA9IHRydWVdIC0gSWYgdHJ1ZSwgd2lsbCBzZW5kIGEgcmVzcG9uc2UuIERlZmF1bHRzIHRvIHRydWUuXG4gKiBAcmV0dXJucyB7QnVtYmxlU3RyZWFtfSBSZXR1cm5zIHRoZSBCdW1ibGVTdHJlYW0gb2JqZWN0LlxuICogICBUaGUgZmluYWwgcmV0dXJuIHZhbHVlIG9mIHRoZSBzdHJlYW0gd2lsbCBiZSBzZW50IGFzIGEgbWVzc2FnZSByZXNwb25zZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogbWVzc2FnZS5saXN0ZW5Gb3JNZXNzYWdlKClcbiAqICAgLmZvckVhY2goKHtncmVldGluZ30pID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnVGhleSBzYWlkJywgZ3JlZXRpbmcpXG4gKiAgIH0pXG4gKi9cbmV4cG9ydCBjb25zdCBsaXN0ZW5Gb3JNZXNzYWdlID0gKHNlbmRSZXNwb25zZSA9IHRydWUpID0+XG4gIEJ1bWJsZVN0cmVhbShjYWxsYmFjayA9PiB7XG4gICAgYXN5bmMgZnVuY3Rpb24gYXN5bmNDYWxsYmFjayhtZXNzYWdlLCBzZW5kZXIpIHtcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgY2FsbGJhY2sgcmV0dXJucyBhIFByb21pc2VcbiAgICAgIHJldHVybiBjYWxsYmFjayhtZXNzYWdlLCBzZW5kZXIpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIGNhbGxiYWNrKSB7XG4gICAgICBhc3luY0NhbGxiYWNrKG1lc3NhZ2UsIHNlbmRlcilcbiAgICAgICAgLnRoZW4ocmVzdWx0ID0+ICh7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgIH0pKVxuICAgICAgICAuY2F0Y2gocmVhc29uID0+ICh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgcmVhc29uOiByZWFzb24ubWVzc2FnZSB8fCByZWFzb24sXG4gICAgICAgICAgc3RhY2s6IHJlYXNvbi5zdGFjayB8fCB1bmRlZmluZWQsXG4gICAgICAgIH0pKVxuICAgICAgICAudGhlbihtc2cgPT4gKHtcbiAgICAgICAgICBncmVldGluZzogbWVzc2FnZS5ncmVldGluZyxcbiAgICAgICAgICAuLi5tc2csXG4gICAgICAgIH0pKVxuICAgICAgICAudGhlbihjYWxsYmFjaylcblxuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZVxuICAgIH1cblxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihoYW5kbGVNZXNzYWdlKVxuXG4gICAgLy8gUmV0dXJuIGEgZnVuY3Rpb24gdG8gc3RvcCBsaXN0ZW5pbmcgZm9yIHRoZSBtZXNzYWdlXG4gICAgcmV0dXJuICgpID0+XG4gICAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoaGFuZGxlTWVzc2FnZSlcbiAgfSlcblxuLyoqIEBuYW1lc3BhY2UgKi9cbmV4cG9ydCBjb25zdCBtZXNzYWdlID0ge1xuICBzZW5kLFxuICBzZW5kRnJvbVRhYixcbiAgc2VuZFRvVGFiLFxuICBsaXN0ZW5Gb3JNZXNzYWdlLFxufVxuIiwiLyoqXG4gKiBSZWZlcnJlZCB0byBhcyBcIlRlbXBsYXRlVHlwZVwiIG9uIENocm9tZSBBUEkgRG9jcy5cbiAqIC0gYGJhc2ljYDogaWNvbiwgdGl0bGUsIG1lc3NhZ2UsIGV4cGFuZGVkTWVzc2FnZSwgdXAgdG8gdHdvIGJ1dHRvbnMuXG4gKiAtIGBpbWFnZWA6IGljb24sIHRpdGxlLCBtZXNzYWdlLCBleHBhbmRlZE1lc3NhZ2UsIGltYWdlLCB1cCB0byB0d28gYnV0dG9ucy5cbiAqIC0gYGxpc3RgOiBpY29uLCB0aXRsZSwgbWVzc2FnZSwgaXRlbXMsIHVwIHRvIHR3byBidXR0b25zLiBVc2VycyBvbiBNYWMgT1MgWCBvbmx5IHNlZSB0aGUgZmlyc3QgaXRlbXMuXG4gKiAtIGBwcm9ncmVzc2A6IGljb24sIHRpdGxlLCBtZXNzYWdlLCBwcm9ncmVzcywgdXAgdG8gdHdvIGJ1dHRvbnMuXG4gKlxuICogU2VlIHRoZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2FwcHMvbm90aWZpY2F0aW9ucyN0eXBlLVRlbXBsYXRlVHlwZSkuXG4gKlxuICogQG1lbWJlcm9mIG5vdGlmeVxuICogQHR5cGVkZWYgeygnYmFzaWMnfCdpbWFnZSd8J2xpc3QnfCdwcm9ncmVzcycpfSBOb3RlVHlwZSAtXG4gKi9cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBub3RpZmljYXRpb24gYWN0aW9uIGJ1dHRvbi5cbiAqXG4gKiBAbWVtYmVyb2Ygbm90aWZ5XG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBOb3RlQnV0dG9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGl0bGUgQnV0dG9uIHRpdGxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWNvblVybCBCdXR0b24gaWNvbiB1cmxcbiAqL1xuXG4vKipcbiAqIEl0ZW1zIGZvciBsaXN0IG5vdGlmaWNhdGlvbnMuIFVzZXJzIG9uIE1hYyBPUyBYIG9ubHkgc2VlIHRoZSBmaXJzdCBpdGVtLlxuICpcbiAqIEBtZW1iZXJvZiBub3RpZnlcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE5vdGVJdGVtXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGl0bGUgVGl0bGUgb2Ygb25lIGl0ZW0gb2YgYSBsaXN0IG5vdGlmaWNhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtZXNzYWdlIEFkZGl0aW9uYWwgZGV0YWlscyBhYm91dCB0aGlzIGl0ZW0uXG4gKi9cblxuLyoqXG4gKiBbUmljaCBOb3RpZmljYXRpb25zIC0gQ2hyb21lIEV4dGVuc2lvbnMgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9yaWNoTm90aWZpY2F0aW9ucylcbiAqXG4gKiBTZWUgdGhlIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vYXBwcy9ub3RpZmljYXRpb25zI3R5cGUtTm90aWZpY2F0aW9uT3B0aW9ucylcbiAqXG4gKiBAbWVtYmVyb2Ygbm90aWZ5XG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBOb3RlT3B0aW9uc1xuICogQHByb3BlcnR5IHtOb3RlVHlwZX0gW3R5cGVdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2ljb25VcmxdIEEgVVJMIHBvaW50aW5nIHRvIGFuIGljb24gdG8gZGlzcGxheSBpbiB0aGUgbm90aWZpY2F0aW9uLiBUaGUgVVJMIGNhbiBiZTogYSBkYXRhIFVSTCwgYSBibG9iIFVSTCwgYSBodHRwIG9yIGh0dHBzIFVSTCwgb3IgdGhlIHJlbGF0aXZlIFVSTCBvZiBhIGZpbGUgd2l0aGluIHRoZSBleHRlbnNpb24uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3RpdGxlXSBUaXRsZSBvZiB0aGUgbm90aWZpY2F0aW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW21lc3NhZ2VdIE1haW4gbm90aWZpY2F0aW9uIGNvbnRlbnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbY29udGV4dE1lc3NhZ2VdIEFsdGVybmF0ZSBub3RpZmljYXRpb24gY29udGVudCB3aXRoIGEgbG93ZXItd2VpZ2h0IGZvbnQuXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3ByaW9yaXR5XSBQcmlvcml0eSByYW5nZXMgZnJvbSAtMiB0byAyLiAtMiBpcyBsb3dlc3QgcHJpb3JpdHkuIDIgaXMgaGlnaGVzdC4gWmVybyBpcyBkZWZhdWx0LlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtldmVudFRpbWVdICBBIHRpbWVzdGFtcCBmb3IgdGhlIG5vdGlmaWNhdGlvbiBpbiBtaWxsaXNlY29uZHNcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8Tm90ZUJ1dHRvbj59IFtidXR0b25zXSBUZXh0IGFuZCBpY29ucyBmb3IgdXAgdG8gdHdvIG5vdGlmaWNhdGlvbiBhY3Rpb24gYnV0dG9ucy5cbiAqIEBwcm9wZXJ0eSB7QXJyYXk8Tm90ZUl0ZW0+fSBbaXRlbXNdIEl0ZW1zIGZvciBtdWx0aS1pdGVtIG5vdGlmaWNhdGlvbnMuIFVzZXJzIG9uIE1hYyBPUyBYIG9ubHkgc2VlIHRoZSBmaXJzdCBpdGVtLlxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSBbcHJvZ3Jlc3NdIEFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCAxMDAsIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBjdXJyZW50IHByb2dyZXNzIGluIGEgcHJvZ3Jlc3MgaW5kaWNhdG9yLlxuICogQHByb3BlcnR5IHtib29sZWFufSBbcmVxdWlyZUludGVyYWN0aW9uXSBJbmRpY2F0ZXMgdGhhdCB0aGUgbm90aWZpY2F0aW9uIHNob3VsZCByZW1haW4gdmlzaWJsZSBvbiBzY3JlZW4gdW50aWwgdGhlIHVzZXIgYWN0aXZhdGVzIG9yIGRpc21pc3NlcyB0aGUgbm90aWZpY2F0aW9uLlxuICogQHByb3BlcnR5IHtib29sZWFufSBbc2lsZW50XSBJbmRpY2F0ZXMgdGhhdCBubyBzb3VuZHMgb3IgdmlicmF0aW9ucyBzaG91bGQgYmUgbWFkZSB3aGVuIHRoZSBub3RpZmljYXRpb24gaXMgYmVpbmcgc2hvd24uIFRoaXMgZGVmYXVsdHMgdG8gZmFsc2UuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVza3RvcCBub3RpZmljYXRpb24uXG4gKiBTZWUgdGhlIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vYXBwcy9ub3RpZmljYXRpb25zI21ldGhvZC1jcmVhdGUpLlxuICpcbiAqIEBtZW1iZXJvZiBub3RpZnlcbiAqIEBmdW5jdGlvbiBjcmVhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGV0YWlscyAtIERldGFpbHMgb2YgdGhlIG5vdGlmaWNhdGlvbiB0byBjcmVhdGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2RldGFpbHMuaWRdIC0gSWRlbnRpZmllciBvZiB0aGUgbm90aWZpY2F0aW9uLiBJZiBub3Qgc2V0IG9yIGVtcHR5IGFuIElEIHdpbGwgYXV0b21hdGljYWxseSBiZSBnZW5lcmF0ZWQuXG4gKiBAcGFyYW0gey4uLk5vdGVPcHRpb25zfSBbZGV0YWlscy5vcHRpb25zXSAtIENvbnRlbnRzIG9mIHRoZSBub3RpZmljYXRpb24uXG4gKiBAcGFyYW0ge05vdGVUeXBlfSBkZXRhaWxzLm9wdGlvbnMudHlwZSAtIFdoaWNoIHR5cGUgb2Ygbm90aWZpY2F0aW9uIHRvIGRpc3BsYXkuXG4gKiBAcGFyYW0ge3N0cmluZ30gZGV0YWlscy5vcHRpb25zLmljb25VcmwgLSBXaGljaCB0eXBlIG9mIG5vdGlmaWNhdGlvbiB0byBkaXNwbGF5LlxuICogQHBhcmFtIHtzdHJpbmd9IGRldGFpbHMub3B0aW9ucy50aXRsZSAtIFRpdGxlIG9mIHRoZSBub3RpZmljYXRpb24gKGUuZy4gU2VuZGVyIG5hbWUgZm9yIGVtYWlsKS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXRhaWxzLm9wdGlvbnMubWVzc2FnZSAtIE1haW4gbm90aWZpY2F0aW9uIGNvbnRlbnQuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx7aWQ6IHtzdHJpbmc6P3N0cmluZ319Pn0gUmVzb2x2ZXMgdG8gYW4gb2JqZWN0IHdpdGggdGhlIG5vdGlmaWNhdGlvbiBpZCwgYXMgd2VsbCBhcyB0aGUgb3JpZ2luYWwgTm90aWZpY2F0aW9uT3B0aW9ucyBwcm9wZXJ0aWVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBub3RpZnlcbiAqICAgLmNyZWF0ZSh7XG4gKiAgICAgdHlwZTogTm90ZVR5cGUuYmFzaWMsXG4gKiAgICAgbWVzc2FnZTogJ1NvbWV0aGluZyB0byBzYXknLFxuICogICAgIGJ1dHRvbnM6IFt7IHRpdGxlOiAnQ2xpY2sgaGVyZSEnIH1dLFxuICogICAgIGljb25Vcmw6ICdpY29uLnBuZycsXG4gKiAgICAgaWQ6IGl0ZW0uYXNpbixcbiAqICAgfSlcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9ICh7IGlkLCAuLi5vcHRpb25zIH0pID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY3JlYXRlKGlkLCBvcHRpb25zLCBub3RlSWQgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoeyBpZDogbm90ZUlkLCAuLi5vcHRpb25zIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIGNocm9tZS5ub3RpZmljYXRpb25zIEFQSS4gVXNlIHRvIGNyZWF0ZSByaWNoIG5vdGlmaWNhdGlvbnMgdXNpbmcgdGVtcGxhdGVzIGFuZCBzaG93IHRoZXNlIG5vdGlmaWNhdGlvbnMgdG8gdXNlcnMgaW4gdGhlIHN5c3RlbSB0cmF5LlxuICpcbiAqIFNlZSB0aGVcbiAqIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vYXBwcy9ub3RpZmljYXRpb25zKVxuICogYW5kXG4gKiBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9ub3RpZmljYXRpb25zKS5cbiAqXG4gKiBAbmFtZXNwYWNlIG5vdGlmeVxuICovXG5leHBvcnQgY29uc3Qgbm90aWZ5ID0geyBjcmVhdGUgfVxuIiwiLyoqXG4gKiBPcGVucyB0aGUgb3B0aW9ucyBwYWdlIGFzIGRlZmluZWQgaW4gbWFuaWZlc3QuanNvbi5cbiAqIFNlZVxuICogW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3J1bnRpbWUjbWV0aG9kLW9wZW5PcHRpb25zUGFnZSlcbiAqIGFuZFxuICogW01ETl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0FkZC1vbnMvV2ViRXh0ZW5zaW9ucy9BUEkvcnVudGltZS9vcGVuT3B0aW9uc1BhZ2UpLlxuICpcbiAqIEBtZW1iZXJvZiBvcHRpb25zXG4gKiBAZnVuY3Rpb24gb3BlblxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIGFmdGVyIHRoZSBvcHRpb24gcGFnZSBvcGVucy5cbiAqXG4gKiBAZXhhbXBsZVxuICogb3B0aW9ucy5vcGVuKCkudGhlbigoKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKCdUaGUgb3B0aW9ucyBwYWdlIGlzIG9wZW4uJylcbiAqIH0pXG4gKlxuICovXG4vLyBUT0RPOiBSZWZhY3RvciB0byBjaHJvbWUvZXh0ZW5zaW9uLXBhZ2VzLmpzXG5leHBvcnQgY29uc3Qgb3BlbiA9ICgpID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnJ1bnRpbWUub3Blbk9wdGlvbnNQYWdlKCgpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcblxuLyoqIEBuYW1lc3BhY2UgKi9cbmV4cG9ydCBjb25zdCBvcHRpb25zID0geyBvcGVuIH1cbiIsIi8qKlxuICogQSBQcm94eUNvbmZpZyBvYmplY3QncyBtb2RlIGF0dHJpYnV0ZSBkZXRlcm1pbmVzIHRoZSBvdmVyYWxsIGJlaGF2aW9yIG9mIENocm9tZSB3aXRoIHJlZ2FyZHMgdG8gcHJveHkgdXNhZ2UuXG4gKiBTZWUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3Byb3h5I3Byb3h5X21vZGVzKS5cbiAqXG4gKiAtIGBkaXJlY3RgIG1vZGU6IGFsbCBjb25uZWN0aW9ucyBhcmUgY3JlYXRlZCBkaXJlY3RseSwgd2l0aG91dCBhbnkgcHJveHkgaW52b2x2ZWQuIFRoaXMgbW9kZSBhbGxvd3Mgbm8gZnVydGhlciBwYXJhbWV0ZXJzIGluIHRoZSBQcm94eUNvbmZpZyBvYmplY3QuXG4gKiAtIGBhdXRvX2RldGVjdGAgbW9kZTogdGhlIHByb3h5IGNvbmZpZ3VyYXRpb24gaXMgZGV0ZXJtaW5lZCBieSBhIFBBQyBzY3JpcHQgdGhhdCBjYW4gYmUgZG93bmxvYWRlZCBhdCBodHRwOi8vd3BhZC93cGFkLmRhdC4gVGhpcyBtb2RlIGFsbG93cyBubyBmdXJ0aGVyIHBhcmFtZXRlcnMgaW4gdGhlIFByb3h5Q29uZmlnIG9iamVjdC5cbiAqIC0gYHBhY19zY3JpcHRgIG1vZGU6IHRoZSBwcm94eSBjb25maWd1cmF0aW9uIGlzIGRldGVybWluZWQgYnkgYSBQQUMgc2NyaXB0IHRoYXQgaXMgZWl0aGVyIHJldHJpZXZlZCBmcm9tIHRoZSBVUkwgc3BlY2lmaWVkIGluIHRoZSBwcm94eS5QYWNTY3JpcHQgb2JqZWN0IG9yIHRha2VuIGxpdGVyYWxseSBmcm9tIHRoZSBkYXRhIGVsZW1lbnQgc3BlY2lmaWVkIGluIHRoZSBwcm94eS5QYWNTY3JpcHQgb2JqZWN0LiBCZXNpZGVzIHRoaXMsIHRoaXMgbW9kZSBhbGxvd3Mgbm8gZnVydGhlciBwYXJhbWV0ZXJzIGluIHRoZSBQcm94eUNvbmZpZyBvYmplY3QuXG4gKiAtIGBmaXhlZF9zZXJ2ZXJzYCBtb2RlOiB0aGUgcHJveHkgY29uZmlndXJhdGlvbiBpcyBjb2RpZmllZCBpbiBhIHByb3h5LlByb3h5UnVsZXMgb2JqZWN0LiBJdHMgc3RydWN0dXJlIGlzIGRlc2NyaWJlZCBpbiBQcm94eSBydWxlcy4gQmVzaWRlcyB0aGlzLCB0aGUgZml4ZWRfc2VydmVycyBtb2RlIGFsbG93cyBubyBmdXJ0aGVyIHBhcmFtZXRlcnMgaW4gdGhlIFByb3h5Q29uZmlnIG9iamVjdC5cbiAqIC0gYHN5c3RlbWAgbW9kZTogdGhlIHByb3h5IGNvbmZpZ3VyYXRpb24gaXMgdGFrZW4gZnJvbSB0aGUgb3BlcmF0aW5nIHN5c3RlbS4gVGhpcyBtb2RlIGFsbG93cyBubyBmdXJ0aGVyIHBhcmFtZXRlcnMgaW4gdGhlIFByb3h5Q29uZmlnIG9iamVjdC4gTm90ZSB0aGF0IHRoZSBzeXN0ZW0gbW9kZSBpcyBkaWZmZXJlbnQgZnJvbSBzZXR0aW5nIG5vIHByb3h5IGNvbmZpZ3VyYXRpb24uIEluIHRoZSBsYXR0ZXIgY2FzZSwgQ2hyb21lIGZhbGxzIGJhY2sgdG8gdGhlIHN5c3RlbSBzZXR0aW5ncyBvbmx5IGlmIG5vIGNvbW1hbmQtbGluZSBvcHRpb25zIGluZmx1ZW5jZSB0aGUgcHJveHkgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgcHJveHlcbiAqIEB0eXBlZGVmIHsoJ2RpcmVjdCd8J2F1dG9fZGV0ZWN0J3wncGFjX3NjcmlwdCd8J2ZpeGVkX3NlcnZlcnMnfCdzeXN0ZW0nKX0gUHJveHlNb2RlXG4gKi9cblxuLyoqXG4gKiBUaGUgY29ubmVjdGlvbiB0byB0aGUgcHJveHkgc2VydmVyIHVzZXMgdGhlIHByb3RvY29sIGRlZmluZWQgaW4gdGhlIHNjaGVtZSBhdHRyaWJ1dGUuXG4gKiBJZiBubyBzY2hlbWUgaXMgc3BlY2lmaWVkLCB0aGUgcHJveHkgY29ubmVjdGlvbiBkZWZhdWx0cyB0byBodHRwLlxuICogU2VlIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9wcm94eSNwcm94eV9zZXJ2ZXJfb2JqZWN0cylcbiAqXG4gKiAtIGBodHRwYC5cbiAqIC0gYGh0dHBzYC5cbiAqIC0gYHF1aWNgLlxuICogLSBgc29ja3M0YC5cbiAqIC0gYHNvY2tzNWAuXG4gKlxuICogQG1lbWJlcm9mIHByb3h5XG4gKiBAdHlwZWRlZiB7KCdodHRwJ3wnaHR0cHMnfCdxdWljJ3wnc29ja3M0J3wnc29ja3M1Jyl9IFByb3h5U2NoZW1lXG4gKi9cblxuLyoqXG4gKiBUaGUgbGV2ZWwgb2YgY29udHJvbCBhdmFpbGFibGUgdG8gdGhlIGV4dGVuc2lvbiBmb3IgdGhlIHByb3h5IHNldHRpbmcuXG4gKlxuICogLSBgbm90X2NvbnRyb2xsYWJsZWBcbiAqIC0gYGNvbnRyb2xsZWRfYnlfb3RoZXJfZXh0ZW5zaW9uc2BcbiAqIC0gYGNvbnRyb2xsYWJsZV9ieV90aGlzX2V4dGVuc2lvbmBcbiAqIC0gYGNvbnRyb2xsZWRfYnlfdGhpc19leHRlbnNpb25gXG4gKlxuICogQG1lbWJlcm9mIHByb3h5XG4gKiBAdHlwZWRlZiB7KCdub3RfY29udHJvbGxhYmxlJ3wnY29udHJvbGxlZF9ieV9vdGhlcl9leHRlbnNpb25zJ3wnY29udHJvbGxhYmxlX2J5X3RoaXNfZXh0ZW5zaW9uJ3wnY29udHJvbGxlZF9ieV90aGlzX2V4dGVuc2lvbicpfSBQcm94eUxldmVsT2ZDb250cm9sXG4gKlxuICovXG5cbi8qKlxuICogQ2hyb21lIGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiB0aHJlZSBkaWZmZXJlbnQgc2NvcGVzIG9mIGJyb3dzZXIgc2V0dGluZ3MuXG4gKiBTZWUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3R5cGVzI0Nocm9tZVNldHRpbmctbGlmZWN5Y2xlKVxuICpcbiAqIC0gYHJlZ3VsYXJgOiBzZXR0aW5ncyBzZXQgaW4gdGhlIHJlZ3VsYXIgc2NvcGUgYXBwbHkgdG8gcmVndWxhciBicm93c2VyIHdpbmRvd3MgYW5kIGFyZSBpbmhlcml0ZWQgYnkgaW5jb2duaXRvIHdpbmRvd3MgaWYgdGhleSBhcmUgbm90IG92ZXJ3cml0dGVuLiBUaGVzZSBzZXR0aW5ncyBhcmUgc3RvcmVkIHRvIGRpc2sgYW5kIHJlbWFpbiBpbiBwbGFjZSB1bnRpbCB0aGV5IGFyZSBjbGVhcmVkIGJ5IHRoZSBnb3Zlcm5pbmcgZXh0ZW5zaW9uLCBvciB0aGUgZ292ZXJuaW5nIGV4dGVuc2lvbiBpcyBkaXNhYmxlZCBvciB1bmluc3RhbGxlZC5cbiAqIC0gYHJlZ3VsYXJfb25seWA6IHNldHRpbmdzIHNldCBpbiB0aGUgaW5jb2duaXRvX3BlcnNpc3RlbnQgc2NvcGUgYXBwbHkgb25seSB0byBpbmNvZ25pdG8gd2luZG93cy4gRm9yIHRoZXNlLCB0aGV5IG92ZXJyaWRlIHJlZ3VsYXIgc2V0dGluZ3MuIFRoZXNlIHNldHRpbmdzIGFyZSBzdG9yZWQgdG8gZGlzayBhbmQgcmVtYWluIGluIHBsYWNlIHVudGlsIHRoZXkgYXJlIGNsZWFyZWQgYnkgdGhlIGdvdmVybmluZyBleHRlbnNpb24sIG9yIHRoZSBnb3Zlcm5pbmcgZXh0ZW5zaW9uIGlzIGRpc2FibGVkIG9yIHVuaW5zdGFsbGVkLlxuICogLSBgaW5jb2duaXRvX3BlcnNpc3RlbnRgOiBzZXR0aW5ncyBzZXQgaW4gdGhlIGluY29nbml0b19zZXNzaW9uX29ubHkgc2NvcGUgYXBwbHkgb25seSB0byBpbmNvZ25pdG8gd2luZG93cy4gRm9yIHRoZXNlLCB0aGV5IG92ZXJyaWRlIHJlZ3VsYXIgYW5kIGluY29nbml0b19wZXJzaXN0ZW50IHNldHRpbmdzLiBUaGVzZSBzZXR0aW5ncyBhcmUgbm90IHN0b3JlZCB0byBkaXNrIGFuZCBhcmUgY2xlYXJlZCB3aGVuIHRoZSBsYXN0IGluY29nbml0byB3aW5kb3cgaXMgY2xvc2VkLiBUaGV5IGNhbiBvbmx5IGJlIHNldCB3aGVuIGF0IGxlYXN0IG9uZSBpbmNvZ25pdG8gd2luZG93IGlzIG9wZW4uXG4gKiAtIGBpbmNvZ25pdG9fc2Vzc2lvbl9vbmx5YFxuICpcbiAqIEBtZW1iZXJvZiBwcm94eVxuICogQHR5cGVkZWYgeygncmVndWxhcid8J3JlZ3VsYXJfb25seSd8J2luY29nbml0b19wZXJzaXN0ZW50J3wnaW5jb2duaXRvX3Nlc3Npb25fb25seScpfSBQcm94eVNjb3BlXG4gKlxuICovXG5cbi8qKlxuICogQSBwcm94eSBzZXJ2ZXIgaXMgY29uZmlndXJlZCBpbiBhIHByb3h5LlByb3h5U2VydmVyIG9iamVjdC5cbiAqIFNlZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvcHJveHkjdHlwZS1Qcm94eVNlcnZlcilcbiAqXG4gKiBAbWVtYmVyb2YgcHJveHlcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb3h5U2VydmVyXG4gKiBAcHJvcGVydHkge1Byb3h5U2NoZW1lfSBzY2hlbWUgVGhlIHNjaGVtZSAocHJvdG9jb2wpIG9mIHRoZSBwcm94eSBzZXJ2ZXIgaXRzZWxmLiBEZWZhdWx0cyB0byAnaHR0cCcuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaG9zdCBUaGUgVVJJIG9mIHRoZSBwcm94eSBzZXJ2ZXIuIFRoaXMgbXVzdCBiZSBhbiBBU0NJSSBob3N0bmFtZSAoaW4gUHVueWNvZGUgZm9ybWF0KS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwb3J0IFRoZSBwb3J0IG9mIHRoZSBwcm94eSBzZXJ2ZXIuIERlZmF1bHRzIHRvIGEgcG9ydCB0aGF0IGRlcGVuZHMgb24gdGhlIHNjaGVtZS5cbiAqL1xuXG4vKipcbiAqIEFuIG9iamVjdCBlbmNhcHN1bGF0aW5nIHRoZSBzZXQgb2YgcHJveHkgcnVsZXMgZm9yIGFsbCBwcm90b2NvbHMuXG4gKiBVc2UgZWl0aGVyICdzaW5nbGVQcm94eScgb3IgKGEgc3Vic2V0IG9mKSAncHJveHlGb3JIdHRwJywgJ3Byb3h5Rm9ySHR0cHMnLCAncHJveHlGb3JGdHAnIGFuZCAnZmFsbGJhY2tQcm94eScuXG4gKiBTZWUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3Byb3h5I3R5cGUtUHJveHlSdWxlcylcbiAqXG4gKiBAbWVtYmVyb2YgcHJveHlcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb3h5UnVsZXNcbiAqIEBwcm9wZXJ0eSB7UHJveHlTZXJ2ZXJ9IHNpbmdsZVByb3h5IFRoZSBwcm94eSBzZXJ2ZXIgdG8gYmUgdXNlZCBmb3IgYWxsIHBlci1VUkwgcmVxdWVzdHMgKHRoYXQgaXMgaHR0cCwgaHR0cHMsIGFuZCBmdHApLlxuICogQHByb3BlcnR5IHtNb2RlfSBtb2RlXG4gKi9cblxuLyoqXG4gKiBBbiBvYmplY3QgZW5jYXBzdWxhdGluZyBhIGNvbXBsZXRlIHByb3h5IGNvbmZpZ3VyYXRpb24uXG4gKiBTZWUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3Byb3h5I3R5cGUtUHJveHlDb25maWcpXG4gKlxuICogQG1lbWJlcm9mIHByb3h5XG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQcm94eUNvbmZpZ1xuICogQHByb3BlcnR5IHtQcm94eVJ1bGVzfSBydWxlcyBUaGUgcHJveHkgcnVsZXMgZGVzY3JpYmluZyB0aGlzIGNvbmZpZ3VyYXRpb24uIFVzZSB0aGlzIGZvciAnZml4ZWRfc2VydmVycycgbW9kZS5cbiAqIEBwcm9wZXJ0eSB7TW9kZX0gbW9kZVxuICovXG5cbi8qKlxuICogQ3JlYXRlIGEgdmFsaWQgUHJveHlTZXJ2ZXIuIFBhcmFtcyB3aWxsIGJlIHR5cGUgY29lcmNlZCBhbmQgdHJpbW1lZC5cbiAqIFRoZSBzY2hlbWUgd2lsbCBkZWZhdWx0IHRvICdodHRwJyBpZiBub25lIGlzIHNwZWNpZmllZC5cbiAqIFRoZSBwb3J0IHdpbGwgYmUgZGVyaXZlZCBmcm9tIHRoZSBzY2hlbWUgaWYgaXQgaXMgbm90IGRlZmluZWQuXG4gKiBTZWUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3Byb3h5I3R5cGUtUHJveHlTZXJ2ZXIpLlxuICpcbiAqIEBtZW1iZXJvZiBwcm94eVxuICogQGZ1bmN0aW9uIGNyZWF0ZVByb3h5U2VydmVyXG4gKiBAcGFyYW0ge09iamVjdH0gZGV0YWlscyAtIFNldHRpbmcgZGV0YWlsc1xuICogQHBhcmFtIHtzdHJpbmd9IGRldGFpbHMuaG9zdCAtIFRoZSBwcm94eSBzZXJ2ZXIgaG9zdCBpcC4gV2lsbCB0cmltIGFueSBsZWFkaW5nIG9yIHRyYWlsaW5nIHdoaXRlc3BhY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW2RldGFpbHMucG9ydF0gLSBUaGUgcHJveHkgc2VydmVyIHBvcnQuXG4gKiBAcGFyYW0ge1Byb3h5U2NoZW1lfSBbZGV0YWlscy5zY2hlbWVdIC0gVGhlIHByb3h5IHNlcnZlciBzY2hlbWUuXG4gKiBAcmV0dXJucyB7UHJveHlTZXJ2ZXJ9IFZhbGlkIHByb3h5IHNlcnZlciBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHNlcnZlciA9IGNyZWF0ZVByb3h5U2VydmVyKHsgaG9zdDogJzEwLjEwLjEwLjQnIH0pXG4gKlxuICovXG5jb25zdCBjcmVhdGVQcm94eVNlcnZlciA9ICh7IGhvc3QsIHBvcnQsIHNjaGVtZSB9KSA9PiB7XG4gIGNvbnN0IHNlcnZlciA9IHtcbiAgICBob3N0OiBob3N0LnRyaW0oKSxcbiAgfVxuICBpZiAocG9ydCkge1xuICAgIHNlcnZlci5wb3J0ID0gcGFyc2VJbnQocG9ydClcbiAgfVxuICBpZiAoc2NoZW1lKSB7XG4gICAgc2VydmVyLnNjaGVtZSA9IHNjaGVtZS50cmltKClcbiAgfVxuICByZXR1cm4gc2VydmVyXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgdmFsaWQgUHJveHlDb25maWcuXG4gKiBTZWUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3Byb3h5I3R5cGUtUHJveHlDb25maWcuKS5cbiAqXG4gKiBAbWVtYmVyb2YgcHJveHlcbiAqIEBmdW5jdGlvbiBjcmVhdGVTaW5nbGVQcm94eUNvbmZpZ1xuICogQHBhcmFtIHtPYmplY3R9IGRldGFpbHMgLSBTZXR0aW5nIGRldGFpbHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXRhaWxzLmhvc3QgLSBUaGUgcHJveHkgc2VydmVyIGhvc3QgaXAuXG4gKiBAcGFyYW0ge251bWJlcn0gW2RldGFpbHMucG9ydF0gLSBUaGUgcHJveHkgc2VydmVyIHBvcnQuXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IFtkZXRhaWxzLmJ5cGFzc0xpc3RdIC0gTGlzdCBvZiB3ZWJzaXRlcyB0byBjb25uZWN0IHRvIHdpdGhvdXQgYSBwcm94eS4gW1NlZSB0aGUgYnlwYXNzTGlzdCBkb2NzLl0oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3Byb3h5I2J5cGFzc19saXN0KVxuICogQHJldHVybnMge1Byb3h5Q29uZmlnfSBSZXR1cm5zIGFuIG9iamVjdCBlbmNhcHN1bGF0aW5nIGEgY29tcGxldGUgcHJveHkgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY29uZmlnID0gY3JlYXRlU2luZ2xlUHJveHlDb25maWcoe2hvc3Q6ICcxMC40LjAuMSd9KVxuICpcbiAqL1xuY29uc3QgY3JlYXRlU2luZ2xlUHJveHlDb25maWcgPSAoe1xuICBob3N0LFxuICBwb3J0LFxuICBieXBhc3NMaXN0ID0gW10sXG59KSA9PiAoe1xuICBtb2RlOiAnZml4ZWRfc2VydmVycycsXG4gIHJ1bGVzOiB7XG4gICAgc2luZ2xlUHJveHk6IGNyZWF0ZVByb3h5U2VydmVyKHsgaG9zdCwgcG9ydCB9KSxcbiAgICBieXBhc3NMaXN0LFxuICB9LFxufSlcblxuLyoqXG4gKiBBbiBvYmplY3QgcmV0dXJuZWQgZnJvbSBwcm94eS5nZXQoKS5cbiAqIEBtZW1iZXJvZiBwcm94eVxuICogQHR5cGVkZWYge09iamVjdH0gUHJveHlTZXR0aW5nc1xuICogQHByb3BlcnR5IHtQcm94eUNvbmZpZ30gdmFsdWUgVGhlIGN1cnJlbnQgUHJveHlDb25maWcuXG4gKiBAcHJvcGVydHkge1Byb3h5TGV2ZWxPZkNvbnRyb2x9IGxldmVsT2ZDb250cm9sIFRoZSBsZXZlbCBvZiBleHRlbnNpb24gY29udHJvbCBvdmVyIHByb3h5IHNldHRpbmdzLlxuICogQHByb3BlcnR5IHtib29sZWFufSBpbmNvZ25pdG9TcGVjaWZpYyBXaGV0aGVyIHRoZSBlZmZlY3RpdmUgdmFsdWUgaXMgc3BlY2lmaWMgdG8gdGhlIGluY29nbml0byBzZXNzaW9uLiBUaGlzIHByb3BlcnR5IHdpbGwgb25seSBiZSBwcmVzZW50IGlmIHRoZSBpbmNvZ25pdG8gcHJvcGVydHkgaW4gdGhlIGRldGFpbHMgcGFyYW1ldGVyIG9mIHByb3h5LmdldCgpIHdhcyB0cnVlLlxuICovXG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IHByb3h5IHNldHRpbmdzLlxuICogU2VlIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9wcm94eSNtZXRob2Qtc2V0dGluZ3MtZ2V0LikuXG4gKlxuICogQG1lbWJlcm9mIHByb3h5XG4gKiBAZnVuY3Rpb24gZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gW2RldGFpbHNdIC0gU2V0dGluZyBkZXRhaWxzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtkZXRhaWxzLmluY29nbml0b10gLSBXaGV0aGVyIHRvIHJldHVybiB0aGUgdmFsdWUgdGhhdCBhcHBsaWVzIHRvIHRoZSBpbmNvZ25pdG8gc2Vzc2lvbiAoZGVmYXVsdCBmYWxzZSkuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxQcm94eVNldHRpbmdzPn0gVGhlIHZhbHVlIG9mIHRoZSBwcm94eSBzZXR0aW5ncy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcHJveHlTZXR0aW5nc1Byb21pc2UgPSBwcm94eS5nZXQoKVxuICpcbiAqL1xuY29uc3QgZ2V0ID0gKHsgaW5jb2duaXRvID0gZmFsc2UgfSA9IHt9KSA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5wcm94eS5zZXR0aW5ncy5nZXQoeyBpbmNvZ25pdG8gfSwgc2V0dGluZ3MgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoc2V0dGluZ3MpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG5cbi8qKlxuICogU2V0cyB0aGUgY3VycmVudCBwcm94eSBzZXR0aW5ncy5cbiAqIFNlZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvcHJveHkjbWV0aG9kLXNldHRpbmdzLXNldC4pLlxuICpcbiAqIEBtZW1iZXJvZiBwcm94eVxuICogQGZ1bmN0aW9uIHNldFxuICogQHBhcmFtIHtPYmplY3R9IGRldGFpbHMgLSBTZXR0aW5nIGRldGFpbHNcbiAqIEBwYXJhbSB7UHJveHlDb25maWd9IGRldGFpbHMuY29uZmlnIC0gQW4gb2JqZWN0IGVuY2Fwc3VsYXRpbmcgYSBjb21wbGV0ZSBwcm94eSBjb25maWd1cmF0aW9uLlxuICogQHBhcmFtIHtQcm94eVNjb3BlfSBbZGV0YWlscy5zY29wZV0gLSBPbmUgb2YgdGhlIHZhbHVlcyBmcm9tIFByb3h5U2NvcGUuXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgYXQgdGhlIGNvbXBsZXRpb24gb2YgdGhlIHNldCBvcGVyYXRpb24uIFJlamVjdHMgaWYgdGhlcmUgd2FzIGFuIGVycm9yLlxuICpcbiAqIEBleGFtcGxlXG4gKiBwcm94eS5zZXQoeyBjb25maWc6IFByb3h5Q29uZmlnIH0pLnRoZW4oKCkgPT4ge1xuICogICBjb25zb2xlLmxvZygnTm93IHVzaW5nIHlvdXIgcHJveHkgc2V0dGluZ3MuJylcbiAqIH0pXG4gKlxuICovXG5jb25zdCBzZXQgPSAoeyBzY29wZSA9ICdyZWd1bGFyJywgY29uZmlnIH0pID0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnByb3h5LnNldHRpbmdzLnNldCh7IHZhbHVlOiBjb25maWcsIHNjb3BlIH0sICgpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcblxuLyoqXG4gKiBDbGVhcnMgdGhlIGN1cnJlbnQgcHJveHkgc2V0dGluZ3MgYW5kIHJlc3RvcmVzIHRoZSBkZWZhdWx0LlxuICpcbiAqIEBtZW1iZXJvZiBwcm94eVxuICogQGZ1bmN0aW9uIGNsZWFyXG4gKiBAcGFyYW0ge09iamVjdH0gW2RldGFpbHNdIC0gU2V0dGluZyBkZXRhaWxzXG4gKiBAcGFyYW0ge1Byb3h5U2NvcGV9IFtkZXRhaWxzLnNjb3BlXSAtIE9uZSBvZiB0aGUgdmFsdWVzIGZyb20gUHJveHlTY29wZS5cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyBhZnRlciB0aGUgZGVmYXVsdCBwcm94eSBzZXR0aW5ncyBoYXZlIGJlZW4gcmVzdG9yZWQuIFJlamVjdHMgaWYgdGhlcmUgd2FzIGFuIGVycm9yLlxuICpcbiAqIEBleGFtcGxlXG4gKiBwcm94eS5jbGVhcigpLnRoZW4oKCkgPT4ge1xuICogICBjb25zb2xlLmxvZygnTm93IHVzaW5nIGEgZGlyZWN0IGNvbm5lY3Rpb24uJylcbiAqIH0pXG4gKlxuICovXG5jb25zdCBjbGVhciA9ICh7IHNjb3BlID0gJ3JlZ3VsYXInIH0gPSB7fSkgPT5cbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUucHJveHkuc2V0dGluZ3MuY2xlYXIoeyBzY29wZSB9LCAoKSA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG5cbi8qKlxuICogVXNlIHRoZSBjaHJvbWUucHJveHkgQVBJIHRvIG1hbmFnZSBDaHJvbWUncyBwcm94eSBzZXR0aW5ncy5cbiAqIFNlZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvcHJveHkpXG4gKlxuICogQG5hbWVzcGFjZVxuICovXG5leHBvcnQgY29uc3QgcHJveHkgPSB7XG4gIHNldCxcbiAgZ2V0LFxuICBjbGVhcixcbiAgY3JlYXRlUHJveHlTZXJ2ZXIsXG4gIGNyZWF0ZVNpbmdsZVByb3h5Q29uZmlnLFxufVxuIiwiLyoqXG4gKiBTZWUgdGhlIFRhYiB0eXBlIGluIHRoZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvdGFicyN0eXBlLVRhYikuXG4gKlxuICogVGhlIHR5cGUgdGFicy5UYWIgY29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgYSB0YWIuIFRoaXMgcHJvdmlkZXMgYWNjZXNzIHRvIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgY29udGVudCBpcyBpbiB0aGUgdGFiLCBob3cgbGFyZ2UgdGhlIGNvbnRlbnQgaXMsIHdoYXQgc3BlY2lhbCBzdGF0ZXMgb3IgcmVzdHJpY3Rpb25zIGFyZSBpbiBlZmZlY3QsIGFuZCBzbyBmb3J0aC5cbiAqXG4gKiBAbWVtYmVyb2YgdGFic1xuICogQHR5cGVkZWYge09iamVjdH0gVGFiXG4gKiBAcHJvcGVydHkge2ludGVnZXJ9IFtpZF1cbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIHRhYiB3aXRoaW4gaXRzIHdpbmRvdy5cbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gd2luZG93SWQgVGhlIElEIG9mIHRoZSB3aW5kb3cgdGhhdCBjb250YWlucyB0aGUgdGFiLlxuICogQHByb3BlcnR5IHtpbnRlZ2VyfSBbb3BlbmVyVGFiSWRdIFRoZSBJRCBvZiB0aGUgdGFiIHRoYXQgb3BlbmVkIHRoaXMgdGFiLCBpZiBhbnkuIFRoaXMgcHJvcGVydHkgaXMgb25seSBwcmVzZW50IGlmIHRoZSBvcGVuZXIgdGFiIHN0aWxsIGV4aXN0cy5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaGlnaGxpZ2h0ZWQgV2hldGhlciB0aGUgdGFiIGlzIGhpZ2hsaWdodGVkLlxuICogQHByb3BlcnR5IHtib29sZWFufSBhY3RpdmUgV2hldGhlciB0aGUgdGFiIGlzIGFjdGl2ZSBpbiBpdHMgd2luZG93LiBEb2VzIG5vdCBuZWNlc3NhcmlseSBtZWFuIHRoZSB3aW5kb3cgaXMgZm9jdXNlZC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gcGlubmVkIFdoZXRoZXIgdGhlIHRhYiBpcyBwaW5uZWQuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFthdWRpYmxlXSBXaGV0aGVyIHRoZSB0YWIgaGFzIHByb2R1Y2VkIHNvdW5kIG92ZXIgdGhlIHBhc3QgY291cGxlIG9mIHNlY29uZHMgKGJ1dCBpdCBtaWdodCBub3QgYmUgaGVhcmQgaWYgYWxzbyBtdXRlZCkuIEVxdWl2YWxlbnQgdG8gd2hldGhlciB0aGUgJ3NwZWFrZXIgYXVkaW8nIGluZGljYXRvciBpcyBzaG93aW5nLlxuICogQHByb3BlcnR5IHtib29sZWFufSBkaXNjYXJkZWQgV2hldGhlciB0aGUgdGFiIGlzIGRpc2NhcmRlZC4gQSBkaXNjYXJkZWQgdGFiIGlzIG9uZSB3aG9zZSBjb250ZW50IGhhcyBiZWVuIHVubG9hZGVkIGZyb20gbWVtb3J5LCBidXQgaXMgc3RpbGwgdmlzaWJsZSBpbiB0aGUgdGFiIHN0cmlwLiBJdHMgY29udGVudCBpcyByZWxvYWRlZCB0aGUgbmV4dCB0aW1lIGl0IGlzIGFjdGl2YXRlZC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYXV0b0Rpc2NhcmRhYmxlIFdoZXRoZXIgdGhlIHRhYiBjYW4gYmUgZGlzY2FyZGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIGJyb3dzZXIgd2hlbiByZXNvdXJjZXMgYXJlIGxvdy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdXJsXSBUaGUgVVJMIHRoZSB0YWIgaXMgZGlzcGxheWluZy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdGl0bGVdIFRoZSB0aXRsZSBvZiB0aGUgdGFiLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtmYXZJY29uVXJsXSBUaGUgVVJMIG9mIHRoZSB0YWIncyBmYXZpY29uLiBJdCBtYXkgYWxzbyBiZSBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIHRhYiBpcyBsb2FkaW5nLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzdGF0dXNdIEVpdGhlciBsb2FkaW5nIG9yIGNvbXBsZXRlXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGluY29nbml0byBXaGV0aGVyIHRoZSB0YWIgaXMgaW4gYW4gaW5jb2duaXRvIHdpbmRvdy5cbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gW3dpZHRoXSBUaGUgd2lkdGggb2YgdGhlIHRhYiBpbiBwaXhlbHMuXG4gKiBAcHJvcGVydHkge2ludGVnZXJ9IFtoZWlnaHRdIFRoZSBoZWlnaHQgb2YgdGhlIHRhYiBpbiBwaXhlbHMuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Nlc3Npb25JZF0gVGhlIHNlc3Npb24gSUQgdXNlZCB0byB1bmlxdWVseSBpZGVudGlmeSBhIFRhYiBvYnRhaW5lZCBmcm9tIHRoZSBzZXNzaW9ucyBBUEkuXG4gKlxuICovXG5cbi8qKlxuICogU2VlIHRoZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvdGFicyNtZXRob2QtY3JlYXRlKVxuICpcbiAqIEBtZW1iZXJvZiB0YWJzXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDcmVhdGVQcm9wZXJ0aWVzXG4gKiBAcHJvcGVydHkge2ludGVnZXJ9IFt3aW5kb3dJZF0gVGhlIHdpbmRvdyBpbiB3aGljaCB0byBjcmVhdGUgdGhlIG5ldyB0YWIuIERlZmF1bHRzIHRvIHRoZSBjdXJyZW50IHdpbmRvdy5cbiAqIEBwcm9wZXJ0eSB7aW50ZWdlcn0gW2luZGV4XSBUaGUgcG9zaXRpb24gdGhlIHRhYiBzaG91bGQgdGFrZSBpbiB0aGUgd2luZG93LiBUaGUgcHJvdmlkZWQgdmFsdWUgaXMgY2xhbXBlZCB0byBiZXR3ZWVuIHplcm8gYW5kIHRoZSBudW1iZXIgb2YgdGFicyBpbiB0aGUgd2luZG93LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1cmxdIFRoZSBVUkwgdG8gaW5pdGlhbGx5IG5hdmlnYXRlIHRoZSB0YWIgdG8uIEZ1bGx5LXF1YWxpZmllZCBVUkxzIG11c3QgaW5jbHVkZSBhIHNjaGVtZSAoaS5lLiwgJ2h0dHA6Ly93d3cuZ29vZ2xlLmNvbScsIG5vdCAnd3d3Lmdvb2dsZS5jb20nKS4gUmVsYXRpdmUgVVJMcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgcGFnZSB3aXRoaW4gdGhlIGV4dGVuc2lvbi4gRGVmYXVsdHMgdG8gdGhlIE5ldyBUYWIgUGFnZS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2FjdGl2ZSA9IHRydWVdIFdoZXRoZXIgdGhlIHRhYiBzaG91bGQgYmVjb21lIHRoZSBhY3RpdmUgdGFiIGluIHRoZSB3aW5kb3cuIERvZXMgbm90IGFmZmVjdCB3aGV0aGVyIHRoZSB3aW5kb3cgaXMgZm9jdXNlZCAoc2VlIHdpbmRvd3MudXBkYXRlKS4gRGVmYXVsdHMgdG8gdHJ1ZS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3Bpbm5lZF0gV2hldGhlciB0aGUgdGFiIHNob3VsZCBiZSBwaW5uZWQuIERlZmF1bHRzIHRvIGZhbHNlXG4gKiBAcHJvcGVydHkge2ludGVnZXJ9IFtvcGVuZXJUYWJJZF0gVGhlIElEIG9mIHRoZSB0YWIgdGhhdCBvcGVuZWQgdGhpcyB0YWIuIElmIHNwZWNpZmllZCwgdGhlIG9wZW5lciB0YWIgbXVzdCBiZSBpbiB0aGUgc2FtZSB3aW5kb3cgYXMgdGhlIG5ld2x5IGNyZWF0ZWQgdGFiLlxuICovXG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB0YWIuXG4gKiBTZWUgW0Nocm9tZSBBUEkgRG9jc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3RhYnMjbWV0aG9kLWNyZWF0ZSkgYW5kIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3RhYnMvY3JlYXRlKS5cbiAqXG4gKiBAbWVtYmVyb2YgdGFic1xuICogQGZ1bmN0aW9uIGNyZWF0ZVxuICogQHBhcmFtIHtDcmVhdGVQcm9wZXJ0aWVzfSBbZGV0YWlsc10gLSBBbiBvYmplY3Qgd2l0aCBvcHRpb25hbCBwcm9wZXJ0aWVzIGZvciB0aGUgbmV3IHRhYi5cbiAqIEByZXR1cm5zIHtUYWJ9IFRoZSBjcmVhdGVkIHRhYi5cbiAqXG4gKiBAZXhhbXBsZVxuICogdGFicy5jcmVhdGUoe1xuICogICB1cmw6ICdodHRwOi8vd3d3Lmdvb2dsZS5jb20nLFxuICogfSkudGhlbigodGFiKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKCdUaGUgbmV3IHRhYiBpZCBpczonLCB0YWIuaWQpXG4gKiB9KVxuICpcbiAqIEBleGFtcGxlXG4gKiB0YWJzLmNyZWF0ZSgpLnRoZW4oKHRhYikgPT4ge1xuICogICBjb25zb2xlLmxvZygnSXQgaXMganVzdCBhIG5ldyBhY3RpdmUgdGFiLicpXG4gKiB9KVxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IGRldGFpbHMgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUudGFicy5jcmVhdGUoZGV0YWlscywgdGFiID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHRhYilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBHaXZlbiBhIHRhYiBJRCwgZ2V0IHRoZSB0YWIncyBkZXRhaWxzIGFzIGEgdGFicy5UYWIgb2JqZWN0LlxuICogV2l0aG91dCB0aGUgXCJ0YWJzXCIgcGVybWlzc2lvbiwgd2lsbCBvbWl0IGB1cmxgLCBgdGl0bGVgLCBhbmQgYGZhdkljb25VcmxgLlxuICpcbiAqIFNlZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvdGFicyNtZXRob2QtZ2V0KSBhbmQgW01ETl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0FkZC1vbnMvV2ViRXh0ZW5zaW9ucy9BUEkvdGFicy9nZXQpLlxuICpcbiAqIEBtZW1iZXJvZiB0YWJzXG4gKiBAZnVuY3Rpb24gZ2V0XG4gKiBAcGFyYW0ge251bWJlcn0gWyQwLnRhYklkXSAtIElEIG9mIHRoZSB0YWIgdG8gZ2V0LlxuICogQHJldHVybnMge1Byb21pc2U8VGFiPn0gQSBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2l0aCBhIHRhYnMuVGFiIG9iamVjdCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSB0YWIuXG4gKlxuICogQGV4YW1wbGVcbiAqIHRhYnMuZ2V0KHsgdGFiSWQ6IDEyMzQ1IH0pXG4gKiAgIC50aGVuKCh0YWIpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZyh0YWIuc3RhdHVzKVxuICogICB9KVxuICpcbiAqIEBleGFtcGxlXG4gKiB0YWJzLmdldCh7IHRhYklkOiAxMjM0NSB9KVxuICogICAudGhlbigodGFiKSA9PiB7XG4gKiAgICAgLy8gUmVxdWlyZXMgXCJ0YWJzXCIgcGVybWlzc2lvblxuICogICAgIGNvbnNvbGUubG9nKHRhYi50aXRsZSlcbiAqICAgfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBnZXQgPSAoeyB0YWJJZCB9KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGFiSWQpIHtcbiAgICAgICAgcmVqZWN0KCdJbnZhbGlkIGFyZ3VtZW50OiB0YWJJZCBub3Qgc3BlY2lmaWVkJylcbiAgICAgIH1cblxuICAgICAgY2hyb21lLnRhYnMuZ2V0KHRhYklkLCB0YWIgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUodGFiKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEdldHMgYWxsIHRhYnMgdGhhdCBoYXZlIHRoZSBzcGVjaWZpZWQgcHJvcGVydGllcywgb3IgYWxsIHRhYnMgaWYgbm8gcHJvcGVydGllcyBhcmUgc3BlY2lmaWVkLlxuICogU29tZSBxdWVyeUluZm8gcHJvcGVydGllcyBhcmUgaWdub3JlZCB3aXRob3V0IHRoZSBcInRhYnNcIiBwZXJtaXNzaW9uLlxuICpcbiAqIFNlZSBbQ2hyb21lIEFQSSBEb2NzXShodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2V4dGVuc2lvbnMvdGFicyNtZXRob2QtcXVlcnkpIGFuZCBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS90YWJzL3F1ZXJ5KS5cbiAqXG4gKiBAbWVtYmVyb2YgdGFic1xuICogQGZ1bmN0aW9uIHF1ZXJ5XG4gKiBAcGFyYW0ge09iamVjdH0gW3F1ZXJ5SW5mb10gLSBTcGVjaWZpZWQgcHJvcGVydGllcyBvZiB0YWJzLiBTZWUgW0Nocm9tZSBxdWVyeUluZm9dKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy90YWJzI3Byb3BlcnR5LXF1ZXJ5LXF1ZXJ5SW5mbykuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxUYWI+Pn0gQSBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSBvZiB0aGUgcXVlcmllZCB0YWJzLlRhYiBvYmplY3RzLlxuICpcbiAqIEBleGFtcGxlXG4gKiB0YWJzLnF1ZXJ5KHtcbiAqICAgYWN0aXZlOiB0cnVlLFxuICogfSkudGhlbigodGFicykgPT4ge1xuICogICBjb25zb2xlLmxvZygnQWxsIHRoZSBhY3RpdmU6JywgdGFicylcbiAqIH0pXG4gKlxuICogQGV4YW1wbGVcbiAqIHRhYnMucXVlcnkoe1xuICogICAvLyBUaGUgdXJsIHByb3BlcnR5IHJlcXVpcmVzIHRoZSAndGFicycgcGVybWlzc2lvbi5cbiAqICAgdXJsOiAnaHR0cHM6Ly8qLmdvb2dsZS5jb20vKicsXG4gKiB9KS50aGVuKCh0YWJzKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKCdBbGwgdGhlIEdvb2dsZSB0YWJzOicsIHRhYnMpXG4gKiB9KVxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXJ5ID0gcXVlcnkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjaHJvbWUudGFicy5xdWVyeShxdWVyeSwgdGFicyA9PiB7XG4gICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSh0YWJzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIE1vZGlmaWVzIHRoZSBwcm9wZXJ0aWVzIG9mIGEgdGFiLiBQcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBzcGVjaWZpZWQgaW4gdXBkYXRlUHJvcGVydGllcyBhcmUgbm90IG1vZGlmaWVkLlxuICogU2VlIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy90YWJzI21ldGhvZC11cGRhdGUpXG4gKiBhbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3RhYnMvdXBkYXRlKS5cbiAqXG4gKiBAbWVtYmVyb2YgdGFic1xuICogQGZ1bmN0aW9uIHVwZGF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFskMC50YWJJZF0gLSBEZWZhdWx0cyB0byB0aGUgc2VsZWN0ZWQgdGFiIG9mIHRoZSBjdXJyZW50IHdpbmRvdy5cbiAqIEBwYXJhbSB7T2JqZWN0fSAuLi5bJDAudXBkYXRlUHJvcHNdIC0gU3BlY2lmaWVkIHByb3BlcnRpZXMgb2YgdGFicy4gU2VlIFtDaHJvbWUgdXBkYXRlUHJvcGVydGllc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3RhYnMjcHJvcGVydHktdXBkYXRlLXVwZGF0ZVByb3BlcnRpZXMpLlxuICogQHJldHVybnMge1Byb21pc2U8VGFiPn0gQSBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2l0aCBhIHRhYnMuVGFiIG9iamVjdCBjb250YWluaW5nIGRldGFpbHMgYWJvdXQgdGhlIHVwZGF0ZWQgdGFiLlxuICpcbiAqIEBleGFtcGxlXG4gKiB0YWJzLnVwZGF0ZSh7XG4gKiAgIHRhYklkOiAxMjM0NSxcbiAqICAgdXJsOiAnaHR0cDovL3d3dy5nb29nbGUuY29tJyxcbiAqIH0pLnRoZW4oKHRhYikgPT4ge1xuICogICBjb25zb2xlLmxvZygnVGhlIHRhYiB3YXMgdXBkYXRlZC4nKVxuICogfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGUgPSAoeyB0YWJJZCwgLi4udXBkYXRlUHJvcHMgfSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAodGFiSWQpIHtcbiAgICAgICAgY2hyb21lLnRhYnMudXBkYXRlKHRhYklkLCB1cGRhdGVQcm9wcywgdGFiID0+IHtcbiAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUodGFiKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdCgnVGFiIG5vdCBzcGVjaWZpZWQnKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIENsb3NlcyBvbmUgb3IgbW9yZSB0YWJzLlxuICpcbiAqIFNlZSB0aGVcbiAqIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy90YWJzI21ldGhvZC1yZW1vdmUpXG4gKiBhbmRcbiAqIFtNRE5dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9BZGQtb25zL1dlYkV4dGVuc2lvbnMvQVBJL3RhYnMvcmVtb3ZlKS5cbiAqXG4gKiBAbWVtYmVyb2YgdGFic1xuICogQGZ1bmN0aW9uIGNsb3NlXG4gKiBAcGFyYW0ge3N0cmluZ3xBcnJheTxzdHJpbmc+fSAkMC50YWJJZCAtIFRoZSB0YWIgSUQgb3IgbGlzdCBvZiB0YWIgSURzIHRvIGNsb3NlLlxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIG9uIHN1Y2Nlc3Mgb3IgcmVqZWN0cyBvbiBmYWlsdXJlIHdpdGggdGhlIHJlYXNvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogdGFicy5jbG9zZSh7IHRhYklkOiAxMjM0NSB9KVxuICogICAudGhlbigoKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coJ1RoZSB0YWIgd2FzIGNsb3NlZC4nKVxuICogICB9KVxuICpcbiAqIEBleGFtcGxlXG4gKiB0YWJzLmNsb3NlKHsgdGFiSWQ6IFsxMjM0NSwgNjc4OTBdIH0pXG4gKiAgIC50aGVuKCgpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnVHdvIHRhYnMgd2VyZSBjbG9zZWQuJylcbiAqICAgfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBjbG9zZSA9ICh7IHRhYklkIH0pID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHRhYklkKSB7XG4gICAgICAgIGNocm9tZS50YWJzLnJlbW92ZSh0YWJJZCwgKCkgPT4ge1xuICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KCdUYWIgbm90IHNwZWNpZmllZCcpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogSW5qZWN0IEphdmFTY3JpcHQgY29kZSBpbnRvIGEgcGFnZS4gVGhlIHNjcmlwdCB3aWxsIGV4ZWN1dGUgaW4gaXRzIG93biBlbnZpcm9ubWVudCwgYnV0IHdpbGwgc2hhcmUgdGhlIERPTSBvZiB0aGUgcGFnZS5cbiAqIFRoaXMgcmVxdWlyZXMgZWl0aGVyIGFcbiAqIFtob3N0IHBlcm1pc3Npb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL0FkZC1vbnMvV2ViRXh0ZW5zaW9ucy9tYW5pZmVzdC5qc29uL3Blcm1pc3Npb25zI0hvc3RfcGVybWlzc2lvbnMpXG4gKiBvciB0aGVcbiAqIFthY3RpdmVUYWIgcGVybWlzc2lvbl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvQWRkLW9ucy9XZWJFeHRlbnNpb25zL21hbmlmZXN0Lmpzb24vcGVybWlzc2lvbnMjYWN0aXZlVGFiX3Blcm1pc3Npb24pLlxuICogRWl0aGVyIHRoZSBgY29kZWAgb3IgYGZpbGVgIHByb3BlcnR5IG11c3QgYmUgc2V0IGluIHRoZSBgZGV0YWlsc2AgcGFyYW0uXG4gKlxuICogU2VlIFtwcm9ncmFtbWF0aWMgaW5qZWN0aW9uIGluIHRoZSBDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9jb250ZW50X3NjcmlwdHMjcGkpLlxuICpcbiAqIEBtZW1iZXJvZiB0YWJzXG4gKiBAZnVuY3Rpb24gZXhlY3V0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFskMC50YWJJZF0gLSBUaGUgaWQgb2YgdGhlIHRhYiB0byBpbmplY3QuIERlZmF1bHRzIHRvIHRoZSBhY3RpdmUgdGFiLlxuICogQHBhcmFtIHtzdHJpbmd9IFskMC5jb2RlXSAtIEphdmFTY3JpcHQgb3IgQ1NTIGNvZGUgdG8gaW5qZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IFskMC5maWxlXSAtIFRoZSBwYXRoIHRvIHRoZSBKYXZhU2NyaXB0IG9yIENTUyBmaWxlIHRvIGluamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAuLi5bJDAuZGV0YWlsc10gLSBbT3RoZXIgb3B0aW9uYWwgZGV0YWlscyBvZiB0aGUgc2NyaXB0IHRvIHJ1bi5dKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy90YWJzI3Byb3BlcnR5LWV4ZWN1dGVTY3JpcHQtZGV0YWlscykuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheT59IFJlc29sdmVzIHdpdGggYW4gYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgdGhlIHNjcmlwdCBpbiBldmVyeSBpbmplY3RlZCBmcmFtZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogdGFicy5leGVjdXRlKHtcbiAqICAgdGFiSWQ6IDEyMzQ1LFxuICogICBmaWxlOiAnY29udGVudC1zY3JpcHQuanMnLFxuICogfSkudGhlbigodGFiKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKCcnKVxuICogfSlcbiAqL1xuZXhwb3J0IGNvbnN0IGV4ZWN1dGUgPSAoeyB0YWJJZCwgLi4uZGV0YWlscyB9KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQodGFiSWQsIGRldGFpbHMsIHJlc3VsdHMgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0cylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgY2hyb21lLnRhYnMgQVBJLiBVc2UgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgYnJvd3NlcidzIHRhYiBzeXN0ZW0uXG4gKiBZb3UgY2FuIHVzZSB0aGlzIEFQSSB0byBjcmVhdGUsIG1vZGlmeSwgYW5kIHJlYXJyYW5nZSB0YWJzIGluIHRoZSBicm93c2VyLlxuICpcbiAqIFNlZSB0aGVcbiAqIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy90YWJzKVxuICogYW5kXG4gKiBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS90YWJzKS5cbiAqXG4gKiBAbmFtZXNwYWNlXG4gKi9cbmV4cG9ydCBjb25zdCB0YWJzID0ge1xuICBjcmVhdGUsXG4gIGdldCxcbiAgcXVlcnksXG4gIHVwZGF0ZSxcbiAgY2xvc2UsXG4gIGV4ZWN1dGUsXG59XG4iLCJpbXBvcnQgeyBCdW1ibGVTdHJlYW0gfSBmcm9tICcuLi9ldmVudC1zdHJlYW0vc3RyZWFtJ1xuXG4vKipcbiAqIExpc3RlbiB0byBvbmUgb3IgbXVsdGlwbGUgZXZlbnRzIG9uIGEgRE9NIEVsZW1lbnQuXG4gKlxuICogQG1lbWJlcm9mIGxpc3RlblRvXG4gKiBAZnVuY3Rpb24gbGlzdGVuVG9DaHJvbWVFdmVudFxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50T2JqZWN0IC0gQSBET00gRWxlbWVudC5cbiAqIEBwYXJhbSB7Li4uYW55fSBbYXJnc10gLSBBZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBzcHJlYWQgaW50byBFdmVudC5hZGRMaXN0ZW5lcigpLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIEJ1bWJsZVN0cmVhbSBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IG15RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215ZGl2JylcbiAqIGxpc3RlblRvRG9tRXZlbnQobXlEaXYsICdjbGljaycpXG4gKiAgIC5tYXAoKGV2ZW50KSA9PiB7fSlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlkaXYnKVxuICogbGlzdGVuVG9Eb21FdmVudChteURpdiwgWydjbGljaycsICdrZXlwcmVzcyddKVxuICogICAubWFwKChldmVudCkgPT4ge30pXG4gKi9cbmNvbnN0IGxpc3RlblRvQ2hyb21lRXZlbnQgPSAoZXZlbnRPYmplY3QsIC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIEJ1bWJsZVN0cmVhbShjYWxsYmFjayA9PiB7XG4gICAgZXZlbnRPYmplY3QuYWRkTGlzdGVuZXIoY2FsbGJhY2ssIC4uLmFyZ3MpXG4gICAgcmV0dXJuICgpID0+IGV2ZW50T2JqZWN0LnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKVxuICB9KVxufVxuXG4vKipcbiAqIExpc3RlbiB0byBvbmUgb3IgbXVsdGlwbGUgZXZlbnRzIG9uIGEgRE9NIEVsZW1lbnQuXG4gKlxuICogQG1lbWJlcm9mIGxpc3RlblRvXG4gKiBAZnVuY3Rpb24gbGlzdGVuVG9Eb21FdmVudFxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCAtIEEgRE9NIEVsZW1lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ3xBcnJheTxzdHJpbmc+fSBldmVudCAtIEFuIGV2ZW50IHN0cmluZyBvciBhbiBhcnJheSBvZiBldmVudCBzdHJpbmdzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIEJ1bWJsZVN0cmVhbSBvYmplY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IG15RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215ZGl2JylcbiAqIGxpc3RlblRvRG9tRXZlbnQobXlEaXYsICdjbGljaycpXG4gKiAgIC5tYXAoKGV2ZW50KSA9PiB7fSlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgbXlEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlkaXYnKVxuICogbGlzdGVuVG9Eb21FdmVudChteURpdiwgWydjbGljaycsICdrZXlwcmVzcyddKVxuICogICAubWFwKChldmVudCkgPT4ge30pXG4gKi9cbmNvbnN0IGxpc3RlblRvRG9tRXZlbnQgPSAodGFyZ2V0LCBldmVudCkgPT4ge1xuICByZXR1cm4gQnVtYmxlU3RyZWFtKGNhbGxiYWNrID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgIGV2ZW50LmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKSxcbiAgICAgIClcblxuICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgIGV2ZW50LmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spLFxuICAgICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaylcbiAgICAgIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIE1hcCByZXNwb25zZXMgdG8gZXZlbnRzLiBVc2VzIEJ1bWJsZVN0cmVhbSBpbnRlcm5hbGx5LlxuICpcbiAqIEBmdW5jdGlvbiBsaXN0ZW5Ub1xuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCAtIEVpdGhlciBDaHJvbWUgQVBJIEV2ZW50IG9yIERPTSBFbGVtZW50LlxuICogQHBhcmFtICB7Li4uYW55fSBbYXJnc10gLSBFdmVudCBzdHJpbmcgb3IgYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgQnVtYmxlU3RyZWFtIG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogbGlzdGVuVG8oY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlKS5tYXAoKHtncmVldGluZ30pID0+IHtcbiAqICAgaWYoZ3JlZXRpbmcgPT09ICdoZWxsbycpIHtcbiAqICAgICByZXR1cm4gKHtncmVldGluZzogJ2dvb2RieWUnfSlcbiAqICAgfVxuICogfSlcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBsaXN0ZW5UbyA9ICh0YXJnZXQsIC4uLmFyZ3MpID0+IHtcbiAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgcmV0dXJuIGxpc3RlblRvRG9tRXZlbnQodGFyZ2V0LCBhcmdzWzBdKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5Ub0Nocm9tZUV2ZW50KHRhcmdldCwgLi4uYXJncylcbiAgfVxufVxubGlzdGVuVG8uZG9tRXZlbnQgPSBsaXN0ZW5Ub0RvbUV2ZW50XG5saXN0ZW5Uby5jaHJvbWVFdmVudCA9IGxpc3RlblRvQ2hyb21lRXZlbnRcbiIsImltcG9ydCB7IGxpc3RlblRvIH0gZnJvbSAnLi4vaGVscGVycy9saXN0ZW4tdG8nXG5cbmV4cG9ydCBjb25zdCBldmVudFByb21pc2UgPSAoLi4uYXJncykgPT5cbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5UbyguLi5hcmdzKVxuICAgICAgICAuZm9yRWFjaChyZXNvbHZlKVxuICAgICAgICAuY2F0Y2gocmVqZWN0KVxuICAgICAgICAuY2xlYXIoKCkgPT4gdHJ1ZSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbiIsImltcG9ydCB7IGV2ZW50UHJvbWlzZSB9IGZyb20gJy4uL3V0aWxzL3V0aWwuZXZlbnQtcHJvbWlzZSdcblxuZXhwb3J0IGNvbnN0IHdoZW4gPSB7XG4gIG9uSW5zdGFsbGVkOiAoKSA9PiBldmVudFByb21pc2UoY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQpLFxufVxuIiwiY29uc3QgY3JlYXRlID0gZGV0YWlscyA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5jb250ZXh0TWVudXMuY3JlYXRlKGRldGFpbHMsICgpID0+IHtcbiAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIHJlamVjdChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcblxuZXhwb3J0IGNvbnN0IGNvbnRleHRNZW51ID0geyBjcmVhdGUgfVxuIiwiLyoqXG4gKiBIZWxwZXJzLlxuICovXG5cbnZhciBzID0gMTAwMDtcbnZhciBtID0gcyAqIDYwO1xudmFyIGggPSBtICogNjA7XG52YXIgZCA9IGggKiAyNDtcbnZhciB3ID0gZCAqIDc7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAdGhyb3dzIHtFcnJvcn0gdGhyb3cgYW4gZXJyb3IgaWYgdmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG4gIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBwYXJzZSh2YWwpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmIGlzTmFOKHZhbCkgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigoPzpcXGQrKT9cXC0/XFxkP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8d2Vla3M/fHd8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuICByZXR1cm4gbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XG4gIHZhciBpc1BsdXJhbCA9IG1zQWJzID49IG4gKiAxLjU7XG4gIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwiaW1wb3J0IG1zIGZyb20gJ21zJ1xuXG4vKipcbiAqIFRoZW5hYmxlIHNldFRpbWVvdXQuIFVzZXMgUHJvbWlzZSBpbnRlcm5hbGx5LlxuICogVGhlIFByb21pc2UgcmVzb2x2ZXMgd2l0aCB1bmRlZmluZWQuXG4gKlxuICogQG1lbWJlcm9mXG4gKiBAZnVuY3Rpb24gdGltZW91dFxuICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB0aW1lIC0gU3RyaW5nIGRlc2NyaXB0aW9uIG9mIHRpbWUgb3IgbWlsbGlzZWNvbmRzIGlmIG51bWJlci5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSB0aGVuYWJsZSBvYmplY3QgZm9yIGNoYWluaW5nLlxuICpcbiAqIEBleGFtcGxlXG4gKiB0aW1lb3V0KCcxMHMnKS50aGVuKCgpID0+IHtcbiAqICAgY29uc29sZS5sb2coJ0l0IGhhcyBiZWVuIDEwIHNlY29uZHMhJylcbiAqIH0pXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFVzZSBhcmd1bWVudCBkZWZhdWx0cyB0byBwYXNzXG4gKiAvLyB2YWx1ZXMgd2hlbiB0aGUgcHJvbWlzZSByZXNvbHZlcy5cbiAqIHRpbWVvdXQoJzEwcycpLnRoZW4oKHJlc3VsdCA9IDUpID0+IHtcbiAqICAgY29uc29sZS5sb2coJ1RoZSByZXN1bHQgaXMnLCByZXN1bHQpXG4gKiB9KSAvLyBUaGUgcmVzdWx0IGlzIDVcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2FsbCByZXNvbHZlIHRvIHJlc29sdmUgdGhlIHByb21pc2UgaW1tZWRpYXRlbHkuXG4gKiAvLyBUaGUgcHJvbWlzZSB3aWxsIHJlc29sdmUgd2l0aCB0aGUgdmFsdWUgeW91IHBhc3MgdG8gaXQuXG4gKiB0aW1lb3V0KCcxMHMnKS50aGVuKChyZXN1bHQgPSA1KSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKCdUaGUgcmVzdWx0IGlzJywgcmVzdWx0KVxuICogfSkucmVzb2x2ZSg2KSAvLyBUaGUgcmVzdWx0IGlzIDZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXQodGltZSkge1xuICBjb25zdCBtaWxsaXNlY29uZHMgPSB0eXBlb2YgdGltZSA9PT0gJ3N0cmluZycgPyBtcyh0aW1lKSA6IHRpbWVcblxuICBsZXQgdGltZW91dElkXG4gIGxldCBwcm9taXNlUmVzb2x2ZVxuICBsZXQgcHJvbWlzZVJlamVjdFxuXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBwcm9taXNlUmVzb2x2ZSA9IHggPT4gcmVzb2x2ZSh4KVxuICAgICAgcHJvbWlzZVJlamVjdCA9IHggPT4gcmVqZWN0KHgpXG5cbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHByb21pc2VSZXNvbHZlID0gKCkgPT4ge31cbiAgICAgICAgICBwcm9taXNlUmVqZWN0ID0gKCkgPT4ge31cblxuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfVxuICAgICAgfSwgbWlsbGlzZWNvbmRzKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpXG4gICAgfVxuICB9KVxuXG4gIGNvbnN0IG1ldGhvZHMgPSB7XG4gICAgLyoqXG4gICAgICogQWRkIGFub3RoZXIgZnVuY3Rpb24gdG8gdGhlIFByb21pc2UgY2hhaW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbWV0aG9kcyBvYmplY3RcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdGltZW91dCgnNXMnKS50aGVuKCgpID0+IHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKCc1IHNlY29uZHMgaGF2ZSBwYXNzZWQuJylcbiAgICAgKiB9KVxuICAgICAqL1xuICAgIHRoZW46IGZuID0+IHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oZm4pXG4gICAgICByZXR1cm4gbWV0aG9kc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYXRjaCBhIHJlamVjdGVkIHByb21pc2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbWV0aG9kcyBvYmplY3RcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdGltZW91dCgnNXMnKVxuICAgICAqICAgLnRoZW4oKCkgPT4ge1xuICAgICAqICAgICB0aHJvdyAnTm8sIG5vIHF1aWVyby4nXG4gICAgICogICB9KVxuICAgICAqICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAqICAgICBjb25zb2xlLmxvZygnSnVzdCBkbyBpdC4nKVxuICAgICAqICAgfSlcbiAgICAgKi9cbiAgICBjYXRjaDogZm4gPT4ge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UuY2F0Y2goZm4pXG4gICAgICByZXR1cm4gbWV0aG9kc1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIHRoZSB0aW1lci5cbiAgICAgKiBUaGUgcHJvbWlzZSB3aWxsIHJlbWFpbiBwZW5kaW5nLFxuICAgICAqIGFuZCBjYW4gYmUgcmVzb2x2ZWQgYW5kIHJlamVjdGVkLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCB0aW1lciA9IHRpbWVvdXQoJzVzJylcbiAgICAgKiB0aW1lci5jbGVhcigpXG4gICAgICovXG4gICAgY2xlYXI6ICgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFyIHRoZSB0aW1lb3V0IGFuZCByZXNvbHZlIHRoZSBwcm9taXNlIGltbWVkaWF0ZWx5IHdpdGggdGhlIHBhcmFtZXRlciB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiByZXNvbHZlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBwYXNzIHRvIHJlc29sdmUoKS5cbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfSBSZXR1cm5zIHVuZGVmaW5lZFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aW1lb3V0KCc1cycpLnJlc29sdmUoJ0RvbmUhJylcbiAgICAgKi9cbiAgICByZXNvbHZlOiB4ID0+IHtcbiAgICAgIG1ldGhvZHMuY2xlYXIoKVxuICAgICAgcHJvbWlzZVJlc29sdmUoeClcbiAgICAgIHJldHVybiBtZXRob2RzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENsZWFyIHRoZSB0aW1lb3V0IGFuZCByZXNvbHZlIHRoZSBwcm9taXNlIGltbWVkaWF0ZWx5IHdpdGggdGhlIHBhcmFtZXRlciB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvbiByZWplY3RcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHBhc3MgdG8gcmVqZWN0KCkuXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH0gUmV0dXJucyB1bmRlZmluZWRcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdGltZW91dCgnNXMnKS5yZWplY3QoJ05vIHNvdXAgZm9yIHlvdSEnKVxuICAgICAqL1xuICAgIHJlamVjdDogeCA9PiB7XG4gICAgICBtZXRob2RzLmNsZWFyKClcbiAgICAgIHByb21pc2VSZWplY3QoeClcbiAgICAgIHJldHVybiBtZXRob2RzXG4gICAgfSxcblxuICAgIC8qKiBUaGUgaWQgcmV0dXJuZWQgYnkgc2V0VGltZW91dCAqL1xuICAgIHRpbWVvdXRJZCxcbiAgfVxuXG4gIHJldHVybiBtZXRob2RzXG59XG4iLCJpbXBvcnQgeyB0aW1lb3V0IH0gZnJvbSAnLi4vaGVscGVycy90aW1lb3V0J1xuaW1wb3J0IHsgaXNCYWNrZ3JvdW5kUGFnZSB9IGZyb20gJy4uL3V0aWxzL3V0aWwuZXh0ZW5kJ1xuXG5sZXQgc3RvcmVSZWFkeSA9IGZhbHNlXG5jb25zdCBzdGF0ZSA9IHt9XG5sZXQgbGlzdGVuZXJzID0gW11cblxuLyoqXG4gKiBSZXR1cm5zIGNvcHkgb2Ygc3RhdGUgb2JqZWN0IG9yIHZhbHVlIHJldHVybmVkIGZyb20gbWFwcGluZyBmblxuICpcbiAqIEBtZW1iZXJvZiBCdW1ibGVTdG9yZVxuICogQGZ1bmN0aW9uIGdldFN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ3xTdGF0ZVNlbGVjdG9yfSBrZXlPckZuIC0ga2V5IG5hbWUgb3IgZm4gOjoge3N0YXRlfSAtPiBhbnlcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aXRoIHRoZSBzdGF0ZSBvYmplY3Qgb3IgdGhlIHZhbHVlIG9mIHRoZSBzdGF0ZSBwcm9wZXJ0eS5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0U3RhdGUoJ2FwcGxlcycpLnRoZW4oKGFwcGxlcykgPT4ge1xuICogICBjb25zb2xlLmxvZyhhcHBsZXMpXG4gKiB9KVxuICovXG5leHBvcnQgY29uc3QgZ2V0U3RhdGUgPSBrZXlPckZuID0+IHtcbiAgaWYgKCFzdG9yZVJlYWR5KSB7XG4gICAgbm90Q29ubmVjdGVkRXJyb3IoJ3N0b3JlLmdldFN0YXRlJylcbiAgfVxuXG4gIGlmICh0eXBlb2Yga2V5T3JGbiA9PT0gJ3N0cmluZycgJiYga2V5T3JGbi5sZW5ndGgpIHtcbiAgICAvLyBHZXQgb25seSBvbmUgcHJvcGVydHkgb2Ygc3RhdGVcbiAgICBsZXQgdmFsdWUgPSBzdGF0ZVtrZXlPckZuXVxuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ldyBFcnJvcihgZ2V0U3RhdGU6IHN0YXRlLiR7a2V5T3JGbn0gaXMgdW5kZWZpbmVkLmApXG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIC8vIFJldHVybiBjb3B5IG9mIHZhbHVlIGlmIGFycmF5XG4gICAgICByZXR1cm4gWy4uLnZhbHVlXVxuICAgIH0gZWxzZSBpZiAodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIC8vIFJldHVybiBjb3B5IG9mIHZhbHVlIGlmIG9iamVjdFxuICAgICAgcmV0dXJuIHsgLi4udmFsdWUgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQcmltaXRpdmUgdmFsdWUsIG5vIG5lZWQgdG8gY29weVxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBrZXlPckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGtleU9yRm4oeyAuLi5zdGF0ZSB9KVxuICB9IGVsc2Uge1xuICAgIC8vIFJldHVybiBjb3B5IG9mIHdob2xlIHN0YXRlXG4gICAgcmV0dXJuIHsgLi4uc3RhdGUgfVxuICB9XG59XG4vKipcbiAqIERlcml2ZSBhIHZhbHVlIGZyb20gdGhlIGN1cnJlbnQgc3RhdGUuXG4gKlxuICogQGNhbGxiYWNrIFN0YXRlU2VsZWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSAtIFRoZSBjdXJyZW50IHN0YXRlLlxuICogQHJldHVybnMge2FueX0gQW55IGRlcml2ZWQgdmFsdWUuXG4gKi9cblxubGV0IHNob3VsZFVwZGF0ZVN0YXRlID0gdHJ1ZVxubGV0IGNvbXBvc2VOZXh0U3RhdGUgPSBzID0+IHNcblxuLyoqXG4gKiBTZXRzIHN0YXRlIGFzeW5jaHJvbm91c2x5IHVzaW5nIGEgc3RhdGUgb2JqZWN0IG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIG9iamVjdC5cbiAqXG4gKiBAbWVtYmVyb2YgQnVtYmxlU3RvcmVcbiAqIEBmdW5jdGlvbiBzZXRTdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd8U3RhdGVBY3Rpb259IG5ld1N0YXRlT3JGbiAtIGtleSBuYW1lIG9yIGZuIDo6IHtzdGF0ZX0gLT4ge3N0YXRlfVxuICogQHJldHVybnMge1Byb21pc2U8T2JqZWN0Pn0gUmVzb2x2ZXMgdG8gYSBjb3B5IG9mIHRoZSBuZXcgc3RhdGUgb2JqZWN0LlxuICpcbiAqIEBleGFtcGxlXG4gKiBzZXRTdGF0ZSh7IGFwcGxlczogMiB9KVxuICogICAudGhlbigoc3RhdGUpID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnTnVtYmVyIG9mIGFwcGxlczonLCBzdGF0ZS5hcHBsZXMpXG4gKiAgIH0pXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRTdGF0ZSA9IG5ld1N0YXRlT3JGbiA9PiB7XG4gIGlmICghc3RvcmVSZWFkeSkge1xuICAgIG5vdENvbm5lY3RlZEVycm9yKCdzdG9yZS5zZXRTdGF0ZScpXG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzZXR0ZXIgPSBjb21wb3NlTmV4dFN0YXRlXG4gICAgICBsZXQgZm5cblxuICAgICAgaWYgKHR5cGVvZiBuZXdTdGF0ZU9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm4gPSBwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICAuLi5wcmV2U3RhdGUsXG4gICAgICAgICAgLi4ubmV3U3RhdGVPckZuKHByZXZTdGF0ZSksXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbiA9IHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIC4uLnByZXZTdGF0ZSxcbiAgICAgICAgICAuLi5uZXdTdGF0ZU9yRm4sXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbXBvc2VOZXh0U3RhdGUgPSBuZXh0U3RhdGUgPT4gZm4oc2V0dGVyKG5leHRTdGF0ZSkpXG5cbiAgICAgIGlmIChzaG91bGRVcGRhdGVTdGF0ZSkge1xuICAgICAgICAvLyBGb3JjZSBhc3luYyB1cGRhdGUgb2Ygc3RhdGVcbiAgICAgICAgLy8gdG8gYXZvaWQgdW5leHBlY3RlZCBzaWRlIGVmZmVjdHNcbiAgICAgICAgLy8gZm9yIG11bHRpcGxlIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICB0aW1lb3V0KDApXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQ29tcG9zZSBuZXcgc3RhdGUgYW5kIGFzc2lnblxuICAgICAgICAgICAgY29uc3QgbmV4dFN0YXRlID0gY29tcG9zZU5leHRTdGF0ZShnZXRTdGF0ZSgpKVxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzdGF0ZSwgbmV4dFN0YXRlKVxuICAgICAgICAgICAgLy8gQ2xlYW4gdXBcbiAgICAgICAgICAgIHNob3VsZFVwZGF0ZVN0YXRlID0gdHJ1ZVxuICAgICAgICAgICAgY29tcG9zZU5leHRTdGF0ZSA9IHMgPT4gc1xuICAgICAgICAgICAgLy8gUHNldWRvIGZpcmUgT25TdGF0ZUNoYW5nZVxuICAgICAgICAgICAgbGlzdGVuZXJzLmZvckVhY2goZm4gPT4gZm4oZ2V0U3RhdGUoKSkpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihyZXNvbHZlKVxuXG4gICAgICAgIHNob3VsZFVwZGF0ZVN0YXRlID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGltZW91dCgwKS50aGVuKHJlc29sdmUpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9XG4gIH0pLnRoZW4oZ2V0U3RhdGUpXG59XG4vKipcbiAqIE1hcCB0aGUgc3RhdGUgb2JqZWN0IGF0IHRoZSB0aW1lIHNldFN0YXRlKCkgZmlyZXMuXG4gKlxuICogQGNhbGxiYWNrIFN0YXRlQWN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgQSBjb3B5IG9mIGN1cnJlbnQgc3RhdGUgb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gVGhlIG5ldyBzdGF0ZSBvYmplY3QuXG4gKi9cblxuLyoqXG4gKiBBZGRzIGEgbGlzdGVuZXIgZnVuY3Rpb24gdG8gb25TdGF0ZUNoYW5nZS5cbiAqXG4gKiBAbWVtYmVyb2Ygb25TdGF0ZUNoYW5nZVxuICogQGZ1bmN0aW9uIGFkZExpc3RlbmVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIEEgc3RhdGUgcHJvcGVydHkgbmFtZSBvciBmbiA6OiB7c3RhdGV9IC0+IGFueVxuICogQHJldHVybnMge3VuZGVmaW5lZH0gUmV0dXJucyB1bmRlZmluZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqIHN0b3JlLm9uU3RhdGVDaGFuZ2UuYWRkTGlzdGVuZXIoZm4pXG4gKi9cbmNvbnN0IGFkZExpc3RlbmVyID0gbGlzdGVuZXIgPT4ge1xuICBpZiAoc3RvcmVSZWFkeSkge1xuICAgIGxpc3RlbmVycyA9IFsuLi5saXN0ZW5lcnMsIGxpc3RlbmVyXVxuICB9IGVsc2Uge1xuICAgIG5vdENvbm5lY3RlZEVycm9yKCdzdG9yZS5vblN0YXRlQ2hhbmdlLmFkZExpc3RlbmVyJylcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIG9uU3RhdGVDaGFuZ2UuXG4gKlxuICogQG1lbWJlcm9mIG9uU3RhdGVDaGFuZ2VcbiAqIEBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBUaGUgbGlzdGVuZXIgZnVuY3Rpb24gdG8gcmVtb3ZlLlxuICogQHJldHVybnMge3VuZGVmaW5lZH0gUmV0dXJucyB1bmRlZmluZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqIHN0b3JlLm9uU3RhdGVDaGFuZ2UucmVtb3ZlTGlzdGVuZXIoZm4pXG4gKi9cbmNvbnN0IHJlbW92ZUxpc3RlbmVyID0gbGlzdGVuZXIgPT4ge1xuICBpZiAoc3RvcmVSZWFkeSkge1xuICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIobCA9PiBsICE9PSBsaXN0ZW5lcilcbiAgfSBlbHNlIHtcbiAgICBub3RDb25uZWN0ZWRFcnJvcignc3RvcmUub25TdGF0ZUNoYW5nZS5yZW1vdmVMaXN0ZW5lcicpXG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgb25TdGF0ZUNoYW5nZSBoYXMgdGhlIGxpc3RlbmVyLlxuICpcbiAqIEBtZW1iZXJvZiBvblN0YXRlQ2hhbmdlXG4gKiBAZnVuY3Rpb24gaGFzbGlzdGVuZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIC0gRnVuY3Rpb24gdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIG9uU3RhdGVDaGFuZ2UgaGFzIHRoZSBsaXN0ZW5lci5cbiAqXG4gKiBAZXhhbXBsZVxuICogc3RvcmUub25TdGF0ZUNoYW5nZS5oYXNMaXN0ZW5lcihmbilcbiAqL1xuY29uc3QgaGFzTGlzdGVuZXIgPSBsaXN0ZW5lciA9PiB7XG4gIGlmIChzdG9yZVJlYWR5KSB7XG4gICAgbGlzdGVuZXJzLnNvbWUobCA9PiBsID09PSBsaXN0ZW5lcilcbiAgfSBlbHNlIHtcbiAgICBub3RDb25uZWN0ZWRFcnJvcignc3RvcmUub25TdGF0ZUNoYW5nZS5oYXNMaXN0ZW5lcicpXG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZnVuY3Rpb24gaGFzIGFueSBsaXN0ZW5lcnMuXG4gKlxuICogQG1lbWJlcm9mIG9uU3RhdGVDaGFuZ2VcbiAqIEBmdW5jdGlvbiBoYXNsaXN0ZW5lcnNcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgb25TdGF0ZUNoYW5nZSBoYXMgYW55IGxpc3RlbmVycy5cbiAqXG4gKiBAZXhhbXBsZVxuICogc3RvcmUub25TdGF0ZUNoYW5nZS5oYXNMaXN0ZW5lcnMoKVxuICovXG5jb25zdCBoYXNMaXN0ZW5lcnMgPSAoKSA9PiAhIWxpc3RlbmVycy5sZW5ndGhcblxuLyoqXG4gKiBDYWxscyBhbGwgdGhlIG9uU3RhdGVDaGFuZ2UgbGlzdGVuZXJzLlxuICpcbiAqIEBtZW1iZXJvZiBvblN0YXRlQ2hhbmdlXG4gKiBAZnVuY3Rpb24gZmlyZUxpc3RlbmVyc1xuICogQHJldHVybnMge3VuZGVmaW5lZH0gUmV0dXJucyB1bmRlZmluZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqIHN0b3JlLm9uU3RhdGVDaGFuZ2UuZmlyZUxpc3RlbmVycygpXG4gKi9cbmNvbnN0IGZpcmVMaXN0ZW5lcnMgPSAoKSA9PlxuICBsaXN0ZW5lcnMuZm9yRWFjaChmbiA9PiBmbihnZXRTdGF0ZSgpKSlcblxuLyoqIEBuYW1lc3BhY2UgKi9cbmNvbnN0IG9uU3RhdGVDaGFuZ2UgPSB7XG4gIGFkZExpc3RlbmVyLFxuICByZW1vdmVMaXN0ZW5lcixcbiAgaGFzTGlzdGVuZXIsXG4gIGhhc0xpc3RlbmVycyxcbiAgZmlyZUxpc3RlbmVycyxcbn1cblxuY29uc3Qgbm90Q29ubmVjdGVkRXJyb3IgPSBuYW1lID0+IHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIGAke25hbWV9IGlzIG5vdCBpbml0aWFsaXplZC4gQ2FsbCB0aGlzIGZ1bmN0aW9uIGFmdGVyIGluaXRTdG9yZSgpIGhhcyBjb21wbGV0ZWQuYCxcbiAgKVxufVxuXG4vKiogQG5hbWVzcGFjZSBCdW1ibGVTdG9yZSAqL1xuZXhwb3J0IGNvbnN0IHN0b3JlID0ge1xuICBnZXRTdGF0ZSxcbiAgc2V0U3RhdGUsXG4gIG9uU3RhdGVDaGFuZ2UsXG59XG5cbmNvbnN0IGNyZWF0ZVN0b3JlID0gKCkgPT4ge1xuICBjb25zdCBpbnZlcnRlZFN0b3JlUHJvbWlzZSA9IHt9XG5cbiAgY29uc3Qgc3RvcmVQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIE9iamVjdC5hc3NpZ24oaW52ZXJ0ZWRTdG9yZVByb21pc2UsIHsgcmVzb2x2ZSwgcmVqZWN0IH0pXG4gIH0pXG5cbiAgY29uc3QgaW5pdFN0b3JlID0gaW5pdGlhbFN0YXRlID0+IHtcbiAgICBpZiAoc3RvcmVSZWFkeSkge1xuICAgICAgLy8gU3RvcmUgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZFxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgaW5pdGlhbGl6ZSB0aGUgc3RvcmUgdHdpY2UuJylcbiAgICB9IGVsc2UgaWYgKCFpc0JhY2tncm91bmRQYWdlKCkpIHtcbiAgICAgIC8vIE5vdCBiYWNrZ3JvdW5kIHBhZ2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ011c3QgaW5pdGlhbGl6ZSB0aGUgc3RvcmUgaW4gdGhlIGJhY2tncm91bmQgcGFnZS4nLFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBc3NpZ24gaW5pdGlhbCBzdGF0ZSB2YWx1ZXMgdG8gc3RvcmUgc3RhdGVcbiAgICAgIE9iamVjdC5hc3NpZ24oc3RhdGUsIGluaXRpYWxTdGF0ZSlcblxuICAgICAgaW52ZXJ0ZWRTdG9yZVByb21pc2UucmVzb2x2ZShzdG9yZSlcbiAgICAgIHN0b3JlUmVhZHkgPSB0cnVlXG5cbiAgICAgIHJldHVybiBzdG9yZVxuICAgIH1cbiAgfVxuXG4gIHdpbmRvdy5idW1ibGVTdG9yZSA9IHN0b3JlUHJvbWlzZVxuXG4gIHJldHVybiB7IGluaXRTdG9yZSwgc3RvcmVQcm9taXNlIH1cbn1cblxuLyoqXG4gKiBTZXRzIHVwIHN0YXRlIGFuZCBpbW1lZGlhdGVseSBjYWxscyB0aGUgY2FsbGJhY2suXG4gKiBTZXRzIHdpbmRvdy5zdG9yZSBhcyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBzdG9yZSBhZnRlciB0aGUgY2FsbGJhY2sgY29tcGxldGVzLlxuICpcbiAqIEBmdW5jdGlvbiBpbml0U3RvcmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbml0aWFsU3RhdGUgLSBUaGUgaW5pdGlhbCBzdGF0ZSB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7QnVtYmxlU3RvcmV9IFRoZSBpbml0aWFsaXplZCBzdG9yZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge30gPSBzdG9yZS5pbml0U3RvcmUoeyBhcHBsZXM6IDIgfSlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgZGVmYXVsdFN0YXRlID0geyBhcHBsZXM6IDIgfVxuICogc3RvcmFnZUxvY2FsLmdldCgnc3RhdGUnKVxuICogICAudGhlbigoe3N0YXRlID0gZGVmYXVsdFN0YXRlfSkgPT4gc3RhdGUpXG4gKiAgIC50aGVuKHN0b3JlLmluaXRTdG9yZSlcbiAqICAgLnRoZW4oKHsgc2V0U3RhdGUsIGdldFN0YXRlLCBvblN0YXRlQ2hhbmdlIH0pID0+IHtcbiAqICAgICBjb25zb2xlLmxvZygnU3RvcmUgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuJylcbiAqICAgfSlcbiAqL1xuY29uc3QgeyBpbml0U3RvcmUsIHN0b3JlUHJvbWlzZSB9ID0gY3JlYXRlU3RvcmUoKVxuXG5leHBvcnQgeyBpbml0U3RvcmUsIHN0b3JlUHJvbWlzZSB9XG4iLCIvKipcbiAqIFJldHJpZXZlcyB0aGUgV2luZG93IG9iamVjdCBmb3IgdGhlIGJhY2tncm91bmQgcGFnZSBydW5uaW5nIGluc2lkZSB0aGUgY3VycmVudCBleHRlbnNpb24uXG4gKiBTZWVcbiAqIFtDaHJvbWUgQVBJIERvY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vZXh0ZW5zaW9ucy9ydW50aW1lI21ldGhvZC1nZXRCYWNrZ3JvdW5kUGFnZSlcbiAqIGFuZFxuICogW01ETl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0FkZC1vbnMvV2ViRXh0ZW5zaW9ucy9BUEkvcnVudGltZS9nZXRCYWNrZ3JvdW5kUGFnZSkuXG4gKlxuICogQGZ1bmN0aW9uIGdldEJhY2tncm91bmRQYWdlXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2l0aCB0aGUgV2luZG93IG9iamVjdCBmb3IgdGhlIGJhY2tncm91bmQgcGFnZSwgaWYgdGhlcmUgaXMgb25lLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRCYWNrZ3JvdW5kUGFnZSgpXG4gKlxuICovXG4vLyBUT0RPOiBSZWZhY3RvciB0byBjaHJvbWUvZXh0ZW5zaW9uLXBhZ2VzLmpzXG5leHBvcnQgY29uc3QgZ2V0QmFja2dyb3VuZFBhZ2UgPSAoKSA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5ydW50aW1lLmdldEJhY2tncm91bmRQYWdlKHcgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUodylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH1cbiAgfSlcbiIsImltcG9ydCB7XG4gIGlzQmFja2dyb3VuZFBhZ2UsXG4gIGlzQ29udGVudFNjcmlwdCxcbn0gZnJvbSAnLi4vdXRpbHMvdXRpbC5leHRlbmQnXG5pbXBvcnQgeyBnZXRCYWNrZ3JvdW5kUGFnZSB9IGZyb20gJy4uL2Nocm9tZS9jaHJvbWUucnVudGltZSdcblxuY29uc3Qgbm90Q29ubmVjdGVkRXJyb3IgPSBuYW1lID0+IHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIGAke25hbWV9IGlzIG5vdCBpbml0aWFsaXplZC4gQ2FsbCB0aGlzIGZ1bmN0aW9uIGluc2lkZSBjb25uZWN0VG9TdG9yZSgpLnRoZW4oKWAsXG4gIClcbn1cblxuLy8gVE9ETzogV2lyZSB1cCBiZXR0ZXIgZXJyb3JzIHdoZW4gYmdTdG9yZSBpcyBub3QgcmVhZHlcbi8vIFwiYmdTdG9yZSBpcyBub3QgaW5pdGlhbGl6ZWQuIENhbGwgdGhpcyBmdW5jdGlvbiBpbnNpZGUgY29ubmVjdFRvU3RvcmUoKS50aGVuKClcIlxuZXhwb3J0IGNvbnN0IGJhY2tncm91bmRTdG9yZSA9IHtcbiAgZ2V0U3RhdGU6ICgpID0+IG5vdENvbm5lY3RlZEVycm9yKCdiYWNrZ3JvdW5kU3RvcmUuZ2V0U3RhdGUnKSxcbiAgc2V0U3RhdGU6ICgpID0+IG5vdENvbm5lY3RlZEVycm9yKCdiYWNrZ3JvdW5kU3RvcmUuc2V0U3RhdGUnKSxcbiAgb25TdGF0ZUNoYW5nZToge1xuICAgIGFkZExpc3RlbmVyOiAoKSA9PlxuICAgICAgbm90Q29ubmVjdGVkRXJyb3IoXG4gICAgICAgICdiYWNrZ3JvdW5kU3RvcmUub25TdGF0ZUNoYW5nZS5hZGRMaXN0ZW5lcicsXG4gICAgICApLFxuICAgIHJlbW92ZUxpc3RlbmVyOiAoKSA9PlxuICAgICAgbm90Q29ubmVjdGVkRXJyb3IoXG4gICAgICAgICdiYWNrZ3JvdW5kU3RvcmUub25TdGF0ZUNoYW5nZS5yZW1vdmVMaXN0ZW5lcicsXG4gICAgICApLFxuICB9LFxufVxuXG4vLyBUT0RPOiBUZXN0IHRoYXQgaXNCYWNrZ3JvdW5kUGFnZSBhbmQgaXNDb250ZW50U2NyaXB0IHdvcmtzXG5leHBvcnQgY29uc3QgY29ubmVjdFRvU3RvcmUgPSAoKSA9PiB7XG4gIGlmIChpc0JhY2tncm91bmRQYWdlKCkpIHtcbiAgICBuZXcgRXJyb3IoXG4gICAgICAnQ29udGV4dCBlcnJvcjogY29ubmVjdFRvU3RvcmUgY2Fubm90IHJ1biBvbiBhIGJhY2tncm91bmQgcGFnZS4nLFxuICAgIClcbiAgfSBlbHNlIGlmIChpc0NvbnRlbnRTY3JpcHQoKSkge1xuICAgIG5ldyBFcnJvcihcbiAgICAgICdDb250ZXh0IGVycm9yOiBjb25uZWN0VG9TdG9yZSBjYW5ub3QgcnVuIGluc2lkZSBhIGNvbnRlbnQgc2NyaXB0LicsXG4gICAgKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAoXG4gICAgICBnZXRCYWNrZ3JvdW5kUGFnZSgpXG4gICAgICAgIC8vIFN0b3JlIGlzIGEgcHJvbWlzZVxuICAgICAgICAudGhlbigoeyBidW1ibGVTdG9yZSB9KSA9PiBidW1ibGVTdG9yZSlcbiAgICAgICAgLy8gU3RvcmUgaXMgdW53cmFwcGVkIGFmdGVyIGJnIHBhZ2UgaW5pdGlhbGl6ZXNcbiAgICAgICAgLnRoZW4oc3RvcmUgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdG9yZScsIHN0b3JlKVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdiYWNrZ3JvdW5kU3RvcmUnLCBiYWNrZ3JvdW5kU3RvcmUpXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihiYWNrZ3JvdW5kU3RvcmUsIHN0b3JlKVxuICAgICAgICAgIHJldHVybiBzdG9yZVxuICAgICAgICB9KVxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgQnVtYmxlU3RyZWFtIH0gZnJvbSAnLi4vZXZlbnQtc3RyZWFtL3N0cmVhbSdcbmltcG9ydCBtcyBmcm9tICdtcydcblxuLyoqXG4gKiBNYXBwYWJsZSBzZXRJbnRlcnZhbC4gVXNlcyBCdW1ibGVTdHJlYW0gaW50ZXJuYWxseS5cbiAqXG4gKiBAZnVuY3Rpb24gaW50ZXJ2YWxcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lIC0gUmVwcmVzZW50cyB0aW1lIGJldHdlZW4gaW50ZXJ2YWxzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIEJ1bWJsZVN0cmVhbUNoYWluIG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW50ZXJ2YWwoJzEwcycpLmZvckVhY2goKHgpID0+IHtcbiAqICAgY29uc29sZS5sb2coeCwgJ3RpbWVzJylcbiAqIH0pXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnZhbCh0aW1lKSB7XG4gIGNvbnN0IG1pbGxpc2Vjb25kcyA9IHR5cGVvZiB0aW1lID09PSAnc3RyaW5nJyA/IG1zKHRpbWUpIDogdGltZVxuXG4gIHJldHVybiBCdW1ibGVTdHJlYW0oY2FsbGJhY2sgPT4ge1xuICAgIC8vIENyZWF0ZSBjb3VudGVyXG4gICAgbGV0IGNvdW50ID0gMFxuXG4gICAgLy8gU3RhcnQgaW50ZXJ2YWwsIHBhc3MgY291bnQgdG8gY2FsbGJhY2ssIGluY3JlbWVudCBjb3VudFxuICAgIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY2FsbGJhY2soY291bnQpXG4gICAgICBjb3VudCsrXG4gICAgfSwgbWlsbGlzZWNvbmRzKVxuXG4gICAgLy8gUmV0dXJuIGZ1bmN0aW9uIHRvIHN0b3AgaW50ZXJ2YWxcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbChpZClcbiAgfSlcbn1cbiIsImltcG9ydCB7IHRpbWVvdXQgfSBmcm9tICcuL3RpbWVvdXQnXG5cbi8qKlxuICogQSBQcm9taXNlIGJhc2VkIGRlYm91bmNlIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgd2l0aCB0cnVlXG4gKiBvbmx5IGFmdGVyIHRoZSBmdW5jdGlvbiBoYXMgbm90IGJlZW4gY2FsbGVkXG4gKiBmb3IgYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lLlxuICogV2hlbiB0aGUgZGVib3VuY2VyIGlzIGNhbGxlZCBhIHNlY29uZCB0aW1lLFxuICogdGhlIGZpcnN0IHByb21pc2UgaW1tZWRpYXRlbHkgcmVzb2x2ZXMgdG8gZmFsc2UuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigqKTpib29sZWFufHN0cmluZ3xudW1iZXJ9IGRlYm91bmNlQ2FsbGJhY2sgLSBDYWxsYmFjayBmb3IgZWFjaCB0aW1lIHRoZSBkZWJvdW5jZXIgaXMgY2FsbGVkLlxuICogQHJldHVybnMge2Z1bmN0aW9uKCopOlRpbWVvdXRQcm9taXNlPGJvb2xlYW4+fSBSZXR1cm5zIGEgZGVib3VuY2VyIGZ1bmN0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBEZWJvdW5jZSBmb3IgNW1zXG4gKiBjb25zdCBkZWJvdW5jZXIgPSBkZWJvdW5jZSgoKSA9PiA1KVxuICogZGVib3VuY2VyKCkudGhlbigpIC8vIFJlc29sdmVzIHRvIGZhbHNlXG4gKiBkZWJvdW5jZXIoKS50aGVuKCkgLy8gUmVzb2x2ZXMgdG8gdHJ1ZVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBkZWJvdW5jZXIgPSBkZWJvdW5jZSh0ZXh0ID0+IHtcbiAqICAgaWYgKHRleHQgPT09ICcnKSB7XG4gKiAgICAgLy8gUmVzb2x2ZSBib3RoIHRoZSBwZW5kaW5nIHByb21pc2VcbiAqICAgICAvLyBhbmQgdGhpcyBvbmUgdG8gZmFsc2VcbiAqICAgICByZXR1cm4gZmFsc2VcbiAqICAgfVxuICogICBpZiAodGV4dC5pbmNsdWRlcygnXFxuJykpIHtcbiAqICAgICAvLyBSZXNvbHZlIGJvdGggcHJvbWlzZXMgdG8gdHJ1ZVxuICogICAgIHJldHVybiB0cnVlXG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgLy8gUmVzb2x2ZSB0aGUgcHJldiBwcm9taXNlIHRvIGZhbHNlXG4gKiAgICAgLy8gQW5kIHJlc29sdmUgdGhlIGN1cnJlbnQgcHJvbWlzZSBpbiA1bXNcbiAqICAgICByZXR1cm4gNVxuICogICB9XG4gKiB9KVxuICpcbiAqIGRlYm91bmNlcignc3RpbGwgdHlwaW5nJykgLy8gRGVib3VuY2VcbiAqIGRlYm91bmNlcignJykgLy8gRG9uJ3QgY29udGludWUsIG5vIGlucHV0XG4gKiBkZWJvdW5jZXIoJ2RvbmUgdHlwaW5nXFxuJykgLy8gUmVzb2x2ZSBpbW1lZGlhdGVseVxuICovXG5leHBvcnQgY29uc3QgZGVib3VuY2UgPSBmbiA9PiB7XG4gIGxldCBwcm9taXNlID0gbnVsbFxuXG4gIHJldHVybiB4ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBmbih4KVxuXG4gICAgLy8gaGFuZGxlIG9sZCBwcm9taXNlXG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIHByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICAgIHByb21pc2UgPSBudWxsXG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIG5ldyBwcm9taXNlXG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIHRpbWVvdXQoMCkucmVzb2x2ZShyZXN1bHQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UgPSB0aW1lb3V0KHJlc3VsdCkudGhlbigoeCA9IHRydWUpID0+IHgpXG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgdGltZW91dCB9IGZyb20gJy4vdGltZW91dCdcblxuLyoqXG4gKiBBIFByb21pc2UgYmFzZWQgdGhyb3R0bGUgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB3aXRoIHRydWVcbiAqIGFmdGVyIGEgc3BlY2lmaWVkIGFtb3VudCBvZiB0aW1lLiBXaGVuIHRoZSB0aG90dGxlciBpcyBjYWxsZWRcbiAqIGEgc2Vjb25kIHRpbWUgYmVmb3JlIHRoZSBmaXJzdCBwcm9taXNlIHJlc29sdmVzLFxuICogdGhlIHJldHVybmVkIHByb21pc2UgaW1tZWRpYXRlbHkgcmVzb2x2ZXMgdG8gZmFsc2UuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigqKTpib29sZWFufHN0cmluZ3xudW1iZXJ9IGZuIC0gQ2FsbGJhY2sgZm9yIGVhY2ggdGltZSB0aGUgdGhyb3R0bGVyIGlzIGNhbGxlZC5cbiAqIEByZXR1cm5zIHtmdW5jdGlvbigqKTpUaW1lb3V0UHJvbWlzZTxib29sZWFuPn0gUmV0dXJucyBhIHRocm90dGxlciBmdW5jdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRGVib3VuY2UgZm9yIDVtc1xuICogY29uc3QgdGhyb3R0bGVyID0gdGhyb3R0bGUoKCkgPT4gNSlcbiAqIHRocm90dGxlcigpLnRoZW4oKSAvLyBSZXNvbHZlcyB0byB0cnVlIGFmdGVyIDVtc1xuICogdGhyb3R0bGVyKCkudGhlbigpIC8vIFJlc29sdmVzIHRvIGZhbHNlIG5vd1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB0aHJvdHRsZXIgPSB0aHJvdHRsZSh0ZXh0ID0+IHtcbiAqICAgaWYgKHRleHQgPT09ICcnKSB7XG4gKiAgICAgLy8gUmVzb2x2ZSB0aGUgaW5pdGlhbCBhbmRcbiAqICAgICAvLyBjdXJyZW50IHByb21pc2VzIHRvIGZhbHNlIG5vd1xuICogICAgIHJldHVybiBmYWxzZVxuICogICB9XG4gKiAgIGlmICh0ZXh0LmluY2x1ZGVzKCdcXG4nKSkge1xuICogICAgIC8vIFJlc29sdmUgdGhlIGluaXRpYWwgcHJvbWlzZSB0byB0cnVlIG5vd1xuICogICAgIC8vIGFuZCB0aGUgY3VycmVudCBwcm9taXNlIHRvIGZhbHNlIG5vd1xuICogICAgIHJldHVybiB0cnVlXG4gKiAgIH0gZWxzZSB7XG4gKiAgICAgLy8gUmVzb2x2ZSB0aGUgaW5pdGlhbCBwcm9taXNlIGFzIHNjaGVkdWxlZFxuICogICAgIC8vIFJlc29sdmUgdGhlIGN1cnJlbnQgcHJvbWlzZSB0byBmYWxzZSBub3dcbiAqICAgICByZXR1cm4gNVxuICogICB9XG4gKiB9KVxuICpcbiAqIHRocm90dGxlcignc3RpbGwgdHlwaW5nJykgLy8gUmVzb2x2ZSBldmVyeSA1bXNcbiAqIHRocm90dGxlcignJykgLy8gUmVzb2x2ZSBib3RoIHRvIGZhbHNlIG5vd1xuICogdGhyb3R0bGVyKCdkb25lIHR5cGluZ1xcbicpIC8vIFJlc29sdmUgYm90aCB0byB0cnVlIG5vd1xuICovXG5leHBvcnQgY29uc3QgdGhyb3R0bGUgPSBmbiA9PiB7XG4gIGxldCBwcm9taXNlID0gbnVsbFxuXG4gIHJldHVybiB4ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBmbih4KVxuXG4gICAgLy8gaGFuZGxlIG9sZCBwcm9taXNlXG4gICAgaWYgKCFwcm9taXNlKSB7XG4gICAgICBwcm9taXNlID0gdGltZW91dChyZXN1bHQpXG4gICAgICAgIC8vIENsZWFuIHVwIHByb21pc2VcbiAgICAgICAgLnRoZW4oKHggPSB0cnVlKSA9PiB7XG4gICAgICAgICAgcHJvbWlzZSA9IG51bGxcbiAgICAgICAgICByZXR1cm4geFxuICAgICAgICB9KVxuXG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwcm9taXNlLnJlc29sdmUocmVzdWx0KVxuICAgIH1cblxuICAgIHJldHVybiB0aW1lb3V0KDApLnJlc29sdmUoZmFsc2UpXG4gIH1cbn1cbiIsIi8qKiBVc2VkIHRvIG1hcCBhbGlhc2VzIHRvIHRoZWlyIHJlYWwgbmFtZXMuICovXG5leHBvcnRzLmFsaWFzVG9SZWFsID0ge1xuXG4gIC8vIExvZGFzaCBhbGlhc2VzLlxuICAnZWFjaCc6ICdmb3JFYWNoJyxcbiAgJ2VhY2hSaWdodCc6ICdmb3JFYWNoUmlnaHQnLFxuICAnZW50cmllcyc6ICd0b1BhaXJzJyxcbiAgJ2VudHJpZXNJbic6ICd0b1BhaXJzSW4nLFxuICAnZXh0ZW5kJzogJ2Fzc2lnbkluJyxcbiAgJ2V4dGVuZEFsbCc6ICdhc3NpZ25JbkFsbCcsXG4gICdleHRlbmRBbGxXaXRoJzogJ2Fzc2lnbkluQWxsV2l0aCcsXG4gICdleHRlbmRXaXRoJzogJ2Fzc2lnbkluV2l0aCcsXG4gICdmaXJzdCc6ICdoZWFkJyxcblxuICAvLyBNZXRob2RzIHRoYXQgYXJlIGN1cnJpZWQgdmFyaWFudHMgb2Ygb3RoZXJzLlxuICAnY29uZm9ybXMnOiAnY29uZm9ybXNUbycsXG4gICdtYXRjaGVzJzogJ2lzTWF0Y2gnLFxuICAncHJvcGVydHknOiAnZ2V0JyxcblxuICAvLyBSYW1kYSBhbGlhc2VzLlxuICAnX18nOiAncGxhY2Vob2xkZXInLFxuICAnRic6ICdzdHViRmFsc2UnLFxuICAnVCc6ICdzdHViVHJ1ZScsXG4gICdhbGwnOiAnZXZlcnknLFxuICAnYWxsUGFzcyc6ICdvdmVyRXZlcnknLFxuICAnYWx3YXlzJzogJ2NvbnN0YW50JyxcbiAgJ2FueSc6ICdzb21lJyxcbiAgJ2FueVBhc3MnOiAnb3ZlclNvbWUnLFxuICAnYXBwbHknOiAnc3ByZWFkJyxcbiAgJ2Fzc29jJzogJ3NldCcsXG4gICdhc3NvY1BhdGgnOiAnc2V0JyxcbiAgJ2NvbXBsZW1lbnQnOiAnbmVnYXRlJyxcbiAgJ2NvbXBvc2UnOiAnZmxvd1JpZ2h0JyxcbiAgJ2NvbnRhaW5zJzogJ2luY2x1ZGVzJyxcbiAgJ2Rpc3NvYyc6ICd1bnNldCcsXG4gICdkaXNzb2NQYXRoJzogJ3Vuc2V0JyxcbiAgJ2Ryb3BMYXN0JzogJ2Ryb3BSaWdodCcsXG4gICdkcm9wTGFzdFdoaWxlJzogJ2Ryb3BSaWdodFdoaWxlJyxcbiAgJ2VxdWFscyc6ICdpc0VxdWFsJyxcbiAgJ2lkZW50aWNhbCc6ICdlcScsXG4gICdpbmRleEJ5JzogJ2tleUJ5JyxcbiAgJ2luaXQnOiAnaW5pdGlhbCcsXG4gICdpbnZlcnRPYmonOiAnaW52ZXJ0JyxcbiAgJ2p1eHQnOiAnb3ZlcicsXG4gICdvbWl0QWxsJzogJ29taXQnLFxuICAnbkFyeSc6ICdhcnknLFxuICAncGF0aCc6ICdnZXQnLFxuICAncGF0aEVxJzogJ21hdGNoZXNQcm9wZXJ0eScsXG4gICdwYXRoT3InOiAnZ2V0T3InLFxuICAncGF0aHMnOiAnYXQnLFxuICAncGlja0FsbCc6ICdwaWNrJyxcbiAgJ3BpcGUnOiAnZmxvdycsXG4gICdwbHVjayc6ICdtYXAnLFxuICAncHJvcCc6ICdnZXQnLFxuICAncHJvcEVxJzogJ21hdGNoZXNQcm9wZXJ0eScsXG4gICdwcm9wT3InOiAnZ2V0T3InLFxuICAncHJvcHMnOiAnYXQnLFxuICAnc3ltbWV0cmljRGlmZmVyZW5jZSc6ICd4b3InLFxuICAnc3ltbWV0cmljRGlmZmVyZW5jZUJ5JzogJ3hvckJ5JyxcbiAgJ3N5bW1ldHJpY0RpZmZlcmVuY2VXaXRoJzogJ3hvcldpdGgnLFxuICAndGFrZUxhc3QnOiAndGFrZVJpZ2h0JyxcbiAgJ3Rha2VMYXN0V2hpbGUnOiAndGFrZVJpZ2h0V2hpbGUnLFxuICAndW5hcHBseSc6ICdyZXN0JyxcbiAgJ3VubmVzdCc6ICdmbGF0dGVuJyxcbiAgJ3VzZVdpdGgnOiAnb3ZlckFyZ3MnLFxuICAnd2hlcmUnOiAnY29uZm9ybXNUbycsXG4gICd3aGVyZUVxJzogJ2lzTWF0Y2gnLFxuICAnemlwT2JqJzogJ3ppcE9iamVjdCdcbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBhcnkgdG8gbWV0aG9kIG5hbWVzLiAqL1xuZXhwb3J0cy5hcnlNZXRob2QgPSB7XG4gICcxJzogW1xuICAgICdhc3NpZ25BbGwnLCAnYXNzaWduSW5BbGwnLCAnYXR0ZW1wdCcsICdjYXN0QXJyYXknLCAnY2VpbCcsICdjcmVhdGUnLFxuICAgICdjdXJyeScsICdjdXJyeVJpZ2h0JywgJ2RlZmF1bHRzQWxsJywgJ2RlZmF1bHRzRGVlcEFsbCcsICdmbG9vcicsICdmbG93JyxcbiAgICAnZmxvd1JpZ2h0JywgJ2Zyb21QYWlycycsICdpbnZlcnQnLCAnaXRlcmF0ZWUnLCAnbWVtb2l6ZScsICdtZXRob2QnLCAnbWVyZ2VBbGwnLFxuICAgICdtZXRob2RPZicsICdtaXhpbicsICdudGhBcmcnLCAnb3ZlcicsICdvdmVyRXZlcnknLCAnb3ZlclNvbWUnLCdyZXN0JywgJ3JldmVyc2UnLFxuICAgICdyb3VuZCcsICdydW5JbkNvbnRleHQnLCAnc3ByZWFkJywgJ3RlbXBsYXRlJywgJ3RyaW0nLCAndHJpbUVuZCcsICd0cmltU3RhcnQnLFxuICAgICd1bmlxdWVJZCcsICd3b3JkcycsICd6aXBBbGwnXG4gIF0sXG4gICcyJzogW1xuICAgICdhZGQnLCAnYWZ0ZXInLCAnYXJ5JywgJ2Fzc2lnbicsICdhc3NpZ25BbGxXaXRoJywgJ2Fzc2lnbkluJywgJ2Fzc2lnbkluQWxsV2l0aCcsXG4gICAgJ2F0JywgJ2JlZm9yZScsICdiaW5kJywgJ2JpbmRBbGwnLCAnYmluZEtleScsICdjaHVuaycsICdjbG9uZURlZXBXaXRoJyxcbiAgICAnY2xvbmVXaXRoJywgJ2NvbmNhdCcsICdjb25mb3Jtc1RvJywgJ2NvdW50QnknLCAnY3VycnlOJywgJ2N1cnJ5UmlnaHROJyxcbiAgICAnZGVib3VuY2UnLCAnZGVmYXVsdHMnLCAnZGVmYXVsdHNEZWVwJywgJ2RlZmF1bHRUbycsICdkZWxheScsICdkaWZmZXJlbmNlJyxcbiAgICAnZGl2aWRlJywgJ2Ryb3AnLCAnZHJvcFJpZ2h0JywgJ2Ryb3BSaWdodFdoaWxlJywgJ2Ryb3BXaGlsZScsICdlbmRzV2l0aCcsICdlcScsXG4gICAgJ2V2ZXJ5JywgJ2ZpbHRlcicsICdmaW5kJywgJ2ZpbmRJbmRleCcsICdmaW5kS2V5JywgJ2ZpbmRMYXN0JywgJ2ZpbmRMYXN0SW5kZXgnLFxuICAgICdmaW5kTGFzdEtleScsICdmbGF0TWFwJywgJ2ZsYXRNYXBEZWVwJywgJ2ZsYXR0ZW5EZXB0aCcsICdmb3JFYWNoJyxcbiAgICAnZm9yRWFjaFJpZ2h0JywgJ2ZvckluJywgJ2ZvckluUmlnaHQnLCAnZm9yT3duJywgJ2Zvck93blJpZ2h0JywgJ2dldCcsXG4gICAgJ2dyb3VwQnknLCAnZ3QnLCAnZ3RlJywgJ2hhcycsICdoYXNJbicsICdpbmNsdWRlcycsICdpbmRleE9mJywgJ2ludGVyc2VjdGlvbicsXG4gICAgJ2ludmVydEJ5JywgJ2ludm9rZScsICdpbnZva2VNYXAnLCAnaXNFcXVhbCcsICdpc01hdGNoJywgJ2pvaW4nLCAna2V5QnknLFxuICAgICdsYXN0SW5kZXhPZicsICdsdCcsICdsdGUnLCAnbWFwJywgJ21hcEtleXMnLCAnbWFwVmFsdWVzJywgJ21hdGNoZXNQcm9wZXJ0eScsXG4gICAgJ21heEJ5JywgJ21lYW5CeScsICdtZXJnZScsICdtZXJnZUFsbFdpdGgnLCAnbWluQnknLCAnbXVsdGlwbHknLCAnbnRoJywgJ29taXQnLFxuICAgICdvbWl0QnknLCAnb3ZlckFyZ3MnLCAncGFkJywgJ3BhZEVuZCcsICdwYWRTdGFydCcsICdwYXJzZUludCcsICdwYXJ0aWFsJyxcbiAgICAncGFydGlhbFJpZ2h0JywgJ3BhcnRpdGlvbicsICdwaWNrJywgJ3BpY2tCeScsICdwcm9wZXJ0eU9mJywgJ3B1bGwnLCAncHVsbEFsbCcsXG4gICAgJ3B1bGxBdCcsICdyYW5kb20nLCAncmFuZ2UnLCAncmFuZ2VSaWdodCcsICdyZWFyZycsICdyZWplY3QnLCAncmVtb3ZlJyxcbiAgICAncmVwZWF0JywgJ3Jlc3RGcm9tJywgJ3Jlc3VsdCcsICdzYW1wbGVTaXplJywgJ3NvbWUnLCAnc29ydEJ5JywgJ3NvcnRlZEluZGV4JyxcbiAgICAnc29ydGVkSW5kZXhPZicsICdzb3J0ZWRMYXN0SW5kZXgnLCAnc29ydGVkTGFzdEluZGV4T2YnLCAnc29ydGVkVW5pcUJ5JyxcbiAgICAnc3BsaXQnLCAnc3ByZWFkRnJvbScsICdzdGFydHNXaXRoJywgJ3N1YnRyYWN0JywgJ3N1bUJ5JywgJ3Rha2UnLCAndGFrZVJpZ2h0JyxcbiAgICAndGFrZVJpZ2h0V2hpbGUnLCAndGFrZVdoaWxlJywgJ3RhcCcsICd0aHJvdHRsZScsICd0aHJ1JywgJ3RpbWVzJywgJ3RyaW1DaGFycycsXG4gICAgJ3RyaW1DaGFyc0VuZCcsICd0cmltQ2hhcnNTdGFydCcsICd0cnVuY2F0ZScsICd1bmlvbicsICd1bmlxQnknLCAndW5pcVdpdGgnLFxuICAgICd1bnNldCcsICd1bnppcFdpdGgnLCAnd2l0aG91dCcsICd3cmFwJywgJ3hvcicsICd6aXAnLCAnemlwT2JqZWN0JyxcbiAgICAnemlwT2JqZWN0RGVlcCdcbiAgXSxcbiAgJzMnOiBbXG4gICAgJ2Fzc2lnbkluV2l0aCcsICdhc3NpZ25XaXRoJywgJ2NsYW1wJywgJ2RpZmZlcmVuY2VCeScsICdkaWZmZXJlbmNlV2l0aCcsXG4gICAgJ2ZpbmRGcm9tJywgJ2ZpbmRJbmRleEZyb20nLCAnZmluZExhc3RGcm9tJywgJ2ZpbmRMYXN0SW5kZXhGcm9tJywgJ2dldE9yJyxcbiAgICAnaW5jbHVkZXNGcm9tJywgJ2luZGV4T2ZGcm9tJywgJ2luUmFuZ2UnLCAnaW50ZXJzZWN0aW9uQnknLCAnaW50ZXJzZWN0aW9uV2l0aCcsXG4gICAgJ2ludm9rZUFyZ3MnLCAnaW52b2tlQXJnc01hcCcsICdpc0VxdWFsV2l0aCcsICdpc01hdGNoV2l0aCcsICdmbGF0TWFwRGVwdGgnLFxuICAgICdsYXN0SW5kZXhPZkZyb20nLCAnbWVyZ2VXaXRoJywgJ29yZGVyQnknLCAncGFkQ2hhcnMnLCAncGFkQ2hhcnNFbmQnLFxuICAgICdwYWRDaGFyc1N0YXJ0JywgJ3B1bGxBbGxCeScsICdwdWxsQWxsV2l0aCcsICdyYW5nZVN0ZXAnLCAncmFuZ2VTdGVwUmlnaHQnLFxuICAgICdyZWR1Y2UnLCAncmVkdWNlUmlnaHQnLCAncmVwbGFjZScsICdzZXQnLCAnc2xpY2UnLCAnc29ydGVkSW5kZXhCeScsXG4gICAgJ3NvcnRlZExhc3RJbmRleEJ5JywgJ3RyYW5zZm9ybScsICd1bmlvbkJ5JywgJ3VuaW9uV2l0aCcsICd1cGRhdGUnLCAneG9yQnknLFxuICAgICd4b3JXaXRoJywgJ3ppcFdpdGgnXG4gIF0sXG4gICc0JzogW1xuICAgICdmaWxsJywgJ3NldFdpdGgnLCAndXBkYXRlV2l0aCdcbiAgXVxufTtcblxuLyoqIFVzZWQgdG8gbWFwIGFyeSB0byByZWFyZyBjb25maWdzLiAqL1xuZXhwb3J0cy5hcnlSZWFyZyA9IHtcbiAgJzInOiBbMSwgMF0sXG4gICczJzogWzIsIDAsIDFdLFxuICAnNCc6IFszLCAyLCAwLCAxXVxufTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byB0aGVpciBpdGVyYXRlZSBhcnkuICovXG5leHBvcnRzLml0ZXJhdGVlQXJ5ID0ge1xuICAnZHJvcFJpZ2h0V2hpbGUnOiAxLFxuICAnZHJvcFdoaWxlJzogMSxcbiAgJ2V2ZXJ5JzogMSxcbiAgJ2ZpbHRlcic6IDEsXG4gICdmaW5kJzogMSxcbiAgJ2ZpbmRGcm9tJzogMSxcbiAgJ2ZpbmRJbmRleCc6IDEsXG4gICdmaW5kSW5kZXhGcm9tJzogMSxcbiAgJ2ZpbmRLZXknOiAxLFxuICAnZmluZExhc3QnOiAxLFxuICAnZmluZExhc3RGcm9tJzogMSxcbiAgJ2ZpbmRMYXN0SW5kZXgnOiAxLFxuICAnZmluZExhc3RJbmRleEZyb20nOiAxLFxuICAnZmluZExhc3RLZXknOiAxLFxuICAnZmxhdE1hcCc6IDEsXG4gICdmbGF0TWFwRGVlcCc6IDEsXG4gICdmbGF0TWFwRGVwdGgnOiAxLFxuICAnZm9yRWFjaCc6IDEsXG4gICdmb3JFYWNoUmlnaHQnOiAxLFxuICAnZm9ySW4nOiAxLFxuICAnZm9ySW5SaWdodCc6IDEsXG4gICdmb3JPd24nOiAxLFxuICAnZm9yT3duUmlnaHQnOiAxLFxuICAnbWFwJzogMSxcbiAgJ21hcEtleXMnOiAxLFxuICAnbWFwVmFsdWVzJzogMSxcbiAgJ3BhcnRpdGlvbic6IDEsXG4gICdyZWR1Y2UnOiAyLFxuICAncmVkdWNlUmlnaHQnOiAyLFxuICAncmVqZWN0JzogMSxcbiAgJ3JlbW92ZSc6IDEsXG4gICdzb21lJzogMSxcbiAgJ3Rha2VSaWdodFdoaWxlJzogMSxcbiAgJ3Rha2VXaGlsZSc6IDEsXG4gICd0aW1lcyc6IDEsXG4gICd0cmFuc2Zvcm0nOiAyXG59O1xuXG4vKiogVXNlZCB0byBtYXAgbWV0aG9kIG5hbWVzIHRvIGl0ZXJhdGVlIHJlYXJnIGNvbmZpZ3MuICovXG5leHBvcnRzLml0ZXJhdGVlUmVhcmcgPSB7XG4gICdtYXBLZXlzJzogWzFdLFxuICAncmVkdWNlUmlnaHQnOiBbMSwgMF1cbn07XG5cbi8qKiBVc2VkIHRvIG1hcCBtZXRob2QgbmFtZXMgdG8gcmVhcmcgY29uZmlncy4gKi9cbmV4cG9ydHMubWV0aG9kUmVhcmcgPSB7XG4gICdhc3NpZ25JbkFsbFdpdGgnOiBbMSwgMF0sXG4gICdhc3NpZ25JbldpdGgnOiBbMSwgMiwgMF0sXG4gICdhc3NpZ25BbGxXaXRoJzogWzEsIDBdLFxuICAnYXNzaWduV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ2RpZmZlcmVuY2VCeSc6IFsxLCAyLCAwXSxcbiAgJ2RpZmZlcmVuY2VXaXRoJzogWzEsIDIsIDBdLFxuICAnZ2V0T3InOiBbMiwgMSwgMF0sXG4gICdpbnRlcnNlY3Rpb25CeSc6IFsxLCAyLCAwXSxcbiAgJ2ludGVyc2VjdGlvbldpdGgnOiBbMSwgMiwgMF0sXG4gICdpc0VxdWFsV2l0aCc6IFsxLCAyLCAwXSxcbiAgJ2lzTWF0Y2hXaXRoJzogWzIsIDEsIDBdLFxuICAnbWVyZ2VBbGxXaXRoJzogWzEsIDBdLFxuICAnbWVyZ2VXaXRoJzogWzEsIDIsIDBdLFxuICAncGFkQ2hhcnMnOiBbMiwgMSwgMF0sXG4gICdwYWRDaGFyc0VuZCc6IFsyLCAxLCAwXSxcbiAgJ3BhZENoYXJzU3RhcnQnOiBbMiwgMSwgMF0sXG4gICdwdWxsQWxsQnknOiBbMiwgMSwgMF0sXG4gICdwdWxsQWxsV2l0aCc6IFsyLCAxLCAwXSxcbiAgJ3JhbmdlU3RlcCc6IFsxLCAyLCAwXSxcbiAgJ3JhbmdlU3RlcFJpZ2h0JzogWzEsIDIsIDBdLFxuICAnc2V0V2l0aCc6IFszLCAxLCAyLCAwXSxcbiAgJ3NvcnRlZEluZGV4QnknOiBbMiwgMSwgMF0sXG4gICdzb3J0ZWRMYXN0SW5kZXhCeSc6IFsyLCAxLCAwXSxcbiAgJ3VuaW9uQnknOiBbMSwgMiwgMF0sXG4gICd1bmlvbldpdGgnOiBbMSwgMiwgMF0sXG4gICd1cGRhdGVXaXRoJzogWzMsIDEsIDIsIDBdLFxuICAneG9yQnknOiBbMSwgMiwgMF0sXG4gICd4b3JXaXRoJzogWzEsIDIsIDBdLFxuICAnemlwV2l0aCc6IFsxLCAyLCAwXVxufTtcblxuLyoqIFVzZWQgdG8gbWFwIG1ldGhvZCBuYW1lcyB0byBzcHJlYWQgY29uZmlncy4gKi9cbmV4cG9ydHMubWV0aG9kU3ByZWFkID0ge1xuICAnYXNzaWduQWxsJzogeyAnc3RhcnQnOiAwIH0sXG4gICdhc3NpZ25BbGxXaXRoJzogeyAnc3RhcnQnOiAwIH0sXG4gICdhc3NpZ25JbkFsbCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAnYXNzaWduSW5BbGxXaXRoJzogeyAnc3RhcnQnOiAwIH0sXG4gICdkZWZhdWx0c0FsbCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAnZGVmYXVsdHNEZWVwQWxsJzogeyAnc3RhcnQnOiAwIH0sXG4gICdpbnZva2VBcmdzJzogeyAnc3RhcnQnOiAyIH0sXG4gICdpbnZva2VBcmdzTWFwJzogeyAnc3RhcnQnOiAyIH0sXG4gICdtZXJnZUFsbCc6IHsgJ3N0YXJ0JzogMCB9LFxuICAnbWVyZ2VBbGxXaXRoJzogeyAnc3RhcnQnOiAwIH0sXG4gICdwYXJ0aWFsJzogeyAnc3RhcnQnOiAxIH0sXG4gICdwYXJ0aWFsUmlnaHQnOiB7ICdzdGFydCc6IDEgfSxcbiAgJ3dpdGhvdXQnOiB7ICdzdGFydCc6IDEgfSxcbiAgJ3ppcEFsbCc6IHsgJ3N0YXJ0JzogMCB9XG59O1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBtZXRob2RzIHdoaWNoIG11dGF0ZSBhcnJheXMgb3Igb2JqZWN0cy4gKi9cbmV4cG9ydHMubXV0YXRlID0ge1xuICAnYXJyYXknOiB7XG4gICAgJ2ZpbGwnOiB0cnVlLFxuICAgICdwdWxsJzogdHJ1ZSxcbiAgICAncHVsbEFsbCc6IHRydWUsXG4gICAgJ3B1bGxBbGxCeSc6IHRydWUsXG4gICAgJ3B1bGxBbGxXaXRoJzogdHJ1ZSxcbiAgICAncHVsbEF0JzogdHJ1ZSxcbiAgICAncmVtb3ZlJzogdHJ1ZSxcbiAgICAncmV2ZXJzZSc6IHRydWVcbiAgfSxcbiAgJ29iamVjdCc6IHtcbiAgICAnYXNzaWduJzogdHJ1ZSxcbiAgICAnYXNzaWduQWxsJzogdHJ1ZSxcbiAgICAnYXNzaWduQWxsV2l0aCc6IHRydWUsXG4gICAgJ2Fzc2lnbkluJzogdHJ1ZSxcbiAgICAnYXNzaWduSW5BbGwnOiB0cnVlLFxuICAgICdhc3NpZ25JbkFsbFdpdGgnOiB0cnVlLFxuICAgICdhc3NpZ25JbldpdGgnOiB0cnVlLFxuICAgICdhc3NpZ25XaXRoJzogdHJ1ZSxcbiAgICAnZGVmYXVsdHMnOiB0cnVlLFxuICAgICdkZWZhdWx0c0FsbCc6IHRydWUsXG4gICAgJ2RlZmF1bHRzRGVlcCc6IHRydWUsXG4gICAgJ2RlZmF1bHRzRGVlcEFsbCc6IHRydWUsXG4gICAgJ21lcmdlJzogdHJ1ZSxcbiAgICAnbWVyZ2VBbGwnOiB0cnVlLFxuICAgICdtZXJnZUFsbFdpdGgnOiB0cnVlLFxuICAgICdtZXJnZVdpdGgnOiB0cnVlLFxuICB9LFxuICAnc2V0Jzoge1xuICAgICdzZXQnOiB0cnVlLFxuICAgICdzZXRXaXRoJzogdHJ1ZSxcbiAgICAndW5zZXQnOiB0cnVlLFxuICAgICd1cGRhdGUnOiB0cnVlLFxuICAgICd1cGRhdGVXaXRoJzogdHJ1ZVxuICB9XG59O1xuXG4vKiogVXNlZCB0byBtYXAgcmVhbCBuYW1lcyB0byB0aGVpciBhbGlhc2VzLiAqL1xuZXhwb3J0cy5yZWFsVG9BbGlhcyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgIG9iamVjdCA9IGV4cG9ydHMuYWxpYXNUb1JlYWwsXG4gICAgICByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgIHJlc3VsdFt2YWx1ZV0ucHVzaChrZXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRbdmFsdWVdID0gW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59KCkpO1xuXG4vKiogVXNlZCB0byBtYXAgbWV0aG9kIG5hbWVzIHRvIG90aGVyIG5hbWVzLiAqL1xuZXhwb3J0cy5yZW1hcCA9IHtcbiAgJ2Fzc2lnbkFsbCc6ICdhc3NpZ24nLFxuICAnYXNzaWduQWxsV2l0aCc6ICdhc3NpZ25XaXRoJyxcbiAgJ2Fzc2lnbkluQWxsJzogJ2Fzc2lnbkluJyxcbiAgJ2Fzc2lnbkluQWxsV2l0aCc6ICdhc3NpZ25JbldpdGgnLFxuICAnY3VycnlOJzogJ2N1cnJ5JyxcbiAgJ2N1cnJ5UmlnaHROJzogJ2N1cnJ5UmlnaHQnLFxuICAnZGVmYXVsdHNBbGwnOiAnZGVmYXVsdHMnLFxuICAnZGVmYXVsdHNEZWVwQWxsJzogJ2RlZmF1bHRzRGVlcCcsXG4gICdmaW5kRnJvbSc6ICdmaW5kJyxcbiAgJ2ZpbmRJbmRleEZyb20nOiAnZmluZEluZGV4JyxcbiAgJ2ZpbmRMYXN0RnJvbSc6ICdmaW5kTGFzdCcsXG4gICdmaW5kTGFzdEluZGV4RnJvbSc6ICdmaW5kTGFzdEluZGV4JyxcbiAgJ2dldE9yJzogJ2dldCcsXG4gICdpbmNsdWRlc0Zyb20nOiAnaW5jbHVkZXMnLFxuICAnaW5kZXhPZkZyb20nOiAnaW5kZXhPZicsXG4gICdpbnZva2VBcmdzJzogJ2ludm9rZScsXG4gICdpbnZva2VBcmdzTWFwJzogJ2ludm9rZU1hcCcsXG4gICdsYXN0SW5kZXhPZkZyb20nOiAnbGFzdEluZGV4T2YnLFxuICAnbWVyZ2VBbGwnOiAnbWVyZ2UnLFxuICAnbWVyZ2VBbGxXaXRoJzogJ21lcmdlV2l0aCcsXG4gICdwYWRDaGFycyc6ICdwYWQnLFxuICAncGFkQ2hhcnNFbmQnOiAncGFkRW5kJyxcbiAgJ3BhZENoYXJzU3RhcnQnOiAncGFkU3RhcnQnLFxuICAncHJvcGVydHlPZic6ICdnZXQnLFxuICAncmFuZ2VTdGVwJzogJ3JhbmdlJyxcbiAgJ3JhbmdlU3RlcFJpZ2h0JzogJ3JhbmdlUmlnaHQnLFxuICAncmVzdEZyb20nOiAncmVzdCcsXG4gICdzcHJlYWRGcm9tJzogJ3NwcmVhZCcsXG4gICd0cmltQ2hhcnMnOiAndHJpbScsXG4gICd0cmltQ2hhcnNFbmQnOiAndHJpbUVuZCcsXG4gICd0cmltQ2hhcnNTdGFydCc6ICd0cmltU3RhcnQnLFxuICAnemlwQWxsJzogJ3ppcCdcbn07XG5cbi8qKiBVc2VkIHRvIHRyYWNrIG1ldGhvZHMgdGhhdCBza2lwIGZpeGluZyB0aGVpciBhcml0eS4gKi9cbmV4cG9ydHMuc2tpcEZpeGVkID0ge1xuICAnY2FzdEFycmF5JzogdHJ1ZSxcbiAgJ2Zsb3cnOiB0cnVlLFxuICAnZmxvd1JpZ2h0JzogdHJ1ZSxcbiAgJ2l0ZXJhdGVlJzogdHJ1ZSxcbiAgJ21peGluJzogdHJ1ZSxcbiAgJ3JlYXJnJzogdHJ1ZSxcbiAgJ3J1bkluQ29udGV4dCc6IHRydWVcbn07XG5cbi8qKiBVc2VkIHRvIHRyYWNrIG1ldGhvZHMgdGhhdCBza2lwIHJlYXJyYW5naW5nIGFyZ3VtZW50cy4gKi9cbmV4cG9ydHMuc2tpcFJlYXJnID0ge1xuICAnYWRkJzogdHJ1ZSxcbiAgJ2Fzc2lnbic6IHRydWUsXG4gICdhc3NpZ25Jbic6IHRydWUsXG4gICdiaW5kJzogdHJ1ZSxcbiAgJ2JpbmRLZXknOiB0cnVlLFxuICAnY29uY2F0JzogdHJ1ZSxcbiAgJ2RpZmZlcmVuY2UnOiB0cnVlLFxuICAnZGl2aWRlJzogdHJ1ZSxcbiAgJ2VxJzogdHJ1ZSxcbiAgJ2d0JzogdHJ1ZSxcbiAgJ2d0ZSc6IHRydWUsXG4gICdpc0VxdWFsJzogdHJ1ZSxcbiAgJ2x0JzogdHJ1ZSxcbiAgJ2x0ZSc6IHRydWUsXG4gICdtYXRjaGVzUHJvcGVydHknOiB0cnVlLFxuICAnbWVyZ2UnOiB0cnVlLFxuICAnbXVsdGlwbHknOiB0cnVlLFxuICAnb3ZlckFyZ3MnOiB0cnVlLFxuICAncGFydGlhbCc6IHRydWUsXG4gICdwYXJ0aWFsUmlnaHQnOiB0cnVlLFxuICAncHJvcGVydHlPZic6IHRydWUsXG4gICdyYW5kb20nOiB0cnVlLFxuICAncmFuZ2UnOiB0cnVlLFxuICAncmFuZ2VSaWdodCc6IHRydWUsXG4gICdzdWJ0cmFjdCc6IHRydWUsXG4gICd6aXAnOiB0cnVlLFxuICAnemlwT2JqZWN0JzogdHJ1ZSxcbiAgJ3ppcE9iamVjdERlZXAnOiB0cnVlXG59O1xuIiwiLyoqXG4gKiBUaGUgZGVmYXVsdCBhcmd1bWVudCBwbGFjZWhvbGRlciB2YWx1ZSBmb3IgbWV0aG9kcy5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwidmFyIG1hcHBpbmcgPSByZXF1aXJlKCcuL19tYXBwaW5nJyksXG4gICAgZmFsbGJhY2tIb2xkZXIgPSByZXF1aXJlKCcuL3BsYWNlaG9sZGVyJyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2UuICovXG52YXIgcHVzaCA9IEFycmF5LnByb3RvdHlwZS5wdXNoO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiwgd2l0aCBhbiBhcml0eSBvZiBgbmAsIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGVcbiAqIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBvZiB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBcml0eShmdW5jLCBuKSB7XG4gIHJldHVybiBuID09IDJcbiAgICA/IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpOyB9XG4gICAgOiBmdW5jdGlvbihhKSB7IHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTsgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCwgd2l0aCB1cCB0byBgbmAgYXJndW1lbnRzLCBpZ25vcmluZ1xuICogYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBjYXAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFyeShmdW5jLCBuKSB7XG4gIHJldHVybiBuID09IDJcbiAgICA/IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGZ1bmMoYSwgYik7IH1cbiAgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGZ1bmMoYSk7IH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHJlc3VsdFtsZW5ndGhdID0gYXJyYXlbbGVuZ3RoXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGNsb25lcyBhIGdpdmVuIG9iamVjdCB1c2luZyB0aGUgYXNzaWdubWVudCBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGFzc2lnbm1lbnQgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjbG9uZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNsb25lcihmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gZnVuYyh7fSwgb2JqZWN0KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc3ByZWFkYCB3aGljaCBmbGF0dGVucyB0aGUgc3ByZWFkIGFycmF5IGludG9cbiAqIHRoZSBhcmd1bWVudHMgb2YgdGhlIGludm9rZWQgYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBzcHJlYWQgYXJndW1lbnRzIG92ZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSBzcHJlYWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZmxhdFNwcmVhZChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDEsXG4gICAgICAgIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICBhcmdzW2xlbmd0aF0gPSBhcmd1bWVudHNbbGVuZ3RoXTtcbiAgICB9XG4gICAgdmFyIGFycmF5ID0gYXJnc1tzdGFydF0sXG4gICAgICAgIG90aGVyQXJncyA9IGFyZ3Muc2xpY2UoMCwgc3RhcnQpO1xuXG4gICAgaWYgKGFycmF5KSB7XG4gICAgICBwdXNoLmFwcGx5KG90aGVyQXJncywgYXJyYXkpO1xuICAgIH1cbiAgICBpZiAoc3RhcnQgIT0gbGFzdEluZGV4KSB7XG4gICAgICBwdXNoLmFwcGx5KG90aGVyQXJncywgYXJncy5zbGljZShzdGFydCArIDEpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgYW5kIHVzZXMgYGNsb25lcmAgdG8gY2xvbmUgdGhlIGZpcnN0XG4gKiBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lciBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgYXJndW1lbnRzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgaW1tdXRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiB3cmFwSW1tdXRhYmxlKGZ1bmMsIGNsb25lcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgYXJnc1tsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBhcmdzWzBdID0gY2xvbmVyLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGNvbnZlcnRgIHdoaWNoIGFjY2VwdHMgYSBgdXRpbGAgb2JqZWN0IG9mIG1ldGhvZHNcbiAqIHJlcXVpcmVkIHRvIHBlcmZvcm0gY29udmVyc2lvbnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHV0aWwgVGhlIHV0aWwgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmNhcD10cnVlXSBTcGVjaWZ5IGNhcHBpbmcgaXRlcmF0ZWUgYXJndW1lbnRzLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jdXJyeT10cnVlXSBTcGVjaWZ5IGN1cnJ5aW5nLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5maXhlZD10cnVlXSBTcGVjaWZ5IGZpeGVkIGFyaXR5LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5pbW11dGFibGU9dHJ1ZV0gU3BlY2lmeSBpbW11dGFibGUgb3BlcmF0aW9ucy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMucmVhcmc9dHJ1ZV0gU3BlY2lmeSByZWFycmFuZ2luZyBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb258T2JqZWN0fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgZnVuY3Rpb24gb3Igb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlQ29udmVydCh1dGlsLCBuYW1lLCBmdW5jLCBvcHRpb25zKSB7XG4gIHZhciBpc0xpYiA9IHR5cGVvZiBuYW1lID09ICdmdW5jdGlvbicsXG4gICAgICBpc09iaiA9IG5hbWUgPT09IE9iamVjdChuYW1lKTtcblxuICBpZiAoaXNPYmopIHtcbiAgICBvcHRpb25zID0gZnVuYztcbiAgICBmdW5jID0gbmFtZTtcbiAgICBuYW1lID0gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChmdW5jID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICB9XG4gIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cbiAgdmFyIGNvbmZpZyA9IHtcbiAgICAnY2FwJzogJ2NhcCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuY2FwIDogdHJ1ZSxcbiAgICAnY3VycnknOiAnY3VycnknIGluIG9wdGlvbnMgPyBvcHRpb25zLmN1cnJ5IDogdHJ1ZSxcbiAgICAnZml4ZWQnOiAnZml4ZWQnIGluIG9wdGlvbnMgPyBvcHRpb25zLmZpeGVkIDogdHJ1ZSxcbiAgICAnaW1tdXRhYmxlJzogJ2ltbXV0YWJsZScgaW4gb3B0aW9ucyA/IG9wdGlvbnMuaW1tdXRhYmxlIDogdHJ1ZSxcbiAgICAncmVhcmcnOiAncmVhcmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLnJlYXJnIDogdHJ1ZVxuICB9O1xuXG4gIHZhciBkZWZhdWx0SG9sZGVyID0gaXNMaWIgPyBmdW5jIDogZmFsbGJhY2tIb2xkZXIsXG4gICAgICBmb3JjZUN1cnJ5ID0gKCdjdXJyeScgaW4gb3B0aW9ucykgJiYgb3B0aW9ucy5jdXJyeSxcbiAgICAgIGZvcmNlRml4ZWQgPSAoJ2ZpeGVkJyBpbiBvcHRpb25zKSAmJiBvcHRpb25zLmZpeGVkLFxuICAgICAgZm9yY2VSZWFyZyA9ICgncmVhcmcnIGluIG9wdGlvbnMpICYmIG9wdGlvbnMucmVhcmcsXG4gICAgICBwcmlzdGluZSA9IGlzTGliID8gZnVuYy5ydW5JbkNvbnRleHQoKSA6IHVuZGVmaW5lZDtcblxuICB2YXIgaGVscGVycyA9IGlzTGliID8gZnVuYyA6IHtcbiAgICAnYXJ5JzogdXRpbC5hcnksXG4gICAgJ2Fzc2lnbic6IHV0aWwuYXNzaWduLFxuICAgICdjbG9uZSc6IHV0aWwuY2xvbmUsXG4gICAgJ2N1cnJ5JzogdXRpbC5jdXJyeSxcbiAgICAnZm9yRWFjaCc6IHV0aWwuZm9yRWFjaCxcbiAgICAnaXNBcnJheSc6IHV0aWwuaXNBcnJheSxcbiAgICAnaXNFcnJvcic6IHV0aWwuaXNFcnJvcixcbiAgICAnaXNGdW5jdGlvbic6IHV0aWwuaXNGdW5jdGlvbixcbiAgICAnaXNXZWFrTWFwJzogdXRpbC5pc1dlYWtNYXAsXG4gICAgJ2l0ZXJhdGVlJzogdXRpbC5pdGVyYXRlZSxcbiAgICAna2V5cyc6IHV0aWwua2V5cyxcbiAgICAncmVhcmcnOiB1dGlsLnJlYXJnLFxuICAgICd0b0ludGVnZXInOiB1dGlsLnRvSW50ZWdlcixcbiAgICAndG9QYXRoJzogdXRpbC50b1BhdGhcbiAgfTtcblxuICB2YXIgYXJ5ID0gaGVscGVycy5hcnksXG4gICAgICBhc3NpZ24gPSBoZWxwZXJzLmFzc2lnbixcbiAgICAgIGNsb25lID0gaGVscGVycy5jbG9uZSxcbiAgICAgIGN1cnJ5ID0gaGVscGVycy5jdXJyeSxcbiAgICAgIGVhY2ggPSBoZWxwZXJzLmZvckVhY2gsXG4gICAgICBpc0FycmF5ID0gaGVscGVycy5pc0FycmF5LFxuICAgICAgaXNFcnJvciA9IGhlbHBlcnMuaXNFcnJvcixcbiAgICAgIGlzRnVuY3Rpb24gPSBoZWxwZXJzLmlzRnVuY3Rpb24sXG4gICAgICBpc1dlYWtNYXAgPSBoZWxwZXJzLmlzV2Vha01hcCxcbiAgICAgIGtleXMgPSBoZWxwZXJzLmtleXMsXG4gICAgICByZWFyZyA9IGhlbHBlcnMucmVhcmcsXG4gICAgICB0b0ludGVnZXIgPSBoZWxwZXJzLnRvSW50ZWdlcixcbiAgICAgIHRvUGF0aCA9IGhlbHBlcnMudG9QYXRoO1xuXG4gIHZhciBhcnlNZXRob2RLZXlzID0ga2V5cyhtYXBwaW5nLmFyeU1ldGhvZCk7XG5cbiAgdmFyIHdyYXBwZXJzID0ge1xuICAgICdjYXN0QXJyYXknOiBmdW5jdGlvbihjYXN0QXJyYXkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICA/IGNhc3RBcnJheShjbG9uZUFycmF5KHZhbHVlKSlcbiAgICAgICAgICA6IGNhc3RBcnJheS5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0sXG4gICAgJ2l0ZXJhdGVlJzogZnVuY3Rpb24oaXRlcmF0ZWUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBhcmd1bWVudHNbMF0sXG4gICAgICAgICAgICBhcml0eSA9IGFyZ3VtZW50c1sxXSxcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZXJhdGVlKGZ1bmMsIGFyaXR5KSxcbiAgICAgICAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5jYXAgJiYgdHlwZW9mIGFyaXR5ID09ICdudW1iZXInKSB7XG4gICAgICAgICAgYXJpdHkgPSBhcml0eSA+IDIgPyAoYXJpdHkgLSAyKSA6IDE7XG4gICAgICAgICAgcmV0dXJuIChsZW5ndGggJiYgbGVuZ3RoIDw9IGFyaXR5KSA/IHJlc3VsdCA6IGJhc2VBcnkocmVzdWx0LCBhcml0eSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfSxcbiAgICAnbWl4aW4nOiBmdW5jdGlvbihtaXhpbikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICB2YXIgZnVuYyA9IHRoaXM7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICAgIHJldHVybiBtaXhpbihmdW5jLCBPYmplY3Qoc291cmNlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhaXJzID0gW107XG4gICAgICAgIGVhY2goa2V5cyhzb3VyY2UpLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICBpZiAoaXNGdW5jdGlvbihzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgICAgIHBhaXJzLnB1c2goW2tleSwgZnVuYy5wcm90b3R5cGVba2V5XV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWl4aW4oZnVuYywgT2JqZWN0KHNvdXJjZSkpO1xuXG4gICAgICAgIGVhY2gocGFpcnMsIGZ1bmN0aW9uKHBhaXIpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBwYWlyWzFdO1xuICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgICAgZnVuYy5wcm90b3R5cGVbcGFpclswXV0gPSB2YWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGZ1bmMucHJvdG90eXBlW3BhaXJbMF1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgfTtcbiAgICB9LFxuICAgICdudGhBcmcnOiBmdW5jdGlvbihudGhBcmcpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihuKSB7XG4gICAgICAgIHZhciBhcml0eSA9IG4gPCAwID8gMSA6ICh0b0ludGVnZXIobikgKyAxKTtcbiAgICAgICAgcmV0dXJuIGN1cnJ5KG50aEFyZyhuKSwgYXJpdHkpO1xuICAgICAgfTtcbiAgICB9LFxuICAgICdyZWFyZyc6IGZ1bmN0aW9uKHJlYXJnKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZnVuYywgaW5kZXhlcykge1xuICAgICAgICB2YXIgYXJpdHkgPSBpbmRleGVzID8gaW5kZXhlcy5sZW5ndGggOiAwO1xuICAgICAgICByZXR1cm4gY3VycnkocmVhcmcoZnVuYywgaW5kZXhlcyksIGFyaXR5KTtcbiAgICAgIH07XG4gICAgfSxcbiAgICAncnVuSW5Db250ZXh0JzogZnVuY3Rpb24ocnVuSW5Db250ZXh0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gYmFzZUNvbnZlcnQodXRpbCwgcnVuSW5Db250ZXh0KGNvbnRleHQpLCBvcHRpb25zKTtcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDYXN0cyBgZnVuY2AgdG8gYSBmdW5jdGlvbiB3aXRoIGFuIGFyaXR5IGNhcHBlZCBpdGVyYXRlZSBpZiBuZWVkZWQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byBpbnNwZWN0LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnNwZWN0LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhc3QgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjYXN0Q2FwKG5hbWUsIGZ1bmMpIHtcbiAgICBpZiAoY29uZmlnLmNhcCkge1xuICAgICAgdmFyIGluZGV4ZXMgPSBtYXBwaW5nLml0ZXJhdGVlUmVhcmdbbmFtZV07XG4gICAgICBpZiAoaW5kZXhlcykge1xuICAgICAgICByZXR1cm4gaXRlcmF0ZWVSZWFyZyhmdW5jLCBpbmRleGVzKTtcbiAgICAgIH1cbiAgICAgIHZhciBuID0gIWlzTGliICYmIG1hcHBpbmcuaXRlcmF0ZWVBcnlbbmFtZV07XG4gICAgICBpZiAobikge1xuICAgICAgICByZXR1cm4gaXRlcmF0ZWVBcnkoZnVuYywgbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdW5jO1xuICB9XG5cbiAgLyoqXG4gICAqIENhc3RzIGBmdW5jYCB0byBhIGN1cnJpZWQgZnVuY3Rpb24gaWYgbmVlZGVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIGFyaXR5IG9mIGBmdW5jYC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYXN0IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FzdEN1cnJ5KG5hbWUsIGZ1bmMsIG4pIHtcbiAgICByZXR1cm4gKGZvcmNlQ3VycnkgfHwgKGNvbmZpZy5jdXJyeSAmJiBuID4gMSkpXG4gICAgICA/IGN1cnJ5KGZ1bmMsIG4pXG4gICAgICA6IGZ1bmM7XG4gIH1cblxuICAvKipcbiAgICogQ2FzdHMgYGZ1bmNgIHRvIGEgZml4ZWQgYXJpdHkgZnVuY3Rpb24gaWYgbmVlZGVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW5zcGVjdC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIGFyaXR5IGNhcC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYXN0IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FzdEZpeGVkKG5hbWUsIGZ1bmMsIG4pIHtcbiAgICBpZiAoY29uZmlnLmZpeGVkICYmIChmb3JjZUZpeGVkIHx8ICFtYXBwaW5nLnNraXBGaXhlZFtuYW1lXSkpIHtcbiAgICAgIHZhciBkYXRhID0gbWFwcGluZy5tZXRob2RTcHJlYWRbbmFtZV0sXG4gICAgICAgICAgc3RhcnQgPSBkYXRhICYmIGRhdGEuc3RhcnQ7XG5cbiAgICAgIHJldHVybiBzdGFydCAgPT09IHVuZGVmaW5lZCA/IGFyeShmdW5jLCBuKSA6IGZsYXRTcHJlYWQoZnVuYywgc3RhcnQpO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYXN0cyBgZnVuY2AgdG8gYW4gcmVhcmdlZCBmdW5jdGlvbiBpZiBuZWVkZWQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byBpbnNwZWN0LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnNwZWN0LlxuICAgKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhc3QgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjYXN0UmVhcmcobmFtZSwgZnVuYywgbikge1xuICAgIHJldHVybiAoY29uZmlnLnJlYXJnICYmIG4gPiAxICYmIChmb3JjZVJlYXJnIHx8ICFtYXBwaW5nLnNraXBSZWFyZ1tuYW1lXSkpXG4gICAgICA/IHJlYXJnKGZ1bmMsIG1hcHBpbmcubWV0aG9kUmVhcmdbbmFtZV0gfHwgbWFwcGluZy5hcnlSZWFyZ1tuXSlcbiAgICAgIDogZnVuYztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgYG9iamVjdGAgYnkgYHBhdGhgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gICAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNsb25lIGJ5LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gY2xvbmVCeVBhdGgob2JqZWN0LCBwYXRoKSB7XG4gICAgcGF0aCA9IHRvUGF0aChwYXRoKTtcblxuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgICAgbGFzdEluZGV4ID0gbGVuZ3RoIC0gMSxcbiAgICAgICAgcmVzdWx0ID0gY2xvbmUoT2JqZWN0KG9iamVjdCkpLFxuICAgICAgICBuZXN0ZWQgPSByZXN1bHQ7XG5cbiAgICB3aGlsZSAobmVzdGVkICE9IG51bGwgJiYgKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIGtleSA9IHBhdGhbaW5kZXhdLFxuICAgICAgICAgIHZhbHVlID0gbmVzdGVkW2tleV07XG5cbiAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmXG4gICAgICAgICAgIShpc0Z1bmN0aW9uKHZhbHVlKSB8fCBpc0Vycm9yKHZhbHVlKSB8fCBpc1dlYWtNYXAodmFsdWUpKSkge1xuICAgICAgICBuZXN0ZWRba2V5XSA9IGNsb25lKGluZGV4ID09IGxhc3RJbmRleCA/IHZhbHVlIDogT2JqZWN0KHZhbHVlKSk7XG4gICAgICB9XG4gICAgICBuZXN0ZWQgPSBuZXN0ZWRba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgbG9kYXNoYCB0byBhbiBpbW11dGFibGUgYXV0by1jdXJyaWVkIGl0ZXJhdGVlLWZpcnN0IGRhdGEtbGFzdFxuICAgKiB2ZXJzaW9uIHdpdGggY29udmVyc2lvbiBgb3B0aW9uc2AgYXBwbGllZC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuIFNlZSBgYmFzZUNvbnZlcnRgIGZvciBtb3JlIGRldGFpbHMuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY29udmVydGVkIGBsb2Rhc2hgLlxuICAgKi9cbiAgZnVuY3Rpb24gY29udmVydExpYihvcHRpb25zKSB7XG4gICAgcmV0dXJuIF8ucnVuSW5Db250ZXh0LmNvbnZlcnQob3B0aW9ucykodW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBjb252ZXJ0ZXIgZnVuY3Rpb24gZm9yIGBmdW5jYCBvZiBgbmFtZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb252ZXJ0ZXIgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVDb252ZXJ0ZXIobmFtZSwgZnVuYykge1xuICAgIHZhciByZWFsTmFtZSA9IG1hcHBpbmcuYWxpYXNUb1JlYWxbbmFtZV0gfHwgbmFtZSxcbiAgICAgICAgbWV0aG9kTmFtZSA9IG1hcHBpbmcucmVtYXBbcmVhbE5hbWVdIHx8IHJlYWxOYW1lLFxuICAgICAgICBvbGRPcHRpb25zID0gb3B0aW9ucztcblxuICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgbmV3VXRpbCA9IGlzTGliID8gcHJpc3RpbmUgOiBoZWxwZXJzLFxuICAgICAgICAgIG5ld0Z1bmMgPSBpc0xpYiA/IHByaXN0aW5lW21ldGhvZE5hbWVdIDogZnVuYyxcbiAgICAgICAgICBuZXdPcHRpb25zID0gYXNzaWduKGFzc2lnbih7fSwgb2xkT3B0aW9ucyksIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gYmFzZUNvbnZlcnQobmV3VXRpbCwgcmVhbE5hbWUsIG5ld0Z1bmMsIG5ld09wdGlvbnMpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIHRvIGludm9rZSBpdHMgaXRlcmF0ZWUsIHdpdGggdXAgdG8gYG5gXG4gICAqIGFyZ3VtZW50cywgaWdub3JpbmcgYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgaXRlcmF0ZWUgYXJndW1lbnRzIGZvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIGFyaXR5IGNhcC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBpdGVyYXRlZUFyeShmdW5jLCBuKSB7XG4gICAgcmV0dXJuIG92ZXJBcmcoZnVuYywgZnVuY3Rpb24oZnVuYykge1xuICAgICAgcmV0dXJuIHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbicgPyBiYXNlQXJ5KGZ1bmMsIG4pIDogZnVuYztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gaW52b2tlIGl0cyBpdGVyYXRlZSB3aXRoIGFyZ3VtZW50c1xuICAgKiBhcnJhbmdlZCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCBgaW5kZXhlc2Agd2hlcmUgdGhlIGFyZ3VtZW50IHZhbHVlIGF0XG4gICAqIHRoZSBmaXJzdCBpbmRleCBpcyBwcm92aWRlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQsIHRoZSBhcmd1bWVudCB2YWx1ZSBhdFxuICAgKiB0aGUgc2Vjb25kIGluZGV4IGlzIHByb3ZpZGVkIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQsIGFuZCBzbyBvbi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVhcnJhbmdlIGl0ZXJhdGVlIGFyZ3VtZW50cyBmb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IGluZGV4ZXMgVGhlIGFycmFuZ2VkIGFyZ3VtZW50IGluZGV4ZXMuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gaXRlcmF0ZWVSZWFyZyhmdW5jLCBpbmRleGVzKSB7XG4gICAgcmV0dXJuIG92ZXJBcmcoZnVuYywgZnVuY3Rpb24oZnVuYykge1xuICAgICAgdmFyIG4gPSBpbmRleGVzLmxlbmd0aDtcbiAgICAgIHJldHVybiBiYXNlQXJpdHkocmVhcmcoYmFzZUFyeShmdW5jLCBuKSwgaW5kZXhlcyksIG4pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGZpcnN0IGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMoKTtcbiAgICAgIH1cbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBhcmdzW2xlbmd0aF0gPSBhcmd1bWVudHNbbGVuZ3RoXTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IGNvbmZpZy5yZWFyZyA/IDAgOiAobGVuZ3RoIC0gMSk7XG4gICAgICBhcmdzW2luZGV4XSA9IHRyYW5zZm9ybShhcmdzW2luZGV4XSk7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIGFuZCBhcHBseXMgdGhlIGNvbnZlcnNpb25zXG4gICAqIHJ1bGVzIGJ5IGBuYW1lYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY29udmVydGVkIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcChuYW1lLCBmdW5jLCBwbGFjZWhvbGRlcikge1xuICAgIHZhciByZXN1bHQsXG4gICAgICAgIHJlYWxOYW1lID0gbWFwcGluZy5hbGlhc1RvUmVhbFtuYW1lXSB8fCBuYW1lLFxuICAgICAgICB3cmFwcGVkID0gZnVuYyxcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzW3JlYWxOYW1lXTtcblxuICAgIGlmICh3cmFwcGVyKSB7XG4gICAgICB3cmFwcGVkID0gd3JhcHBlcihmdW5jKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY29uZmlnLmltbXV0YWJsZSkge1xuICAgICAgaWYgKG1hcHBpbmcubXV0YXRlLmFycmF5W3JlYWxOYW1lXSkge1xuICAgICAgICB3cmFwcGVkID0gd3JhcEltbXV0YWJsZShmdW5jLCBjbG9uZUFycmF5KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG1hcHBpbmcubXV0YXRlLm9iamVjdFtyZWFsTmFtZV0pIHtcbiAgICAgICAgd3JhcHBlZCA9IHdyYXBJbW11dGFibGUoZnVuYywgY3JlYXRlQ2xvbmVyKGZ1bmMpKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG1hcHBpbmcubXV0YXRlLnNldFtyZWFsTmFtZV0pIHtcbiAgICAgICAgd3JhcHBlZCA9IHdyYXBJbW11dGFibGUoZnVuYywgY2xvbmVCeVBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlYWNoKGFyeU1ldGhvZEtleXMsIGZ1bmN0aW9uKGFyeUtleSkge1xuICAgICAgZWFjaChtYXBwaW5nLmFyeU1ldGhvZFthcnlLZXldLCBmdW5jdGlvbihvdGhlck5hbWUpIHtcbiAgICAgICAgaWYgKHJlYWxOYW1lID09IG90aGVyTmFtZSkge1xuICAgICAgICAgIHZhciBkYXRhID0gbWFwcGluZy5tZXRob2RTcHJlYWRbcmVhbE5hbWVdLFxuICAgICAgICAgICAgICBhZnRlclJlYXJnID0gZGF0YSAmJiBkYXRhLmFmdGVyUmVhcmc7XG5cbiAgICAgICAgICByZXN1bHQgPSBhZnRlclJlYXJnXG4gICAgICAgICAgICA/IGNhc3RGaXhlZChyZWFsTmFtZSwgY2FzdFJlYXJnKHJlYWxOYW1lLCB3cmFwcGVkLCBhcnlLZXkpLCBhcnlLZXkpXG4gICAgICAgICAgICA6IGNhc3RSZWFyZyhyZWFsTmFtZSwgY2FzdEZpeGVkKHJlYWxOYW1lLCB3cmFwcGVkLCBhcnlLZXkpLCBhcnlLZXkpO1xuXG4gICAgICAgICAgcmVzdWx0ID0gY2FzdENhcChyZWFsTmFtZSwgcmVzdWx0KTtcbiAgICAgICAgICByZXN1bHQgPSBjYXN0Q3VycnkocmVhbE5hbWUsIHJlc3VsdCwgYXJ5S2V5KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuICFyZXN1bHQ7XG4gICAgfSk7XG5cbiAgICByZXN1bHQgfHwgKHJlc3VsdCA9IHdyYXBwZWQpO1xuICAgIGlmIChyZXN1bHQgPT0gZnVuYykge1xuICAgICAgcmVzdWx0ID0gZm9yY2VDdXJyeSA/IGN1cnJ5KHJlc3VsdCwgMSkgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJlc3VsdC5jb252ZXJ0ID0gY3JlYXRlQ29udmVydGVyKHJlYWxOYW1lLCBmdW5jKTtcbiAgICByZXN1bHQucGxhY2Vob2xkZXIgPSBmdW5jLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgaWYgKCFpc09iaikge1xuICAgIHJldHVybiB3cmFwKG5hbWUsIGZ1bmMsIGRlZmF1bHRIb2xkZXIpO1xuICB9XG4gIHZhciBfID0gZnVuYztcblxuICAvLyBDb252ZXJ0IG1ldGhvZHMgYnkgYXJ5IGNhcC5cbiAgdmFyIHBhaXJzID0gW107XG4gIGVhY2goYXJ5TWV0aG9kS2V5cywgZnVuY3Rpb24oYXJ5S2V5KSB7XG4gICAgZWFjaChtYXBwaW5nLmFyeU1ldGhvZFthcnlLZXldLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBmdW5jID0gX1ttYXBwaW5nLnJlbWFwW2tleV0gfHwga2V5XTtcbiAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgIHBhaXJzLnB1c2goW2tleSwgd3JhcChrZXksIGZ1bmMsIF8pXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIENvbnZlcnQgcmVtYWluaW5nIG1ldGhvZHMuXG4gIGVhY2goa2V5cyhfKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGZ1bmMgPSBfW2tleV07XG4gICAgaWYgKHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBsZW5ndGggPSBwYWlycy5sZW5ndGg7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKHBhaXJzW2xlbmd0aF1bMF0gPT0ga2V5KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jLmNvbnZlcnQgPSBjcmVhdGVDb252ZXJ0ZXIoa2V5LCBmdW5jKTtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgZnVuY10pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQXNzaWduIHRvIGBfYCBsZWF2aW5nIGBfLnByb3RvdHlwZWAgdW5jaGFuZ2VkIHRvIGFsbG93IGNoYWluaW5nLlxuICBlYWNoKHBhaXJzLCBmdW5jdGlvbihwYWlyKSB7XG4gICAgX1twYWlyWzBdXSA9IHBhaXJbMV07XG4gIH0pO1xuXG4gIF8uY29udmVydCA9IGNvbnZlcnRMaWI7XG4gIF8ucGxhY2Vob2xkZXIgPSBfO1xuXG4gIC8vIEFzc2lnbiBhbGlhc2VzLlxuICBlYWNoKGtleXMoXyksIGZ1bmN0aW9uKGtleSkge1xuICAgIGVhY2gobWFwcGluZy5yZWFsVG9BbGlhc1trZXldIHx8IFtdLCBmdW5jdGlvbihhbGlhcykge1xuICAgICAgX1thbGlhc10gPSBfW2tleV07XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBfO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb252ZXJ0O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Tb3VyY2U7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgZ2V0VmFsdWUgPSByZXF1aXJlKCcuL19nZXRWYWx1ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCJ2YXIgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKTtcblxuLyoqIFVzZWQgdG8gc3RvcmUgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgbWV0YU1hcCA9IFdlYWtNYXAgJiYgbmV3IFdlYWtNYXA7XG5cbm1vZHVsZS5leHBvcnRzID0gbWV0YU1hcDtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBtZXRhTWFwID0gcmVxdWlyZSgnLi9fbWV0YU1hcCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXREYXRhYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhc3NvY2lhdGUgbWV0YWRhdGEgd2l0aC5cbiAqIEBwYXJhbSB7Kn0gZGF0YSBUaGUgbWV0YWRhdGEuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldERhdGEgPSAhbWV0YU1hcCA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgZGF0YSkge1xuICBtZXRhTWFwLnNldChmdW5jLCBkYXRhKTtcbiAgcmV0dXJuIGZ1bmM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXREYXRhO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNyZWF0ZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhc3NpZ25pbmdcbiAqIHByb3BlcnRpZXMgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG8gVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG52YXIgYmFzZUNyZWF0ZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gb2JqZWN0KCkge31cbiAgcmV0dXJuIGZ1bmN0aW9uKHByb3RvKSB7XG4gICAgaWYgKCFpc09iamVjdChwcm90bykpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgaWYgKG9iamVjdENyZWF0ZSkge1xuICAgICAgcmV0dXJuIG9iamVjdENyZWF0ZShwcm90byk7XG4gICAgfVxuICAgIG9iamVjdC5wcm90b3R5cGUgPSBwcm90bztcbiAgICB2YXIgcmVzdWx0ID0gbmV3IG9iamVjdDtcbiAgICBvYmplY3QucHJvdG90eXBlID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDcmVhdGU7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBpbnN0YW5jZSBvZiBgQ3RvcmAgcmVnYXJkbGVzcyBvZlxuICogd2hldGhlciBpdCB3YXMgaW52b2tlZCBhcyBwYXJ0IG9mIGEgYG5ld2AgZXhwcmVzc2lvbiBvciBieSBgY2FsbGAgb3IgYGFwcGx5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ3RvciBUaGUgY29uc3RydWN0b3IgdG8gd3JhcC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUN0b3IoQ3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgLy8gVXNlIGEgYHN3aXRjaGAgc3RhdGVtZW50IHRvIHdvcmsgd2l0aCBjbGFzcyBjb25zdHJ1Y3RvcnMuIFNlZVxuICAgIC8vIGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtZnVuY3Rpb24tb2JqZWN0cy1jYWxsLXRoaXNhcmd1bWVudC1hcmd1bWVudHNsaXN0XG4gICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6IHJldHVybiBuZXcgQ3RvcjtcbiAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDdG9yKGFyZ3NbMF0pO1xuICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEN0b3IoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICBjYXNlIDM6IHJldHVybiBuZXcgQ3RvcihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIG5ldyBDdG9yKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICAgICAgY2FzZSA1OiByZXR1cm4gbmV3IEN0b3IoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSk7XG4gICAgICBjYXNlIDY6IHJldHVybiBuZXcgQ3RvcihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdLCBhcmdzWzVdKTtcbiAgICAgIGNhc2UgNzogcmV0dXJuIG5ldyBDdG9yKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0sIGFyZ3NbNV0sIGFyZ3NbNl0pO1xuICAgIH1cbiAgICB2YXIgdGhpc0JpbmRpbmcgPSBiYXNlQ3JlYXRlKEN0b3IucHJvdG90eXBlKSxcbiAgICAgICAgcmVzdWx0ID0gQ3Rvci5hcHBseSh0aGlzQmluZGluZywgYXJncyk7XG5cbiAgICAvLyBNaW1pYyB0aGUgY29uc3RydWN0b3IncyBgcmV0dXJuYCBiZWhhdmlvci5cbiAgICAvLyBTZWUgaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4MTMuMi4yIGZvciBtb3JlIGRldGFpbHMuXG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiB0aGlzQmluZGluZztcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVDdG9yO1xuIiwidmFyIGNyZWF0ZUN0b3IgPSByZXF1aXJlKCcuL19jcmVhdGVDdG9yJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9CSU5EX0ZMQUcgPSAxO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXQgd2l0aCB0aGUgb3B0aW9uYWwgYHRoaXNgXG4gKiBiaW5kaW5nIG9mIGB0aGlzQXJnYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmluZChmdW5jLCBiaXRtYXNrLCB0aGlzQXJnKSB7XG4gIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgV1JBUF9CSU5EX0ZMQUcsXG4gICAgICBDdG9yID0gY3JlYXRlQ3RvcihmdW5jKTtcblxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIHZhciBmbiA9ICh0aGlzICYmIHRoaXMgIT09IHJvb3QgJiYgdGhpcyBpbnN0YW5jZW9mIHdyYXBwZXIpID8gQ3RvciA6IGZ1bmM7XG4gICAgcmV0dXJuIGZuLmFwcGx5KGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzLCBhcmd1bWVudHMpO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJpbmQ7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG4iLCIvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMsXG4gKiBwbGFjZWhvbGRlcnMsIGFuZCBwcm92aWRlZCBhcmd1bWVudHMgaW50byBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIHByb3ZpZGVkIGFyZ3VtZW50cy5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcnRpYWxzIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZC5cbiAqIEBwYXJhbSB7QXJyYXl9IGhvbGRlcnMgVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbXMge2Jvb2xlYW59IFtpc0N1cnJpZWRdIFNwZWNpZnkgY29tcG9zaW5nIGZvciBhIGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBjb21wb3NlZCBhcmd1bWVudHMuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VBcmdzKGFyZ3MsIHBhcnRpYWxzLCBob2xkZXJzLCBpc0N1cnJpZWQpIHtcbiAgdmFyIGFyZ3NJbmRleCA9IC0xLFxuICAgICAgYXJnc0xlbmd0aCA9IGFyZ3MubGVuZ3RoLFxuICAgICAgaG9sZGVyc0xlbmd0aCA9IGhvbGRlcnMubGVuZ3RoLFxuICAgICAgbGVmdEluZGV4ID0gLTEsXG4gICAgICBsZWZ0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgcmFuZ2VMZW5ndGggPSBuYXRpdmVNYXgoYXJnc0xlbmd0aCAtIGhvbGRlcnNMZW5ndGgsIDApLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVmdExlbmd0aCArIHJhbmdlTGVuZ3RoKSxcbiAgICAgIGlzVW5jdXJyaWVkID0gIWlzQ3VycmllZDtcblxuICB3aGlsZSAoKytsZWZ0SW5kZXggPCBsZWZ0TGVuZ3RoKSB7XG4gICAgcmVzdWx0W2xlZnRJbmRleF0gPSBwYXJ0aWFsc1tsZWZ0SW5kZXhdO1xuICB9XG4gIHdoaWxlICgrK2FyZ3NJbmRleCA8IGhvbGRlcnNMZW5ndGgpIHtcbiAgICBpZiAoaXNVbmN1cnJpZWQgfHwgYXJnc0luZGV4IDwgYXJnc0xlbmd0aCkge1xuICAgICAgcmVzdWx0W2hvbGRlcnNbYXJnc0luZGV4XV0gPSBhcmdzW2FyZ3NJbmRleF07XG4gICAgfVxuICB9XG4gIHdoaWxlIChyYW5nZUxlbmd0aC0tKSB7XG4gICAgcmVzdWx0W2xlZnRJbmRleCsrXSA9IGFyZ3NbYXJnc0luZGV4KytdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcG9zZUFyZ3M7XG4iLCIvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBjb21wb3NlQXJnc2AgZXhjZXB0IHRoYXQgdGhlIGFyZ3VtZW50cyBjb21wb3NpdGlvblxuICogaXMgdGFpbG9yZWQgZm9yIGBfLnBhcnRpYWxSaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIHByb3ZpZGVkIGFyZ3VtZW50cy5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcnRpYWxzIFRoZSBhcmd1bWVudHMgdG8gYXBwZW5kIHRvIHRob3NlIHByb3ZpZGVkLlxuICogQHBhcmFtIHtBcnJheX0gaG9sZGVycyBUaGUgYHBhcnRpYWxzYCBwbGFjZWhvbGRlciBpbmRleGVzLlxuICogQHBhcmFtcyB7Ym9vbGVhbn0gW2lzQ3VycmllZF0gU3BlY2lmeSBjb21wb3NpbmcgZm9yIGEgY3VycmllZCBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGNvbXBvc2VkIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZUFyZ3NSaWdodChhcmdzLCBwYXJ0aWFscywgaG9sZGVycywgaXNDdXJyaWVkKSB7XG4gIHZhciBhcmdzSW5kZXggPSAtMSxcbiAgICAgIGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCxcbiAgICAgIGhvbGRlcnNJbmRleCA9IC0xLFxuICAgICAgaG9sZGVyc0xlbmd0aCA9IGhvbGRlcnMubGVuZ3RoLFxuICAgICAgcmlnaHRJbmRleCA9IC0xLFxuICAgICAgcmlnaHRMZW5ndGggPSBwYXJ0aWFscy5sZW5ndGgsXG4gICAgICByYW5nZUxlbmd0aCA9IG5hdGl2ZU1heChhcmdzTGVuZ3RoIC0gaG9sZGVyc0xlbmd0aCwgMCksXG4gICAgICByZXN1bHQgPSBBcnJheShyYW5nZUxlbmd0aCArIHJpZ2h0TGVuZ3RoKSxcbiAgICAgIGlzVW5jdXJyaWVkID0gIWlzQ3VycmllZDtcblxuICB3aGlsZSAoKythcmdzSW5kZXggPCByYW5nZUxlbmd0aCkge1xuICAgIHJlc3VsdFthcmdzSW5kZXhdID0gYXJnc1thcmdzSW5kZXhdO1xuICB9XG4gIHZhciBvZmZzZXQgPSBhcmdzSW5kZXg7XG4gIHdoaWxlICgrK3JpZ2h0SW5kZXggPCByaWdodExlbmd0aCkge1xuICAgIHJlc3VsdFtvZmZzZXQgKyByaWdodEluZGV4XSA9IHBhcnRpYWxzW3JpZ2h0SW5kZXhdO1xuICB9XG4gIHdoaWxlICgrK2hvbGRlcnNJbmRleCA8IGhvbGRlcnNMZW5ndGgpIHtcbiAgICBpZiAoaXNVbmN1cnJpZWQgfHwgYXJnc0luZGV4IDwgYXJnc0xlbmd0aCkge1xuICAgICAgcmVzdWx0W29mZnNldCArIGhvbGRlcnNbaG9sZGVyc0luZGV4XV0gPSBhcmdzW2FyZ3NJbmRleCsrXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb21wb3NlQXJnc1JpZ2h0O1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBudW1iZXIgb2YgYHBsYWNlaG9sZGVyYCBvY2N1cnJlbmNlcyBpbiBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gcGxhY2Vob2xkZXIgVGhlIHBsYWNlaG9sZGVyIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBwbGFjZWhvbGRlciBjb3VudC5cbiAqL1xuZnVuY3Rpb24gY291bnRIb2xkZXJzKGFycmF5LCBwbGFjZWhvbGRlcikge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gMDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoYXJyYXlbbGVuZ3RoXSA9PT0gcGxhY2Vob2xkZXIpIHtcbiAgICAgICsrcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvdW50SG9sZGVycztcbiIsIi8qKlxuICogVGhlIGZ1bmN0aW9uIHdob3NlIHByb3RvdHlwZSBjaGFpbiBzZXF1ZW5jZSB3cmFwcGVycyBpbmhlcml0IGZyb20uXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYmFzZUxvZGFzaCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTG9kYXNoO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgYmFzZUxvZGFzaCA9IHJlcXVpcmUoJy4vX2Jhc2VMb2Rhc2gnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdGhlIG1heGltdW0gbGVuZ3RoIGFuZCBpbmRleCBvZiBhbiBhcnJheS4gKi9cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gNDI5NDk2NzI5NTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbGF6eSB3cmFwcGVyIG9iamVjdCB3aGljaCB3cmFwcyBgdmFsdWVgIHRvIGVuYWJsZSBsYXp5IGV2YWx1YXRpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcC5cbiAqL1xuZnVuY3Rpb24gTGF6eVdyYXBwZXIodmFsdWUpIHtcbiAgdGhpcy5fX3dyYXBwZWRfXyA9IHZhbHVlO1xuICB0aGlzLl9fYWN0aW9uc19fID0gW107XG4gIHRoaXMuX19kaXJfXyA9IDE7XG4gIHRoaXMuX19maWx0ZXJlZF9fID0gZmFsc2U7XG4gIHRoaXMuX19pdGVyYXRlZXNfXyA9IFtdO1xuICB0aGlzLl9fdGFrZUNvdW50X18gPSBNQVhfQVJSQVlfTEVOR1RIO1xuICB0aGlzLl9fdmlld3NfXyA9IFtdO1xufVxuXG4vLyBFbnN1cmUgYExhenlXcmFwcGVyYCBpcyBhbiBpbnN0YW5jZSBvZiBgYmFzZUxvZGFzaGAuXG5MYXp5V3JhcHBlci5wcm90b3R5cGUgPSBiYXNlQ3JlYXRlKGJhc2VMb2Rhc2gucHJvdG90eXBlKTtcbkxhenlXcmFwcGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExhenlXcmFwcGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExhenlXcmFwcGVyO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4zLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5ub29wKTtcbiAqIC8vID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZF1cbiAqL1xuZnVuY3Rpb24gbm9vcCgpIHtcbiAgLy8gTm8gb3BlcmF0aW9uIHBlcmZvcm1lZC5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBub29wO1xuIiwidmFyIG1ldGFNYXAgPSByZXF1aXJlKCcuL19tZXRhTWFwJyksXG4gICAgbm9vcCA9IHJlcXVpcmUoJy4vbm9vcCcpO1xuXG4vKipcbiAqIEdldHMgbWV0YWRhdGEgZm9yIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWV0YWRhdGEgZm9yIGBmdW5jYC5cbiAqL1xudmFyIGdldERhdGEgPSAhbWV0YU1hcCA/IG5vb3AgOiBmdW5jdGlvbihmdW5jKSB7XG4gIHJldHVybiBtZXRhTWFwLmdldChmdW5jKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RGF0YTtcbiIsIi8qKiBVc2VkIHRvIGxvb2t1cCB1bm1pbmlmaWVkIGZ1bmN0aW9uIG5hbWVzLiAqL1xudmFyIHJlYWxOYW1lcyA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlYWxOYW1lcztcbiIsInZhciByZWFsTmFtZXMgPSByZXF1aXJlKCcuL19yZWFsTmFtZXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYW1lIG9mIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBuYW1lLlxuICovXG5mdW5jdGlvbiBnZXRGdW5jTmFtZShmdW5jKSB7XG4gIHZhciByZXN1bHQgPSAoZnVuYy5uYW1lICsgJycpLFxuICAgICAgYXJyYXkgPSByZWFsTmFtZXNbcmVzdWx0XSxcbiAgICAgIGxlbmd0aCA9IGhhc093blByb3BlcnR5LmNhbGwocmVhbE5hbWVzLCByZXN1bHQpID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIgZGF0YSA9IGFycmF5W2xlbmd0aF0sXG4gICAgICAgIG90aGVyRnVuYyA9IGRhdGEuZnVuYztcbiAgICBpZiAob3RoZXJGdW5jID09IG51bGwgfHwgb3RoZXJGdW5jID09IGZ1bmMpIHtcbiAgICAgIHJldHVybiBkYXRhLm5hbWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RnVuY05hbWU7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBiYXNlTG9kYXNoID0gcmVxdWlyZSgnLi9fYmFzZUxvZGFzaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGNvbnN0cnVjdG9yIGZvciBjcmVhdGluZyBgbG9kYXNoYCB3cmFwcGVyIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtjaGFpbkFsbF0gRW5hYmxlIGV4cGxpY2l0IG1ldGhvZCBjaGFpbiBzZXF1ZW5jZXMuXG4gKi9cbmZ1bmN0aW9uIExvZGFzaFdyYXBwZXIodmFsdWUsIGNoYWluQWxsKSB7XG4gIHRoaXMuX193cmFwcGVkX18gPSB2YWx1ZTtcbiAgdGhpcy5fX2FjdGlvbnNfXyA9IFtdO1xuICB0aGlzLl9fY2hhaW5fXyA9ICEhY2hhaW5BbGw7XG4gIHRoaXMuX19pbmRleF9fID0gMDtcbiAgdGhpcy5fX3ZhbHVlc19fID0gdW5kZWZpbmVkO1xufVxuXG5Mb2Rhc2hXcmFwcGVyLnByb3RvdHlwZSA9IGJhc2VDcmVhdGUoYmFzZUxvZGFzaC5wcm90b3R5cGUpO1xuTG9kYXNoV3JhcHBlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMb2Rhc2hXcmFwcGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZGFzaFdyYXBwZXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuIiwidmFyIExhenlXcmFwcGVyID0gcmVxdWlyZSgnLi9fTGF6eVdyYXBwZXInKSxcbiAgICBMb2Rhc2hXcmFwcGVyID0gcmVxdWlyZSgnLi9fTG9kYXNoV3JhcHBlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgd3JhcHBlcmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB3cmFwcGVyIFRoZSB3cmFwcGVyIHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHdyYXBwZXIuXG4gKi9cbmZ1bmN0aW9uIHdyYXBwZXJDbG9uZSh3cmFwcGVyKSB7XG4gIGlmICh3cmFwcGVyIGluc3RhbmNlb2YgTGF6eVdyYXBwZXIpIHtcbiAgICByZXR1cm4gd3JhcHBlci5jbG9uZSgpO1xuICB9XG4gIHZhciByZXN1bHQgPSBuZXcgTG9kYXNoV3JhcHBlcih3cmFwcGVyLl9fd3JhcHBlZF9fLCB3cmFwcGVyLl9fY2hhaW5fXyk7XG4gIHJlc3VsdC5fX2FjdGlvbnNfXyA9IGNvcHlBcnJheSh3cmFwcGVyLl9fYWN0aW9uc19fKTtcbiAgcmVzdWx0Ll9faW5kZXhfXyAgPSB3cmFwcGVyLl9faW5kZXhfXztcbiAgcmVzdWx0Ll9fdmFsdWVzX18gPSB3cmFwcGVyLl9fdmFsdWVzX187XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlckNsb25lO1xuIiwidmFyIExhenlXcmFwcGVyID0gcmVxdWlyZSgnLi9fTGF6eVdyYXBwZXInKSxcbiAgICBMb2Rhc2hXcmFwcGVyID0gcmVxdWlyZSgnLi9fTG9kYXNoV3JhcHBlcicpLFxuICAgIGJhc2VMb2Rhc2ggPSByZXF1aXJlKCcuL19iYXNlTG9kYXNoJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyksXG4gICAgd3JhcHBlckNsb25lID0gcmVxdWlyZSgnLi9fd3JhcHBlckNsb25lJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBsb2Rhc2hgIG9iamVjdCB3aGljaCB3cmFwcyBgdmFsdWVgIHRvIGVuYWJsZSBpbXBsaWNpdCBtZXRob2RcbiAqIGNoYWluIHNlcXVlbmNlcy4gTWV0aG9kcyB0aGF0IG9wZXJhdGUgb24gYW5kIHJldHVybiBhcnJheXMsIGNvbGxlY3Rpb25zLFxuICogYW5kIGZ1bmN0aW9ucyBjYW4gYmUgY2hhaW5lZCB0b2dldGhlci4gTWV0aG9kcyB0aGF0IHJldHJpZXZlIGEgc2luZ2xlIHZhbHVlXG4gKiBvciBtYXkgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlIHdpbGwgYXV0b21hdGljYWxseSBlbmQgdGhlIGNoYWluIHNlcXVlbmNlXG4gKiBhbmQgcmV0dXJuIHRoZSB1bndyYXBwZWQgdmFsdWUuIE90aGVyd2lzZSwgdGhlIHZhbHVlIG11c3QgYmUgdW53cmFwcGVkXG4gKiB3aXRoIGBfI3ZhbHVlYC5cbiAqXG4gKiBFeHBsaWNpdCBjaGFpbiBzZXF1ZW5jZXMsIHdoaWNoIG11c3QgYmUgdW53cmFwcGVkIHdpdGggYF8jdmFsdWVgLCBtYXkgYmVcbiAqIGVuYWJsZWQgdXNpbmcgYF8uY2hhaW5gLlxuICpcbiAqIFRoZSBleGVjdXRpb24gb2YgY2hhaW5lZCBtZXRob2RzIGlzIGxhenksIHRoYXQgaXMsIGl0J3MgZGVmZXJyZWQgdW50aWxcbiAqIGBfI3ZhbHVlYCBpcyBpbXBsaWNpdGx5IG9yIGV4cGxpY2l0bHkgY2FsbGVkLlxuICpcbiAqIExhenkgZXZhbHVhdGlvbiBhbGxvd3Mgc2V2ZXJhbCBtZXRob2RzIHRvIHN1cHBvcnQgc2hvcnRjdXQgZnVzaW9uLlxuICogU2hvcnRjdXQgZnVzaW9uIGlzIGFuIG9wdGltaXphdGlvbiB0byBtZXJnZSBpdGVyYXRlZSBjYWxsczsgdGhpcyBhdm9pZHNcbiAqIHRoZSBjcmVhdGlvbiBvZiBpbnRlcm1lZGlhdGUgYXJyYXlzIGFuZCBjYW4gZ3JlYXRseSByZWR1Y2UgdGhlIG51bWJlciBvZlxuICogaXRlcmF0ZWUgZXhlY3V0aW9ucy4gU2VjdGlvbnMgb2YgYSBjaGFpbiBzZXF1ZW5jZSBxdWFsaWZ5IGZvciBzaG9ydGN1dFxuICogZnVzaW9uIGlmIHRoZSBzZWN0aW9uIGlzIGFwcGxpZWQgdG8gYW4gYXJyYXkgYW5kIGl0ZXJhdGVlcyBhY2NlcHQgb25seVxuICogb25lIGFyZ3VtZW50LiBUaGUgaGV1cmlzdGljIGZvciB3aGV0aGVyIGEgc2VjdGlvbiBxdWFsaWZpZXMgZm9yIHNob3J0Y3V0XG4gKiBmdXNpb24gaXMgc3ViamVjdCB0byBjaGFuZ2UuXG4gKlxuICogQ2hhaW5pbmcgaXMgc3VwcG9ydGVkIGluIGN1c3RvbSBidWlsZHMgYXMgbG9uZyBhcyB0aGUgYF8jdmFsdWVgIG1ldGhvZCBpc1xuICogZGlyZWN0bHkgb3IgaW5kaXJlY3RseSBpbmNsdWRlZCBpbiB0aGUgYnVpbGQuXG4gKlxuICogSW4gYWRkaXRpb24gdG8gbG9kYXNoIG1ldGhvZHMsIHdyYXBwZXJzIGhhdmUgYEFycmF5YCBhbmQgYFN0cmluZ2AgbWV0aG9kcy5cbiAqXG4gKiBUaGUgd3JhcHBlciBgQXJyYXlgIG1ldGhvZHMgYXJlOlxuICogYGNvbmNhdGAsIGBqb2luYCwgYHBvcGAsIGBwdXNoYCwgYHNoaWZ0YCwgYHNvcnRgLCBgc3BsaWNlYCwgYW5kIGB1bnNoaWZ0YFxuICpcbiAqIFRoZSB3cmFwcGVyIGBTdHJpbmdgIG1ldGhvZHMgYXJlOlxuICogYHJlcGxhY2VgIGFuZCBgc3BsaXRgXG4gKlxuICogVGhlIHdyYXBwZXIgbWV0aG9kcyB0aGF0IHN1cHBvcnQgc2hvcnRjdXQgZnVzaW9uIGFyZTpcbiAqIGBhdGAsIGBjb21wYWN0YCwgYGRyb3BgLCBgZHJvcFJpZ2h0YCwgYGRyb3BXaGlsZWAsIGBmaWx0ZXJgLCBgZmluZGAsXG4gKiBgZmluZExhc3RgLCBgaGVhZGAsIGBpbml0aWFsYCwgYGxhc3RgLCBgbWFwYCwgYHJlamVjdGAsIGByZXZlcnNlYCwgYHNsaWNlYCxcbiAqIGB0YWlsYCwgYHRha2VgLCBgdGFrZVJpZ2h0YCwgYHRha2VSaWdodFdoaWxlYCwgYHRha2VXaGlsZWAsIGFuZCBgdG9BcnJheWBcbiAqXG4gKiBUaGUgY2hhaW5hYmxlIHdyYXBwZXIgbWV0aG9kcyBhcmU6XG4gKiBgYWZ0ZXJgLCBgYXJ5YCwgYGFzc2lnbmAsIGBhc3NpZ25JbmAsIGBhc3NpZ25JbldpdGhgLCBgYXNzaWduV2l0aGAsIGBhdGAsXG4gKiBgYmVmb3JlYCwgYGJpbmRgLCBgYmluZEFsbGAsIGBiaW5kS2V5YCwgYGNhc3RBcnJheWAsIGBjaGFpbmAsIGBjaHVua2AsXG4gKiBgY29tbWl0YCwgYGNvbXBhY3RgLCBgY29uY2F0YCwgYGNvbmZvcm1zYCwgYGNvbnN0YW50YCwgYGNvdW50QnlgLCBgY3JlYXRlYCxcbiAqIGBjdXJyeWAsIGBkZWJvdW5jZWAsIGBkZWZhdWx0c2AsIGBkZWZhdWx0c0RlZXBgLCBgZGVmZXJgLCBgZGVsYXlgLFxuICogYGRpZmZlcmVuY2VgLCBgZGlmZmVyZW5jZUJ5YCwgYGRpZmZlcmVuY2VXaXRoYCwgYGRyb3BgLCBgZHJvcFJpZ2h0YCxcbiAqIGBkcm9wUmlnaHRXaGlsZWAsIGBkcm9wV2hpbGVgLCBgZXh0ZW5kYCwgYGV4dGVuZFdpdGhgLCBgZmlsbGAsIGBmaWx0ZXJgLFxuICogYGZsYXRNYXBgLCBgZmxhdE1hcERlZXBgLCBgZmxhdE1hcERlcHRoYCwgYGZsYXR0ZW5gLCBgZmxhdHRlbkRlZXBgLFxuICogYGZsYXR0ZW5EZXB0aGAsIGBmbGlwYCwgYGZsb3dgLCBgZmxvd1JpZ2h0YCwgYGZyb21QYWlyc2AsIGBmdW5jdGlvbnNgLFxuICogYGZ1bmN0aW9uc0luYCwgYGdyb3VwQnlgLCBgaW5pdGlhbGAsIGBpbnRlcnNlY3Rpb25gLCBgaW50ZXJzZWN0aW9uQnlgLFxuICogYGludGVyc2VjdGlvbldpdGhgLCBgaW52ZXJ0YCwgYGludmVydEJ5YCwgYGludm9rZU1hcGAsIGBpdGVyYXRlZWAsIGBrZXlCeWAsXG4gKiBga2V5c2AsIGBrZXlzSW5gLCBgbWFwYCwgYG1hcEtleXNgLCBgbWFwVmFsdWVzYCwgYG1hdGNoZXNgLCBgbWF0Y2hlc1Byb3BlcnR5YCxcbiAqIGBtZW1vaXplYCwgYG1lcmdlYCwgYG1lcmdlV2l0aGAsIGBtZXRob2RgLCBgbWV0aG9kT2ZgLCBgbWl4aW5gLCBgbmVnYXRlYCxcbiAqIGBudGhBcmdgLCBgb21pdGAsIGBvbWl0QnlgLCBgb25jZWAsIGBvcmRlckJ5YCwgYG92ZXJgLCBgb3ZlckFyZ3NgLFxuICogYG92ZXJFdmVyeWAsIGBvdmVyU29tZWAsIGBwYXJ0aWFsYCwgYHBhcnRpYWxSaWdodGAsIGBwYXJ0aXRpb25gLCBgcGlja2AsXG4gKiBgcGlja0J5YCwgYHBsYW50YCwgYHByb3BlcnR5YCwgYHByb3BlcnR5T2ZgLCBgcHVsbGAsIGBwdWxsQWxsYCwgYHB1bGxBbGxCeWAsXG4gKiBgcHVsbEFsbFdpdGhgLCBgcHVsbEF0YCwgYHB1c2hgLCBgcmFuZ2VgLCBgcmFuZ2VSaWdodGAsIGByZWFyZ2AsIGByZWplY3RgLFxuICogYHJlbW92ZWAsIGByZXN0YCwgYHJldmVyc2VgLCBgc2FtcGxlU2l6ZWAsIGBzZXRgLCBgc2V0V2l0aGAsIGBzaHVmZmxlYCxcbiAqIGBzbGljZWAsIGBzb3J0YCwgYHNvcnRCeWAsIGBzcGxpY2VgLCBgc3ByZWFkYCwgYHRhaWxgLCBgdGFrZWAsIGB0YWtlUmlnaHRgLFxuICogYHRha2VSaWdodFdoaWxlYCwgYHRha2VXaGlsZWAsIGB0YXBgLCBgdGhyb3R0bGVgLCBgdGhydWAsIGB0b0FycmF5YCxcbiAqIGB0b1BhaXJzYCwgYHRvUGFpcnNJbmAsIGB0b1BhdGhgLCBgdG9QbGFpbk9iamVjdGAsIGB0cmFuc2Zvcm1gLCBgdW5hcnlgLFxuICogYHVuaW9uYCwgYHVuaW9uQnlgLCBgdW5pb25XaXRoYCwgYHVuaXFgLCBgdW5pcUJ5YCwgYHVuaXFXaXRoYCwgYHVuc2V0YCxcbiAqIGB1bnNoaWZ0YCwgYHVuemlwYCwgYHVuemlwV2l0aGAsIGB1cGRhdGVgLCBgdXBkYXRlV2l0aGAsIGB2YWx1ZXNgLFxuICogYHZhbHVlc0luYCwgYHdpdGhvdXRgLCBgd3JhcGAsIGB4b3JgLCBgeG9yQnlgLCBgeG9yV2l0aGAsIGB6aXBgLFxuICogYHppcE9iamVjdGAsIGB6aXBPYmplY3REZWVwYCwgYW5kIGB6aXBXaXRoYFxuICpcbiAqIFRoZSB3cmFwcGVyIG1ldGhvZHMgdGhhdCBhcmUgKipub3QqKiBjaGFpbmFibGUgYnkgZGVmYXVsdCBhcmU6XG4gKiBgYWRkYCwgYGF0dGVtcHRgLCBgY2FtZWxDYXNlYCwgYGNhcGl0YWxpemVgLCBgY2VpbGAsIGBjbGFtcGAsIGBjbG9uZWAsXG4gKiBgY2xvbmVEZWVwYCwgYGNsb25lRGVlcFdpdGhgLCBgY2xvbmVXaXRoYCwgYGNvbmZvcm1zVG9gLCBgZGVidXJyYCxcbiAqIGBkZWZhdWx0VG9gLCBgZGl2aWRlYCwgYGVhY2hgLCBgZWFjaFJpZ2h0YCwgYGVuZHNXaXRoYCwgYGVxYCwgYGVzY2FwZWAsXG4gKiBgZXNjYXBlUmVnRXhwYCwgYGV2ZXJ5YCwgYGZpbmRgLCBgZmluZEluZGV4YCwgYGZpbmRLZXlgLCBgZmluZExhc3RgLFxuICogYGZpbmRMYXN0SW5kZXhgLCBgZmluZExhc3RLZXlgLCBgZmlyc3RgLCBgZmxvb3JgLCBgZm9yRWFjaGAsIGBmb3JFYWNoUmlnaHRgLFxuICogYGZvckluYCwgYGZvckluUmlnaHRgLCBgZm9yT3duYCwgYGZvck93blJpZ2h0YCwgYGdldGAsIGBndGAsIGBndGVgLCBgaGFzYCxcbiAqIGBoYXNJbmAsIGBoZWFkYCwgYGlkZW50aXR5YCwgYGluY2x1ZGVzYCwgYGluZGV4T2ZgLCBgaW5SYW5nZWAsIGBpbnZva2VgLFxuICogYGlzQXJndW1lbnRzYCwgYGlzQXJyYXlgLCBgaXNBcnJheUJ1ZmZlcmAsIGBpc0FycmF5TGlrZWAsIGBpc0FycmF5TGlrZU9iamVjdGAsXG4gKiBgaXNCb29sZWFuYCwgYGlzQnVmZmVyYCwgYGlzRGF0ZWAsIGBpc0VsZW1lbnRgLCBgaXNFbXB0eWAsIGBpc0VxdWFsYCxcbiAqIGBpc0VxdWFsV2l0aGAsIGBpc0Vycm9yYCwgYGlzRmluaXRlYCwgYGlzRnVuY3Rpb25gLCBgaXNJbnRlZ2VyYCwgYGlzTGVuZ3RoYCxcbiAqIGBpc01hcGAsIGBpc01hdGNoYCwgYGlzTWF0Y2hXaXRoYCwgYGlzTmFOYCwgYGlzTmF0aXZlYCwgYGlzTmlsYCwgYGlzTnVsbGAsXG4gKiBgaXNOdW1iZXJgLCBgaXNPYmplY3RgLCBgaXNPYmplY3RMaWtlYCwgYGlzUGxhaW5PYmplY3RgLCBgaXNSZWdFeHBgLFxuICogYGlzU2FmZUludGVnZXJgLCBgaXNTZXRgLCBgaXNTdHJpbmdgLCBgaXNVbmRlZmluZWRgLCBgaXNUeXBlZEFycmF5YCxcbiAqIGBpc1dlYWtNYXBgLCBgaXNXZWFrU2V0YCwgYGpvaW5gLCBga2ViYWJDYXNlYCwgYGxhc3RgLCBgbGFzdEluZGV4T2ZgLFxuICogYGxvd2VyQ2FzZWAsIGBsb3dlckZpcnN0YCwgYGx0YCwgYGx0ZWAsIGBtYXhgLCBgbWF4QnlgLCBgbWVhbmAsIGBtZWFuQnlgLFxuICogYG1pbmAsIGBtaW5CeWAsIGBtdWx0aXBseWAsIGBub0NvbmZsaWN0YCwgYG5vb3BgLCBgbm93YCwgYG50aGAsIGBwYWRgLFxuICogYHBhZEVuZGAsIGBwYWRTdGFydGAsIGBwYXJzZUludGAsIGBwb3BgLCBgcmFuZG9tYCwgYHJlZHVjZWAsIGByZWR1Y2VSaWdodGAsXG4gKiBgcmVwZWF0YCwgYHJlc3VsdGAsIGByb3VuZGAsIGBydW5JbkNvbnRleHRgLCBgc2FtcGxlYCwgYHNoaWZ0YCwgYHNpemVgLFxuICogYHNuYWtlQ2FzZWAsIGBzb21lYCwgYHNvcnRlZEluZGV4YCwgYHNvcnRlZEluZGV4QnlgLCBgc29ydGVkTGFzdEluZGV4YCxcbiAqIGBzb3J0ZWRMYXN0SW5kZXhCeWAsIGBzdGFydENhc2VgLCBgc3RhcnRzV2l0aGAsIGBzdHViQXJyYXlgLCBgc3R1YkZhbHNlYCxcbiAqIGBzdHViT2JqZWN0YCwgYHN0dWJTdHJpbmdgLCBgc3R1YlRydWVgLCBgc3VidHJhY3RgLCBgc3VtYCwgYHN1bUJ5YCxcbiAqIGB0ZW1wbGF0ZWAsIGB0aW1lc2AsIGB0b0Zpbml0ZWAsIGB0b0ludGVnZXJgLCBgdG9KU09OYCwgYHRvTGVuZ3RoYCxcbiAqIGB0b0xvd2VyYCwgYHRvTnVtYmVyYCwgYHRvU2FmZUludGVnZXJgLCBgdG9TdHJpbmdgLCBgdG9VcHBlcmAsIGB0cmltYCxcbiAqIGB0cmltRW5kYCwgYHRyaW1TdGFydGAsIGB0cnVuY2F0ZWAsIGB1bmVzY2FwZWAsIGB1bmlxdWVJZGAsIGB1cHBlckNhc2VgLFxuICogYHVwcGVyRmlyc3RgLCBgdmFsdWVgLCBhbmQgYHdvcmRzYFxuICpcbiAqIEBuYW1lIF9cbiAqIEBjb25zdHJ1Y3RvclxuICogQGNhdGVnb3J5IFNlcVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIHNxdWFyZShuKSB7XG4gKiAgIHJldHVybiBuICogbjtcbiAqIH1cbiAqXG4gKiB2YXIgd3JhcHBlZCA9IF8oWzEsIDIsIDNdKTtcbiAqXG4gKiAvLyBSZXR1cm5zIGFuIHVud3JhcHBlZCB2YWx1ZS5cbiAqIHdyYXBwZWQucmVkdWNlKF8uYWRkKTtcbiAqIC8vID0+IDZcbiAqXG4gKiAvLyBSZXR1cm5zIGEgd3JhcHBlZCB2YWx1ZS5cbiAqIHZhciBzcXVhcmVzID0gd3JhcHBlZC5tYXAoc3F1YXJlKTtcbiAqXG4gKiBfLmlzQXJyYXkoc3F1YXJlcyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShzcXVhcmVzLnZhbHVlKCkpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBsb2Rhc2godmFsdWUpIHtcbiAgaWYgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzQXJyYXkodmFsdWUpICYmICEodmFsdWUgaW5zdGFuY2VvZiBMYXp5V3JhcHBlcikpIHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBMb2Rhc2hXcmFwcGVyKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnX193cmFwcGVkX18nKSkge1xuICAgICAgcmV0dXJuIHdyYXBwZXJDbG9uZSh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgTG9kYXNoV3JhcHBlcih2YWx1ZSk7XG59XG5cbi8vIEVuc3VyZSB3cmFwcGVycyBhcmUgaW5zdGFuY2VzIG9mIGBiYXNlTG9kYXNoYC5cbmxvZGFzaC5wcm90b3R5cGUgPSBiYXNlTG9kYXNoLnByb3RvdHlwZTtcbmxvZGFzaC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBsb2Rhc2g7XG5cbm1vZHVsZS5leHBvcnRzID0gbG9kYXNoO1xuIiwidmFyIExhenlXcmFwcGVyID0gcmVxdWlyZSgnLi9fTGF6eVdyYXBwZXInKSxcbiAgICBnZXREYXRhID0gcmVxdWlyZSgnLi9fZ2V0RGF0YScpLFxuICAgIGdldEZ1bmNOYW1lID0gcmVxdWlyZSgnLi9fZ2V0RnVuY05hbWUnKSxcbiAgICBsb2Rhc2ggPSByZXF1aXJlKCcuL3dyYXBwZXJMb2Rhc2gnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBhIGxhenkgY291bnRlcnBhcnQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBoYXMgYSBsYXp5IGNvdW50ZXJwYXJ0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMYXppYWJsZShmdW5jKSB7XG4gIHZhciBmdW5jTmFtZSA9IGdldEZ1bmNOYW1lKGZ1bmMpLFxuICAgICAgb3RoZXIgPSBsb2Rhc2hbZnVuY05hbWVdO1xuXG4gIGlmICh0eXBlb2Ygb3RoZXIgIT0gJ2Z1bmN0aW9uJyB8fCAhKGZ1bmNOYW1lIGluIExhenlXcmFwcGVyLnByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGZ1bmMgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIGRhdGEgPSBnZXREYXRhKG90aGVyKTtcbiAgcmV0dXJuICEhZGF0YSAmJiBmdW5jID09PSBkYXRhWzBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGF6aWFibGU7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG4iLCJ2YXIgYmFzZVNldERhdGEgPSByZXF1aXJlKCcuL19iYXNlU2V0RGF0YScpLFxuICAgIHNob3J0T3V0ID0gcmVxdWlyZSgnLi9fc2hvcnRPdXQnKTtcblxuLyoqXG4gKiBTZXRzIG1ldGFkYXRhIGZvciBgZnVuY2AuXG4gKlxuICogKipOb3RlOioqIElmIHRoaXMgZnVuY3Rpb24gYmVjb21lcyBob3QsIGkuZS4gaXMgaW52b2tlZCBhIGxvdCBpbiBhIHNob3J0XG4gKiBwZXJpb2Qgb2YgdGltZSwgaXQgd2lsbCB0cmlwIGl0cyBicmVha2VyIGFuZCB0cmFuc2l0aW9uIHRvIGFuIGlkZW50aXR5XG4gKiBmdW5jdGlvbiB0byBhdm9pZCBnYXJiYWdlIGNvbGxlY3Rpb24gcGF1c2VzIGluIFY4LiBTZWVcbiAqIFtWOCBpc3N1ZSAyMDcwXShodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMDcwKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXNzb2NpYXRlIG1ldGFkYXRhIHdpdGguXG4gKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1ldGFkYXRhLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldERhdGEgPSBzaG9ydE91dChiYXNlU2V0RGF0YSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0RGF0YTtcbiIsIi8qKiBVc2VkIHRvIG1hdGNoIHdyYXAgZGV0YWlsIGNvbW1lbnRzLiAqL1xudmFyIHJlV3JhcERldGFpbHMgPSAvXFx7XFxuXFwvXFwqIFxcW3dyYXBwZWQgd2l0aCAoLispXFxdIFxcKi8sXG4gICAgcmVTcGxpdERldGFpbHMgPSAvLD8gJiAvO1xuXG4vKipcbiAqIEV4dHJhY3RzIHdyYXBwZXIgZGV0YWlscyBmcm9tIHRoZSBgc291cmNlYCBib2R5IGNvbW1lbnQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2UgVGhlIHNvdXJjZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB3cmFwcGVyIGRldGFpbHMuXG4gKi9cbmZ1bmN0aW9uIGdldFdyYXBEZXRhaWxzKHNvdXJjZSkge1xuICB2YXIgbWF0Y2ggPSBzb3VyY2UubWF0Y2gocmVXcmFwRGV0YWlscyk7XG4gIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdLnNwbGl0KHJlU3BsaXREZXRhaWxzKSA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFdyYXBEZXRhaWxzO1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggd3JhcCBkZXRhaWwgY29tbWVudHMuICovXG52YXIgcmVXcmFwQ29tbWVudCA9IC9cXHsoPzpcXG5cXC9cXCogXFxbd3JhcHBlZCB3aXRoIC4rXFxdIFxcKlxcLyk/XFxuPy87XG5cbi8qKlxuICogSW5zZXJ0cyB3cmFwcGVyIGBkZXRhaWxzYCBpbiBhIGNvbW1lbnQgYXQgdGhlIHRvcCBvZiB0aGUgYHNvdXJjZWAgYm9keS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSBUaGUgc291cmNlIHRvIG1vZGlmeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gZGV0YWlscyBUaGUgZGV0YWlscyB0byBpbnNlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBtb2RpZmllZCBzb3VyY2UuXG4gKi9cbmZ1bmN0aW9uIGluc2VydFdyYXBEZXRhaWxzKHNvdXJjZSwgZGV0YWlscykge1xuICB2YXIgbGVuZ3RoID0gZGV0YWlscy5sZW5ndGg7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gbGVuZ3RoIC0gMTtcbiAgZGV0YWlsc1tsYXN0SW5kZXhdID0gKGxlbmd0aCA+IDEgPyAnJiAnIDogJycpICsgZGV0YWlsc1tsYXN0SW5kZXhdO1xuICBkZXRhaWxzID0gZGV0YWlscy5qb2luKGxlbmd0aCA+IDIgPyAnLCAnIDogJyAnKTtcbiAgcmV0dXJuIHNvdXJjZS5yZXBsYWNlKHJlV3JhcENvbW1lbnQsICd7XFxuLyogW3dyYXBwZWQgd2l0aCAnICsgZGV0YWlscyArICddICovXFxuJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0V3JhcERldGFpbHM7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCJ2YXIgY29uc3RhbnQgPSByZXF1aXJlKCcuL2NvbnN0YW50JyksXG4gICAgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXRUb1N0cmluZ2Agd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuYywgJ3RvU3RyaW5nJywge1xuICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgJ3ZhbHVlJzogY29uc3RhbnQoc3RyaW5nKSxcbiAgICAnd3JpdGFibGUnOiB0cnVlXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0VG9TdHJpbmc7XG4iLCJ2YXIgYmFzZVNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVNldFRvU3RyaW5nJyksXG4gICAgc2hvcnRPdXQgPSByZXF1aXJlKCcuL19zaG9ydE91dCcpO1xuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuIiwidmFyIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCcuL19iYXNlRmluZEluZGV4JyksXG4gICAgYmFzZUlzTmFOID0gcmVxdWlyZSgnLi9fYmFzZUlzTmFOJyksXG4gICAgc3RyaWN0SW5kZXhPZiA9IHJlcXVpcmUoJy4vX3N0cmljdEluZGV4T2YnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IGBmcm9tSW5kZXhgIGJvdW5kcyBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZVxuICAgID8gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleClcbiAgICA6IGJhc2VGaW5kSW5kZXgoYXJyYXksIGJhc2VJc05hTiwgZnJvbUluZGV4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZjtcbiIsInZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluY2x1ZGVzYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIHNwZWNpZnlpbmcgYW4gaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdGFyZ2V0YCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFycmF5LCB2YWx1ZSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIDApID4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlJbmNsdWRlcztcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhcnJheUluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXlJbmNsdWRlcycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBmdW5jdGlvbiBtZXRhZGF0YS4gKi9cbnZhciBXUkFQX0JJTkRfRkxBRyA9IDEsXG4gICAgV1JBUF9CSU5EX0tFWV9GTEFHID0gMixcbiAgICBXUkFQX0NVUlJZX0ZMQUcgPSA4LFxuICAgIFdSQVBfQ1VSUllfUklHSFRfRkxBRyA9IDE2LFxuICAgIFdSQVBfUEFSVElBTF9GTEFHID0gMzIsXG4gICAgV1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUcgPSA2NCxcbiAgICBXUkFQX0FSWV9GTEFHID0gMTI4LFxuICAgIFdSQVBfUkVBUkdfRkxBRyA9IDI1NixcbiAgICBXUkFQX0ZMSVBfRkxBRyA9IDUxMjtcblxuLyoqIFVzZWQgdG8gYXNzb2NpYXRlIHdyYXAgbWV0aG9kcyB3aXRoIHRoZWlyIGJpdCBmbGFncy4gKi9cbnZhciB3cmFwRmxhZ3MgPSBbXG4gIFsnYXJ5JywgV1JBUF9BUllfRkxBR10sXG4gIFsnYmluZCcsIFdSQVBfQklORF9GTEFHXSxcbiAgWydiaW5kS2V5JywgV1JBUF9CSU5EX0tFWV9GTEFHXSxcbiAgWydjdXJyeScsIFdSQVBfQ1VSUllfRkxBR10sXG4gIFsnY3VycnlSaWdodCcsIFdSQVBfQ1VSUllfUklHSFRfRkxBR10sXG4gIFsnZmxpcCcsIFdSQVBfRkxJUF9GTEFHXSxcbiAgWydwYXJ0aWFsJywgV1JBUF9QQVJUSUFMX0ZMQUddLFxuICBbJ3BhcnRpYWxSaWdodCcsIFdSQVBfUEFSVElBTF9SSUdIVF9GTEFHXSxcbiAgWydyZWFyZycsIFdSQVBfUkVBUkdfRkxBR11cbl07XG5cbi8qKlxuICogVXBkYXRlcyB3cmFwcGVyIGBkZXRhaWxzYCBiYXNlZCBvbiBgYml0bWFza2AgZmxhZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtBcnJheX0gZGV0YWlscyBUaGUgZGV0YWlscyB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBjcmVhdGVXcmFwYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBkZXRhaWxzYC5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlV3JhcERldGFpbHMoZGV0YWlscywgYml0bWFzaykge1xuICBhcnJheUVhY2god3JhcEZsYWdzLCBmdW5jdGlvbihwYWlyKSB7XG4gICAgdmFyIHZhbHVlID0gJ18uJyArIHBhaXJbMF07XG4gICAgaWYgKChiaXRtYXNrICYgcGFpclsxXSkgJiYgIWFycmF5SW5jbHVkZXMoZGV0YWlscywgdmFsdWUpKSB7XG4gICAgICBkZXRhaWxzLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZXRhaWxzLnNvcnQoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVXcmFwRGV0YWlscztcbiIsInZhciBnZXRXcmFwRGV0YWlscyA9IHJlcXVpcmUoJy4vX2dldFdyYXBEZXRhaWxzJyksXG4gICAgaW5zZXJ0V3JhcERldGFpbHMgPSByZXF1aXJlKCcuL19pbnNlcnRXcmFwRGV0YWlscycpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKSxcbiAgICB1cGRhdGVXcmFwRGV0YWlscyA9IHJlcXVpcmUoJy4vX3VwZGF0ZVdyYXBEZXRhaWxzJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYHdyYXBwZXJgIHRvIG1pbWljIHRoZSBzb3VyY2Ugb2YgYHJlZmVyZW5jZWBcbiAqIHdpdGggd3JhcHBlciBkZXRhaWxzIGluIGEgY29tbWVudCBhdCB0aGUgdG9wIG9mIHRoZSBzb3VyY2UgYm9keS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gd3JhcHBlciBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVmZXJlbmNlIFRoZSByZWZlcmVuY2UgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBjcmVhdGVXcmFwYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGB3cmFwcGVyYC5cbiAqL1xuZnVuY3Rpb24gc2V0V3JhcFRvU3RyaW5nKHdyYXBwZXIsIHJlZmVyZW5jZSwgYml0bWFzaykge1xuICB2YXIgc291cmNlID0gKHJlZmVyZW5jZSArICcnKTtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKHdyYXBwZXIsIGluc2VydFdyYXBEZXRhaWxzKHNvdXJjZSwgdXBkYXRlV3JhcERldGFpbHMoZ2V0V3JhcERldGFpbHMoc291cmNlKSwgYml0bWFzaykpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRXcmFwVG9TdHJpbmc7XG4iLCJ2YXIgaXNMYXppYWJsZSA9IHJlcXVpcmUoJy4vX2lzTGF6aWFibGUnKSxcbiAgICBzZXREYXRhID0gcmVxdWlyZSgnLi9fc2V0RGF0YScpLFxuICAgIHNldFdyYXBUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFdyYXBUb1N0cmluZycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBmdW5jdGlvbiBtZXRhZGF0YS4gKi9cbnZhciBXUkFQX0JJTkRfRkxBRyA9IDEsXG4gICAgV1JBUF9CSU5EX0tFWV9GTEFHID0gMixcbiAgICBXUkFQX0NVUlJZX0JPVU5EX0ZMQUcgPSA0LFxuICAgIFdSQVBfQ1VSUllfRkxBRyA9IDgsXG4gICAgV1JBUF9QQVJUSUFMX0ZMQUcgPSAzMixcbiAgICBXUkFQX1BBUlRJQUxfUklHSFRfRkxBRyA9IDY0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBjb250aW51ZSBjdXJyeWluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB3cmFwRnVuYyBUaGUgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBgZnVuY2Agd3JhcHBlci5cbiAqIEBwYXJhbSB7Kn0gcGxhY2Vob2xkZXIgVGhlIHBsYWNlaG9sZGVyIHZhbHVlLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IFtwYXJ0aWFsc10gVGhlIGFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIHRob3NlIHByb3ZpZGVkIHRvXG4gKiAgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IFtob2xkZXJzXSBUaGUgYHBhcnRpYWxzYCBwbGFjZWhvbGRlciBpbmRleGVzLlxuICogQHBhcmFtIHtBcnJheX0gW2FyZ1Bvc10gVGhlIGFyZ3VtZW50IHBvc2l0aW9ucyBvZiB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcnldIFRoZSBhcml0eSBjYXAgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcml0eV0gVGhlIGFyaXR5IG9mIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJlY3VycnkoZnVuYywgYml0bWFzaywgd3JhcEZ1bmMsIHBsYWNlaG9sZGVyLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycywgYXJnUG9zLCBhcnksIGFyaXR5KSB7XG4gIHZhciBpc0N1cnJ5ID0gYml0bWFzayAmIFdSQVBfQ1VSUllfRkxBRyxcbiAgICAgIG5ld0hvbGRlcnMgPSBpc0N1cnJ5ID8gaG9sZGVycyA6IHVuZGVmaW5lZCxcbiAgICAgIG5ld0hvbGRlcnNSaWdodCA9IGlzQ3VycnkgPyB1bmRlZmluZWQgOiBob2xkZXJzLFxuICAgICAgbmV3UGFydGlhbHMgPSBpc0N1cnJ5ID8gcGFydGlhbHMgOiB1bmRlZmluZWQsXG4gICAgICBuZXdQYXJ0aWFsc1JpZ2h0ID0gaXNDdXJyeSA/IHVuZGVmaW5lZCA6IHBhcnRpYWxzO1xuXG4gIGJpdG1hc2sgfD0gKGlzQ3VycnkgPyBXUkFQX1BBUlRJQUxfRkxBRyA6IFdSQVBfUEFSVElBTF9SSUdIVF9GTEFHKTtcbiAgYml0bWFzayAmPSB+KGlzQ3VycnkgPyBXUkFQX1BBUlRJQUxfUklHSFRfRkxBRyA6IFdSQVBfUEFSVElBTF9GTEFHKTtcblxuICBpZiAoIShiaXRtYXNrICYgV1JBUF9DVVJSWV9CT1VORF9GTEFHKSkge1xuICAgIGJpdG1hc2sgJj0gfihXUkFQX0JJTkRfRkxBRyB8IFdSQVBfQklORF9LRVlfRkxBRyk7XG4gIH1cbiAgdmFyIG5ld0RhdGEgPSBbXG4gICAgZnVuYywgYml0bWFzaywgdGhpc0FyZywgbmV3UGFydGlhbHMsIG5ld0hvbGRlcnMsIG5ld1BhcnRpYWxzUmlnaHQsXG4gICAgbmV3SG9sZGVyc1JpZ2h0LCBhcmdQb3MsIGFyeSwgYXJpdHlcbiAgXTtcblxuICB2YXIgcmVzdWx0ID0gd3JhcEZ1bmMuYXBwbHkodW5kZWZpbmVkLCBuZXdEYXRhKTtcbiAgaWYgKGlzTGF6aWFibGUoZnVuYykpIHtcbiAgICBzZXREYXRhKHJlc3VsdCwgbmV3RGF0YSk7XG4gIH1cbiAgcmVzdWx0LnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gIHJldHVybiBzZXRXcmFwVG9TdHJpbmcocmVzdWx0LCBmdW5jLCBiaXRtYXNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSZWN1cnJ5O1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBhcmd1bWVudCBwbGFjZWhvbGRlciB2YWx1ZSBmb3IgYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnNwZWN0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHBsYWNlaG9sZGVyIHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRIb2xkZXIoZnVuYykge1xuICB2YXIgb2JqZWN0ID0gZnVuYztcbiAgcmV0dXJuIG9iamVjdC5wbGFjZWhvbGRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRIb2xkZXI7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcblxuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgKHR5cGUgIT0gJ3N5bWJvbCcgJiYgcmVJc1VpbnQudGVzdCh2YWx1ZSkpKSAmJlxuICAgICAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsInZhciBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogUmVvcmRlciBgYXJyYXlgIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGluZGV4ZXMgd2hlcmUgdGhlIGVsZW1lbnQgYXRcbiAqIHRoZSBmaXJzdCBpbmRleCBpcyBhc3NpZ25lZCBhcyB0aGUgZmlyc3QgZWxlbWVudCwgdGhlIGVsZW1lbnQgYXRcbiAqIHRoZSBzZWNvbmQgaW5kZXggaXMgYXNzaWduZWQgYXMgdGhlIHNlY29uZCBlbGVtZW50LCBhbmQgc28gb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byByZW9yZGVyLlxuICogQHBhcmFtIHtBcnJheX0gaW5kZXhlcyBUaGUgYXJyYW5nZWQgYXJyYXkgaW5kZXhlcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiByZW9yZGVyKGFycmF5LCBpbmRleGVzKSB7XG4gIHZhciBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBuYXRpdmVNaW4oaW5kZXhlcy5sZW5ndGgsIGFyckxlbmd0aCksXG4gICAgICBvbGRBcnJheSA9IGNvcHlBcnJheShhcnJheSk7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGluZGV4ID0gaW5kZXhlc1tsZW5ndGhdO1xuICAgIGFycmF5W2xlbmd0aF0gPSBpc0luZGV4KGluZGV4LCBhcnJMZW5ndGgpID8gb2xkQXJyYXlbaW5kZXhdIDogdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZW9yZGVyO1xuIiwiLyoqIFVzZWQgYXMgdGhlIGludGVybmFsIGFyZ3VtZW50IHBsYWNlaG9sZGVyLiAqL1xudmFyIFBMQUNFSE9MREVSID0gJ19fbG9kYXNoX3BsYWNlaG9sZGVyX18nO1xuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCBgcGxhY2Vob2xkZXJgIGVsZW1lbnRzIGluIGBhcnJheWAgd2l0aCBhbiBpbnRlcm5hbCBwbGFjZWhvbGRlclxuICogYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgdGhlaXIgaW5kZXhlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7Kn0gcGxhY2Vob2xkZXIgVGhlIHBsYWNlaG9sZGVyIHRvIHJlcGxhY2UuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBwbGFjZWhvbGRlciBpbmRleGVzLlxuICovXG5mdW5jdGlvbiByZXBsYWNlSG9sZGVycyhhcnJheSwgcGxhY2Vob2xkZXIpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAodmFsdWUgPT09IHBsYWNlaG9sZGVyIHx8IHZhbHVlID09PSBQTEFDRUhPTERFUikge1xuICAgICAgYXJyYXlbaW5kZXhdID0gUExBQ0VIT0xERVI7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXBsYWNlSG9sZGVycztcbiIsInZhciBjb21wb3NlQXJncyA9IHJlcXVpcmUoJy4vX2NvbXBvc2VBcmdzJyksXG4gICAgY29tcG9zZUFyZ3NSaWdodCA9IHJlcXVpcmUoJy4vX2NvbXBvc2VBcmdzUmlnaHQnKSxcbiAgICBjb3VudEhvbGRlcnMgPSByZXF1aXJlKCcuL19jb3VudEhvbGRlcnMnKSxcbiAgICBjcmVhdGVDdG9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQ3RvcicpLFxuICAgIGNyZWF0ZVJlY3VycnkgPSByZXF1aXJlKCcuL19jcmVhdGVSZWN1cnJ5JyksXG4gICAgZ2V0SG9sZGVyID0gcmVxdWlyZSgnLi9fZ2V0SG9sZGVyJyksXG4gICAgcmVvcmRlciA9IHJlcXVpcmUoJy4vX3Jlb3JkZXInKSxcbiAgICByZXBsYWNlSG9sZGVycyA9IHJlcXVpcmUoJy4vX3JlcGxhY2VIb2xkZXJzJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9CSU5EX0ZMQUcgPSAxLFxuICAgIFdSQVBfQklORF9LRVlfRkxBRyA9IDIsXG4gICAgV1JBUF9DVVJSWV9GTEFHID0gOCxcbiAgICBXUkFQX0NVUlJZX1JJR0hUX0ZMQUcgPSAxNixcbiAgICBXUkFQX0FSWV9GTEFHID0gMTI4LFxuICAgIFdSQVBfRkxJUF9GTEFHID0gNTEyO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXQgd2l0aCBvcHRpb25hbCBgdGhpc2BcbiAqIGJpbmRpbmcgb2YgYHRoaXNBcmdgLCBwYXJ0aWFsIGFwcGxpY2F0aW9uLCBhbmQgY3VycnlpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmdW5jIFRoZSBmdW5jdGlvbiBvciBtZXRob2QgbmFtZSB0byB3cmFwLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgY3JlYXRlV3JhcGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZCB0b1xuICogIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc10gVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtwYXJ0aWFsc1JpZ2h0XSBUaGUgYXJndW1lbnRzIHRvIGFwcGVuZCB0byB0aG9zZSBwcm92aWRlZFxuICogIHRvIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc1JpZ2h0XSBUaGUgYHBhcnRpYWxzUmlnaHRgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJnUG9zXSBUaGUgYXJndW1lbnQgcG9zaXRpb25zIG9mIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyeV0gVGhlIGFyaXR5IGNhcCBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5XSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSHlicmlkKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzLCBob2xkZXJzLCBwYXJ0aWFsc1JpZ2h0LCBob2xkZXJzUmlnaHQsIGFyZ1BvcywgYXJ5LCBhcml0eSkge1xuICB2YXIgaXNBcnkgPSBiaXRtYXNrICYgV1JBUF9BUllfRkxBRyxcbiAgICAgIGlzQmluZCA9IGJpdG1hc2sgJiBXUkFQX0JJTkRfRkxBRyxcbiAgICAgIGlzQmluZEtleSA9IGJpdG1hc2sgJiBXUkFQX0JJTkRfS0VZX0ZMQUcsXG4gICAgICBpc0N1cnJpZWQgPSBiaXRtYXNrICYgKFdSQVBfQ1VSUllfRkxBRyB8IFdSQVBfQ1VSUllfUklHSFRfRkxBRyksXG4gICAgICBpc0ZsaXAgPSBiaXRtYXNrICYgV1JBUF9GTElQX0ZMQUcsXG4gICAgICBDdG9yID0gaXNCaW5kS2V5ID8gdW5kZWZpbmVkIDogY3JlYXRlQ3RvcihmdW5jKTtcblxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICBhcmdzID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgICAgaW5kZXggPSBsZW5ndGg7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgYXJnc1tpbmRleF0gPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgIH1cbiAgICBpZiAoaXNDdXJyaWVkKSB7XG4gICAgICB2YXIgcGxhY2Vob2xkZXIgPSBnZXRIb2xkZXIod3JhcHBlciksXG4gICAgICAgICAgaG9sZGVyc0NvdW50ID0gY291bnRIb2xkZXJzKGFyZ3MsIHBsYWNlaG9sZGVyKTtcbiAgICB9XG4gICAgaWYgKHBhcnRpYWxzKSB7XG4gICAgICBhcmdzID0gY29tcG9zZUFyZ3MoYXJncywgcGFydGlhbHMsIGhvbGRlcnMsIGlzQ3VycmllZCk7XG4gICAgfVxuICAgIGlmIChwYXJ0aWFsc1JpZ2h0KSB7XG4gICAgICBhcmdzID0gY29tcG9zZUFyZ3NSaWdodChhcmdzLCBwYXJ0aWFsc1JpZ2h0LCBob2xkZXJzUmlnaHQsIGlzQ3VycmllZCk7XG4gICAgfVxuICAgIGxlbmd0aCAtPSBob2xkZXJzQ291bnQ7XG4gICAgaWYgKGlzQ3VycmllZCAmJiBsZW5ndGggPCBhcml0eSkge1xuICAgICAgdmFyIG5ld0hvbGRlcnMgPSByZXBsYWNlSG9sZGVycyhhcmdzLCBwbGFjZWhvbGRlcik7XG4gICAgICByZXR1cm4gY3JlYXRlUmVjdXJyeShcbiAgICAgICAgZnVuYywgYml0bWFzaywgY3JlYXRlSHlicmlkLCB3cmFwcGVyLnBsYWNlaG9sZGVyLCB0aGlzQXJnLFxuICAgICAgICBhcmdzLCBuZXdIb2xkZXJzLCBhcmdQb3MsIGFyeSwgYXJpdHkgLSBsZW5ndGhcbiAgICAgICk7XG4gICAgfVxuICAgIHZhciB0aGlzQmluZGluZyA9IGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzLFxuICAgICAgICBmbiA9IGlzQmluZEtleSA/IHRoaXNCaW5kaW5nW2Z1bmNdIDogZnVuYztcblxuICAgIGxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xuICAgIGlmIChhcmdQb3MpIHtcbiAgICAgIGFyZ3MgPSByZW9yZGVyKGFyZ3MsIGFyZ1Bvcyk7XG4gICAgfSBlbHNlIGlmIChpc0ZsaXAgJiYgbGVuZ3RoID4gMSkge1xuICAgICAgYXJncy5yZXZlcnNlKCk7XG4gICAgfVxuICAgIGlmIChpc0FyeSAmJiBhcnkgPCBsZW5ndGgpIHtcbiAgICAgIGFyZ3MubGVuZ3RoID0gYXJ5O1xuICAgIH1cbiAgICBpZiAodGhpcyAmJiB0aGlzICE9PSByb290ICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSB7XG4gICAgICBmbiA9IEN0b3IgfHwgY3JlYXRlQ3Rvcihmbik7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQmluZGluZywgYXJncyk7XG4gIH1cbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlSHlicmlkO1xuIiwidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKSxcbiAgICBjcmVhdGVDdG9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQ3RvcicpLFxuICAgIGNyZWF0ZUh5YnJpZCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUh5YnJpZCcpLFxuICAgIGNyZWF0ZVJlY3VycnkgPSByZXF1aXJlKCcuL19jcmVhdGVSZWN1cnJ5JyksXG4gICAgZ2V0SG9sZGVyID0gcmVxdWlyZSgnLi9fZ2V0SG9sZGVyJyksXG4gICAgcmVwbGFjZUhvbGRlcnMgPSByZXF1aXJlKCcuL19yZXBsYWNlSG9sZGVycycpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIHRvIGVuYWJsZSBjdXJyeWluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge251bWJlcn0gYXJpdHkgVGhlIGFyaXR5IG9mIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUN1cnJ5KGZ1bmMsIGJpdG1hc2ssIGFyaXR5KSB7XG4gIHZhciBDdG9yID0gY3JlYXRlQ3RvcihmdW5jKTtcblxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICBhcmdzID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgICAgaW5kZXggPSBsZW5ndGgsXG4gICAgICAgIHBsYWNlaG9sZGVyID0gZ2V0SG9sZGVyKHdyYXBwZXIpO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIGFyZ3NbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICB9XG4gICAgdmFyIGhvbGRlcnMgPSAobGVuZ3RoIDwgMyAmJiBhcmdzWzBdICE9PSBwbGFjZWhvbGRlciAmJiBhcmdzW2xlbmd0aCAtIDFdICE9PSBwbGFjZWhvbGRlcilcbiAgICAgID8gW11cbiAgICAgIDogcmVwbGFjZUhvbGRlcnMoYXJncywgcGxhY2Vob2xkZXIpO1xuXG4gICAgbGVuZ3RoIC09IGhvbGRlcnMubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPCBhcml0eSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJlY3VycnkoXG4gICAgICAgIGZ1bmMsIGJpdG1hc2ssIGNyZWF0ZUh5YnJpZCwgd3JhcHBlci5wbGFjZWhvbGRlciwgdW5kZWZpbmVkLFxuICAgICAgICBhcmdzLCBob2xkZXJzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgYXJpdHkgLSBsZW5ndGgpO1xuICAgIH1cbiAgICB2YXIgZm4gPSAodGhpcyAmJiB0aGlzICE9PSByb290ICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IEN0b3IgOiBmdW5jO1xuICAgIHJldHVybiBhcHBseShmbiwgdGhpcywgYXJncyk7XG4gIH1cbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQ3Vycnk7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIGNyZWF0ZUN0b3IgPSByZXF1aXJlKCcuL19jcmVhdGVDdG9yJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9CSU5EX0ZMQUcgPSAxO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmdcbiAqIG9mIGB0aGlzQXJnYCBhbmQgYHBhcnRpYWxzYCBwcmVwZW5kZWQgdG8gdGhlIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcnRpYWxzIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZCB0b1xuICogIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVQYXJ0aWFsKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzKSB7XG4gIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgV1JBUF9CSU5EX0ZMQUcsXG4gICAgICBDdG9yID0gY3JlYXRlQ3RvcihmdW5jKTtcblxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIHZhciBhcmdzSW5kZXggPSAtMSxcbiAgICAgICAgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGxlZnRJbmRleCA9IC0xLFxuICAgICAgICBsZWZ0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgICBhcmdzID0gQXJyYXkobGVmdExlbmd0aCArIGFyZ3NMZW5ndGgpLFxuICAgICAgICBmbiA9ICh0aGlzICYmIHRoaXMgIT09IHJvb3QgJiYgdGhpcyBpbnN0YW5jZW9mIHdyYXBwZXIpID8gQ3RvciA6IGZ1bmM7XG5cbiAgICB3aGlsZSAoKytsZWZ0SW5kZXggPCBsZWZ0TGVuZ3RoKSB7XG4gICAgICBhcmdzW2xlZnRJbmRleF0gPSBwYXJ0aWFsc1tsZWZ0SW5kZXhdO1xuICAgIH1cbiAgICB3aGlsZSAoYXJnc0xlbmd0aC0tKSB7XG4gICAgICBhcmdzW2xlZnRJbmRleCsrXSA9IGFyZ3VtZW50c1srK2FyZ3NJbmRleF07XG4gICAgfVxuICAgIHJldHVybiBhcHBseShmbiwgaXNCaW5kID8gdGhpc0FyZyA6IHRoaXMsIGFyZ3MpO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVBhcnRpYWw7XG4iLCJ2YXIgY29tcG9zZUFyZ3MgPSByZXF1aXJlKCcuL19jb21wb3NlQXJncycpLFxuICAgIGNvbXBvc2VBcmdzUmlnaHQgPSByZXF1aXJlKCcuL19jb21wb3NlQXJnc1JpZ2h0JyksXG4gICAgcmVwbGFjZUhvbGRlcnMgPSByZXF1aXJlKCcuL19yZXBsYWNlSG9sZGVycycpO1xuXG4vKiogVXNlZCBhcyB0aGUgaW50ZXJuYWwgYXJndW1lbnQgcGxhY2Vob2xkZXIuICovXG52YXIgUExBQ0VIT0xERVIgPSAnX19sb2Rhc2hfcGxhY2Vob2xkZXJfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGZ1bmN0aW9uIG1ldGFkYXRhLiAqL1xudmFyIFdSQVBfQklORF9GTEFHID0gMSxcbiAgICBXUkFQX0JJTkRfS0VZX0ZMQUcgPSAyLFxuICAgIFdSQVBfQ1VSUllfQk9VTkRfRkxBRyA9IDQsXG4gICAgV1JBUF9DVVJSWV9GTEFHID0gOCxcbiAgICBXUkFQX0FSWV9GTEFHID0gMTI4LFxuICAgIFdSQVBfUkVBUkdfRkxBRyA9IDI1NjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIE1lcmdlcyB0aGUgZnVuY3Rpb24gbWV0YWRhdGEgb2YgYHNvdXJjZWAgaW50byBgZGF0YWAuXG4gKlxuICogTWVyZ2luZyBtZXRhZGF0YSByZWR1Y2VzIHRoZSBudW1iZXIgb2Ygd3JhcHBlcnMgdXNlZCB0byBpbnZva2UgYSBmdW5jdGlvbi5cbiAqIFRoaXMgaXMgcG9zc2libGUgYmVjYXVzZSBtZXRob2RzIGxpa2UgYF8uYmluZGAsIGBfLmN1cnJ5YCwgYW5kIGBfLnBhcnRpYWxgXG4gKiBtYXkgYmUgYXBwbGllZCByZWdhcmRsZXNzIG9mIGV4ZWN1dGlvbiBvcmRlci4gTWV0aG9kcyBsaWtlIGBfLmFyeWAgYW5kXG4gKiBgXy5yZWFyZ2AgbW9kaWZ5IGZ1bmN0aW9uIGFyZ3VtZW50cywgbWFraW5nIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IGFyZVxuICogZXhlY3V0ZWQgaW1wb3J0YW50LCBwcmV2ZW50aW5nIHRoZSBtZXJnaW5nIG9mIG1ldGFkYXRhLiBIb3dldmVyLCB3ZSBtYWtlXG4gKiBhbiBleGNlcHRpb24gZm9yIGEgc2FmZSBjb21iaW5lZCBjYXNlIHdoZXJlIGN1cnJpZWQgZnVuY3Rpb25zIGhhdmUgYF8uYXJ5YFxuICogYW5kIG9yIGBfLnJlYXJnYCBhcHBsaWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRhIFRoZSBkZXN0aW5hdGlvbiBtZXRhZGF0YS5cbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgc291cmNlIG1ldGFkYXRhLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBkYXRhYC5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VEYXRhKGRhdGEsIHNvdXJjZSkge1xuICB2YXIgYml0bWFzayA9IGRhdGFbMV0sXG4gICAgICBzcmNCaXRtYXNrID0gc291cmNlWzFdLFxuICAgICAgbmV3Qml0bWFzayA9IGJpdG1hc2sgfCBzcmNCaXRtYXNrLFxuICAgICAgaXNDb21tb24gPSBuZXdCaXRtYXNrIDwgKFdSQVBfQklORF9GTEFHIHwgV1JBUF9CSU5EX0tFWV9GTEFHIHwgV1JBUF9BUllfRkxBRyk7XG5cbiAgdmFyIGlzQ29tYm8gPVxuICAgICgoc3JjQml0bWFzayA9PSBXUkFQX0FSWV9GTEFHKSAmJiAoYml0bWFzayA9PSBXUkFQX0NVUlJZX0ZMQUcpKSB8fFxuICAgICgoc3JjQml0bWFzayA9PSBXUkFQX0FSWV9GTEFHKSAmJiAoYml0bWFzayA9PSBXUkFQX1JFQVJHX0ZMQUcpICYmIChkYXRhWzddLmxlbmd0aCA8PSBzb3VyY2VbOF0pKSB8fFxuICAgICgoc3JjQml0bWFzayA9PSAoV1JBUF9BUllfRkxBRyB8IFdSQVBfUkVBUkdfRkxBRykpICYmIChzb3VyY2VbN10ubGVuZ3RoIDw9IHNvdXJjZVs4XSkgJiYgKGJpdG1hc2sgPT0gV1JBUF9DVVJSWV9GTEFHKSk7XG5cbiAgLy8gRXhpdCBlYXJseSBpZiBtZXRhZGF0YSBjYW4ndCBiZSBtZXJnZWQuXG4gIGlmICghKGlzQ29tbW9uIHx8IGlzQ29tYm8pKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgdGhpc0FyZ2AgaWYgYXZhaWxhYmxlLlxuICBpZiAoc3JjQml0bWFzayAmIFdSQVBfQklORF9GTEFHKSB7XG4gICAgZGF0YVsyXSA9IHNvdXJjZVsyXTtcbiAgICAvLyBTZXQgd2hlbiBjdXJyeWluZyBhIGJvdW5kIGZ1bmN0aW9uLlxuICAgIG5ld0JpdG1hc2sgfD0gYml0bWFzayAmIFdSQVBfQklORF9GTEFHID8gMCA6IFdSQVBfQ1VSUllfQk9VTkRfRkxBRztcbiAgfVxuICAvLyBDb21wb3NlIHBhcnRpYWwgYXJndW1lbnRzLlxuICB2YXIgdmFsdWUgPSBzb3VyY2VbM107XG4gIGlmICh2YWx1ZSkge1xuICAgIHZhciBwYXJ0aWFscyA9IGRhdGFbM107XG4gICAgZGF0YVszXSA9IHBhcnRpYWxzID8gY29tcG9zZUFyZ3MocGFydGlhbHMsIHZhbHVlLCBzb3VyY2VbNF0pIDogdmFsdWU7XG4gICAgZGF0YVs0XSA9IHBhcnRpYWxzID8gcmVwbGFjZUhvbGRlcnMoZGF0YVszXSwgUExBQ0VIT0xERVIpIDogc291cmNlWzRdO1xuICB9XG4gIC8vIENvbXBvc2UgcGFydGlhbCByaWdodCBhcmd1bWVudHMuXG4gIHZhbHVlID0gc291cmNlWzVdO1xuICBpZiAodmFsdWUpIHtcbiAgICBwYXJ0aWFscyA9IGRhdGFbNV07XG4gICAgZGF0YVs1XSA9IHBhcnRpYWxzID8gY29tcG9zZUFyZ3NSaWdodChwYXJ0aWFscywgdmFsdWUsIHNvdXJjZVs2XSkgOiB2YWx1ZTtcbiAgICBkYXRhWzZdID0gcGFydGlhbHMgPyByZXBsYWNlSG9sZGVycyhkYXRhWzVdLCBQTEFDRUhPTERFUikgOiBzb3VyY2VbNl07XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgYXJnUG9zYCBpZiBhdmFpbGFibGUuXG4gIHZhbHVlID0gc291cmNlWzddO1xuICBpZiAodmFsdWUpIHtcbiAgICBkYXRhWzddID0gdmFsdWU7XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgYXJ5YCBpZiBpdCdzIHNtYWxsZXIuXG4gIGlmIChzcmNCaXRtYXNrICYgV1JBUF9BUllfRkxBRykge1xuICAgIGRhdGFbOF0gPSBkYXRhWzhdID09IG51bGwgPyBzb3VyY2VbOF0gOiBuYXRpdmVNaW4oZGF0YVs4XSwgc291cmNlWzhdKTtcbiAgfVxuICAvLyBVc2Ugc291cmNlIGBhcml0eWAgaWYgb25lIGlzIG5vdCBwcm92aWRlZC5cbiAgaWYgKGRhdGFbOV0gPT0gbnVsbCkge1xuICAgIGRhdGFbOV0gPSBzb3VyY2VbOV07XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgZnVuY2AgYW5kIG1lcmdlIGJpdG1hc2tzLlxuICBkYXRhWzBdID0gc291cmNlWzBdO1xuICBkYXRhWzFdID0gbmV3Qml0bWFzaztcblxuICByZXR1cm4gZGF0YTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZURhdGE7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcbiIsInZhciB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMi4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9GaW5pdGUoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9GaW5pdGUoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvRmluaXRlKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0Zpbml0ZSgnMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9GaW5pdGUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyB2YWx1ZSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9GaW5pdGU7XG4iLCJ2YXIgdG9GaW5pdGUgPSByZXF1aXJlKCcuL3RvRmluaXRlJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvSW50ZWdlcmBdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2ludGVnZXIpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9JbnRlZ2VyKDMuMik7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0ludGVnZXIoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvSW50ZWdlcignMy4yJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gdG9GaW5pdGUodmFsdWUpLFxuICAgICAgcmVtYWluZGVyID0gcmVzdWx0ICUgMTtcblxuICByZXR1cm4gcmVzdWx0ID09PSByZXN1bHQgPyAocmVtYWluZGVyID8gcmVzdWx0IC0gcmVtYWluZGVyIDogcmVzdWx0KSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9JbnRlZ2VyO1xuIiwidmFyIGJhc2VTZXREYXRhID0gcmVxdWlyZSgnLi9fYmFzZVNldERhdGEnKSxcbiAgICBjcmVhdGVCaW5kID0gcmVxdWlyZSgnLi9fY3JlYXRlQmluZCcpLFxuICAgIGNyZWF0ZUN1cnJ5ID0gcmVxdWlyZSgnLi9fY3JlYXRlQ3VycnknKSxcbiAgICBjcmVhdGVIeWJyaWQgPSByZXF1aXJlKCcuL19jcmVhdGVIeWJyaWQnKSxcbiAgICBjcmVhdGVQYXJ0aWFsID0gcmVxdWlyZSgnLi9fY3JlYXRlUGFydGlhbCcpLFxuICAgIGdldERhdGEgPSByZXF1aXJlKCcuL19nZXREYXRhJyksXG4gICAgbWVyZ2VEYXRhID0gcmVxdWlyZSgnLi9fbWVyZ2VEYXRhJyksXG4gICAgc2V0RGF0YSA9IHJlcXVpcmUoJy4vX3NldERhdGEnKSxcbiAgICBzZXRXcmFwVG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRXcmFwVG9TdHJpbmcnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBmdW5jdGlvbiBtZXRhZGF0YS4gKi9cbnZhciBXUkFQX0JJTkRfRkxBRyA9IDEsXG4gICAgV1JBUF9CSU5EX0tFWV9GTEFHID0gMixcbiAgICBXUkFQX0NVUlJZX0ZMQUcgPSA4LFxuICAgIFdSQVBfQ1VSUllfUklHSFRfRkxBRyA9IDE2LFxuICAgIFdSQVBfUEFSVElBTF9GTEFHID0gMzIsXG4gICAgV1JBUF9QQVJUSUFMX1JJR0hUX0ZMQUcgPSA2NDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGVpdGhlciBjdXJyaWVzIG9yIGludm9rZXMgYGZ1bmNgIHdpdGggb3B0aW9uYWxcbiAqIGB0aGlzYCBiaW5kaW5nIGFuZCBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmdW5jIFRoZSBmdW5jdGlvbiBvciBtZXRob2QgbmFtZSB0byB3cmFwLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgICAxIC0gYF8uYmluZGBcbiAqICAgIDIgLSBgXy5iaW5kS2V5YFxuICogICAgNCAtIGBfLmN1cnJ5YCBvciBgXy5jdXJyeVJpZ2h0YCBvZiBhIGJvdW5kIGZ1bmN0aW9uXG4gKiAgICA4IC0gYF8uY3VycnlgXG4gKiAgIDE2IC0gYF8uY3VycnlSaWdodGBcbiAqICAgMzIgLSBgXy5wYXJ0aWFsYFxuICogICA2NCAtIGBfLnBhcnRpYWxSaWdodGBcbiAqICAxMjggLSBgXy5yZWFyZ2BcbiAqICAyNTYgLSBgXy5hcnlgXG4gKiAgNTEyIC0gYF8uZmxpcGBcbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc10gVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdQb3NdIFRoZSBhcmd1bWVudCBwb3NpdGlvbnMgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJ5XSBUaGUgYXJpdHkgY2FwIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHldIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVXcmFwKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzLCBob2xkZXJzLCBhcmdQb3MsIGFyeSwgYXJpdHkpIHtcbiAgdmFyIGlzQmluZEtleSA9IGJpdG1hc2sgJiBXUkFQX0JJTkRfS0VZX0ZMQUc7XG4gIGlmICghaXNCaW5kS2V5ICYmIHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IHBhcnRpYWxzID8gcGFydGlhbHMubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBiaXRtYXNrICY9IH4oV1JBUF9QQVJUSUFMX0ZMQUcgfCBXUkFQX1BBUlRJQUxfUklHSFRfRkxBRyk7XG4gICAgcGFydGlhbHMgPSBob2xkZXJzID0gdW5kZWZpbmVkO1xuICB9XG4gIGFyeSA9IGFyeSA9PT0gdW5kZWZpbmVkID8gYXJ5IDogbmF0aXZlTWF4KHRvSW50ZWdlcihhcnkpLCAwKTtcbiAgYXJpdHkgPSBhcml0eSA9PT0gdW5kZWZpbmVkID8gYXJpdHkgOiB0b0ludGVnZXIoYXJpdHkpO1xuICBsZW5ndGggLT0gaG9sZGVycyA/IGhvbGRlcnMubGVuZ3RoIDogMDtcblxuICBpZiAoYml0bWFzayAmIFdSQVBfUEFSVElBTF9SSUdIVF9GTEFHKSB7XG4gICAgdmFyIHBhcnRpYWxzUmlnaHQgPSBwYXJ0aWFscyxcbiAgICAgICAgaG9sZGVyc1JpZ2h0ID0gaG9sZGVycztcblxuICAgIHBhcnRpYWxzID0gaG9sZGVycyA9IHVuZGVmaW5lZDtcbiAgfVxuICB2YXIgZGF0YSA9IGlzQmluZEtleSA/IHVuZGVmaW5lZCA6IGdldERhdGEoZnVuYyk7XG5cbiAgdmFyIG5ld0RhdGEgPSBbXG4gICAgZnVuYywgYml0bWFzaywgdGhpc0FyZywgcGFydGlhbHMsIGhvbGRlcnMsIHBhcnRpYWxzUmlnaHQsIGhvbGRlcnNSaWdodCxcbiAgICBhcmdQb3MsIGFyeSwgYXJpdHlcbiAgXTtcblxuICBpZiAoZGF0YSkge1xuICAgIG1lcmdlRGF0YShuZXdEYXRhLCBkYXRhKTtcbiAgfVxuICBmdW5jID0gbmV3RGF0YVswXTtcbiAgYml0bWFzayA9IG5ld0RhdGFbMV07XG4gIHRoaXNBcmcgPSBuZXdEYXRhWzJdO1xuICBwYXJ0aWFscyA9IG5ld0RhdGFbM107XG4gIGhvbGRlcnMgPSBuZXdEYXRhWzRdO1xuICBhcml0eSA9IG5ld0RhdGFbOV0gPSBuZXdEYXRhWzldID09PSB1bmRlZmluZWRcbiAgICA/IChpc0JpbmRLZXkgPyAwIDogZnVuYy5sZW5ndGgpXG4gICAgOiBuYXRpdmVNYXgobmV3RGF0YVs5XSAtIGxlbmd0aCwgMCk7XG5cbiAgaWYgKCFhcml0eSAmJiBiaXRtYXNrICYgKFdSQVBfQ1VSUllfRkxBRyB8IFdSQVBfQ1VSUllfUklHSFRfRkxBRykpIHtcbiAgICBiaXRtYXNrICY9IH4oV1JBUF9DVVJSWV9GTEFHIHwgV1JBUF9DVVJSWV9SSUdIVF9GTEFHKTtcbiAgfVxuICBpZiAoIWJpdG1hc2sgfHwgYml0bWFzayA9PSBXUkFQX0JJTkRfRkxBRykge1xuICAgIHZhciByZXN1bHQgPSBjcmVhdGVCaW5kKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcpO1xuICB9IGVsc2UgaWYgKGJpdG1hc2sgPT0gV1JBUF9DVVJSWV9GTEFHIHx8IGJpdG1hc2sgPT0gV1JBUF9DVVJSWV9SSUdIVF9GTEFHKSB7XG4gICAgcmVzdWx0ID0gY3JlYXRlQ3VycnkoZnVuYywgYml0bWFzaywgYXJpdHkpO1xuICB9IGVsc2UgaWYgKChiaXRtYXNrID09IFdSQVBfUEFSVElBTF9GTEFHIHx8IGJpdG1hc2sgPT0gKFdSQVBfQklORF9GTEFHIHwgV1JBUF9QQVJUSUFMX0ZMQUcpKSAmJiAhaG9sZGVycy5sZW5ndGgpIHtcbiAgICByZXN1bHQgPSBjcmVhdGVQYXJ0aWFsKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBjcmVhdGVIeWJyaWQuYXBwbHkodW5kZWZpbmVkLCBuZXdEYXRhKTtcbiAgfVxuICB2YXIgc2V0dGVyID0gZGF0YSA/IGJhc2VTZXREYXRhIDogc2V0RGF0YTtcbiAgcmV0dXJuIHNldFdyYXBUb1N0cmluZyhzZXR0ZXIocmVzdWx0LCBuZXdEYXRhKSwgZnVuYywgYml0bWFzayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlV3JhcDtcbiIsInZhciBjcmVhdGVXcmFwID0gcmVxdWlyZSgnLi9fY3JlYXRlV3JhcCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBmdW5jdGlvbiBtZXRhZGF0YS4gKi9cbnZhciBXUkFQX0FSWV9GTEFHID0gMTI4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHVwIHRvIGBuYCBhcmd1bWVudHMsXG4gKiBpZ25vcmluZyBhbnkgYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj1mdW5jLmxlbmd0aF0gVGhlIGFyaXR5IGNhcC5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ubWFwKFsnNicsICc4JywgJzEwJ10sIF8uYXJ5KHBhcnNlSW50LCAxKSk7XG4gKiAvLyA9PiBbNiwgOCwgMTBdXG4gKi9cbmZ1bmN0aW9uIGFyeShmdW5jLCBuLCBndWFyZCkge1xuICBuID0gZ3VhcmQgPyB1bmRlZmluZWQgOiBuO1xuICBuID0gKGZ1bmMgJiYgbiA9PSBudWxsKSA/IGZ1bmMubGVuZ3RoIDogbjtcbiAgcmV0dXJuIGNyZWF0ZVdyYXAoZnVuYywgV1JBUF9BUllfRkxBRywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnk7XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGlzTmV3ID0gIW9iamVjdDtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1ZhbHVlID0gc291cmNlW2tleV07XG4gICAgfVxuICAgIGlmIChpc05ldykge1xuICAgICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tEZWxldGU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrSGFzO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVDcmVhdGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tTZXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsIi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlXG4gKiBbYE9iamVjdC5rZXlzYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBleGNlcHQgdGhhdCBpdCBpbmNsdWRlcyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBuYXRpdmVLZXlzSW4ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKG9iamVjdCAhPSBudWxsKSB7XG4gICAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXNJbjtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5c0luID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5c0luJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c0luYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzSW4ob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzSW4ob2JqZWN0KTtcbiAgfVxuICB2YXIgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKCEoa2V5ID09ICdjb25zdHJ1Y3RvcicgJiYgKGlzUHJvdG8gfHwgIWhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXNJbjtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzSW4gPSByZXF1aXJlKCcuL19iYXNlS2V5c0luJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNJbjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25JbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduSW47XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2xzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHN5bWJvbHMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5U3ltYm9scyhzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5U3ltYm9scztcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0UHJvdG90eXBlID0gb3ZlckFyZyhPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvdG90eXBlO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyksXG4gICAgc3R1YkFycmF5ID0gcmVxdWlyZSgnLi9zdHViQXJyYXknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9sc0luID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB3aGlsZSAob2JqZWN0KSB7XG4gICAgYXJyYXlQdXNoKHJlc3VsdCwgZ2V0U3ltYm9scyhvYmplY3QpKTtcbiAgICBvYmplY3QgPSBnZXRQcm90b3R5cGUob2JqZWN0KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTeW1ib2xzSW47XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIGFuZCBpbmhlcml0ZWQgc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHNJbihzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHNJbihzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzSW47XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRBbGxLZXlzYCBhbmQgYGdldEFsbEtleXNJbmAgd2hpY2ggdXNlc1xuICogYGtleXNGdW5jYCBhbmQgYHN5bWJvbHNGdW5jYCB0byBnZXQgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3ltYm9sc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0Z1bmMsIHN5bWJvbHNGdW5jKSB7XG4gIHZhciByZXN1bHQgPSBrZXlzRnVuYyhvYmplY3QpO1xuICByZXR1cm4gaXNBcnJheShvYmplY3QpID8gcmVzdWx0IDogYXJyYXlQdXNoKHJlc3VsdCwgc3ltYm9sc0Z1bmMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldEFsbEtleXM7XG4iLCJ2YXIgYmFzZUdldEFsbEtleXMgPSByZXF1aXJlKCcuL19iYXNlR2V0QWxsS2V5cycpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXM7XG4iLCJ2YXIgYmFzZUdldEFsbEtleXMgPSByZXF1aXJlKCcuL19iYXNlR2V0QWxsS2V5cycpLFxuICAgIGdldFN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2dldFN5bWJvbHNJbicpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzSW4sIGdldFN5bWJvbHNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QWxsS2V5c0luO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0O1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IG5ldyBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQXJyYXlCdWZmZXI7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGRhdGFWaWV3YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFWaWV3IFRoZSBkYXRhIHZpZXcgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIGRhdGEgdmlldy5cbiAqL1xuZnVuY3Rpb24gY2xvbmVEYXRhVmlldyhkYXRhVmlldywgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKGRhdGFWaWV3LmJ1ZmZlcikgOiBkYXRhVmlldy5idWZmZXI7XG4gIHJldHVybiBuZXcgZGF0YVZpZXcuY29uc3RydWN0b3IoYnVmZmVyLCBkYXRhVmlldy5ieXRlT2Zmc2V0LCBkYXRhVmlldy5ieXRlTGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURhdGFWaWV3O1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgZmxhZ3MgZnJvbSB0aGVpciBjb2VyY2VkIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGByZWdleHBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcmVnZXhwIFRoZSByZWdleHAgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgcmVnZXhwLlxuICovXG5mdW5jdGlvbiBjbG9uZVJlZ0V4cChyZWdleHApIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyByZWdleHAuY29uc3RydWN0b3IocmVnZXhwLnNvdXJjZSwgcmVGbGFncy5leGVjKHJlZ2V4cCkpO1xuICByZXN1bHQubGFzdEluZGV4ID0gcmVnZXhwLmxhc3RJbmRleDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVJlZ0V4cDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB0eXBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVUeXBlZEFycmF5KHR5cGVkQXJyYXksIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcih0eXBlZEFycmF5LmJ1ZmZlcikgOiB0eXBlZEFycmF5LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVUeXBlZEFycmF5O1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyksXG4gICAgY2xvbmVEYXRhVmlldyA9IHJlcXVpcmUoJy4vX2Nsb25lRGF0YVZpZXcnKSxcbiAgICBjbG9uZVJlZ0V4cCA9IHJlcXVpcmUoJy4vX2Nsb25lUmVnRXhwJyksXG4gICAgY2xvbmVTeW1ib2wgPSByZXF1aXJlKCcuL19jbG9uZVN5bWJvbCcpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTWFwYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBgU2V0YCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGlzRGVlcCkge1xuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lQXJyYXlCdWZmZXIob2JqZWN0KTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3IoK29iamVjdCk7XG5cbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgcmV0dXJuIGNsb25lRGF0YVZpZXcob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBmbG9hdDMyVGFnOiBjYXNlIGZsb2F0NjRUYWc6XG4gICAgY2FzZSBpbnQ4VGFnOiBjYXNlIGludDE2VGFnOiBjYXNlIGludDMyVGFnOlxuICAgIGNhc2UgdWludDhUYWc6IGNhc2UgdWludDhDbGFtcGVkVGFnOiBjYXNlIHVpbnQxNlRhZzogY2FzZSB1aW50MzJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVUeXBlZEFycmF5KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yO1xuXG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3Iob2JqZWN0KTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgICAgcmV0dXJuIGNsb25lUmVnRXhwKG9iamVjdCk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcjtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgcmV0dXJuIGNsb25lU3ltYm9sKG9iamVjdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVCeVRhZztcbiIsInZhciBiYXNlQ3JlYXRlID0gcmVxdWlyZSgnLi9fYmFzZUNyZWF0ZScpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmICFpc1Byb3RvdHlwZShvYmplY3QpKVxuICAgID8gYmFzZUNyZWF0ZShnZXRQcm90b3R5cGUob2JqZWN0KSlcbiAgICA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXBgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hcCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IG1hcFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXA7XG4iLCJ2YXIgYmFzZUlzTWFwID0gcmVxdWlyZSgnLi9fYmFzZUlzTWFwJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc01hcCA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzTWFwO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTWFwYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBtYXAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc01hcChuZXcgTWFwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTWFwKG5ldyBXZWFrTWFwKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc01hcCA9IG5vZGVJc01hcCA/IGJhc2VVbmFyeShub2RlSXNNYXApIDogYmFzZUlzTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFwO1xuIiwidmFyIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1NldGAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzZXQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzU2V0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGdldFRhZyh2YWx1ZSkgPT0gc2V0VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1NldDtcbiIsInZhciBiYXNlSXNTZXQgPSByZXF1aXJlKCcuL19iYXNlSXNTZXQnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzU2V0ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNTZXQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTZXRgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNldCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU2V0KG5ldyBTZXQpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTZXQobmV3IFdlYWtTZXQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzU2V0ID0gbm9kZUlzU2V0ID8gYmFzZVVuYXJ5KG5vZGVJc1NldCkgOiBiYXNlSXNTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTZXQ7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBiYXNlQXNzaWduID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbicpLFxuICAgIGJhc2VBc3NpZ25JbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25JbicpLFxuICAgIGNsb25lQnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVCdWZmZXInKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBjb3B5U3ltYm9scyA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzJyksXG4gICAgY29weVN5bWJvbHNJbiA9IHJlcXVpcmUoJy4vX2NvcHlTeW1ib2xzSW4nKSxcbiAgICBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpLFxuICAgIGdldEFsbEtleXNJbiA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXNJbicpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9faW5pdENsb25lQXJyYXknKSxcbiAgICBpbml0Q2xvbmVCeVRhZyA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUJ5VGFnJyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzTWFwID0gcmVxdWlyZSgnLi9pc01hcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU2V0ID0gcmVxdWlyZSgnLi9pc1NldCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9ERUVQX0ZMQUcgPSAxLFxuICAgIENMT05FX0ZMQVRfRkxBRyA9IDIsXG4gICAgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBzdXBwb3J0ZWQgYnkgYF8uY2xvbmVgLiAqL1xudmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcbmNsb25lYWJsZVRhZ3NbYXJnc1RhZ10gPSBjbG9uZWFibGVUYWdzW2FycmF5VGFnXSA9XG5jbG9uZWFibGVUYWdzW2FycmF5QnVmZmVyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0YVZpZXdUYWddID1cbmNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGVUYWddID1cbmNsb25lYWJsZVRhZ3NbZmxvYXQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW2Zsb2F0NjRUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDE2VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbbWFwVGFnXSA9XG5jbG9uZWFibGVUYWdzW251bWJlclRhZ10gPSBjbG9uZWFibGVUYWdzW29iamVjdFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tyZWdleHBUYWddID0gY2xvbmVhYmxlVGFnc1tzZXRUYWddID1cbmNsb25lYWJsZVRhZ3Nbc3RyaW5nVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc3ltYm9sVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xuY2xvbmVhYmxlVGFnc1tlcnJvclRhZ10gPSBjbG9uZWFibGVUYWdzW2Z1bmNUYWddID1cbmNsb25lYWJsZVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgYW5kIGBfLmNsb25lRGVlcGAgd2hpY2ggdHJhY2tzXG4gKiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIERlZXAgY2xvbmVcbiAqICAyIC0gRmxhdHRlbiBpbmhlcml0ZWQgcHJvcGVydGllc1xuICogIDQgLSBDbG9uZSBzeW1ib2xzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIFRoZSBrZXkgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgcGFyZW50IG9iamVjdCBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGFuZCB0aGVpciBjbG9uZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFjaykge1xuICB2YXIgcmVzdWx0LFxuICAgICAgaXNEZWVwID0gYml0bWFzayAmIENMT05FX0RFRVBfRkxBRyxcbiAgICAgIGlzRmxhdCA9IGJpdG1hc2sgJiBDTE9ORV9GTEFUX0ZMQUcsXG4gICAgICBpc0Z1bGwgPSBiaXRtYXNrICYgQ0xPTkVfU1lNQk9MU19GTEFHO1xuXG4gIGlmIChjdXN0b21pemVyKSB7XG4gICAgcmVzdWx0ID0gb2JqZWN0ID8gY3VzdG9taXplcih2YWx1ZSwga2V5LCBvYmplY3QsIHN0YWNrKSA6IGN1c3RvbWl6ZXIodmFsdWUpO1xuICB9XG4gIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSk7XG4gIGlmIChpc0Fycikge1xuICAgIHJlc3VsdCA9IGluaXRDbG9uZUFycmF5KHZhbHVlKTtcbiAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgcmV0dXJuIGNvcHlBcnJheSh2YWx1ZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSksXG4gICAgICAgIGlzRnVuYyA9IHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG5cbiAgICBpZiAoaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2xvbmVCdWZmZXIodmFsdWUsIGlzRGVlcCk7XG4gICAgfVxuICAgIGlmICh0YWcgPT0gb2JqZWN0VGFnIHx8IHRhZyA9PSBhcmdzVGFnIHx8IChpc0Z1bmMgJiYgIW9iamVjdCkpIHtcbiAgICAgIHJlc3VsdCA9IChpc0ZsYXQgfHwgaXNGdW5jKSA/IHt9IDogaW5pdENsb25lT2JqZWN0KHZhbHVlKTtcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiBpc0ZsYXRcbiAgICAgICAgICA/IGNvcHlTeW1ib2xzSW4odmFsdWUsIGJhc2VBc3NpZ25JbihyZXN1bHQsIHZhbHVlKSlcbiAgICAgICAgICA6IGNvcHlTeW1ib2xzKHZhbHVlLCBiYXNlQXNzaWduKHJlc3VsdCwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjbG9uZWFibGVUYWdzW3RhZ10pIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdCA/IHZhbHVlIDoge307XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBpbml0Q2xvbmVCeVRhZyh2YWx1ZSwgdGFnLCBpc0RlZXApO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGl0cyBjb3JyZXNwb25kaW5nIGNsb25lLlxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldCh2YWx1ZSk7XG4gIGlmIChzdGFja2VkKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQ7XG4gIH1cbiAgc3RhY2suc2V0KHZhbHVlLCByZXN1bHQpO1xuXG4gIGlmIChpc1NldCh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlKSB7XG4gICAgICByZXN1bHQuYWRkKGJhc2VDbG9uZShzdWJWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3ViVmFsdWUsIHZhbHVlLCBzdGFjaykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmIChpc01hcCh2YWx1ZSkpIHtcbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIGtleXNGdW5jID0gaXNGdWxsXG4gICAgPyAoaXNGbGF0ID8gZ2V0QWxsS2V5c0luIDogZ2V0QWxsS2V5cylcbiAgICA6IChpc0ZsYXQgPyBrZXlzSW4gOiBrZXlzKTtcblxuICB2YXIgcHJvcHMgPSBpc0FyciA/IHVuZGVmaW5lZCA6IGtleXNGdW5jKHZhbHVlKTtcbiAgYXJyYXlFYWNoKHByb3BzIHx8IHZhbHVlLCBmdW5jdGlvbihzdWJWYWx1ZSwga2V5KSB7XG4gICAgaWYgKHByb3BzKSB7XG4gICAgICBrZXkgPSBzdWJWYWx1ZTtcbiAgICAgIHN1YlZhbHVlID0gdmFsdWVba2V5XTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfU1lNQk9MU19GTEFHID0gNDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2hhbGxvdyBjbG9uZSBvZiBgdmFsdWVgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZVxuICogW3N0cnVjdHVyZWQgY2xvbmUgYWxnb3JpdGhtXShodHRwczovL21kbi5pby9TdHJ1Y3R1cmVkX2Nsb25lX2FsZ29yaXRobSlcbiAqIGFuZCBzdXBwb3J0cyBjbG9uaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsIGRhdGUgb2JqZWN0cywgbWFwcyxcbiAqIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZFxuICogYXJyYXlzLiBUaGUgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBgYXJndW1lbnRzYCBvYmplY3RzIGFyZSBjbG9uZWRcbiAqIGFzIHBsYWluIG9iamVjdHMuIEFuIGVtcHR5IG9iamVjdCBpcyByZXR1cm5lZCBmb3IgdW5jbG9uZWFibGUgdmFsdWVzIHN1Y2hcbiAqIGFzIGVycm9yIG9iamVjdHMsIGZ1bmN0aW9ucywgRE9NIG5vZGVzLCBhbmQgV2Vha01hcHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqIEBzZWUgXy5jbG9uZURlZXBcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAnYSc6IDEgfSwgeyAnYic6IDIgfV07XG4gKlxuICogdmFyIHNoYWxsb3cgPSBfLmNsb25lKG9iamVjdHMpO1xuICogY29uc29sZS5sb2coc2hhbGxvd1swXSA9PT0gb2JqZWN0c1swXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNsb25lKHZhbHVlKSB7XG4gIHJldHVybiBiYXNlQ2xvbmUodmFsdWUsIENMT05FX1NZTUJPTFNfRkxBRyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG4iLCJ2YXIgY3JlYXRlV3JhcCA9IHJlcXVpcmUoJy4vX2NyZWF0ZVdyYXAnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgZnVuY3Rpb24gbWV0YWRhdGEuICovXG52YXIgV1JBUF9DVVJSWV9GTEFHID0gODtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGFyZ3VtZW50cyBvZiBgZnVuY2AgYW5kIGVpdGhlciBpbnZva2VzXG4gKiBgZnVuY2AgcmV0dXJuaW5nIGl0cyByZXN1bHQsIGlmIGF0IGxlYXN0IGBhcml0eWAgbnVtYmVyIG9mIGFyZ3VtZW50cyBoYXZlXG4gKiBiZWVuIHByb3ZpZGVkLCBvciByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHRoZSByZW1haW5pbmcgYGZ1bmNgXG4gKiBhcmd1bWVudHMsIGFuZCBzbyBvbi4gVGhlIGFyaXR5IG9mIGBmdW5jYCBtYXkgYmUgc3BlY2lmaWVkIGlmIGBmdW5jLmxlbmd0aGBcbiAqIGlzIG5vdCBzdWZmaWNpZW50LlxuICpcbiAqIFRoZSBgXy5jdXJyeS5wbGFjZWhvbGRlcmAgdmFsdWUsIHdoaWNoIGRlZmF1bHRzIHRvIGBfYCBpbiBtb25vbGl0aGljIGJ1aWxkcyxcbiAqIG1heSBiZSB1c2VkIGFzIGEgcGxhY2Vob2xkZXIgZm9yIHByb3ZpZGVkIGFyZ3VtZW50cy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgZG9lc24ndCBzZXQgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgb2YgY3VycmllZCBmdW5jdGlvbnMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHk9ZnVuYy5sZW5ndGhdIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY3VycmllZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFiYyA9IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAqICAgcmV0dXJuIFthLCBiLCBjXTtcbiAqIH07XG4gKlxuICogdmFyIGN1cnJpZWQgPSBfLmN1cnJ5KGFiYyk7XG4gKlxuICogY3VycmllZCgxKSgyKSgzKTtcbiAqIC8vID0+IFsxLCAyLCAzXVxuICpcbiAqIGN1cnJpZWQoMSwgMikoMyk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqXG4gKiBjdXJyaWVkKDEsIDIsIDMpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogLy8gQ3VycmllZCB3aXRoIHBsYWNlaG9sZGVycy5cbiAqIGN1cnJpZWQoMSkoXywgMykoMik7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqL1xuZnVuY3Rpb24gY3VycnkoZnVuYywgYXJpdHksIGd1YXJkKSB7XG4gIGFyaXR5ID0gZ3VhcmQgPyB1bmRlZmluZWQgOiBhcml0eTtcbiAgdmFyIHJlc3VsdCA9IGNyZWF0ZVdyYXAoZnVuYywgV1JBUF9DVVJSWV9GTEFHLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgYXJpdHkpO1xuICByZXN1bHQucGxhY2Vob2xkZXIgPSBjdXJyeS5wbGFjZWhvbGRlcjtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gQXNzaWduIGRlZmF1bHQgcGxhY2Vob2xkZXJzLlxuY3VycnkucGxhY2Vob2xkZXIgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBjdXJyeTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGluZmVyIHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3Rvci4gKi9cbnZhciBvYmplY3RDdG9yU3RyaW5nID0gZnVuY1RvU3RyaW5nLmNhbGwoT2JqZWN0KTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgdGhhdCBpcywgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlXG4gKiBgT2JqZWN0YCBjb25zdHJ1Y3RvciBvciBvbmUgd2l0aCBhIGBbW1Byb3RvdHlwZV1dYCBvZiBgbnVsbGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjguMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChuZXcgRm9vKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdCh7ICd4JzogMCwgJ3knOiAwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgfHwgYmFzZUdldFRhZyh2YWx1ZSkgIT0gb2JqZWN0VGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwcm90byA9IGdldFByb3RvdHlwZSh2YWx1ZSk7XG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBDdG9yID0gaGFzT3duUHJvcGVydHkuY2FsbChwcm90bywgJ2NvbnN0cnVjdG9yJykgJiYgcHJvdG8uY29uc3RydWN0b3I7XG4gIHJldHVybiB0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IgaW5zdGFuY2VvZiBDdG9yICYmXG4gICAgZnVuY1RvU3RyaW5nLmNhbGwoQ3RvcikgPT0gb2JqZWN0Q3RvclN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1BsYWluT2JqZWN0O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi9pc1BsYWluT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBkb21FeGNUYWcgPSAnW29iamVjdCBET01FeGNlcHRpb25dJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gYEVycm9yYCwgYEV2YWxFcnJvcmAsIGBSYW5nZUVycm9yYCwgYFJlZmVyZW5jZUVycm9yYCxcbiAqIGBTeW50YXhFcnJvcmAsIGBUeXBlRXJyb3JgLCBvciBgVVJJRXJyb3JgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBlcnJvciBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Vycm9yKG5ldyBFcnJvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Vycm9yKEVycm9yKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdExpa2UodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBlcnJvclRhZyB8fCB0YWcgPT0gZG9tRXhjVGFnIHx8XG4gICAgKHR5cGVvZiB2YWx1ZS5tZXNzYWdlID09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZS5uYW1lID09ICdzdHJpbmcnICYmICFpc1BsYWluT2JqZWN0KHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcnJvcjtcbiIsInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFdlYWtNYXBgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHdlYWsgbWFwLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNXZWFrTWFwKG5ldyBXZWFrTWFwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzV2Vha01hcChuZXcgTWFwKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzV2Vha01hcCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBnZXRUYWcodmFsdWUpID09IHdlYWtNYXBUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNXZWFrTWFwO1xuIiwiLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGFkZFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAYWxpYXMgcHVzaFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVBZGQodmFsdWUpIHtcbiAgdGhpcy5fX2RhdGFfXy5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0Q2FjaGVBZGQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0Q2FjaGVIYXM7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpLFxuICAgIHNldENhY2hlQWRkID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVBZGQnKSxcbiAgICBzZXRDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX3NldENhY2hlSGFzJyk7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID09IG51bGwgPyAwIDogdmFsdWVzLmxlbmd0aDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxubW9kdWxlLmV4cG9ydHMgPSBTZXRDYWNoZTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNvbWVgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheVNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlTb21lO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FjaGVIYXM7XG4iLCJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5U29tZSA9IHJlcXVpcmUoJy4vX2FycmF5U29tZScpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEFycmF5cztcbiIsIi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwVG9BcnJheTtcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxCeVRhZztcbiIsInZhciBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBvYmpQcm9wcyA9IGdldEFsbEtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0gZ2V0QWxsS2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIG9iamVjdCk7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbE9iamVjdHM7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9fZXF1YWxCeVRhZycpLFxuICAgIGVxdWFsT2JqZWN0cyA9IHJlcXVpcmUoJy4vX2VxdWFsT2JqZWN0cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbERlZXA7XG4iLCJ2YXIgYmFzZUlzRXF1YWxEZWVwID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWxEZWVwJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBDT01QQVJFX1BBUlRJQUxfRkxBRyB8IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcsIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWF0Y2g7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpZiBzdWl0YWJsZSBmb3Igc3RyaWN0XG4gKiAgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgJiYgIWlzT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmljdENvbXBhcmFibGU7XG4iLCJ2YXIgaXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9faXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIEdldHMgdGhlIHByb3BlcnR5IG5hbWVzLCB2YWx1ZXMsIGFuZCBjb21wYXJlIGZsYWdzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG1hdGNoIGRhdGEgb2YgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGdldE1hdGNoRGF0YShvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXMob2JqZWN0KSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGtleSA9IHJlc3VsdFtsZW5ndGhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgcmVzdWx0W2xlbmd0aF0gPSBba2V5LCB2YWx1ZSwgaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXRjaERhdGE7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgbWF0Y2hlc1Byb3BlcnR5YCBmb3Igc291cmNlIHZhbHVlcyBzdWl0YWJsZVxuICogZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKGtleSwgc3JjVmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0W2tleV0gPT09IHNyY1ZhbHVlICYmXG4gICAgICAoc3JjVmFsdWUgIT09IHVuZGVmaW5lZCB8fCAoa2V5IGluIE9iamVjdChvYmplY3QpKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlc1N0cmljdENvbXBhcmFibGU7XG4iLCJ2YXIgYmFzZUlzTWF0Y2ggPSByZXF1aXJlKCcuL19iYXNlSXNNYXRjaCcpLFxuICAgIGdldE1hdGNoRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hdGNoRGF0YScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBtYXRjaERhdGEgPSBnZXRNYXRjaERhdGEoc291cmNlKTtcbiAgaWYgKG1hdGNoRGF0YS5sZW5ndGggPT0gMSAmJiBtYXRjaERhdGFbMF1bMl0pIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUobWF0Y2hEYXRhWzBdWzBdLCBtYXRjaERhdGFbMF1bMV0pO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXM7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsInZhciBtZW1vaXplID0gcmVxdWlyZSgnLi9tZW1vaXplJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBtYXhpbXVtIG1lbW9pemUgY2FjaGUgc2l6ZS4gKi9cbnZhciBNQVhfTUVNT0laRV9TSVpFID0gNTAwO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tZW1vaXplYCB3aGljaCBjbGVhcnMgdGhlIG1lbW9pemVkIGZ1bmN0aW9uJ3NcbiAqIGNhY2hlIHdoZW4gaXQgZXhjZWVkcyBgTUFYX01FTU9JWkVfU0laRWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtZW1vaXplQ2FwcGVkKGZ1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IG1lbW9pemUoZnVuYywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGNhY2hlLnNpemUgPT09IE1BWF9NRU1PSVpFX1NJWkUpIHtcbiAgICAgIGNhY2hlLmNsZWFyKCk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH0pO1xuXG4gIHZhciBjYWNoZSA9IHJlc3VsdC5jYWNoZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplQ2FwcGVkO1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAoc3RyaW5nLmNoYXJDb2RlQXQoMCkgPT09IDQ2IC8qIC4gKi8pIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN1YlN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TWFwO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9TdHJpbmc7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBzdHJpbmdUb1BhdGggPSByZXF1aXJlKCcuL19zdHJpbmdUb1BhdGgnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9LZXk7XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5nZXRgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVmYXVsdCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXQob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IDAsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICB3aGlsZSAob2JqZWN0ICE9IG51bGwgJiYgaW5kZXggPCBsZW5ndGgpIHtcbiAgICBvYmplY3QgPSBvYmplY3RbdG9LZXkocGF0aFtpbmRleCsrXSldO1xuICB9XG4gIHJldHVybiAoaW5kZXggJiYgaW5kZXggPT0gbGVuZ3RoKSA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0O1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGBvYmplY3RgLiBJZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXNcbiAqIGB1bmRlZmluZWRgLCB0aGUgYGRlZmF1bHRWYWx1ZWAgaXMgcmV0dXJuZWQgaW4gaXRzIHBsYWNlLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy43LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdIFRoZSB2YWx1ZSByZXR1cm5lZCBmb3IgYHVuZGVmaW5lZGAgcmVzb2x2ZWQgdmFsdWVzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFt7ICdiJzogeyAnYyc6IDMgfSB9XSB9O1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2FbMF0uYi5jJyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCBbJ2EnLCAnMCcsICdiJywgJ2MnXSk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCAnYS5iLmMnLCAnZGVmYXVsdCcpO1xuICogLy8gPT4gJ2RlZmF1bHQnXG4gKi9cbmZ1bmN0aW9uIGdldChvYmplY3QsIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXQ7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc0luYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzSW4ob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGtleSBpbiBPYmplY3Qob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzSW47XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGV4aXN0cyBvbiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYXNGdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjayBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzUGF0aChvYmplY3QsIHBhdGgsIGhhc0Z1bmMpIHtcbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoIShyZXN1bHQgPSBvYmplY3QgIT0gbnVsbCAmJiBoYXNGdW5jKG9iamVjdCwga2V5KSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgfVxuICBpZiAocmVzdWx0IHx8ICsraW5kZXggIT0gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBvYmplY3QubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUGF0aDtcbiIsInZhciBiYXNlSGFzSW4gPSByZXF1aXJlKCcuL19iYXNlSGFzSW4nKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3Qgb3IgaW5oZXJpdGVkIHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2InKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhc0luKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzSW47XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpLFxuICAgIGdldCA9IHJlcXVpcmUoJy4vZ2V0JyksXG4gICAgaGFzSW4gPSByZXF1aXJlKCcuL2hhc0luJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzUHJvcGVydHlgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNyY1ZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXNQcm9wZXJ0eShwYXRoLCBzcmNWYWx1ZSkge1xuICBpZiAoaXNLZXkocGF0aCkgJiYgaXNTdHJpY3RDb21wYXJhYmxlKHNyY1ZhbHVlKSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSh0b0tleShwYXRoKSwgc3JjVmFsdWUpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIgb2JqVmFsdWUgPSBnZXQob2JqZWN0LCBwYXRoKTtcbiAgICByZXR1cm4gKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgb2JqVmFsdWUgPT09IHNyY1ZhbHVlKVxuICAgICAgPyBoYXNJbihvYmplY3QsIHBhdGgpXG4gICAgICA6IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgfCBDT01QQVJFX1VOT1JERVJFRF9GTEFHKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlc1Byb3BlcnR5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VQcm9wZXJ0eWAgd2hpY2ggc3VwcG9ydHMgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5RGVlcDtcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHknKSxcbiAgICBiYXNlUHJvcGVydHlEZWVwID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5RGVlcCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGEgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7ICdhJzogeyAnYic6IDIgfSB9LFxuICogICB7ICdhJzogeyAnYic6IDEgfSB9XG4gKiBdO1xuICpcbiAqIF8ubWFwKG9iamVjdHMsIF8ucHJvcGVydHkoJ2EuYicpKTtcbiAqIC8vID0+IFsyLCAxXVxuICpcbiAqIF8ubWFwKF8uc29ydEJ5KG9iamVjdHMsIF8ucHJvcGVydHkoWydhJywgJ2InXSkpLCAnYS5iJyk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqL1xuZnVuY3Rpb24gcHJvcGVydHkocGF0aCkge1xuICByZXR1cm4gaXNLZXkocGF0aCkgPyBiYXNlUHJvcGVydHkodG9LZXkocGF0aCkpIDogYmFzZVByb3BlcnR5RGVlcChwYXRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eTtcbiIsInZhciBiYXNlTWF0Y2hlcyA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzJyksXG4gICAgYmFzZU1hdGNoZXNQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgcHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXRlcmF0ZWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IFt2YWx1ZT1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhbiBpdGVyYXRlZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgaXRlcmF0ZWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJdGVyYXRlZSh2YWx1ZSkge1xuICAvLyBEb24ndCBzdG9yZSB0aGUgYHR5cGVvZmAgcmVzdWx0IGluIGEgdmFyaWFibGUgdG8gYXZvaWQgYSBKSVQgYnVnIGluIFNhZmFyaSA5LlxuICAvLyBTZWUgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE1NjAzNCBmb3IgbW9yZSBkZXRhaWxzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgPyBiYXNlTWF0Y2hlc1Byb3BlcnR5KHZhbHVlWzBdLCB2YWx1ZVsxXSlcbiAgICAgIDogYmFzZU1hdGNoZXModmFsdWUpO1xuICB9XG4gIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUl0ZXJhdGVlO1xuIiwidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDE7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYXJndW1lbnRzIG9mIHRoZSBjcmVhdGVkXG4gKiBmdW5jdGlvbi4gSWYgYGZ1bmNgIGlzIGEgcHJvcGVydHkgbmFtZSwgdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJucyB0aGVcbiAqIHByb3BlcnR5IHZhbHVlIGZvciBhIGdpdmVuIGVsZW1lbnQuIElmIGBmdW5jYCBpcyBhbiBhcnJheSBvciBvYmplY3QsIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbiByZXR1cm5zIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBjb250YWluIHRoZSBlcXVpdmFsZW50XG4gKiBzb3VyY2UgcHJvcGVydGllcywgb3RoZXJ3aXNlIGl0IHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSBbZnVuYz1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhIGNhbGxiYWNrLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYWxsYmFjay5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gKiBdO1xuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbHRlcih1c2VycywgXy5pdGVyYXRlZSh7ICd1c2VyJzogJ2Jhcm5leScsICdhY3RpdmUnOiB0cnVlIH0pKTtcbiAqIC8vID0+IFt7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfV1cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbHRlcih1c2VycywgXy5pdGVyYXRlZShbJ3VzZXInLCAnZnJlZCddKSk7XG4gKiAvLyA9PiBbeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1dXG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLm1hcCh1c2VycywgXy5pdGVyYXRlZSgndXNlcicpKTtcbiAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICpcbiAqIC8vIENyZWF0ZSBjdXN0b20gaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqIF8uaXRlcmF0ZWUgPSBfLndyYXAoXy5pdGVyYXRlZSwgZnVuY3Rpb24oaXRlcmF0ZWUsIGZ1bmMpIHtcbiAqICAgcmV0dXJuICFfLmlzUmVnRXhwKGZ1bmMpID8gaXRlcmF0ZWUoZnVuYykgOiBmdW5jdGlvbihzdHJpbmcpIHtcbiAqICAgICByZXR1cm4gZnVuYy50ZXN0KHN0cmluZyk7XG4gKiAgIH07XG4gKiB9KTtcbiAqXG4gKiBfLmZpbHRlcihbJ2FiYycsICdkZWYnXSwgL2VmLyk7XG4gKiAvLyA9PiBbJ2RlZiddXG4gKi9cbmZ1bmN0aW9uIGl0ZXJhdGVlKGZ1bmMpIHtcbiAgcmV0dXJuIGJhc2VJdGVyYXRlZSh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nID8gZnVuYyA6IGJhc2VDbG9uZShmdW5jLCBDTE9ORV9ERUVQX0ZMQUcpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpdGVyYXRlZTtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwcmVhZGFibGVTeW1ib2wgPSBTeW1ib2wgPyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZmxhdHRlbmFibGUgYGFyZ3VtZW50c2Agb2JqZWN0IG9yIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZsYXR0ZW5hYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzRmxhdHRlbmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSB8fFxuICAgICEhKHNwcmVhZGFibGVTeW1ib2wgJiYgdmFsdWUgJiYgdmFsdWVbc3ByZWFkYWJsZVN5bWJvbF0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRmxhdHRlbmFibGU7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgaXNGbGF0dGVuYWJsZSA9IHJlcXVpcmUoJy4vX2lzRmxhdHRlbmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mbGF0dGVuYCB3aXRoIHN1cHBvcnQgZm9yIHJlc3RyaWN0aW5nIGZsYXR0ZW5pbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGRlcHRoIFRoZSBtYXhpbXVtIHJlY3Vyc2lvbiBkZXB0aC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3ByZWRpY2F0ZT1pc0ZsYXR0ZW5hYmxlXSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNTdHJpY3RdIFJlc3RyaWN0IHRvIHZhbHVlcyB0aGF0IHBhc3MgYHByZWRpY2F0ZWAgY2hlY2tzLlxuICogQHBhcmFtIHtBcnJheX0gW3Jlc3VsdD1bXV0gVGhlIGluaXRpYWwgcmVzdWx0IHZhbHVlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlRmxhdHRlbihhcnJheSwgZGVwdGgsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IGlzRmxhdHRlbmFibGUpO1xuICByZXN1bHQgfHwgKHJlc3VsdCA9IFtdKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAoZGVwdGggPiAwICYmIHByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICAgIGlmIChkZXB0aCA+IDEpIHtcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgICAgYmFzZUZsYXR0ZW4odmFsdWUsIGRlcHRoIC0gMSwgcHJlZGljYXRlLCBpc1N0cmljdCwgcmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5UHVzaChyZXN1bHQsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFpc1N0cmljdCkge1xuICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZsYXR0ZW47XG4iLCJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpO1xuXG4vKipcbiAqIEZsYXR0ZW5zIGBhcnJheWAgYSBzaW5nbGUgbGV2ZWwgZGVlcC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZsYXR0ZW4oWzEsIFsyLCBbMywgWzRdXSwgNV1dKTtcbiAqIC8vID0+IFsxLCAyLCBbMywgWzRdXSwgNV1cbiAqL1xuZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIHJldHVybiBsZW5ndGggPyBiYXNlRmxhdHRlbihhcnJheSwgMSkgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuO1xuIiwidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyUmVzdDtcbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnLi9mbGF0dGVuJyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCBmbGF0dGVucyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBmbGF0UmVzdChmdW5jKSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCB1bmRlZmluZWQsIGZsYXR0ZW4pLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXRSZXN0O1xuIiwidmFyIGNyZWF0ZVdyYXAgPSByZXF1aXJlKCcuL19jcmVhdGVXcmFwJyksXG4gICAgZmxhdFJlc3QgPSByZXF1aXJlKCcuL19mbGF0UmVzdCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBmdW5jdGlvbiBtZXRhZGF0YS4gKi9cbnZhciBXUkFQX1JFQVJHX0ZMQUcgPSAyNTY7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBhcmd1bWVudHMgYXJyYW5nZWQgYWNjb3JkaW5nXG4gKiB0byB0aGUgc3BlY2lmaWVkIGBpbmRleGVzYCB3aGVyZSB0aGUgYXJndW1lbnQgdmFsdWUgYXQgdGhlIGZpcnN0IGluZGV4IGlzXG4gKiBwcm92aWRlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQsIHRoZSBhcmd1bWVudCB2YWx1ZSBhdCB0aGUgc2Vjb25kIGluZGV4IGlzXG4gKiBwcm92aWRlZCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50LCBhbmQgc28gb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZWFycmFuZ2UgYXJndW1lbnRzIGZvci5cbiAqIEBwYXJhbSB7Li4uKG51bWJlcnxudW1iZXJbXSl9IGluZGV4ZXMgVGhlIGFycmFuZ2VkIGFyZ3VtZW50IGluZGV4ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHJlYXJnZWQgPSBfLnJlYXJnKGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAqICAgcmV0dXJuIFthLCBiLCBjXTtcbiAqIH0sIFsyLCAwLCAxXSk7XG4gKlxuICogcmVhcmdlZCgnYicsICdjJywgJ2EnKVxuICogLy8gPT4gWydhJywgJ2InLCAnYyddXG4gKi9cbnZhciByZWFyZyA9IGZsYXRSZXN0KGZ1bmN0aW9uKGZ1bmMsIGluZGV4ZXMpIHtcbiAgcmV0dXJuIGNyZWF0ZVdyYXAoZnVuYywgV1JBUF9SRUFSR19GTEFHLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBpbmRleGVzKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlYXJnO1xuIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1BhdGgoJ2EuYi5jJyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ11cbiAqXG4gKiBfLnRvUGF0aCgnYVswXS5iLmMnKTtcbiAqIC8vID0+IFsnYScsICcwJywgJ2InLCAnYyddXG4gKi9cbmZ1bmN0aW9uIHRvUGF0aCh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIHRvS2V5KTtcbiAgfVxuICByZXR1cm4gaXNTeW1ib2wodmFsdWUpID8gW3ZhbHVlXSA6IGNvcHlBcnJheShzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9QYXRoO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdhcnknOiByZXF1aXJlKCcuLi9hcnknKSxcbiAgJ2Fzc2lnbic6IHJlcXVpcmUoJy4uL19iYXNlQXNzaWduJyksXG4gICdjbG9uZSc6IHJlcXVpcmUoJy4uL2Nsb25lJyksXG4gICdjdXJyeSc6IHJlcXVpcmUoJy4uL2N1cnJ5JyksXG4gICdmb3JFYWNoJzogcmVxdWlyZSgnLi4vX2FycmF5RWFjaCcpLFxuICAnaXNBcnJheSc6IHJlcXVpcmUoJy4uL2lzQXJyYXknKSxcbiAgJ2lzRXJyb3InOiByZXF1aXJlKCcuLi9pc0Vycm9yJyksXG4gICdpc0Z1bmN0aW9uJzogcmVxdWlyZSgnLi4vaXNGdW5jdGlvbicpLFxuICAnaXNXZWFrTWFwJzogcmVxdWlyZSgnLi4vaXNXZWFrTWFwJyksXG4gICdpdGVyYXRlZSc6IHJlcXVpcmUoJy4uL2l0ZXJhdGVlJyksXG4gICdrZXlzJzogcmVxdWlyZSgnLi4vX2Jhc2VLZXlzJyksXG4gICdyZWFyZyc6IHJlcXVpcmUoJy4uL3JlYXJnJyksXG4gICd0b0ludGVnZXInOiByZXF1aXJlKCcuLi90b0ludGVnZXInKSxcbiAgJ3RvUGF0aCc6IHJlcXVpcmUoJy4uL3RvUGF0aCcpXG59O1xuIiwidmFyIGJhc2VDb252ZXJ0ID0gcmVxdWlyZSgnLi9fYmFzZUNvbnZlcnQnKSxcbiAgICB1dGlsID0gcmVxdWlyZSgnLi9fdXRpbCcpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCBvZiBgbmFtZWAgdG8gYW4gaW1tdXRhYmxlIGF1dG8tY3VycmllZCBpdGVyYXRlZS1maXJzdCBkYXRhLWxhc3RcbiAqIHZlcnNpb24gd2l0aCBjb252ZXJzaW9uIGBvcHRpb25zYCBhcHBsaWVkLiBJZiBgbmFtZWAgaXMgYW4gb2JqZWN0IGl0cyBtZXRob2RzXG4gKiB3aWxsIGJlIGNvbnZlcnRlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmdW5jXSBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LiBTZWUgYGJhc2VDb252ZXJ0YCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufE9iamVjdH0gUmV0dXJucyB0aGUgY29udmVydGVkIGZ1bmN0aW9uIG9yIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY29udmVydChuYW1lLCBmdW5jLCBvcHRpb25zKSB7XG4gIHJldHVybiBiYXNlQ29udmVydCh1dGlsLCBuYW1lLCBmdW5jLCBvcHRpb25zKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb252ZXJ0O1xuIiwidmFyIExvZGFzaFdyYXBwZXIgPSByZXF1aXJlKCcuL19Mb2Rhc2hXcmFwcGVyJyksXG4gICAgZmxhdFJlc3QgPSByZXF1aXJlKCcuL19mbGF0UmVzdCcpLFxuICAgIGdldERhdGEgPSByZXF1aXJlKCcuL19nZXREYXRhJyksXG4gICAgZ2V0RnVuY05hbWUgPSByZXF1aXJlKCcuL19nZXRGdW5jTmFtZScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0xhemlhYmxlID0gcmVxdWlyZSgnLi9faXNMYXppYWJsZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBmdW5jdGlvbiBtZXRhZGF0YS4gKi9cbnZhciBXUkFQX0NVUlJZX0ZMQUcgPSA4LFxuICAgIFdSQVBfUEFSVElBTF9GTEFHID0gMzIsXG4gICAgV1JBUF9BUllfRkxBRyA9IDEyOCxcbiAgICBXUkFQX1JFQVJHX0ZMQUcgPSAyNTY7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBfLmZsb3dgIG9yIGBfLmZsb3dSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZmxvdyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmxvdyhmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZsYXRSZXN0KGZ1bmN0aW9uKGZ1bmNzKSB7XG4gICAgdmFyIGxlbmd0aCA9IGZ1bmNzLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBsZW5ndGgsXG4gICAgICAgIHByZXJlcSA9IExvZGFzaFdyYXBwZXIucHJvdG90eXBlLnRocnU7XG5cbiAgICBpZiAoZnJvbVJpZ2h0KSB7XG4gICAgICBmdW5jcy5yZXZlcnNlKCk7XG4gICAgfVxuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICB2YXIgZnVuYyA9IGZ1bmNzW2luZGV4XTtcbiAgICAgIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcmVyZXEgJiYgIXdyYXBwZXIgJiYgZ2V0RnVuY05hbWUoZnVuYykgPT0gJ3dyYXBwZXInKSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0gbmV3IExvZGFzaFdyYXBwZXIoW10sIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpbmRleCA9IHdyYXBwZXIgPyBpbmRleCA6IGxlbmd0aDtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgZnVuYyA9IGZ1bmNzW2luZGV4XTtcblxuICAgICAgdmFyIGZ1bmNOYW1lID0gZ2V0RnVuY05hbWUoZnVuYyksXG4gICAgICAgICAgZGF0YSA9IGZ1bmNOYW1lID09ICd3cmFwcGVyJyA/IGdldERhdGEoZnVuYykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChkYXRhICYmIGlzTGF6aWFibGUoZGF0YVswXSkgJiZcbiAgICAgICAgICAgIGRhdGFbMV0gPT0gKFdSQVBfQVJZX0ZMQUcgfCBXUkFQX0NVUlJZX0ZMQUcgfCBXUkFQX1BBUlRJQUxfRkxBRyB8IFdSQVBfUkVBUkdfRkxBRykgJiZcbiAgICAgICAgICAgICFkYXRhWzRdLmxlbmd0aCAmJiBkYXRhWzldID09IDFcbiAgICAgICAgICApIHtcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJbZ2V0RnVuY05hbWUoZGF0YVswXSldLmFwcGx5KHdyYXBwZXIsIGRhdGFbM10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlciA9IChmdW5jLmxlbmd0aCA9PSAxICYmIGlzTGF6aWFibGUoZnVuYykpXG4gICAgICAgICAgPyB3cmFwcGVyW2Z1bmNOYW1lXSgpXG4gICAgICAgICAgOiB3cmFwcGVyLnRocnUoZnVuYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgIHZhbHVlID0gYXJnc1swXTtcblxuICAgICAgaWYgKHdyYXBwZXIgJiYgYXJncy5sZW5ndGggPT0gMSAmJiBpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gd3JhcHBlci5wbGFudCh2YWx1ZSkudmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IDAsXG4gICAgICAgICAgcmVzdWx0ID0gbGVuZ3RoID8gZnVuY3NbaW5kZXhdLmFwcGx5KHRoaXMsIGFyZ3MpIDogdmFsdWU7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmNzW2luZGV4XS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZsb3c7XG4iLCJ2YXIgY3JlYXRlRmxvdyA9IHJlcXVpcmUoJy4vX2NyZWF0ZUZsb3cnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIGdpdmVuIGZ1bmN0aW9uc1xuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24sIHdoZXJlIGVhY2ggc3VjY2Vzc2l2ZVxuICogaW52b2NhdGlvbiBpcyBzdXBwbGllZCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBwcmV2aW91cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsuLi4oRnVuY3Rpb258RnVuY3Rpb25bXSl9IFtmdW5jc10gVGhlIGZ1bmN0aW9ucyB0byBpbnZva2UuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb21wb3NpdGUgZnVuY3Rpb24uXG4gKiBAc2VlIF8uZmxvd1JpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIHNxdWFyZShuKSB7XG4gKiAgIHJldHVybiBuICogbjtcbiAqIH1cbiAqXG4gKiB2YXIgYWRkU3F1YXJlID0gXy5mbG93KFtfLmFkZCwgc3F1YXJlXSk7XG4gKiBhZGRTcXVhcmUoMSwgMik7XG4gKiAvLyA9PiA5XG4gKi9cbnZhciBmbG93ID0gY3JlYXRlRmxvdygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZsb3c7XG4iLCJ2YXIgY29udmVydCA9IHJlcXVpcmUoJy4vY29udmVydCcpLFxuICAgIGZ1bmMgPSBjb252ZXJ0KCdmbG93JywgcmVxdWlyZSgnLi4vZmxvdycpKTtcblxuZnVuYy5wbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vcGxhY2Vob2xkZXInKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuYztcbiIsInZhciBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyk7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICogZXF1aXZhbGVudC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsXG4gKiBkYXRlIG9iamVjdHMsIGVycm9yIG9iamVjdHMsIG1hcHMsIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsXG4gKiBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWQgYXJyYXlzLiBgT2JqZWN0YCBvYmplY3RzIGFyZSBjb21wYXJlZFxuICogYnkgdGhlaXIgb3duLCBub3QgaW5oZXJpdGVkLCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuIEZ1bmN0aW9ucyBhbmQgRE9NXG4gKiBub2RlcyBhcmUgY29tcGFyZWQgYnkgc3RyaWN0IGVxdWFsaXR5LCBpLmUuIGA9PT1gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmlzRXF1YWwob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogb2JqZWN0ID09PSBvdGhlcjtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWw7XG4iLCJ2YXIgY29udmVydCA9IHJlcXVpcmUoJy4vY29udmVydCcpLFxuICAgIGZ1bmMgPSBjb252ZXJ0KCdpc0VxdWFsJywgcmVxdWlyZSgnLi4vaXNFcXVhbCcpKTtcblxuZnVuYy5wbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vcGxhY2Vob2xkZXInKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuYztcbiIsImltcG9ydCBmbG93IGZyb20gJ2xvZGFzaC9mcC9mbG93J1xuaW1wb3J0IGlzRXF1YWwgZnJvbSAnbG9kYXNoL2ZwL2lzRXF1YWwnXG5pbXBvcnQgeyBub3QgfSBmcm9tICcuLi91dGlscy91dGlsLmV4dGVuZCdcblxuLyoqXG4gKiBDcmVhdGUgYSBmdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGFuIG9wZXJhdGlvbiBvbiB0aGUgZmlyc3QgYXJndW1lbnRzIGZyb20gdGhlIGN1cnJlbnQgYW5kIHByZXZpb3VzIGNhbGxzLlxuICogTm90ZTogVGhlIHN0YXRlIG1haW50YWluZWQgYnkgdGhpcyBmdW5jdGlvbiBtZWFucyB0aGF0IGl0IHNob3VsZCBiZSBjb21wb3NlZCBvdXRzaWRlIHRoZSBmaW5hbCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGEsIGIpfSBmbiAtIENhbGxiYWNrXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oYSl9IENhbGxzIHRoZSBjYWxsYmFjayB3aXRoIGJvdGggdGhlIGZpcnN0IGFyZ3VtZW50IGZyb20gdGhlIGN1cnJlbnQgYW5kIHByZXZpb3VzIGNhbGxzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBTZXQgdXAgd2l0aFByZXYgdG8gcmV0dXJuIHRydWVcbiAqIC8vIGlmIHByZXZpb3VzIGFuZCBjdXJyZW50IGFyZ3VtZW50cyBhcmUgbm90IGVxdWFsXG4gKiBjb25zdCBoYXNDaGFuZ2VkID0gd2l0aFByZXYobm90KGlzRXF1YWwpKVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBQcmV2aW91cyBjYWxsIGFyZ3VtZW50IGlzIHVuZGVmaW5lZFxuICogaGFzQ2hhbmdlZCg1KSAvLyAtPiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFByZXZpb3VzIGFuZCBjdXJyZW50IGNhbGxzIHdpdGggc2FtZSBhcmd1bWVudHNcbiAqIGhhc0NoYW5nZWQoNSkgLy8gLT4gdHJ1ZVxuICogaGFzQ2hhbmdlZCg1KSAvLyAtPiBmYWxzZVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBQcmV2aW91cyBhbmQgY3VycmVudCBjYWxscyB3aXRoIGRpZmZlcmVudCBhcmd1bWVudHNcbiAqIGhhc0NoYW5nZWQoNSkgLy8gLT4gdHJ1ZVxuICogaGFzQ2hhbmdlZCg2KSAvLyAtPiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFByZXZpb3VzIGNhbGwgYXJndW1lbnQgaXMgdW5kZWZpbmVkXG4gKiBoYXNDaGFuZ2VkKHVuZGVmaW5lZCkgLy8gLT4gZmFsc2VcbiAqL1xuZXhwb3J0IGNvbnN0IHdpdGhQcmV2ID0gKGZuLCBpbml0aWFsVmFsdWUpID0+IHtcbiAgbGV0IHByZXZpb3VzID0gaW5pdGlhbFZhbHVlXG5cbiAgcmV0dXJuIGN1cnJlbnQgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKHByZXZpb3VzLCBjdXJyZW50KVxuXG4gICAgLy8gU2F2ZSBjdXJyZW50IHZhbHVlIGZvciBuZXh0IGNhbGxcbiAgICBwcmV2aW91cyA9IGN1cnJlbnRcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIHJlZHVjZXIgZnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBhbiBvcGVyYXRpb24gb24gdGhlIGZpcnN0IGN1cnJlbnQgYXJndW1lbnQgYW5kIHByZXZpb3VzIHJlc3VsdC5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGEsIGIpfSBmbiAtIENhbGxiYWNrXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oYSl9IENhbGxzIHRoZSBjYWxsYmFjayB3aXRoIGJvdGggdGhlIGN1cnJlbnQgYXJndW1lbnQgYW5kIHRoZSBwcmV2aW91cyByZXN1bHRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gU2V0IHVwIHdpdGhQcmV2IHRvIHJldHVybiB0cnVlXG4gKiAvLyBpZiBwcmV2aW91cyBhbmQgY3VycmVudCBhcmd1bWVudHMgYXJlIG5vdCBlcXVhbFxuICogY29uc3Qgc3VtID0gd2l0aFByZXZSZXN1bHQoYWRkLCAwKVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBBZGQgdG8gaW5pdGlhbCB2YWx1ZVxuICogc3VtKDUpIC8vIC0+IDVcbiAqIC8vIEFkZCB0byBwcmV2aW91cyByZXN1bHRcbiAqIHN1bSg2KSAvLyAtPiAxMVxuICovXG5leHBvcnQgY29uc3Qgd2l0aFByZXZSZXN1bHQgPSAoZm4sIGluaXRpYWxWYWx1ZSkgPT4ge1xuICBsZXQgcHJldmlvdXMgPSBpbml0aWFsVmFsdWVcblxuICByZXR1cm4gY3VycmVudCA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gZm4ocHJldmlvdXMsIGN1cnJlbnQpXG5cbiAgICAvLyBTYXZlIGN1cnJlbnQgcmVzdWx0IGZvciBuZXh0IGNhbGxcbiAgICBwcmV2aW91cyA9IHJlc3VsdFxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBhbiBvcGVyYXRpb24gb24gdGhlIGN1cnJlbnQgYW5kIHByZXZpb3VzIGNhbGwgYXJndW1lbnRzXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihBcnJheTxhPiwgQXJyYXk8Yj4pfSBmbiAtIENhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IENhbGxzIHRoZSBjYWxsYmFjayB3aXRoIGJvdGggdGhlIGN1cnJlbnQgYW5kIHByZXZpb3VzIGNhbGwgYXJndW1lbnRzXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGxvZ1ByZXZBbmRDdXJyZW50QXJncyA9IHdpdGhQcmV2QXJncygocHJldiwgY3VycmVudCkgPT4ge1xuICogICBjb25zb2xlLmxvZygncHJldmlvdXMgYXJnczonLCBwcmV2KVxuICogICBjb25zb2xlLmxvZygnY3VycmVudCBhcmdzOicsIGN1cnJlbnQpXG4gKiB9LCBbMSwgMiwgM10pXG4gKlxuICogbGlzdGVuVG8oZXZlbnQpXG4gKiAgIC5mb3JFYWNoKGxvZ1ByZXZBbmRDdXJyZW50QXJncylcbiAqXG4gKiAvLyBGaXJzdCBldmVudDpcbiAqIC8vIHByZXZpb3VzIGFyZ3M6IFsxLCAyLCAzXVxuICogLy8gY3VycmVudCBhcmdzOiBbNCwgNSwgNl1cbiAqXG4gKiAvLyBTZWNvbmQgZXZlbnQ6XG4gKiAvLyBwcmV2aW91cyBhcmdzOiBbNCwgNSwgNl1cbiAqIC8vIGN1cnJlbnQgYXJnczogWzcsIDgsIDldXG4gKi9cbmV4cG9ydCBjb25zdCB3aXRoUHJldkFyZ3MgPSAoZm4sIC4uLmluaXRpYWxWYWx1ZXMpID0+IHtcbiAgbGV0IHByZXZpb3VzID0gaW5pdGlhbFZhbHVlc1xuXG4gIHJldHVybiAoLi4uY3VycmVudCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKHByZXZpb3VzLCBjdXJyZW50KVxuXG4gICAgLy8gU2F2ZSBjdXJyZW50IHJlc3VsdCBmb3IgbmV4dCBjYWxsXG4gICAgcHJldmlvdXMgPSBjdXJyZW50XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxud2l0aFByZXYucmVzdWx0ID0gd2l0aFByZXZSZXN1bHRcbndpdGhQcmV2LmFyZ3MgPSB3aXRoUHJldkFyZ3NcblxuLyoqXG4gKiBDcmVhdGUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGlzXG4gKiBjYWxsJ3MgYXJndW1lbnQgaXMgZGlmZmVyZW50IHRoYW4gdGhlIGxhc3QgY2FsbC5cbiAqIE1haW50YWlucyBvd24gc3RhdGUgdXNpbmcgYSBjbG9zdXJlLlxuICogSW5zdGFudGlhdGUgZm9yIGVhY2ggcGxhY2UgeW91IHVzZSBpdC5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IEluc3RhbmNlIG9mIGhhc0NoYW5nZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgaGFzQ2hhbmdlZCA9IGNyZWF0ZUhhc0NoYW5nZWQoKVxuICovXG5leHBvcnQgY29uc3QgY29tcG9zZUhhc0NoYW5nZWQgPSBmbiA9PlxuICBmbG93KFxuICAgIGZuLFxuICAgIHdpdGhQcmV2KG5vdChpc0VxdWFsKSksXG4gIClcbiIsIi8vIE11c3QgZXhwb3J0IGRpcmVjdGx5XG4vLyBEb24ndCB1c2UgaW1wb3J0ICogLi4uIEl0IGJyZWFrcyB0cmVlLXNoYWtpbmdcblxuLy8gQnVtYmxlIENocm9tZSBBUElcbmV4cG9ydCB7IGJyb3dzZXJBY3Rpb24gfSBmcm9tICcuL2Nocm9tZS9jaHJvbWUuYnJvd3Nlci1hY3Rpb24nXG5leHBvcnQgeyBzdG9yYWdlTG9jYWwgfSBmcm9tICcuL2Nocm9tZS9jaHJvbWUuc3RvcmFnZS5sb2NhbCdcbmV4cG9ydCB7IHN0b3JhZ2VTeW5jIH0gZnJvbSAnLi9jaHJvbWUvY2hyb21lLnN0b3JhZ2Uuc3luYydcbmV4cG9ydCB7IG1lc3NhZ2UgfSBmcm9tICcuL2Nocm9tZS9jaHJvbWUubWVzc2FnZSdcbmV4cG9ydCB7IG5vdGlmeSB9IGZyb20gJy4vY2hyb21lL2Nocm9tZS5ub3RpZnknXG5leHBvcnQgeyBvcHRpb25zIH0gZnJvbSAnLi9jaHJvbWUvY2hyb21lLm9wdGlvbnMnXG5leHBvcnQgeyBwcm94eSB9IGZyb20gJy4vY2hyb21lL2Nocm9tZS5wcm94eSdcbmV4cG9ydCB7IHRhYnMgfSBmcm9tICcuL2Nocm9tZS9jaHJvbWUudGFicydcbmV4cG9ydCB7IHdoZW4gfSBmcm9tICcuL2Nocm9tZS9jaHJvbWUuZXZlbnRzJ1xuZXhwb3J0IHsgY29udGV4dE1lbnUgfSBmcm9tICcuL2Nocm9tZS9jaHJvbWUuY29udGV4dC1tZW51J1xuXG4vLyBCdW1ibGUgU3RvcmVcbmV4cG9ydCB7XG4gIHN0b3JlLFxuICBpbml0U3RvcmUsXG4gIHN0b3JlUHJvbWlzZSxcbn0gZnJvbSAnLi9zdGF0ZS9zdGF0ZS5zdG9yZSdcbmV4cG9ydCB7XG4gIGNvbm5lY3RUb1N0b3JlLFxuICBiYWNrZ3JvdW5kU3RvcmUsXG59IGZyb20gJy4vc3RhdGUvc3RhdGUuY29ubmVjdCdcblxuLy8gLy8gQnVtYmxlIFN0cmVhbVxuZXhwb3J0IHtcbiAgQnVtYmxlU3RyZWFtLFxuICBldmVudEZ1bmN0b3IsXG4gIGV2ZW50U3RyZWFtLFxufSBmcm9tICcuL2V2ZW50LXN0cmVhbS9zdHJlYW0nXG5leHBvcnQgeyB0aW1lb3V0IH0gZnJvbSAnLi9oZWxwZXJzL3RpbWVvdXQnXG5leHBvcnQgeyBpbnRlcnZhbCB9IGZyb20gJy4vaGVscGVycy9pbnRlcnZhbCdcbmV4cG9ydCB7IGxpc3RlblRvIH0gZnJvbSAnLi9oZWxwZXJzL2xpc3Rlbi10bydcbmV4cG9ydCB7IGRlYm91bmNlIH0gZnJvbSAnLi9oZWxwZXJzL2RlYm91bmNlJ1xuZXhwb3J0IHsgdGhyb3R0bGUgfSBmcm9tICcuL2hlbHBlcnMvdGhyb3R0bGUnXG5leHBvcnQgeyB3aXRoUHJldiwgY29tcG9zZUhhc0NoYW5nZWQgfSBmcm9tICcuL2hlbHBlcnMvd2l0aC1wcmV2J1xuXG4vLyAvLyBHZW5lcmFsIFV0aWxpdGllc1xuZXhwb3J0IHsgZXZlbnRQcm9taXNlIH0gZnJvbSAnLi91dGlscy91dGlsLmV2ZW50LXByb21pc2UnXG5leHBvcnQge1xuICBjb250ZXh0LFxuICBsb2csXG4gIG5vdCxcbiAgYm9vbCxcbiAgZXJyb3IsXG4gIGNhbGxFYWNoLFxuICBwYWRBcnJheUVuZCxcbiAgcmFuZG9tQXJyYXlFbGVtZW50LFxufSBmcm9tICcuL3V0aWxzL3V0aWwuZXh0ZW5kJ1xuIl0sIm5hbWVzIjpbInNldCIsImdldCIsImNsZWFyIiwicmVtb3ZlIiwibWFwIiwid3JhcHBlcnMubWFwIiwiZm9yRWFjaCIsIndyYXBwZXJzLmZvckVhY2giLCJmaWx0ZXIiLCJ3cmFwcGVycy5maWx0ZXIiLCJ3cmFwcGVycy5jbGVhciIsImhhbmRsZUVycm9yIiwid3JhcHBlcnMuaGFuZGxlRXJyb3IiLCJhd2FpdE1hcCIsIndyYXBwZXJzLmF3YWl0TWFwIiwiYXdhaXRGaWx0ZXIiLCJ3cmFwcGVycy5hd2FpdEZpbHRlciIsImVycm9yIiwiY3JlYXRlIiwibm90Q29ubmVjdGVkRXJyb3IiLCJmYWxsYmFja0hvbGRlciIsIm1hcHBpbmciLCJwbGFjZWhvbGRlciIsImdsb2JhbCIsImZyZWVHbG9iYWwiLCJyb290IiwiU3ltYm9sIiwib2JqZWN0UHJvdG8iLCJuYXRpdmVPYmplY3RUb1N0cmluZyIsInN5bVRvU3RyaW5nVGFnIiwiZ2V0UmF3VGFnIiwib2JqZWN0VG9TdHJpbmciLCJpc09iamVjdCIsImJhc2VHZXRUYWciLCJjb3JlSnNEYXRhIiwiZnVuY1Byb3RvIiwiZnVuY1RvU3RyaW5nIiwiaGFzT3duUHJvcGVydHkiLCJpc01hc2tlZCIsImlzRnVuY3Rpb24iLCJ0b1NvdXJjZSIsImdldFZhbHVlIiwiYmFzZUlzTmF0aXZlIiwiZ2V0TmF0aXZlIiwiV2Vha01hcCIsIm1ldGFNYXAiLCJpZGVudGl0eSIsImJhc2VDcmVhdGUiLCJjcmVhdGVDdG9yIiwibmF0aXZlTWF4IiwiYmFzZUxvZGFzaCIsIm5vb3AiLCJyZWFsTmFtZXMiLCJMYXp5V3JhcHBlciIsIkxvZGFzaFdyYXBwZXIiLCJjb3B5QXJyYXkiLCJpc09iamVjdExpa2UiLCJpc0FycmF5Iiwid3JhcHBlckNsb25lIiwiZ2V0RnVuY05hbWUiLCJsb2Rhc2giLCJnZXREYXRhIiwic2hvcnRPdXQiLCJiYXNlU2V0RGF0YSIsImRlZmluZVByb3BlcnR5IiwiY29uc3RhbnQiLCJiYXNlU2V0VG9TdHJpbmciLCJzdHJpY3RJbmRleE9mIiwiYmFzZUZpbmRJbmRleCIsImJhc2VJc05hTiIsImJhc2VJbmRleE9mIiwiV1JBUF9CSU5EX0ZMQUciLCJhcnJheUVhY2giLCJhcnJheUluY2x1ZGVzIiwic2V0VG9TdHJpbmciLCJpbnNlcnRXcmFwRGV0YWlscyIsInVwZGF0ZVdyYXBEZXRhaWxzIiwiZ2V0V3JhcERldGFpbHMiLCJXUkFQX0JJTkRfS0VZX0ZMQUciLCJXUkFQX0NVUlJZX0ZMQUciLCJXUkFQX1BBUlRJQUxfRkxBRyIsIldSQVBfUEFSVElBTF9SSUdIVF9GTEFHIiwiaXNMYXppYWJsZSIsInNldERhdGEiLCJzZXRXcmFwVG9TdHJpbmciLCJpc0luZGV4IiwiV1JBUF9DVVJSWV9SSUdIVF9GTEFHIiwiV1JBUF9BUllfRkxBRyIsIldSQVBfRkxJUF9GTEFHIiwiZ2V0SG9sZGVyIiwiY291bnRIb2xkZXJzIiwiY29tcG9zZUFyZ3MiLCJjb21wb3NlQXJnc1JpZ2h0IiwicmVwbGFjZUhvbGRlcnMiLCJjcmVhdGVSZWN1cnJ5IiwicmVvcmRlciIsImNyZWF0ZUh5YnJpZCIsImFwcGx5IiwiUExBQ0VIT0xERVIiLCJXUkFQX0NVUlJZX0JPVU5EX0ZMQUciLCJXUkFQX1JFQVJHX0ZMQUciLCJuYXRpdmVNaW4iLCJpc1N5bWJvbCIsInRvTnVtYmVyIiwidG9GaW5pdGUiLCJ0b0ludGVnZXIiLCJtZXJnZURhdGEiLCJjcmVhdGVCaW5kIiwiY3JlYXRlQ3VycnkiLCJjcmVhdGVQYXJ0aWFsIiwiY3JlYXRlV3JhcCIsImVxIiwiYmFzZUFzc2lnblZhbHVlIiwiYXNzaWduVmFsdWUiLCJiYXNlSXNBcmd1bWVudHMiLCJzdHViRmFsc2UiLCJNQVhfU0FGRV9JTlRFR0VSIiwiYXJnc1RhZyIsImZ1bmNUYWciLCJpc0xlbmd0aCIsIm5vZGVVdGlsIiwiYmFzZVVuYXJ5IiwiYmFzZUlzVHlwZWRBcnJheSIsImlzQXJndW1lbnRzIiwiaXNCdWZmZXIiLCJpc1R5cGVkQXJyYXkiLCJiYXNlVGltZXMiLCJvdmVyQXJnIiwiaXNQcm90b3R5cGUiLCJuYXRpdmVLZXlzIiwiaXNBcnJheUxpa2UiLCJhcnJheUxpa2VLZXlzIiwiYmFzZUtleXMiLCJjb3B5T2JqZWN0Iiwia2V5cyIsImFzc29jSW5kZXhPZiIsImxpc3RDYWNoZUNsZWFyIiwibGlzdENhY2hlRGVsZXRlIiwibGlzdENhY2hlR2V0IiwibGlzdENhY2hlSGFzIiwibGlzdENhY2hlU2V0IiwiTGlzdENhY2hlIiwibmF0aXZlQ3JlYXRlIiwiSEFTSF9VTkRFRklORUQiLCJoYXNoQ2xlYXIiLCJoYXNoRGVsZXRlIiwiaGFzaEdldCIsImhhc2hIYXMiLCJoYXNoU2V0IiwiSGFzaCIsIk1hcCIsImlzS2V5YWJsZSIsImdldE1hcERhdGEiLCJtYXBDYWNoZUNsZWFyIiwibWFwQ2FjaGVEZWxldGUiLCJtYXBDYWNoZUdldCIsIm1hcENhY2hlSGFzIiwibWFwQ2FjaGVTZXQiLCJNYXBDYWNoZSIsInN0YWNrQ2xlYXIiLCJzdGFja0RlbGV0ZSIsInN0YWNrR2V0Iiwic3RhY2tIYXMiLCJzdGFja1NldCIsIm5hdGl2ZUtleXNJbiIsImtleXNJbiIsImJhc2VLZXlzSW4iLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsInN0dWJBcnJheSIsImFycmF5RmlsdGVyIiwiZ2V0U3ltYm9scyIsIm5hdGl2ZUdldFN5bWJvbHMiLCJhcnJheVB1c2giLCJnZXRQcm90b3R5cGUiLCJnZXRTeW1ib2xzSW4iLCJiYXNlR2V0QWxsS2V5cyIsIlByb21pc2UiLCJtYXBUYWciLCJvYmplY3RUYWciLCJzZXRUYWciLCJ3ZWFrTWFwVGFnIiwiZGF0YVZpZXdUYWciLCJEYXRhVmlldyIsIlNldCIsIlVpbnQ4QXJyYXkiLCJjbG9uZUFycmF5QnVmZmVyIiwiYm9vbFRhZyIsImRhdGVUYWciLCJudW1iZXJUYWciLCJyZWdleHBUYWciLCJzdHJpbmdUYWciLCJzeW1ib2xUYWciLCJhcnJheUJ1ZmZlclRhZyIsImZsb2F0MzJUYWciLCJmbG9hdDY0VGFnIiwiaW50OFRhZyIsImludDE2VGFnIiwiaW50MzJUYWciLCJ1aW50OFRhZyIsInVpbnQ4Q2xhbXBlZFRhZyIsInVpbnQxNlRhZyIsInVpbnQzMlRhZyIsImNsb25lRGF0YVZpZXciLCJjbG9uZVR5cGVkQXJyYXkiLCJjbG9uZVJlZ0V4cCIsImNsb25lU3ltYm9sIiwiZ2V0VGFnIiwiYmFzZUlzTWFwIiwiYmFzZUlzU2V0IiwiYXJyYXlUYWciLCJlcnJvclRhZyIsImdlblRhZyIsImluaXRDbG9uZUFycmF5IiwiY2xvbmVCdWZmZXIiLCJpbml0Q2xvbmVPYmplY3QiLCJjb3B5U3ltYm9sc0luIiwiYmFzZUFzc2lnbkluIiwiY29weVN5bWJvbHMiLCJiYXNlQXNzaWduIiwiaW5pdENsb25lQnlUYWciLCJTdGFjayIsImlzU2V0IiwiaXNNYXAiLCJnZXRBbGxLZXlzSW4iLCJnZXRBbGxLZXlzIiwiQ0xPTkVfU1lNQk9MU19GTEFHIiwiYmFzZUNsb25lIiwiaXNQbGFpbk9iamVjdCIsInNldENhY2hlQWRkIiwic2V0Q2FjaGVIYXMiLCJTZXRDYWNoZSIsImFycmF5U29tZSIsImNhY2hlSGFzIiwiQ09NUEFSRV9QQVJUSUFMX0ZMQUciLCJDT01QQVJFX1VOT1JERVJFRF9GTEFHIiwic3ltYm9sUHJvdG8iLCJzeW1ib2xWYWx1ZU9mIiwibWFwVG9BcnJheSIsInNldFRvQXJyYXkiLCJlcXVhbEFycmF5cyIsImVxdWFsQnlUYWciLCJlcXVhbE9iamVjdHMiLCJiYXNlSXNFcXVhbERlZXAiLCJiYXNlSXNFcXVhbCIsImlzU3RyaWN0Q29tcGFyYWJsZSIsImdldE1hdGNoRGF0YSIsIm1hdGNoZXNTdHJpY3RDb21wYXJhYmxlIiwiYmFzZUlzTWF0Y2giLCJGVU5DX0VSUk9SX1RFWFQiLCJtZW1vaXplIiwibWVtb2l6ZUNhcHBlZCIsIklORklOSVRZIiwiYXJyYXlNYXAiLCJiYXNlVG9TdHJpbmciLCJpc0tleSIsInN0cmluZ1RvUGF0aCIsInRvU3RyaW5nIiwiY2FzdFBhdGgiLCJ0b0tleSIsImJhc2VHZXQiLCJoYXNQYXRoIiwiYmFzZUhhc0luIiwiaGFzSW4iLCJiYXNlUHJvcGVydHkiLCJiYXNlUHJvcGVydHlEZWVwIiwiYmFzZU1hdGNoZXNQcm9wZXJ0eSIsImJhc2VNYXRjaGVzIiwicHJvcGVydHkiLCJDTE9ORV9ERUVQX0ZMQUciLCJiYXNlSXRlcmF0ZWUiLCJpc0ZsYXR0ZW5hYmxlIiwiYmFzZUZsYXR0ZW4iLCJvdmVyUmVzdCIsImZsYXR0ZW4iLCJmbGF0UmVzdCIsInJlcXVpcmUkJDAiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwicmVxdWlyZSQkOCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsInJlcXVpcmUkJDExIiwicmVxdWlyZSQkMTIiLCJyZXF1aXJlJCQxMyIsImJhc2VDb252ZXJ0IiwidXRpbCIsImNyZWF0ZUZsb3ciLCJjb252ZXJ0IiwiZnVuYyIsImZsb3ciLCJpc0VxdWFsIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO0VBQ2xELElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSztJQUMvQixJQUFJO01BQ0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZO1FBQy9CLEVBQUUsSUFBSSxFQUFFLElBQUksS0FBSyxLQUFLLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRSxLQUFLLEVBQUU7UUFDM0MsTUFBTTtVQUNKLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBQztXQUN6QyxNQUFNO1lBQ0wsT0FBTyxHQUFFO1dBQ1Y7U0FDRjtRQUNGO0tBQ0YsQ0FBQyxPQUFPLEtBQUssRUFBRTtNQUNkLE1BQU0sQ0FBQyxLQUFLLEVBQUM7S0FDZDtHQUNGLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLE1BQU0sYUFBYSxHQUFHLENBQUMsT0FBTyxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtFQUNuRCxJQUFJLE9BQU8sQ0FBQyxD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QUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDckIsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDeEIsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDMUIsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDeEIsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUMzQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdkIsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDMUIsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUM5QixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNwQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDMUIsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDbEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDcEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDckIsQ0FBQzs7O0FBR0Ysb0JBQW9CLEdBQUc7RUFDckIsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRTtFQUMzQixl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
