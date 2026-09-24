import Extension from "../Extension.js"

/**
 * Number extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class NumberExt extends Extension {
	static classProperties = {
		/**
		 * 0x7FFFFFFF
		 *
		 * @name extensions.NumberExt.MAX_INT32
		 * @type {number}
		 * @readonly
		 */
		MAX_INT32: {value: 0x7FFFFFFF, enumerable: true},

		/**
		 * 0xFFFFFFFF
		 *
		 * @name extensions.NumberExt.MAX_UINT32
		 * @type {number}
		 * @readonly
		 */
		MAX_UINT32: {value: 0xFFFFFFFF, enumerable: true},

		/**
		 * 0x7FFFFFFFFFFFFFFFn
		 *
		 * @name extensions.NumberExt.MAX_INT64
		 * @type {BigInt}
		 * @readonly
		 */
		MAX_INT64: (typeof BigInt == "undefined") ? undefined : {value: 0x7FFFFFFFFFFFFFFFn, enumerable: true},

		/**
		 * 0xFFFFFFFFFFFFFFFFn
		 *
		 * @name extensions.NumberExt.MAX_UINT64
		 * @type {BigInt}
		 * @readonly
		 */
		MAX_UINT64: (typeof BigInt == "undefined") ? undefined : {value: 0xFFFFFFFFFFFFFFFFn, enumerable: true}
	}
/*
	getLength() {
		if (!Number.isInteger(this) || this < 0)
			throw new Error(`Underlying number ${this} should be positive integer`);

		return (Math.log10((this ^ (this >> 31)) - (this >> 31)) | 0) + 1
	}
*/
	/**
	 * Formats underlying number.
	 * It should be positive integer else Error is thrown.
	 *
	 * @param {string} pattern
	 * @example formatted number 158 with pattern '00000' will result to  '00158'
	 * @returns {string} Formatted number
	 */
	format(pattern) {
		if (!Number.isInteger(this) || this < 0)
			throw new Error(`Underlying number ${this} should be positive integer`);

		if (this.toString().length < pattern.length)
			return pattern.substring(0, pattern.length - this.toString().length) + this;
		else
			return this.toString();
	}

	/**
	 * Compares this instance to a specified number and returns an indication of their relative values
	 *
	 * @param {number} value A number to compare
	 * @returns {number} When equals - 0, when this is less than b - -1, else 1
	 */
	compareTo(value) {
		if (this < value)
			return -1;
		else if (this > value)
			return 1;
		else
			return 0;
	}
}

export default NumberExt
