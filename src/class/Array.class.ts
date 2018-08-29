import * as assert from 'assert'

import xjs_Object from './Object.class'


/**
 * @summary Additional static members for the native Array class.
 * @description Does not extend the native Array class.
 */
export default class xjs_Array {
  /**
   * @summary Test whether two arrays are “the same”.
   * @description Shortcut of {@link xjs_Object.is}, but for arrays.
   * @param   a the first array
   * @param   b the second array
   * @param   comparator a predicate checking the “sameness” of corresponding elements of `a` and `b`
   * @returns Are corresponding elements the same, i.e. replaceable??
   */
  static is<T>(a: T[], b: T[], comparator?: (x: T, y: T) => boolean): boolean {
    // comparator = comparator || (x, y) => x === y || Object.is(x, y) // TODO make default param after v0.13+
    if (!comparator) { // TEMP: this preserves deprecated funcationality; will be removed on v0.13+
      try {
        assert.deepStrictEqual(a, b) // COMBAK in node.js v10+, use `assert.strict.deepStrictEqual()`
        return true
      } catch (e) {
        console.error(e.message)
        return false
      }
    }
    return a === b ||
      (a.length === b.length) && a.every((el, i) => comparator(el, b[i]))
  }

  /**
   * @summary Deep freeze an array, and return the result.
   * @description Shortcut of {@link xjs_Object.freezeDeep}, but for arrays.
   * *Note: This function is impure, modifying the given argument.*
   * @param   arr the array to freeze
   * @returns the given array, with everything frozen
   */
  static freezeDeep<T>(arr: T[]): T[] {
    Object.freeze(arr)
    arr.forEach((el) => { if (!Object.isFrozen(el)) xjs_Object.freezeDeep(el) })
    return arr
  }

  /**
   * @summary Deep clone an array, and return the result.
   * @description Shortcut of {@link xjs_Object.cloneDeep}, but for arrays.
   * @param   arr the array to clone
   * @returns an exact copy of the given array
   */
  static cloneDeep<T>(arr: T[]): T[] {
    return arr.map((el) => xjs_Object.cloneDeep(el))
  }

  /**
   * @summary Test whether an array is a subarray of another array.
   * @description This method acts like
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes|String#includes},
   * testing whether
   * the elements in the smaller array appear consecutively and in the same order as in the larger array.
   * In other words, if `{@link xjs_Array.is}(larger.slice(a,b), smaller)` (for some integers a and b),
   * then this method returns `true`.
   *
   * @example
   * 'twofoursix'.includes('wofo')===true
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], ['w','o',4,'o'])===true
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], ['o','u'])===true
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], [6,'o','u','r'])===false // not in the same order
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], [2,4,6])===false // not consecutive
   * xjs.Array.contains([2,4,6], [2,4,6,8])===false // first array is smaller than second
   *
   * @param   larger  the larger array, to test against
   * @param   smaller the smaller array, to test
   * @returns Is `smaller` a subarray of `larger`?
   */
  static contains<T>(larger: T[], smaller: T[]): boolean {
    if (smaller.length > larger.length) {
      console.error('First argument cannot be smaller than the second. Try switching the arguments.')
      return false
    }
    if (xjs_Array.is(smaller, []    )) return true
    if (xjs_Array.is(smaller, larger)) return true
    return larger.map((_el, i) => larger.slice(i, i+smaller.length)).some((sub) => xjs_Array.is(smaller, sub))
  }

  /**
   * @deprecated XXX:DEPRECATED
   * @summary “Convert” an array, number, or string into an array. (Doesn’t really convert.)
   * @description
   * - If the argument is an array, it is returned unchanged.
   * - If the argument is a number `n`, an array of length `n`, filled with increasing integers,
   *   starting with 1, is returned. (E.g. if `n===5` then `[1,2,3,4,5]` is returned.)
   * - If the argument is a string, that string is checked as an **own property** of the given database.
   *   If the value of that property *is* a string, then *that* string is checked, and so on,
   *   until an array or number is found. If no entry is found, an empty array is returned.
   *   The default database is an empty object `{}`.
   * @param   arg the argument to convert
   * @param   database a database to check against
   * @returns an array
   */
  static toArray(arg: any, database: object = {}): any[] {
    const switch_: { [index: string]: () => unknown[] } = {
      'array': () => {
        return arg as any[]
      },
      'number': () => {
        let array = []
        for (let n = 1; n <= arg; n++) { array.push(n) }
        return array
      },
      'string': () => {
        let check = (database as { [index: string]: unknown })[arg]
        return xjs_Array.toArray(check, database)
      },
      default() {
        return []
      },
    }
    return (switch_[xjs_Object.typeOf(arg)] || switch_.default)()
  }

  /**
   * @summary Make a copy of an array, and then remove duplicate entries.
   * @description "Duplicate entries" are entries that considered "the same" by
   * the provided comparator function, or if none is given,
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is|Object.is}.
   * Only duplicate entries are removed; the order of non-duplicates is preserved.
   * @param   arr an array to use
   * @param   comparator a function comparing elements in the array
   * @returns a new array, with duplicates removed
   */
  static removeDuplicates<T>(arr: T[], comparator: (a: T, b: T) => boolean = Object.is): T[] {
    const returned: T[] = arr.slice()
    for (let i = 0; i < returned.length; i++) {
      for (let j = i + 1; j < returned.length; j++) {
        if (comparator(returned[i], returned[j])) returned.splice(j, 1)
      }
    }
    return returned
  }


  private constructor() {}
}
