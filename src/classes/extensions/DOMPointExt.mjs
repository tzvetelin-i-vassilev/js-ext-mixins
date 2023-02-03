import Extension from "../Extension.mjs"

/**
 * DOMPoint extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class DOMPointExt extends Extension {
	/**
	 * Transform underlying point. matrixTransform alias.
	 *
	 * @param {DOMMatrix} matrix Transform matrix
	 * @returns {DOMPoint} Transformed point
	 */
	transform(matrix) {
		if (!(matrix instanceof DOMMatrix)) matrix = DOMMatrix.fromMatrix(matrix);
		return this.matrixTransform(matrix);
	}

	/**
	 * @returns {string} Value formatted as 'point(x, y, z)'
	 */
	toString() {
		return `point(${this.x}, ${this.y}, ${this.z})`;
	}
}

export default DOMPointExt
