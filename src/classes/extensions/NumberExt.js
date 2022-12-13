import Extension from "../Extension.js"

/**
 * Number extension
 *
 * @property {number} MAX_INT32 0x7FFFFFFF (static property)
 * @property {number} MAX_UINT32 0xFFFFFFFF (static property)
 * @property {BigInt} MAX_INT64 0x7FFFFFFFFFFFFFFFn (static property)
 * @property {BigInt} MAX_UINT64 0xFFFFFFFFFFFFFFFFn (static property)
 *
 * @hideconstructor
 * @memberof extensions
 */
class NumberExt extends Extension {
	static classProperties = {
		MAX_INT32: {value: 0x7FFFFFFF, enumerable: true},
		MAX_UINT32: {value: 0xFFFFFFFF, enumerable: true},
		MAX_INT64: (typeof BigInt == "undefined") ? undefined : {value: 0x7FFFFFFFFFFFFFFFn, enumerable: true},
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
	 * Formats underlying number with padding from the left side.
	 * It should be positive integer else Error is thrown.
	 *
	 * @example padded number 158 with length 5 and char '0' will result to  '00158'
	 *
	 * @param {int} length Number length that needs padding
	 * @param {char} [char='0'] Padding value
	 * @returns {string} Formatted number
	 */
	pad(length, char = "0") {
		if (!Number.isInteger(this) || this < 0)
			throw new Error(`Underlying number ${this} should be positive integer`);

		return (String(this).length < length) ? (new Array(length - String(this).length + 1)).join(char) + String(this) : this.toString();
	}
}

export default NumberExt
