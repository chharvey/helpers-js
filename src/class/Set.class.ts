import xjs_Object from './Object.class'
import xjs_Array from './Array.class'


/**
 * Additional static members for the native Set class.
 *
 * Does not extend the native Set class.
 */
export default class xjs_Set {
	/**
	 * Test whether two sets have “the same” elements.
	 *
	 * Similar to {@link xjs_Array.is}, but for sets, the order of elements is not important.
	 * @param   <T> the type of elements in the sets
	 * @param   a the first set
	 * @param   b the second set
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns Are corresponding elements the same, i.e. replaceable??
	 */
	static is<T>(a: ReadonlySet<T>, b: ReadonlySet<T>, predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		if (a === b) return true
		return a.size === b.size &&
			[...a].every((a_el) => [...b].some((b_el) => predicate(a_el, b_el))) &&
			[...b].every((b_el) => [...a].some((a_el) => predicate(b_el, a_el)))
	}

	/**
	 * Return whether `a` is a subset of `b`: whether all elements of `a` are in `b`.
	 *
	 * Note that if `a` is an empty set, or if `a` and `b` are “the same” (as determined by `predicate`),
	 * this method returns `true`.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the smaller set
	 * @param   b the larger set
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns Is `a` a subset of `b`?
	 */
	static isSubsetOf<U, T extends U>(a: ReadonlySet<T>, b: ReadonlySet<U>, predicate: (x: U, y: U) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Array.isSubarrayOf([...a].sort(), [...b].sort(), predicate)
	}

	/**
	 * {@link xjs_Set.isSubsetOf}, but with the parameters switched.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the larger set
	 * @param   b the smaller set
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns exactly `xjs.Set.isSubsetOf(b, a, predicate)`
	 */
	static isSupersetOf<T, U extends T>(a: ReadonlySet<T>, b: ReadonlySet<U>, predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Set.isSubsetOf(b, a, predicate)
	}

	/**
	 * Return the union (disjunction) of two sets: the set of elements that are in either set (or both sets).
	 * @see https://github.com/tc39/proposal-set-methods
	 * @param   <T> the type of elements in the `a`
	 * @param   <U> the type of elements in the `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present in either `a` or `b` (or both)
	 */
	static union<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T|U> {
		const returned: Set<T|U> = new Set(a)
		b.forEach((el) => { returned.add(el) })
		return returned
	}

	/**
	 * Return the intersection (conjunction) of two sets: the set of elements that are in both sets.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present only in both `a` and `b`
	 */
	static intersection<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T&U>;
	static intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
		const returned: Set<T> = new Set(a)
		a.forEach((el) => { if (!b.has(el)) returned.delete(el) })
		return returned
	}

	/**
	 * Return the difference (nonimplication) of two sets: the set of elements in `a`, but not in `b`.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present only in `a`
	 */
	static difference<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T>;
	static difference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
		const returned: Set<T> = new Set(a)
		a.forEach((el) => { if (b.has(el)) returned.delete(el) })
		return returned
	}

	/**
	 * Return the symmetric difference (exclusive disjunction) of two sets: the set of elements either in one set, or in the other, but not both.
	 *
	 * Equivalent to:
	 * - `difference( union(a,b) , intersection(a,b) )`
	 * - `union( difference(a,b) , difference(b,a) )`
	 * @see https://github.com/tc39/proposal-set-methods
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present only in `a` or only in `b`, but not both
	 */
	static symmetricDifference<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T|U> {
		return xjs_Set.difference(xjs_Set.union(a,b), xjs_Set.intersection(a,b))
	}


	private constructor() {}
}
