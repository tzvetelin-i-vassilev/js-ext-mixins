/**
 * DOMSize add-on
 *
 * @memberof add-ons
 */
class DOMSize {
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	/**
	 * @returns {object} Plain object
	 */
	toJSON() {
		return {width: this.width, height: this.height};
	}

	/**
	 * @returns {string} Value formatted as 'size(width, height)'
	 */
	toString() {
		return `size(${this.width}, ${this.height})`;
	}

	/**
	 * Converts given value to size
	 *
	 * @param {string | object} value
	 *   * string value template - size(width, height)
	 *   * object - {x: number, y: number}
	 * @returns {DOMSize} DOMSize instance
	 */
	static fromSize(value) {
		if (value instanceof DOMSize) return value;

		if (typeof value == "string") {
			if (value.startsWith("size(")) {
				let arr = value.substring(value.indexOf("(")+1, value.indexOf(")")).split(/,\s*/g);

				value = {
					width: parseFloat(arr[0]),
					height: parseFloat(arr[1])
				};
			}
			else
				throw new Error("Invalid value found. Expected template - size(width, height).");
		}

		if (isNaN(value.width)) throw new Error("Invalid width found, expected number");
		if (isNaN(value.height)) throw new Error("Invalid height found, expected number");

		return new DOMSize(value.width, value.height);
	}
}

export default DOMSize
