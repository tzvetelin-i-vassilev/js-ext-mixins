import Extension from "../Extension.js"

import DOMSize from "../add-ons/DOMSize.js"

/**
 * DOMRect extension
 *
 * @property {DOMSize} size Rect size
 * @property {DOMPoint} center Rect center
 *
 * @hideconstructor
 * @memberof extensions
 */
class DOMRectExt extends Extension {
	static properties = {
		size: {get: function() {return new DOMSize(this.width, this.height)}, configurable: true},
		center: {get: function() {return new DOMPoint((this.left + this.right) / 2, (this.top + this.bottom) / 2)}, configurable: true}
	}

	/**
	 * Union 2 rects
	 *
	 * @param {DOMRect} rect Union with area
	 * @returns {DOMRect} Union result
	 */
	union(rect) {
		if (!rect) return this;

		return DOMRect.ofEdges(
			Math.min(this.left, rect.left),
			Math.min(this.top, rect.top),
			Math.max(this.right, rect.right),
			Math.max(this.bottom, rect.bottom)
		);
	}

	/**
	 * Intersects 2 rects
	 *
	 * @param {DOMRect} rect Intersect with area
	 * @returns {DOMRect} Intersection result
	 */
	intersect(rect) {
		if (!rect) return;

		let result = DOMRect.ofEdges(
			Math.max(this.left, rect.left),
			Math.max(this.top, rect.top),
			Math.min(this.right, rect.right),
			Math.min(this.bottom, rect.bottom)
		);

		return (result.width > 0 && result.height > 0) ? result : undefined;
	}

	/**
	 * Floor LeftTop, Ceil BottomRight points
	 *
	 * @param {boolean} [even=false] Rect width and height will be multiples of 2
	 * @returns {DOMRect} Ceiling result
	 */
	ceil(even = false) {
		let left = Math.floor(this.left);
		let top = Math.floor(this.top);
		let right = Math.ceil(this.right);
		let bottom = Math.ceil(this.bottom);

		if (even) {
			let width = this.width;
			let height = this.height;

			width += width % 2;
			height += height % 2;

			right = left + width;
			bottom = top + height;
		}

		return DOMRect.ofEdges(left, top, right, bottom);
	}

	/**
	 * Ceil LeftTop, Floor BottomRight points
	 *
	 * @param {boolean} [even=false] Rect width and height will be multiples of 2
	 * @returns {DOMRect} Flooring result
	 */
	floor(even = false) {
		let left = Math.ceil(this.left);
		let top = Math.ceil(this.top);
		let right = Math.floor(this.right);
		let bottom = Math.floor(this.bottom);

		if (even) {
			let width = this.width;
			let height = this.height;

			width -= width % 2;
			height -= height % 2;

			right = left + width;
			bottom = top + height;
		}

		return DOMRect.ofEdges(left, top, right, bottom);
	}

	/**
	 * Is point part from rect
	 *
	 * @param {DOMPoint} point
	 * @returns {boolean} Is point part from rect
	 */
	contains(point) {
		return this.left <= point.x && this.right >= point.x && this.top <= point.y && this.bottom >= point.y;
	}

	/**
	 * Transform rect. Result rect is bounds of transformed edges.
	 *
	 * @param {DOMMatrix} matrix Transform matrix
	 * @returns {DOMRect} Transformed rect
	 */
	transform(matrix) {
		if (!(matrix instanceof DOMMatrix)) matrix = DOMMatrix.fromMatrix(matrix);

		let leftTop = DOMPoint.fromPoint({x: this.left, y: this.top}).transform(matrix);
		let rightTop = DOMPoint.fromPoint({x: this.right, y: this.top}).transform(matrix);
		let leftBottom = DOMPoint.fromPoint({x: this.left, y: this.bottom}).transform(matrix);
		let rightBottom = DOMPoint.fromPoint({x: this.right, y: this.bottom}).transform(matrix);

		let left = Math.min(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x);
		let top = Math.min(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y);
		let right = Math.max(leftTop.x, rightTop.x, leftBottom.x, rightBottom.x);
		let bottom = Math.max(leftTop.y, rightTop.y, leftBottom.y, rightBottom.y);

		return DOMRect.ofEdges(left, top, right, bottom);
	}

	toPath() {
		let path = [];

		path.push(this.left, this.top);
		path.push(this.right, this.top);
		path.push(this.right, this.bottom);
		path.push(this.left, this.bottom);
		path.push(this.left, this.top);

		return path.toFloat32Array();
	}

	/**
	 * @returns {string} Value formatted as 'rect(x, y, width, height)'
	 */
	toString() {
		return `rect(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
	}

	/**
	 * Creates new instance
	 *
	 * @param {float} left
	 * @param {float} top
	 * @param {float} right
	 * @param {float} bottom
	 * @returns {DOMRect} New instance
	 */
	static ofEdges(left, top, right, bottom) {
		return new DOMRect(left, top, right - left, bottom - top);
	}

	static extend() {
		let success = Extension.extend("DOMRect", this);

		if (success)
			globalThis.DOMSize = DOMSize;
	}
}

export default DOMRectExt
