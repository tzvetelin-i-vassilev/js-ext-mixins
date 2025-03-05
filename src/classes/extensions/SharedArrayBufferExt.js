import Extension from "../Extension.js"

/**
 * SharedArrayBuffer extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class SharedArrayBufferExt extends Extension {
	/**
	 * Copy buffer data in shared memory buffer
	 *
	 * @param {ArrayBuffer} buffer
	 * @returns {SharedArrayBuffer} Buffer copy
	 */
	static fromArrayBuffer(buffer) {
		if (!(buffer instanceof ArrayBuffer)) throw new Error("ArrayBuffer is expected");

		let bytes = new Uint8Array(buffer);

		let sharedBuffer = new SharedArrayBuffer(buffer.byteLength);
		let sharedBytes = new Uint8Array(sharedBuffer);
		sharedBytes.set(bytes);

		return sharedBuffer;
	}
}

export default SharedArrayBufferExt
