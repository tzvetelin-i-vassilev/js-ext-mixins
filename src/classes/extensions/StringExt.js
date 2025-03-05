import Extension from "../Extension.js"

/**
 * String extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class StringExt extends Extension {
	/**
	 * Formats underlying string with padding from the left side
	 *
	 * @example padded string 'MyString' with length 10 and char ' ' will result to  '  MyString'
	 *
	 * @param {int} length Number length that needs padding
	 * @param {char} [char='-'] Padding value
	 * @returns {string} Formatted string
	 */
	padStart(length, char = "-") {
		return (this.length < length) ? (new Array(length - this.length + 1)).join(char) + this : this.toString();
	}
/*
	charsCode() {
		return this.split("").reduce((previous, current) => previous + current.charCodeAt(0), 0)
	}
*/
	/**
	 * Converts string to char array
	 *
	 * @param {boolean} [bytes=false] Result type, When is true but string contains multi-bytes symbols is treated as false
	 * @returns {Array<int> | Uint8Array} Char array, where type depends for bytes property
	 */
	toCharArray(bytes = false) {
		let list = [];
		let byteList = true;

		for (let i = 0; i < this.length; i++) {
			let code = this.charCodeAt(i);

			if (code > 255) byteList = false;
			list[i] = code;
		}

		if (bytes) {
			if (!byteList) throw new Error("Current value is not byte string");
			list = new Uint8Array(list);
		}

		return list;
	}

	/**
	 * Converts char array to string
	 *
	 * @param {Array<byte> | Uint8Array} data Bytes to serialize
	 * @returns {string} Binary data as string
	 */
	static fromCharArray(data) {
		return data.reduce((binary, byte) => binary + String.fromCharCode(byte), "");
	}
}

export default StringExt
