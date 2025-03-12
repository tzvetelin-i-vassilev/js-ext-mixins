import Extension from "../Extension.js"

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
	 * @param {boolean} [point2D=false] When true 'z' is excluded
	 * @returns {string} Value formatted as 'point(x, y, z)'
	 */
	toString(point2D = false) {
		return `point(${this.x}, ${this.y}${point2D ? "" : `, ${this.z}`})`;
	}
}

export default DOMPointExt
