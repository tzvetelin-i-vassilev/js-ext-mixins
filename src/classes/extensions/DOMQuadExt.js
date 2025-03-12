import Extension from "../Extension.js"

/**
 * DOMQuad extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class DOMQuadExt extends Extension {
	/**
	 * Transforms underlying quad
	 *
	 * @param {DOMMatrix} matrix Transform matrix
	 * @returns {DOMQuad} Transformed quad
	 */
	transform(matrix) {
		if (!(matrix instanceof DOMMatrix)) matrix = DOMMatrix.fromMatrix(matrix);
		return new DOMQuad(this.p1.transform(matrix), this.p2.transform(matrix), this.p3.transform(matrix), this.p4.transform(matrix));
	}

	/**
	 * Is point part from quad.
	 * Inside test (only convex polygons): Point lies on the same side of each quad's vertex AB, BC, CD, DA.
	 *
	 * @param {DOMPoint} point
	 * @returns {boolean} Is point part from quad
	 */
	contains(point) {
		let isLeftXZ = (a, b) => ((b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)) > 0

		let sideMatch = isLeftXZ(this.p1, this.p2);

		if (isLeftXZ(this.p2, this.p3) != sideMatch) return false;
		if (isLeftXZ(this.p3, this.p4) != sideMatch) return false;
		if (isLeftXZ(this.p4, this.p1) != sideMatch) return false;

		return true;
	}

	/**
	 * @returns {string} Value formatted as 'quad(point(x, y), point(x, y), point(x, y), point(x, y))'
	 */
	toString() {
		return `quad(${this.p1.toString(true)}, ${this.p2.toString(true)}, ${this.p3.toString(true)}, ${this.p4.toString(true)})`;
	}
}

export default DOMQuadExt
