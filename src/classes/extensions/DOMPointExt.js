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
	 * @param {boolean} [round=false] Should round numbers after transform
	 * @returns {DOMPoint} Transformed point
	 */
	transform(matrix, round = false) {
		let point = this.matrixTransform(matrix);
		if (round) point = new DOMPoint(Math.round(point.x), Math.round(point.y), Math.round(point.z));

		return point;
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
