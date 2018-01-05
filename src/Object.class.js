const xjs = {}

/**
 * @summary Additional static members for the native Object class.
 * @description Does not extend the native Object class.
 * @namespace
 */
xjs.Object = class {
  /** @private */ constructor() {}

  /**
   * @summary Return the type of a thing.
   * @description Similar to the `typeof` primitive operator, but more refined.
   *
   * NOTE! passing undeclared variables will throw a `ReferenceError`!
   * ```js
   * var x;          // declare `x`
   * typeof x;       // 'undefined'
   * typeof y;       // 'undefined'
   * xjs.typeOf(x);  // 'undefined'
   * xjs.typeOf(y);  // Uncaught ReferenceError: y is not defined
   * ```
   * Credit to @zaggino.
   *
   * @version STABLE
   * @see https://github.com/zaggino/z-schema/blob/bddb0b25daa0c96119e84b121d7306b1a7871594/src/Utils.js#L12
   * @param   {*} thing anything
   * @returns {string} the type of the thing
   */
  static typeOf(thing) {
    let type = typeof thing
    let returned = {
      object: function () {
        if (thing === null)       return 'null'
        if (Array.isArray(thing)) return 'array'
        return type // 'object'
      },
      number: function () {
        if (Number.isNaN(thing))     return 'NaN'
        if (!Number.isFinite(thing)) return 'infinite'
        return type // 'number'
      },
      default: function () {
        return type // 'undefined', 'boolean', 'string', 'function'
      },
    }
    return (returned[type] || returned.default).call(null)
  }

  /**
   * @summary Return the name of an object’s constructing class or function.
   * @description This method reveals the most specific class that the native `instanceof` operator would reveal.
   * This method can be passed either complex values (objects, arrays, functions) or primitive values.
   * Technically, primitives do not have constructing functions, but they can be wrapped with object constructors.
   * For example, calling `instanceOf(3)` will return `Number`, even though `3` was not constructed via the `Number` class.
   * @version EXPERIMENTAL
   * @param   {*} thing anything except `null` or `undefined`
   * @returns {string} the name of the constructing function
   * @throws  {TypeError} if `null` or `undefined` is passed
   */
  static instanceOf(thing) {
    if (thing === null || thing === undefined) throw new TypeError(`\`${thing}\` does not have a construtor.`)
    return thing.__proto__.constructor.name
  }

  /**
   * @summary Test whether two things are “the same”.
   * @description This function acts **recursively** on corresponding object values,
   * where the base case (for non-object values) is `Object.is()`.
   *
   * “The same” means “replaceable”, that is,
   * for any deterministic function: `fn(a)` would return the same result as `fn(b)` if and only if
   * `xjs.Object.is(a, b)`.
   *
   * This function is less strict than {@link Object.is}.
   * If both arguments are arrays, it is faster to use {@link xjs.Array.is}.
   *
   * @version STABLE
   * @param   {*} a the first  thing
   * @param   {*} b the second thing
   * @returns {boolean} `true` if corresponding elements are the same, or replaceable
   */
  static is(a, b) {
    xjs.Array = require('./Array.class.js')
    if (Object.is(a, b)) return true
    if (xjs.Object.typeOf(a) === 'array' && xjs.Object.typeOf(b) === 'array') return xjs.Array.is(a, b)
    return (
      xjs.Object.typeOf(a) === 'object' && xjs.Object.typeOf(b) === 'object' // both must be objects
      && Object.getOwnPropertyNames(a).length === Object.getOwnPropertyNames(b).length // both must have the same number of own properties
      && Object.getOwnPropertyNames(a).every((key) => Object.getOwnPropertyNames(b).includes(key)) // `b` must own every property in `a`
      // && Object.getOwnPropertyNames(b).every((key) => Object.getOwnPropertyNames(a).includes(key)) // `a` must own every property in `b` // unnecessary if they have the same length
      // finally, compare all the values
      && (function () {
        let r = true
        for (let i in a) {
          // r &&= xjs.Object.is(a[i], b[i]) // IDEA
          r = r && xjs.Object.is(a[i], b[i])
        }
        return r
      })()
    )
  }

  /**
   * @summary Deep freeze an object, and return the result.
   * @description If an array or object is passed,
   * **Recursively** call {@link Object.freeze} on every property and sub-property of the given parameter.
   * Else, return the given argument.
   * @version EXPERIMENTAL
   * @param   {*} thing any value to freeze
   * @returns {*} the returned value, with everything frozen
   */
  static freezeDeep(thing) {
    Object.freeze(thing)
    let action = {
      array: function () {
        thing.forEach(function (val) {
          if (!Object.isFrozen(val)) xjs.Object.freezeDeep(val)
        })
      },
      object: function () {
        for (let key in thing) {
          if (!Object.isFrozen(thing[key])) xjs.Object.freezeDeep(thing[key])
        }
      },
      default: function () {},
    }
    ;(action[xjs.Object.typeOf(thing)] || action.default).call(null)
    return thing
  }

  /**
   * @summary Deep clone an object, and return the result.
   * @description If an array or object is passed,
   * This method is **recursively** called, cloning properties and sub-properties of the given parameter.
   * The returned result is an object, that when passed with the original as arguments of {@link xjs.Object.is},
   * `true` would be returned. The new object would be “replaceable” with its cloner.
   * If a primitive value is passed, the original argument is returned.
   *
   * This method provides a deeper clone than `Object.assign()`: whereas `Object.assign()` only
   * copies the top-level properties, this method recursively clones into all sub-levels.
   *
   * ```js
   * var x = { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   *
   * // Object.assign x into y:
   * var y = Object.assign({}, x) // returns { first: x.first, second: x.second, third: x.third }
   *
   * // you can reassign properties of `y` without affecting `x`:
   * y.first  = 'one'
   * y.second = 2
   * console.log(y) // returns { first: 'one', second: 2, third: x.third }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   *
   * // however you cannot mutate properties of `y` without affecting `x`:
   * y.third[0]    = 'one'
   * y.third[1]    = 2
   * y.third[2].v  = [3]
   * console.log(y) // returns { first: 'one', second: 2, third: ['one', 2, { v:[3] }] }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: ['one', 2, { v:[3] }] }
   *
   * // xjs.cloneDeep x into y:
   * var z = xjs.cloneDeep(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', {v:3}] }
   *
   * // as with Object.assign, you can reassign properties of `z` without affecting `x`:
   * z.first  = 'one'
   * z.second = 2
   * console.log(z) // returns { first: 'one', second: 2, third: [1, '2', {v:3}] }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   *
   * // but unlike Object.assign, you can mutate properties of `z` without affecting `x`:
   * z.third[0]    = 'one'
   * z.third[1]    = 2
   * z.third[2].v  = [3]
   * console.log(z) // returns { first: 'one', second: 2, third: ['one', 2, { v:[3] }] }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   * ```
   *
   * @version EXPERIMENTAL
   * @param   {*} thing any value to clone
   * @returns {*} an exact copy of the given value, but with nothing equal via `==` (unless the value given is primitive)
   */
  static cloneDeep(thing) {
    let returned = {
      array: function () {
        let returned = []
        thing.forEach(function (val) {
          returned.push(xjs.Object.cloneDeep(val))
        })
        return returned
      },
      object: function () {
        let returned = {}
        for (let key in thing) {
          returned[key] = xjs.Object.cloneDeep(thing[key])
        }
        return returned
      },
      default: function () {
        return thing
      },
    }
    return (returned[xjs.Object.typeOf(thing)] || returned.default).call(null)
  }
}

module.exports = xjs.Object