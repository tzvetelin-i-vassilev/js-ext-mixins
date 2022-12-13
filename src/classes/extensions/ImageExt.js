import Extension from "../Extension.js"

/**
 * Image extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class ImageExt extends Extension {
	/**
	 * Image loader
	 *
	 * @param {Uint8Array} bytes Image data
	 * @param {string} [type=png] Image type, mime type second part
	 * @param {Image} [image=new Image()] Data target
	 * @returns {Promise<Image>} Promise resolution load bytes
	 */
	static fromBytes(bytes, type = "png", image = new Image()) {
		return new Promise((resolve, reject) => {
			image.onload = () => {
				URL.revokeObjectURL(image.src);
				resolve(image);
			}

			image.onerror = reject;

			image.src = URL.createObjectURL(new Blob([bytes.buffer || bytes], {type : `image/${type}`}));
		});
	}
}

export default ImageExt
