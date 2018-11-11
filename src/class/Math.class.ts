import xjs_Number from './Number.class'


/**
 * @summary Additional static members for the native Math class.
 * @description Does not extend the native Math class.
 */
export default class xjs_Math {
	/**
	 * Test whether two numbers are approximately equal: closer together than some given interval of refinement.
	 *
	 * If no interval is given,
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON|Number.EPSILON}
	 * is used.
	 * @param   x a number to compare
	 * @param   y a number to compare
	 * @param   epsilon the interval of refinement
	 * @returns are `x` and `y` within `epsilon` distance apart?
	 */
	static approx(x: number, y: number, epsilon: number = Number.EPSILON): boolean {
		xjs_Number.assertType(x)
		xjs_Number.assertType(y)
		xjs_Number.assertType(epsilon)
		return Math.abs(x - y) < epsilon
	}

	/**
	 * Average two numbers, with a weight favoring the 2nd number.
	 * @deprecated This method is an alias of {@link xjs_Math.meanArithmeticWeighted}.
	 * @param   x 1st finite number
	 * @param   y 2nd finite number
	 * @param   w weight of 2nd number; between 0–1
	 * @returns exactly `meanArithmeticWeighted(x, y, w)`
	 * @throws  {Error} if `x` or `y` is not a finite number, an argument is `NaN`, or if the weight is not between 0 and 1
	 */
	static average(x: number, y: number, w = 0.5): number {
		return xjs_Math.meanArithmeticWeighted(x, y, w)
	}

	/**
	 * Return the argument, clamped between two bounds.
	 *
	 * This method returns the argument unchanged iff it is loosely between `min` and `max`;
	 * it returns `min` iff the argument is strictly less than `min`;
	 * and `max` iff the argument is strictly greater than `max`.
	 * If `min === max` then this method returns that value.
	 * If `min > max` then this method switches the bounds.
	 * @param   min the lower bound
	 * @param   x the value to clamp between the bounds
	 * @param   max the upper bound
	 * @returns exactly `Math.min(Math.max(min, x), max)`
	 */
	static clamp(min: number, x: number, max: number): number {
		xjs_Number.assertType(min)
		xjs_Number.assertType(x  )
		xjs_Number.assertType(max)
		return (min <= max) ? Math.min(Math.max(min, x), max) : xjs_Math.clamp(max, x, min)
	}

	/**
	 * Return the arithmetic mean of a set of numbers.
	 *
	 * ```js
	 * meanArithmetic([a,b])   == (a + b)     / 2
	 * meanArithmetic([a,b,c]) == (a + b + c) / 3
	 * ```
	 * @param   nums an array of finite numbers
	 * @returns the arithmetic mean of the given numbers
	 * @throws  {Error} if one of the array entries is not a finite number
	 * @throws  {NaNError} if `NaN` is in the array
	 */
	static meanArithmetic(nums: number[]): number {
		nums.forEach((n) => xjs_Number.assertType(n, 'finite')) // NB re-throw
		return nums.reduce((x, y) => x + y) * (1 / nums.length)
	}

	/**
	 * Return the weighed arithmetic mean of two numbers, the weight favoring the 2nd number.
	 *
	 * The result will always be between the two numbers.
	 * For example, `meanArithmeticWeighted(10, 20, 0.7)` will return 17, while
	 * `meanArithmeticWeighted(20, 10, 0.7)` will return 13 (the same result as `meanArithmeticWeighted(10, 20, 1 - 0.7)`).
	 * When the weight is not given, it defaults to 0.5, thus yielding
	 * an even weight, that is, the {@link xjs_Math.meanArithmetic|arithmetic mean}, of the two numbers.
	 * @param   x 1st finite number
	 * @param   y 2nd finite number
	 * @param   w weight of 2nd number; between 0–1
	 * @returns the weighted arithmetic mean of `x` and `y`
	 * @throws  {Error} if `x` or `y` is not a finite number
	 * @throws  {RangeError} if the weight is not between 0 and 1
	 * @throws  {NaNError} if an argument is `NaN`
	 */
	static meanArithmeticWeighted(x: number, y: number, w: number = 0.5): number {
		xjs_Number.assertType(x, 'finite')
		xjs_Number.assertType(y, 'finite')
		xjs_Number.assertType(w)
		if (w < 0 || 1 < w) throw new RangeError(`${w} must be between 0 and 1.`)
		return (x * (1 - w)) + (y * w)
	}

