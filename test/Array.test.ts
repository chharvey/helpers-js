import * as assert from 'assert'
import xjs_Array from '../src/class/Array.class'

describe('xjs.Array', () => {
	describe('.random<T>(readonly T[]): T', () => {
		it('returns a random element from the arary.', () => {
			const arr: string[] = [...new Array(100)].map(() => `${Math.random() * 1000}`)
			arr.forEach(() => {
				assert.ok(arr.includes(xjs_Array.random(arr)))
			})
		})
	})

	describe('.shuffle<T>(T[]): T[]', () => {
		it('shuffles the array in place.', () => {
			const arr: string[] = [...new Array(100)].map(() => `${Math.random() * 1000}`)
			const arr_orig: string[] = arr.slice()
			xjs_Array.shuffle(arr)
			assert.notStrictEqual    (        arr_orig ,         arr , 'they should not be references to the same object')
			assert.notDeepStrictEqual(        arr_orig ,         arr , 'their elements (in order) should not be the same')
			assert.deepStrictEqual   (new Set(arr_orig), new Set(arr), 'they should contain the same elements but in any order')
		})
	})

	describe('.is<T>(readonly T[], readonly T[], ((T, T) -> boolean)?): boolean', () => {
		it('only checks one level of depth.', () => {
			assert.ok(!xjs_Array.is(
				[1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five']],
				[1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five']],
			))
			assert.ok(!xjs_Array.is(
				[1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five']],
				[1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five'], [6, 'six', [6,'six'], { six: 6 }]],
			))
			assert.ok(!xjs_Array.is(
				[1, 'two', { value: 3 }, ['four']],
				[['four'], 1, 'two', { value: 3 }],
			))
		})
	})

	describe('.densify<T>(readonly T[]): T[]', () => {
		it('removes empty element slots.', () => {
			const x: readonly (number|void)[] = [, 42, , 48, ,]
			assert.deepStrictEqual(xjs_Array.densify(x), [42,48])
		})
		it('does not remove `undefined` elements.', () => {
			const x: readonly (number|void)[] = [void 0, 42, void 0, 48, void 0,]
			assert.notDeepStrictEqual(x,        [      , 42,       , 48,       ,])
			assert.deepStrictEqual(xjs_Array.densify(x), x)
		})
	})

	describe('.fillHoles<T>(readonly T[], T): T[]', () => {
		it('fills empty slots with given value.', () => {
			const x: readonly (number|void)[] = [, 42, , 48, ,]
			assert.deepStrictEqual(xjs_Array.fillHoles(x, 0), [0, 42, 0, 48, 0])
		})
	})

	describe('.isSubarrayOf<U, T extends U>(readonly T[], readonly U[], ((U, U) -> boolean)?): boolean', () => {
		it('is true if elements of the first are in the second, in the same order.', () => {
			const x: number[] = [3,4]
			assert.ok( xjs_Array.isSubarrayOf(x, [0,1,2,0,3,4]))
			assert.ok( xjs_Array.isSubarrayOf(x, [3,4,5]      ))
			assert.ok( xjs_Array.isSubarrayOf(x, [3,3,4,4]    ))
			assert.ok( xjs_Array.isSubarrayOf(x, [3,4]        ))
			assert.ok( xjs_Array.isSubarrayOf(x, [3,0,1,4]    ))
			assert.ok( xjs_Array.isSubarrayOf(x, [3,0,4,1]    ))
			assert.ok(!xjs_Array.isSubarrayOf(x, [3]          ))
			assert.ok(!xjs_Array.isSubarrayOf(x, [0,1,3,0,2,5]))
			assert.ok(!xjs_Array.isSubarrayOf(x, [2,4]        ))
			assert.ok(!xjs_Array.isSubarrayOf(x, [4,3]        ))
			assert.ok(!xjs_Array.isSubarrayOf(x, [0]          ))
		})
	})

	describe('.isSuperarrayOf<T, U extends T>(readonly T[], readonly U[], ((T, T) -> boolean)?): boolean', () => {
		it('is true if elements of the second are in the first, in the same order.', () => {
			const x: number[] = [0,1,2,0,3,4]
			assert.ok( xjs_Array.isSuperarrayOf(x, [3,4]          ))
			assert.ok( xjs_Array.isSuperarrayOf(x, [0,1,2]        ))
			assert.ok( xjs_Array.isSuperarrayOf(x, [0,1,2,0,3,4]  ))
			assert.ok( xjs_Array.isSuperarrayOf(x, [0,3,4]        ))
			assert.ok( xjs_Array.isSuperarrayOf(x, [1]            ))
			assert.ok( xjs_Array.isSuperarrayOf(x, []             ))
			assert.ok( xjs_Array.isSuperarrayOf(x, [2,4]          ))
			assert.ok(!xjs_Array.isSuperarrayOf(x, [2,5]          ))
			assert.ok(!xjs_Array.isSuperarrayOf(x, [4,0]          ))
			assert.ok(!xjs_Array.isSuperarrayOf(x, [4,3]          ))
			assert.ok(!xjs_Array.isSuperarrayOf(x, [0,1,2,0,3,4,5]))
		})
	})

	describe('.isConsecutiveSubarrayOf<U, T extends U>(readonly T[], readonly U[], ((U, U) -> boolean)?): boolean', () => {
		it('is true if the first is consecutively in the second.', () => {
			const x: number[] = [3,4]
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [0,1,2,0,3,4]))
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [3,4,5]      ))
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [3,3,4,4]    ))
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [3,4]        ))
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [3,0,1,4]    ))
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [3,0,4,1]    ))
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [3]          ))
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [0,1,3,0,2,5]))
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [2,4]        ))
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [4,3]        ))
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [0]          ))
		})
	})

	describe('.isConsecutiveSuperarrayOf<T, U extends T>(readonly T[], readonly U[], ((T, T) -> boolean)?): boolean', () => {
		it('is true if the second is consecutively in the first.', () => {
			const x: number[] = [0,1,2,0,3,4]
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [3,4]          ))
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [0,1,2]        ))
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [0,1,2,0,3,4]  ))
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [0,3,4]        ))
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [1]            ))
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, []             ))
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [2,4]          ))
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [2,5]          ))
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [4,0]          ))
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [4,3]          ))
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [0,1,2,0,3,4,5]))
		})
	})
})
