import Extension from "../Extension.mjs"

import SharedArrayBufferExt from "./SharedArrayBufferExt.mjs"

const TYPES = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"];

/**
 * TypedArrays extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class TypedArrayExt extends Extension {
	/**
	 * Copy underlying buffer
	 *
	 * @returns {TypedArray} Data copy
	 */
	clone() {
		if (typeof SharedArrayBuffer != "undefined" && this.buffer instanceof SharedArrayBuffer) {
			let buffer = new SharedArrayBuffer(this.byteLength);
			let instance = new this.constructor(buffer);
			instance.set(this, this.byteOffset);

			return instance;
		}
		else
			return new this.constructor(this, this.byteOffset, this.length);
	}

	/**
	 * Concat two or more typed arrays from the same type
	 *
	 * @param {...TypedArray} others Data used in concat procedure
	 * @returns {TypedArray} Typed array with all values
	 */
	concat(...others) {
		let length = this.length;
		let offset = this.length;

		others.forEach(other => {
			if (this.constructor != other.constructor) throw new Error(`Concat array from wrong type detected - expected ${this.constructor.name}, found ${other.constructor.name}`);
			length += other.length;
		});

		let result;

		if (typeof SharedArrayBuffer != "undefined" && this.buffer instanceof SharedArrayBuffer)
			result = this.constructor.createSharedInstance(length);
		else
			result = new this.constructor(length);

		result.set(this);

		others.forEach(other => {
			result.set(other, offset);
			offset += other.length;
		});

		return result;
	}

	/**
	 * Converts underlying TypedArray to Array
	 *
	 * @returns {Array<number>} Data copy
	 */
	toArray() {
		return Array.from(this);
	}

	/**
	 * Create instance based on SharedArrayBuffer when is supported. Fallbacks to ArrayBuffer based instance.
	 *
	 * @param {int | Array<number> | TypedArray} [data=0] TypedArray data. When input is TypedArray, expected type should be the same as underlying type.
	 * @return {TypedArray} Instance from underlyimg type
	 */
	static createSharedInstance(data = 0) {
		if (data instanceof this) {
			if (typeof SharedArrayBuffer == "undefined" || data.buffer instanceof SharedArrayBuffer)
				return data;
			else
				return new this(SharedArrayBufferExt.fromArrayBuffer(data.buffer));
		}

		if (typeof data != "number" && !Array.isArray(data))
			throw new Error("Expected data type is Array");

		let length = (typeof data == "number") ? data : data.length;

		if (typeof SharedArrayBuffer == "undefined")
			return (typeof data == "number") ? new this(length) : new this(data);
		else {
			let buffer = new SharedArrayBuffer(length * this.BYTES_PER_ELEMENT);

			if (typeof data == "number")
				return new this(buffer);
			else {
				let instance = new this(buffer);
				instance.set(data);

				return instance;
			}
		}
	}

	/**
	 * Converts java-script Array to TypedArray
	 *
	 * @param {Array<number>} Source data
	 * @returns {TypedArray} Data copy
	 */
	static from(array) {
		return new this(array);
	}

	static extend() {
		TYPES.forEach(type => {
			let success = Extension.extend(type + "Array", this);

			if (success) {
				let TypedArray = globalThis[type + "Array"];

				Object.defineProperty(Array.prototype, "to" + type + "Array", {value: function() {
					return TypedArray.from(this);
				}, configurable: true});
			}
		});
	}
}

export default TypedArrayExt
