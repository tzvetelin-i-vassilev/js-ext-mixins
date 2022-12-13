import Extension from "../Extension.js"

/**
 * HTMLImageElement extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class HTMLImageElementExt extends Extension {
	/**
	 * Encodes image as Base64 encoded string
	 *
	 * @param {string} [type=png] Image type, mime type second part
	 * @returns {string} Base64 encoded string
	 */
	toDataURL(type = "png") {
		let canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.getContext("2d").drawImage(this, 0, 0);

		return canvas.toDataURL(`image/${type}`);
	}

	/**
	 * Encodes image as Blob
	 *
	 * @param {string} [type=png] Image type, mime type second part
	 * @returns {Blob} Encoded image as Blob
	 */
	toBlob(type = "png") {
		return new Blob([this.toArrayBuffer(type)], {type: `image/${type}`});
	}

	/**
	 * Encodes image as ArrayBuffer
	 *
	 * @param {string} [type=png] Image type, mime type second part
	 * @returns {ArrayBuffer} Encoded image as ArrayBuffer
	 */
	toArrayBuffer(type) {
		if (!ArrayBuffer.fromBase64) throw new Error("ArrayBuffer extension is required");

		let dataURL = this.toDataURL(type);
		let base64 = dataURL.split(",")[1];

		return ArrayBuffer.fromBase64(base64);
	}
}

export default HTMLImageElementExt
