import Extension from "../Extension.js"

/**
 * ArrayBuffer extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class ArrayBufferExt extends Extension {
	/**
	 * Encodes underlying buffer to base64 encoded string
	 *
	 * @returns {string} base64 encoded string
	 */
	toBase64() {
		if (!String.fromCharArray) throw new Error("String extension is required");

		let bytes = new Uint8Array(this);
		return btoa(String.fromCharArray(bytes));
	}

	/**
	 * Decodes base64 encoded string
	 *
	 * @param {string} str Base64 encoded data
	 * @returns {ArrayBuffer} Decoded buffer
	 */
	static fromBase64(str) {
		if (!String.prototype.toCharArray) throw new Error("String extension is required");

		return atob(str).toCharArray(true).buffer;
	}

	/**
	 * Determines whether object is instance of any TypedArray
	 *
	 * @param {TypedArray} o Object to verify
	 * @returns {boolean} Is instance of any TypedArray
	 */
	static isTypedArray(o) {
		return ArrayBuffer.isView(o) && !(o instanceof DataView);
	}
}

export default ArrayBufferExt
