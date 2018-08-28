import xjs_Object from './Object.class'


/**
 * @summary Additional static members for the native Date class.
 * @description Does not extend the native Date class.
 */
export default class xjs_Date {
  /**
   * @summary List of full month names in English.
   */
  static readonly MONTH_NAMES = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

  /**
   * @summary List of full day names in English.
   */
  static readonly DAY_NAMES = [
      'Sundary',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

  /**
   * @summary Return whether two dates occur on the same 24-hour day.
   * @description That is, if both dates have the same year, same month, *and* same day (date of the month).
   * @param   date1 the first date
   * @param   date2 the second date
   * @returns Does 'YYYY-MM-DD' of `date1` equal 'YYYY-MM-DD' of `date2`?
   */
  static sameDate(date1: Date, date2: Date): boolean {
    return date1.toISOString().slice(0,10) === date2.toISOString().slice(0,10)
  }

  /**
   * @summary Return the percentage of the day that has passed at the given time.
   * @description For example:
   * - `00:00` => 0.00
   * - `06:00` => 0.25
   * - `12:00` => 0.50
   * - `18:00` => 0.75
   * @param   date a Date object
   * @returns the proportion
   */
  static timeProportion(date: Date): number {
    let millis  =  date.getUTCMilliseconds()       / 1000
    let seconds = (date.getUTCSeconds() + millis)  / 60
    let minutes = (date.getUTCMinutes() + seconds) / 60
    let hours   = (date.getUTCHours  () + minutes) / 24
    return hours
  }

  /**
   * @summary Format a date, using PHP-based formatting options.
   * @description The following options are supported (with examples):
   * - 'Y-m-d'     : '2017-08-05'
   * - 'j M Y'     : '5 Aug 2017'
   * - 'd F Y'     : '05 August 2017'
   * - 'l, j F, Y' : 'Friday, 5 August, 2017'
   * - 'j M'       : '5 Aug'
   * - 'M Y'       : 'Aug 2017'
   * - 'M j'       : 'Aug 5'
   * - 'M j, Y'    : 'Aug 5, 2017'
   * - 'F j, Y'    : 'August 5, 2017'
   * - 'M'         : 'Aug'
   * - 'H:i'       : '21:33'
   * - 'g:ia'      : '9:33pm'
   * - 'default'   : '2017-08-06T01:33:00.000Z' ({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString|Date#toISOString})
   * @see http://php.net/manual/en/function.date.php
   * @param   date the date to format
   * @param   format one of the enumerated options listed in the description
   * @returns a string representing the given date in the given format
   */
  static format(date: Date, format: string): string {
    const MONTHS = xjs_Date.MONTH_NAMES
    /**
     * @summary Convert a positive number to a string, adding a leading zero if and only if it is less than 10.
     * @private
     * @param  n any positive number
     * @return that number as a string, possibly prepended with '0'
     */
    function leadingZero(n: number): string { return `${(n < 10) ? '0' : ''}${n}` }
		return xjs_Object.switch<string>({
			'Y-m-d'    : (date: Date) => `${date.getFullYear()}-${leadingZero(date.getUTCMonth()+1)}-${leadingZero(date.getUTCDate())}`,
			'j M Y'    : (date: Date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
			'd F Y'    : (date: Date) => `${leadingZero(date.getUTCDate())} ${MONTHS[date.getUTCMonth()]} ${date.getFullYear()}`,
			'l, j F, Y': (date: Date) => `${xjs_Date.DAY_NAMES[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}, ${date.getFullYear()}`,
			'j M'      : (date: Date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)}`,
			'M Y'      : (date: Date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
			'M j'      : (date: Date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}`,
			'M j, Y'   : (date: Date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}, ${date.getFullYear()}`,
			'F j, Y'   : (date: Date) => `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getFullYear()}`,
			'M'        : (date: Date) => `${MONTHS[date.getUTCMonth()].slice(0,3)}`,
			'H:i'      : (date: Date) => `${(date.getUTCHours() < 10) ? '0' : ''}${date.getUTCHours()}:${(date.getUTCMinutes() < 10) ? '0' : ''}${date.getUTCMinutes()}`,
			'g:ia'     : (date: Date) => `${(date.getUTCHours() - 1)%12 + 1}:${(date.getUTCMinutes() < 10) ? '0' : ''}${date.getUTCMinutes()}${(date.getUTCHours() < 12) ? 'am' : 'pm'}`,
			'default'  : (date: Date) => date.toISOString(),
		}, format)(date)
  }


  private constructor() {}
}
