/**
 * The MutationObserver object
 * @typedef {Object} MutationObserver
 * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
 */

/**
 * The MutationObserverInit object to specify the observer config
 * @typedef {Object} MutationObserverInit
 * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
 */

/**
 * The MutationRecord object that states the changes made in the DOM
 * @typedef {Object} MutationRecord
 * @see https://developer.mozilla.org/docs/Web/API/MutationObserver
 */

/**
 * Instantiate dom-observer
 * @param {HTMLElement} target - The element to observe
 * @param {MutationObserverInit} options - The object with the observer config
 * @param {Function} callback - The function that will receive the reports
 * @param {Boolean} lastChange - Whether or not to return only the last change
 * @access public
 * @exports dom-observer
 * @since 0.1.0
 * @license MIT LICENSE
 */
export default (target, options, callback, lastChange) => {
  // Bring prefixed MutationObserver for older Chrome/Safari and Firefox
  // TODO: REMOVE THIS IF BLOCK WHEN POSSIBLE
  if (!window.MutationObserver) {
    window.MutationObserver =
      window.webkitMutationObserver || window.mozMutationObserver;
  }

  let _callback = callback;

  /**
   * Handle MutationObserver mutations
   * @function
   * @param {MutationRecord[]} mutations - The mutations
   * @access private
   * @since 0.1.0
   */
  const mutationHandler = (mutations) => {
    if (lastChange) {
      _callback(mutations.pop());
    } else {
      _callback(mutations);
    }
  };

  /**
   * The inner MutationObserver used to watch for mutations
   * @access private
   * @type MutationObserver
   * @const
   * @since 0.1.0
   */
  const observer = new MutationObserver(mutationHandler);

  /**
   * Spawn a new observer with the specified config
   * @function
   * @param {HTMLElement} _target - The element to observe
   * @param {MutationObserverInit} options - The config to respect
   * @access private
   * @since 0.1.0
   */
  function observe(_target, _options) {
    if (!(_target instanceof HTMLElement)) {
      throw new Error('You must set a target element!');
    }
    if (callback) {
      observer.observe(_target, _options);
    }
  }

  /**
   * The instance of DomObserver with the public API
   * @const
   * @access public
   * @since 0.1.0
   */
  const self = (() => {
    observe(target, options);
    return {
      /**
       * Add a target to the current observer
       * @function
       * @param {HTMLElement} _target - The element to observe
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      addTarget: (_target) => {
        observe(_target, options);
        return self;
      },
      /**
       * Add a new target and config to the current observer
       * @function
       * @param {HTMLElement} _target - The element to observe
       * @param {MutationObserverInit} _options - The config to respect
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      andObserve: (_target, _options) => {
        observe(_target, _options);
        return self;
      },
      /**
       * Change the function to be called when reporting changes
       * @function
       * @param {Function} fn - The new callback to use
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      changeCallback: (fn) => {
        _callback = fn;
        return self;
      },
      /**
       * Expose MutationObserver's takeRecords method
       * @function
       * @returns {MutationRecord[]} The array of mutations
       * @access public
       * @since 0.1.0
       */
      takeRecords: () => { observer.takeRecords(); },
      /**
       * Clean the MutationObserver record pool and return this instance
       * @function
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      wipe: () => {
        observer.takeRecords();
        return self;
      },
      /**
       * Remove all previous observer configuration
       * @function
       * @returns {DomObserver} self - The current instance of dom-observer
       * @access public
       * @since 0.1.0
       */
      removeAllTargets: () => {
        observer.disconnect();
        return self;
      },
    };
  })();

  return self;
};