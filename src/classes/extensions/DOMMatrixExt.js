import Extension from "../Extension.js"

let nativeFromMatrix;

let nativeToString;
let nativeMultiply;
let nativeMultiplySelf;

// https://www.javascripture.com/DOMMatrix

/**
 * Controlls multiply of matrices order
 *
 * @readonly
 * @typedef MultiplicationType
 * @memberof extensions.DOMMatrixExt
 * @property {string} PRE Multiplication order is 'pre'
 * @property {string} POST Multiplication order is 'post'
 */

/**
 * DOMMatrix extension
 *
 * @property {float} tx Translate x, 'e' alias
 * @property {float} ty Translate y, 'f' alias
 * @property {float} dx Translate x, 'e' alias
 * @property {float} dy Translate y, 'f' alias
 * @property {MultiplicationType} [multiplicationType=POST]
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
		multiplicationType: {value: "POST", enumerable: true, writable: true}
	};

	static classProperties = {
		MultiplicationType: {value: {PRE: "PRE", POST: "POST"}, enumerable: true}
	};

	/**
	 * Pre multiplication (fixed coordinate system (fixed frame), moving point)
	 * The original matrix is not altered.
	 *
	 * @param {DOMMatrix} delta
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	preMultiply(delta) {
		let result = delta.postMultiply(this);
		result.multiplicationType = this.multiplicationType;

		return result;
	}

	/**
	 * Post multiplication (moving coordinate system (Euler frame), fixed point)
	 * The original matrix is not altered.
	 *
	 * @param {DOMMatrix} delta
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	postMultiply(delta) {
		return nativeMultiply.call(this, delta);
	}

	/**
	 * Multiplies with matrix by post or pre multiplying (specified by multiplication type).
	 * The original matrix is not altered.
	 *
	 * @param {DOMMatrix} delta
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	multiply(delta) {
		if (!(delta instanceof DOMMatrix)) delta = DOMMatrix.fromMatrix(delta);

		if (this.multiplicationType == DOMMatrix.MultiplicationType.POST)
			return this.postMultiply(delta);
		else {
			let result = this.preMultiply(delta);
			result.multiplicationType = DOMMatrix.MultiplicationType.PRE;

			return result;
		}
	}

	/**
	 * Post multiplication (moving coordinate system (Euler frame), fixed point)
	 *
	 * @param {DOMMatrix} delta
	 * @returns {DOMMatrix} self
	 */
	postMultiplySelf(delta) {
		return nativeMultiplySelf.call(this, delta);
	}

	/**
	 * Modifies the matrix by post or pre multiplying (specified by multiplication type) it with the specified Matrix
	 *
	 * @param {DOMMatrix} delta
	 * @returns {DOMMatrix} self
	 */
	multiplySelf(delta) {
		if (!(delta instanceof DOMMatrix)) delta = DOMMatrix.fromMatrix(delta);

		if (this.multiplicationType == DOMMatrix.MultiplicationType.POST)
			return this.postMultiplySelf(delta);
		else
			return this.preMultiplySelf(delta);
	}

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

	/**
	 * Decompose matrix to translate, rotate, skew and scale
	 *
	 * @returns {MatrixData} Decomposed matrix
	 */
	decompose() {
		return {
			translate: {x: this.tx, y: this.ty},
			rotate: {angle: Math.atan2(this.b, this.a)},
			skew: {angleX: Math.tan(this.c), angleY: Math.tan(this.b)},
			scale: {x: Math.sqrt(this.a * this.a + this.c * this.c), y: Math.sqrt(this.d * this.d + this.b * this.b)},
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
	 * @param {Matrix2D | Matrix3D} data
	 * @param {DOMMatrix.MultiplicationType} [multiplicationType=POST]
	 * @returns {DOMMatrix} Matrix based on data
	 */
	static fromMatrix(data, multiplicationType) {
		let result;

		if (typeof data == "string")
			result = new DOMMatrix(data);
		else {
			if (!("e" in data)) data.e = data.tx || data.dx;
			if (!("f" in data)) data.f = data.ty || data.dy;

			result = nativeFromMatrix(data);
		}

		result.multiplicationType = multiplicationType || data.multiplicationType || DOMMatrix.MultiplicationType.POST;

		return result;
	}

	/**
	 * Creates delta translate matrix
	 *
	 * @param {Translate} offset
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	static fromTranslate(offset) {
		let translate = isFinite(offset) ? {tx: offset, ty: offset} : {tx: offset.x, ty: offset.y};

		return DOMMatrix.fromMatrix(translate);
	}

	/**
	 * Creates delta rotate matrix
	 *
	 * @param {float} alpha Value should be in rad
	 * @param {DOMPoint} [origin={x: 0, y: 0}] Transform origin
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	static fromRotate(alpha, origin) {
		let sin = Math.sin(alpha);
		let cos = Math.cos(alpha);

		let rotate = {a: cos, b: sin, c: -sin, d: cos};

		if (origin) {
			rotate.tx = origin.x - origin.x * cos + origin.y * sin;
			rotate.ty = origin.y - origin.x * sin - origin.y * cos;
		}

		return DOMMatrix.fromMatrix(rotate);
	}

	/**
	 * Creates delta scale matrix
	 *
	 * @param {Scale | float} factor Scale factor
	 * @param {DOMPoint} [origin={x: 0, y: 0}] Transform origin
	 * @returns {DOMMatrix} Transform as new Matrix
	 */
	static fromScale(factor, origin) {
		if (isFinite(factor)) factor = {x: factor, y: factor};

		let scale = {a: factor.x, d: factor.y};

		if (origin) {
			scale.tx = origin.x - origin.x * factor.x;
			scale.ty = origin.y - origin.y * factor.y;
		}

		return DOMMatrix.fromMatrix(scale);
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
		let X = O.invert().preMultiply(F);

		// convert to homogeneous coordinates
		return DOMMatrix.fromMatrix({a: X.m11, b: X.m12, c: X.m21, d: X.m22, tx: X.m31, ty: X.m32});
	}

	static extend() {
		if (typeof DOMMatrix === "undefined" || nativeFromMatrix)
			return false;

		nativeFromMatrix = DOMMatrix.fromMatrix;
		nativeToString = DOMMatrix.prototype.toString;
		nativeMultiply = DOMMatrix.prototype.multiply;
		nativeMultiplySelf = DOMMatrix.prototype.multiplySelf;

		Extension.extend("DOMMatrix", this);
	}
}

export default DOMMatrixExt
