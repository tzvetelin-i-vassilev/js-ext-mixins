import Extension from "../Extension.js"

/**
 * FormData extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class FormDataExt extends Extension {
	/**
	 * Represents form data as object. Suitable for debugging.
	 *
	 * @returns {object} Readable data
	 */
	toObject() {
		let data = {};

		for (let [key, value] of this.entries()) {
			if (data[key]) {
				if (Array.isArray(data[key]))
					data[key].push(value);
				else {
					data[key] = [data[key], value];
				}
			}
			else
				data[key] = value;
		}

		return data;
	}
}

export default FormDataExt