	/**
	 * Return the geomeric mean of a set of numbers.
	 *
	 * ```js
	 * meanGeometric([a,b])   == (a * b)     ** (1/2)
	 * meanGeometric([a,b,c]) == (a * b * c) ** (1/3)
	 * ```
	 * @param   nums an array of finite numbers
	 * @returns the geometric mean of the given numbers
	 * @throws  {Error} if one of the array entries is not a finite number
	 * @throws  {NaNError} if `NaN` is in the array
	 */
	static meanGeometric(nums: number[]): number {
		nums.forEach((n) => xjs_Number.assertType(n, 'finite')) // NB re-throw
		return Math.abs(nums.reduce((x, y) => x * y)) ** (1 / nums.length)
	}

	/**
	 * Return the weighed geometric mean of two numbers, the weight favoring the 2nd number.
	 *
	 * The result will always be between the two numbers,
	 * and it will always be less than the same-weighted arithmetic mean.
	 * For example, `meanGeometricWeighted(10, 20, 0.7)` will return 16.24, while
	 * `meanGeometricWeighted(20, 10, 0.7)` will return 12.31 (the same result as `meanGeometricWeighted(10, 20, 1 - 0.7)`).
	 * When the weight is not given, it defaults to 0.5, thus yielding
	 * an even weight, that is, the {@link xjs_Math.meanGeometric|geometric mean}, of the two numbers.
	 * @param   x 1st finite number
	 * @param   y 2nd finite number
	 * @param   w weight of 2nd number; between 0–1
	 * @returns the weighted geometric mean of `x` and `y`
	 * @throws  {Error} if `x` or `y` is not a finite number
	 * @throws  {RangeError} if the weight is not between 0 and 1
	 * @throws  {NaNError} if an argument is `NaN`
	 */
	static meanGeometricWeighted(x: number, y: number, w: number = 0.5): number {
		xjs_Number.assertType(x, 'finite')
		xjs_Number.assertType(y, 'finite')
		xjs_Number.assertType(w)
		if (w < 0 || 1 < w) throw new RangeError(`${w} must be between 0 and 1.`)
		return (x ** (1 - w)) * (y ** w)
	}

	/**
	 * Return the harmonic mean of a set of numbers.
	 *
	 * ```js
	 * meanHarmonic([a,b])   == 1 / ((1/a + 1/b)       / 2)
	 * meanHarmonic([a,b,c]) == 1 / ((1/a + 1/b + 1/c) / 3)
	 * ```
	 * @param   nums an array of finite numbers
	 * @returns the harmonic mean of the given numbers
	 * @throws  {Error} if one of the array entries is not a finite number
	 * @throws  {RangeError} if `NaN` is in the array
	 */
	static meanHarmonic(nums: number[]): number {
		nums.forEach((n) => xjs_Number.assertType(n, 'finite')) // NB re-throw
		return 1 / xjs_Math.meanArithmetic(nums.map((x) => 1 / x))
	}

	/**
	 * Return the remainder of Euclidean division of `x` by `n`.
	 *
	 * This method returns `x % n` when `x` is positive,
	 * but returns a positive result when `x` is negative.
	 * The divisor `n` must be positive.
	 * @param   x the dividend
	 * @param   n the divisor, a positive integer
	 * @returns exactly `((x % n) + n) % n`
	 * @throws  {Error} if `n` is not a positive integer
	 */
	static mod(x: number, n: number): number {
		xjs_Number.assertType(x, 'finite')
		xjs_Number.assertType(n, 'whole')
		return ((x % n) + n) % n
	}

  /**
   * Return the `n`th tetration of `x`.
   *
   * Tetration is considered the next hyperoperation after exponentiation
   * (which follows multiplication, following addition).
   * For example, `tetrate(5, 3)` returns the result of `5 ** 5 ** 5`: repeated exponentiation.
   * (Note that with ambiguous grouping, `a ** b ** c` is equal to `a ** (b ** c)`.)
   * If there were a native JavaScript operator for tetration,
   * it might be a triple-asterisk: `5 *** 3`.
   *
   * Currently, there is only support for non-negative integer hyperexponents.
   * Negative numbers and non-integers are not yet allowed.
   *
   * ```js
   * tetrate(5, 3) // returns 5 ** 5 ** 5 // equal to 5 ** (5 ** 5)
   * tetrate(5, 1) // returns 5
   * tetrate(5, 0) // returns 1
   * ```
   *
   * @param   x the root, any number
   * @param   n the hyper-exponent to which the root is raised, a non-negative integer
   * @returns informally, `x *** n`
   * @throws  {Error} if `n` is not a non-negative integer
   */
  static tetrate(x: number, n: number): number {
    xjs_Number.assertType(x, 'finite')
    xjs_Number.assertType(n, 'natural')
    return (n === 0) ? 1 : x ** xjs_Math.tetrate(x, n - 1)
  }


  private constructor() {}
}
