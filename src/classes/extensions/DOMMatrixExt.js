import Extension from "../Extension.js"

let nativeFromMatrix;
let nativeToString;

// https://www.javascripture.com/DOMMatrix

/**
 * DOMMatrix extension
 *
 * @property {float} tx Translate x, 'e' alias
 * @property {float} ty Translate y, 'f' alias
 * @property {float} dx Translate x, 'e' alias
 * @property {float} dy Translate y, 'f' alias
 *
 * @hideconstructor
 * @memberof extensions
 */
class DOMMatrixExt extends Extension {
	static overrides = Extension.overrides.concat(["fromMatrix", "multiply", "multiplySelf", "transformPoint"]);

	static properties = {
		tx: {get: function() {return this.e}, set: function(value) {this.e = value}, enumerable: true},
		ty: {get: function() {return this.f}, set: function(value) {this.f = value}, enumerable: true},
		dx: {get: function() {return this.e}, set: function(value) {this.e = value}, enumerable: true},
		dy: {get: function() {return this.f}, set: function(value) {this.f = value}, enumerable: true},

		translated: {get: function() {return {x: this.tx, y: this.ty}}, enumerable: true},
		rotated: {get: function() {return {angle: Math.atan2(this.b, this.a)}}, enumerable: true},
		scaled: {get: function() {return {x: Math.hypot(this.a, this.c), y: Math.hypot(this.b, this.d)}}, enumerable: true},
		skewed: {get: function() {return {angleX: Math.tan(this.c), angleY: Math.tan(this.b)}}, enumerable: true}
	};

	/**
	 * Transform point
	 *
	 * @param {DOMPoint} point Point to transform
	 * @returns {DOMPoint} Transformed point
	 */
	transformPoint(point) {
		return DOMPoint.fromPoint(point).matrixTransform(this);
	}

	/**
	 * Inverts matrix. The original matrix is not altered. Alias of 'inverse'.
	 *
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	invert() {
		return this.inverse();
	}

	// TODO: remove later
	decompose() {
		console.warn("This method is deprecated. Use the following props instead - translated, rotated, scaled, skewed");

		return {
			translate: this.translated,
			rotate: this.rotated,
			scale: this.scaled,
			skew: this.skewed,
			matrix: this
		};
	}

	/**
	 * @returns {string} Value formatted as 'matrix(a, b, c, d, e, f)'
	 */
	toString(textTable = false) {
		if (!textTable) return nativeToString.call(this);

		let format = n => ((n < 0 ? "" : " ") + n.toPrecision(6)).substring(0, 8);

		return " Matrix 4x4" +
			"\n" + "-".repeat(39) +
			`\n${format(this.m11)}, ${format(this.m21)}, ${format(this.m31)}, ${format(this.m41)}` +
			`\n${format(this.m12)}, ${format(this.m22)}, ${format(this.m32)}, ${format(this.m42)}` +
			`\n${format(this.m13)}, ${format(this.m23)}, ${format(this.m33)}, ${format(this.m43)}` +
			`\n${format(this.m14)}, ${format(this.m24)}, ${format(this.m34)}, ${format(this.m44)}`;
	}

	/**
	 * Factory method for Matrix creation
	 *
	 * @param {Matrix2D | Matrix3D | CSSMatrix} data
	 * @returns {DOMMatrix} Matrix based on data
	 */
	static fromMatrix(data) {
		let matrix;

		if (typeof data == "string")
			matrix = new DOMMatrix(data);
		else {
			if (!("e" in data)) data.e = data.tx ?? data.dx ?? 0;
			if (!("f" in data)) data.f = data.ty ?? data.dy ?? 0;

			matrix = nativeFromMatrix(data);
		}

		return matrix;
	}

	/**
	 * Applies a transformation around a given pivot point.
	 * Converts a transform from local(model) space into a world(view) space
	 * defined by a reference point (pivot)
	 *
	 * The transform is conjugated as: T(pivot) · M · T(-pivot)
	 *
	 * This effectively rotates/scales/translates the matrix
	 * around the specified point instead of the origin.
	 *
	 * @param {DOMPointInit} pivot The point to transform around (focus/pivot point)
	 * @returns {DOMMatrix} A new transformed matrix
	 */
	at(pivot) {
		const t = DOMMatrix.fromTranslate(pivot);
		const inv = DOMMatrix.fromTranslate({x: -pivot.x, y: -pivot.y});

		return t.multiply(this).multiply(inv);
	}

	/**
	 * Converts a transform from world(view) space into a local(model) space
	 * defined by a reference point (pivot)
	 *
	 * This performs a change of basis: T(-pivot) · M · T(pivot)
	 *
	 * Use this when you want to interpret a global transform
	 * as if the pivot point were the origin of the coordinate system.
	 *
	 * @param {DOMMatrix} matrix The transform in world(view) space
	 * @param {DOMPointInit} pivot The reference point defining the local space origin
	 * @returns {DOMMatrix} The transform expressed in local space
	 */
	static toLocal(matrix, pivot) {
		const t = DOMMatrix.fromTranslate(pivot);
		const inv = DOMMatrix.fromTranslate({x: -pivot.x, y: -pivot.y});

		return inv.multiply(matrix).multiply(t);
	}

	/**
	 * Applies a transformation in the coordinate space defined by another matrix.
	 *
	 * This performs: S⁻¹ · M · S
	 *
	 * This allows a transform to behave as if it were defined
	 * relative to a different space (e.g. pivot, object, or view space).
	 *
	 * @param {DOMMatrix} matrix - The transformation to apply.
	 * @param {DOMMatrix} space - The matrix defining the reference space.
	 * @returns {DOMMatrix} A new matrix representing the transformed delta.
	 */
	static inSpace(matrix, space) {
		if (!(space instanceof DOMMatrix)) space = DOMMatrix.fromMatrix(space);

		return space.inverse().multiply(matrix).multiply(space);
	}

	/**
	 * Converts a transformation into the coordinate space defined by another matrix.
	 *
	 * This performs a change of basis: S · M · S⁻¹
	 *
	 * Use this to reinterpret a transform as if it were defined
	 * in the coordinate system described by the given space matrix.
	 *
	 * @param {DOMMatrix} matrix - The transformation to convert.
	 * @param {DOMMatrix} space - The matrix defining the target coordinate space.
	 * @returns {DOMMatrix} The transformation expressed in the target space.
	 */
	static toSpace(matrix, space) {
		if (!(space instanceof DOMMatrix)) space = DOMMatrix.fromMatrix(space);

		return space.multiply(matrix).multiply(space.inverse());
	}

	/**
	 * Creates translate matrix
	 *
	 * @param {Translate} offset
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	static fromTranslate(offset) {
		let translate = (typeof offset === "number") ? {tx: offset, ty: offset} : {tx: offset.x, ty: offset.y};

		return DOMMatrix.fromMatrix(translate);
	}

	/**
	 * Creates delta rotate matrix
	 *
	 * @param {float} angle Value should be in rad
	 * @param {DOMPoint} [focus={x: 0, y: 0}] Transform pivot point
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	static fromRotate(angle, focus) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		let m = new DOMMatrix();

		m.a = cos;
		m.b = sin;
		m.c = -sin;
		m.d = cos;

		if (focus)
			m = m.at(focus);

		return m;
	}

	/**
	 * Creates delta scale matrix
	 *
	 * @param {Scale | float} factor Scale factor
	 * @param {DOMPoint} [focus={x: 0, y: 0}] Transform pivot point
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	static fromScale(factor, focus) {
		if (typeof factor === "number") factor = {x: factor, y: factor};

		let m = new DOMMatrix();

		m.a = factor.x;
		m.d = factor.y;

		if (focus)
			m = m.at(focus);

		return m;
	}

	/**
	 * Creates transformation based on three points
	 *
	 * @param {Array<DOMPoint>} ps Fixed array with length 3. Starting points which should be transformed.
	 * @param {Array<DOMPoint>} pf Fixed array with length 3. Final points after transformation
	 * @returns {DOMMatrix} Matrix which transforms starting points to final points
	 */
	static fromPoints(ps, pf) {
		let O = DOMMatrix.fromMatrix({
			m11: ps[0].x, m21: ps[1].x, m31: ps[2].x,
			m12: ps[0].y, m22: ps[1].y, m32: ps[2].y,
			m13: 1,       m23: 1,       m33: 1
		});

		let F = DOMMatrix.fromMatrix({
			m11: pf[0].x, m21: pf[1].x, m31: pf[2].x,
			m12: pf[0].y, m22: pf[1].y, m32: pf[2].y,
			m13: 1,       m23: 1,       m33: 1
		});

		// O * X = F
		// inv(O) * O * X = inv(O) * F
		let X = F.multiply(O.inverse());

		// convert to homogeneous coordinates
		return DOMMatrix.fromMatrix({a: X.m11, b: X.m12, c: X.m21, d: X.m22, tx: X.m31, ty: X.m32});
	}

	static extend() {
		if (typeof DOMMatrix === "undefined" || nativeFromMatrix)
			return false;

		nativeFromMatrix = DOMMatrix.fromMatrix;
		nativeToString = DOMMatrix.prototype.toString;

		Extension.extend("DOMMatrix", this);
	}
}

export default DOMMatrixExt
