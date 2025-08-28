(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jsExt = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * [js-ext-mixins]{@link https://github.com/tzvetelin-i-vassilev/js-ext-mixins}
	 *
	 * @namespace jsExt
	 * @version 1.0.13
	 * @author Tzvetelin Vassilev
	 * @copyright Tzvetelin Vassilev 2020-2025
	 * @license ISC
	 */

	var version = "1.0.13";

	class Extension {
		static overrides = ["toString"];
		static extend(clazz, extension = this) {
			let name;
			if (typeof clazz == "string") {
				name = clazz;
				clazz = globalThis[name];
			}
			else
				name = clazz.name;
			if (!clazz) {
				if (this.debug)
					console.warn(`Class ${name} not found`);
				return false;
			}
			if (this.debug)
				console.log("extend", clazz.name, extension.name);
			Object.getOwnPropertyNames(extension.prototype).filter(name => name != "constructor").forEach(name => {
				if (name in clazz.prototype && !extension.overrides.includes(name)) {
					if (this.debug) console.log(`%cexclude ${name}`, "color: red");
					return;
				}
				if (this.debug) {
					if (extension.overrides.includes(name))
						console.log(`%coverride ${name}`, "color: chartreuse");
					else
						console.log(`%cdefine ${name}`, "color: green");
				}
				Object.defineProperty(clazz.prototype, name, {value: extension.prototype[name], configurable: true});
			});
			Object.getOwnPropertyNames(extension).forEach(name => {
				if (typeof extension[name] != "function" || name == "extend") return;
				if (name in clazz && !extension.overrides.includes(name)) {
					if (this.debug) console.log(`%cexclude static ${name}`, "color: red");
					return;
				}
				if (this.debug) {
					if (extension.overrides.includes(name))
						console.log(`%coverride static ${name}`, "color: chartreuse");
					else
						console.log(`%cdefine static ${name}`, "color: orange");
				}
				clazz[name] = extension[name];
			});
			if (extension.properties) {
				Object.keys(extension.properties).forEach(name => {
					if (name in clazz.prototype) {
						if (this.debug) console.log(`%cexclude prop ${name}`, "color: red");
						return;
					}
					if (extension.properties[name]) {
						if (this.debug) console.log(`%cdefine prop ${name}`, "color: darkseagreen");
						Object.defineProperty(clazz.prototype, name, extension.properties[name]);
					}
				});
			}
			if (extension.classProperties) {
				Object.keys(extension.classProperties).forEach(name => {
					if (name in clazz) {
						if (this.debug) console.log(`%cexclude static prop ${name}`, "color: red");
						return;
					}
					if (extension.classProperties[name]) {
						if (this.debug) console.log(`%cdefine static prop ${name}`, "color: chocolate");
						Object.defineProperty(clazz, name, extension.classProperties[name]);
					}
				});
			}
			return true;
		}
	}

	class EnumValue {
		constructor(name, value, index) {
			Object.defineProperty(this, "type", {value: name, enumerable: true});
			Object.defineProperty(this, "name", {value: value, enumerable: true});
			Object.defineProperty(this, "value", {value: index, enumerable: true});
		}
		toString() {
			return this.name;
		}
	}

	class ObjectExt extends Extension {
		static equals(x, y) {
			if (x === y) return true;
			if (!(x instanceof Object && y instanceof Object)) return false;
			if (x.constructor !== y.constructor) return false;
			if (x instanceof Array || ArrayBuffer.isTypedArray(x)) {
				if (x.length != y.length) return false;
				return x.every((v, i) => Object.equals(v, y[i]));
			}
			for (let p in x) {
				if (!x.hasOwnProperty(p)) continue;
				if (!y.hasOwnProperty(p)) return false;
				if (x[p] === y[p]) continue;
				if (typeof(x[p]) !== "object") return false;
				if (!Object.equals(x[p], y[p])) return false;
			}
			for (let p in y) {
				if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
			}
			return true;
		}
		static clone(oReference, bDataOnly = false) {
			let aReferences = new Array();
			function deepCopy(oSource) {
				if (oSource === null) return null;
				if (typeof(oSource) !== "object" || oSource.immutable) return oSource;
				if (typeof oSource.clone === "function") return oSource.clone();
				for (let i = 0; i < aReferences.length; i++) {
					if (aReferences[i][0] === oSource)
						return aReferences[i][1];
				}
				let oCopy = Object.create(Object.getPrototypeOf(oSource));
				aReferences.push([oSource, oCopy]);
				for (let sPropertyName in oSource) {
					if (bDataOnly && typeof oSource[sPropertyName] === "function")
						continue;
					if (oSource.hasOwnProperty(sPropertyName))
						oCopy[sPropertyName] = deepCopy(oSource[sPropertyName]);
				}
				return oCopy;
			}
			return deepCopy(oReference);
		}
		static defineEnum(target, name, values, configurable = false) {
			let type = {
				name,
				values: values.map((value, index) => new EnumValue(name, value, index))
			};
			type.values.forEach(value => {
				Object.defineProperty(type, value.name, {value: value, enumerable: true});
				Object.defineProperty(type, value.value, {value: value, enumerable: true});
			});
			Object.defineProperty(target, name, {value: type, enumerable: true, configurable});
			return type;
		}
	}

	class StringExt extends Extension {
		padStart(length, char = "-") {
			return (this.length < length) ? (new Array(length - this.length + 1)).join(char) + this : this.toString();
		}
		toCharArray(bytes = false) {
			let list = [];
			let byteList = true;
			for (let i = 0; i < this.length; i++) {
				let code = this.charCodeAt(i);
				if (code > 255) byteList = false;
				list[i] = code;
			}
			if (bytes) {
				if (!byteList) throw new Error("Current value is not byte string");
				list = new Uint8Array(list);
			}
			return list;
		}
		static fromCharArray(data) {
			return data.reduce((binary, byte) => binary + String.fromCharCode(byte), "");
		}
	}

	class NumberExt extends Extension {
		static classProperties = {
			MAX_INT32: {value: 0x7FFFFFFF, enumerable: true},
			MAX_UINT32: {value: 0xFFFFFFFF, enumerable: true},
			MAX_INT64: (typeof BigInt == "undefined") ? undefined : {value: 0x7FFFFFFFFFFFFFFFn, enumerable: true},
			MAX_UINT64: (typeof BigInt == "undefined") ? undefined : {value: 0xFFFFFFFFFFFFFFFFn, enumerable: true}
		}
		format(pattern) {
			if (!Number.isInteger(this) || this < 0)
				throw new Error(`Underlying number ${this} should be positive integer`);
			if (this.toString().length < pattern.length)
				return pattern.substring(0, pattern.length - this.toString().length) + this;
			else
				return this.toString();
		}
		compareTo(value) {
			if (this < value)
				return -1;
			else if (this > value)
				return 1;
			else
				return 0;
		}
	}

	class DateExt extends Extension {
		format(pattern) {
			let result = pattern;
			function resolve(search, value) {
				let rs = RegExp(`${search}+`).exec(result);
				if (rs) {
					let match = rs[0];
					let pattern = match.replace(new RegExp(match.substring(0, 1), "g"), "0");
					if (search == "Y" && match == "YY") value = parseInt(value.toString().substring(2));
					result = result.replace(match, value.format(pattern));
				}
			}
			resolve("Y", this.getFullYear());
			resolve("M", this.getMonth()+1);
			resolve("D", this.getDate());
			resolve("h", this.getHours());
			resolve("m", this.getMinutes());
			resolve("s", this.getSeconds());
			resolve("S", this.getMilliseconds());
			if (result.match(/[a-zA-Z]/))
				throw new Error(`Invalid pattern found in ${pattern}: ${result.match(/[a-zA-Z]+/)[0]}`);
			return result;
		}
		static format(pattern, timestamp = Date.now()) {
			return (new Date(timestamp)).format(pattern);
		}
	}

	class FunctionExt extends Extension {
		static properties = {
			body: {
				get: function() {
					let body = this.toString();
					body = body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"));
					return body;
				},
				configurable: true
			}
		}
		createClass(name, parentClass, options = {}) {
			let args = options.args || {};
			const def = new Function(parentClass.name, ...Object.keys(args), `return class ${name} extends ${parentClass.name} {
			constructor() {
				super(...arguments);
				${options.constructorSrc || ""}
			}
			${options.methods || ""}
		}`);
			return def(parentClass, ...Object.values(args));
		}
	}

	class ArrayExt extends Extension {
		static properties = {
			first: {get: function() {return this[0]}, configurable: true},
			last: {get: function() {return this[this.length-1]}, configurable: true}
		};
		clear() {
			this.length = 0;
		}
		clone() {
			if (!Object.clone) throw new Error("Object extension is required");
			return this.map(item => Object.clone(item));
		}
		unique() {
			return this.filter((item, index) => this.indexOf(item) == index);
		}
		insert(item, index = 0) {
			this.splice(index, 0, item);
		}
		indicesOf(item) {
			let indices = [];
			let index = this.indexOf(item);
			if (index != -1) {
				indices.push(index);
				let lastIndex = this.lastIndexOf(item);
				while (lastIndex > index) {
					index = this.indexOf(item, index + 1);
					indices.push(index);
				}
			}
			return indices;
		}
		remove(...itemN) {
			let group = (indices) => {
				let groups = [];
				let lastIndex = -1;
				indices.forEach(index => {
					if (lastIndex - index != 1)
						groups.push([]);
					groups.last.push(index);
					lastIndex = index;
				});
				return groups;
			};
			let indices = itemN
				.map(element => this.indicesOf(element))
				.flat()
				.sort((a, b) => b - a);
			group(indices)
				.forEach(group => this.removeAt(group.last, group.length));
			return this;
		}
		removeAt(index, count = 1) {
			if (index > -1)
				this.splice(index, count);
			return this;
		}
		replace(item, replaceWith, exact = false) {
			let index = this.indexOf(item);
			if (index > -1) {
				if (!exact && replaceWith instanceof Array)
					this.splice(index, 1, ...replaceWith);
				else
					this.splice(index, 1, replaceWith);
			}
			return this;
		}
		static from(collection) {
			return Array.prototype.slice.call(collection);
		}
	}

	class ArrayBufferExt extends Extension {
		toBase64() {
			if (!String.fromCharArray) throw new Error("String extension is required");
			let bytes = new Uint8Array(this);
			return btoa(String.fromCharArray(bytes));
		}
		static fromBase64(str) {
			if (!String.prototype.toCharArray) throw new Error("String extension is required");
			return atob(str).toCharArray(true).buffer;
		}
		static isTypedArray(o) {
			return ArrayBuffer.isView(o) && !(o instanceof DataView);
		}
	}

	class SharedArrayBufferExt extends Extension {
		static fromArrayBuffer(buffer) {
			if (!(buffer instanceof ArrayBuffer)) throw new Error("ArrayBuffer is expected");
			let bytes = new Uint8Array(buffer);
			let sharedBuffer = new SharedArrayBuffer(buffer.byteLength);
			let sharedBytes = new Uint8Array(sharedBuffer);
			sharedBytes.set(bytes);
			return sharedBuffer;
		}
	}

	const TYPES = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"];
	class TypedArrayExt extends Extension {
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
		toArray() {
			return Array.from(this);
		}
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

	class SetExt extends Extension {
		map(callback) {
			let set = new Set();
			for (let value of this) {
				value = callback(value);
				if (value) set.add(value);
			}
			return set;
		}
		filter(callback) {
			let set = new Set();
			for (let value of this) {
				if (callback(value))
					set.add(value);
			}
			return set;
		}
	}

	let DOMSize$1 = class DOMSize {
		constructor(width, height) {
			this.width = width;
			this.height = height;
		}
		toJSON() {
			return {width: this.width, height: this.height};
		}
		toString() {
			return `size(${this.width}, ${this.height})`;
		}
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
	};

	class ScreenExt extends Extension {
		static properties = {
			size: {get: () => new DOMSize$1(Math.floor(screen.width), Math.floor(screen.height)), configurable: true},
			resolution: {get: () => new DOMSize$1(Math.floor(screen.width * devicePixelRatio), Math.floor(screen.height * devicePixelRatio)), configurable: true}
		}
	}

	class LocationExt extends Extension {
		static get properties() {
			return {
				query: {
					get: function() {
						if (!this._query) {
							let value = Object.assign({}, ...this.search.substring(1)
								.split("&")
								.filter(pair => pair)
								.map(pair => pair.split("="))
								.map(pair => ({[pair[0]]: decodeURIComponent(pair[1])}))
							);
							Object.defineProperty(this, "_query", {value});
						}
						return this._query;
					},
					configurable: true
				}
			};
		}
	}

	class HTMLElementExt extends Extension {
		static properties = {
			computedStyle: {get: function() { return window.getComputedStyle(this); }, configurable: true}
		}
		getClientOffset(relative = false) {
			let offsetParent = this;
			let offsetLeft = 0;
			let offsetTop  = 0;
			let computedStyle = window.getComputedStyle(this);
			if (computedStyle.transform != "none") {
				let matrix = DOMMatrix.fromMatrix(computedStyle.transform);
				let transformOrigin = computedStyle.transformOrigin.split(" ").map(v => parseFloat(v));
				let origin = new DOMPoint(transformOrigin[0], transformOrigin[1]);
				let point = origin.transform(matrix);
				let tx = origin.x - point.x + matrix.tx;
				let ty = origin.y - point.y + matrix.ty;
				offsetLeft += tx;
				offsetTop += ty;
			}
			do {
				offsetLeft += offsetParent.offsetLeft;
				offsetTop  += offsetParent.offsetTop;
				offsetParent = offsetParent.offsetParent;
			}
			while (offsetParent);
			let scrollParent = this;
			let scrollLeft = 0;
			let scrollTop  = 0;
			if (!relative) {
				do {
					let position = scrollParent.computedStyle.position;
					if (position == "fixed") {
						scrollLeft = 0;
						scrollTop  = 0;
						break;
					}
					scrollLeft += scrollParent.scrollLeft;
					scrollTop  += scrollParent.scrollTop;
					scrollParent = scrollParent.parentNode;
					if (scrollParent && scrollParent.host)
						scrollParent = scrollParent.host;
				}
				while (scrollParent != document);
			}
			return new DOMPoint(offsetLeft - scrollLeft, offsetTop - scrollTop);
		}
		getTransformOrigin() {
			let display = this.style.display;
			let visibility = this.style.visibility;
			let computedStyle = window.getComputedStyle(this);
			let [ox, oy] = computedStyle.transformOrigin.split(" ");
			let parse = (value, size) => value.endsWith("%") ? (parseFloat(value) / 100) * size : parseFloat(value);
			if (display == "none") {
				this.style.visibility = "hidden";
				this.style.display = "";
			}
			let transformOrigin = new DOMPoint(parse(ox, this.offsetWidth), parse(oy, this.offsetHeight));
			if (display == "none") {
				this.style.visibility = visibility;
				this.style.display = "none";
			}
			return transformOrigin;
		}
		toRect() {
			let display = this.style.display;
			let visibility = this.style.visibility;
			if (display == "none") {
				this.style.visibility = "hidden";
				this.style.display = "";
			}
			let computedStyle = window.getComputedStyle(this);
			let margin = {
				left: parseFloat(computedStyle.marginLeft),
				top: parseFloat(computedStyle.marginTop),
				right: parseFloat(computedStyle.marginRight),
				bottom: parseFloat(computedStyle.marginBottom)
			};
			let outerWidth = this.offsetWidth + margin.left + margin.right;
			let outerHeight = this.offsetHeight + margin.top + margin.bottom;
			let rect = new DOMRect(this.offsetLeft, this.offsetTop, this.offsetWidth, this.offsetHeight);
			rect.outerSize = new DOMSize(outerWidth, outerHeight);
			if (display == "none") {
				this.style.visibility = visibility;
				this.style.display = "none";
			}
			return rect;
		}
	}

	class HTMLImageElementExt extends Extension {
		toDataURL(type = "png") {
			let canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			canvas.getContext("2d").drawImage(this, 0, 0);
			return canvas.toDataURL(`image/${type}`);
		}
		toBlob(type = "png") {
			return new Blob([this.toArrayBuffer(type)], {type: `image/${type}`});
		}
		toArrayBuffer(type) {
			if (!ArrayBuffer.fromBase64) throw new Error("ArrayBuffer extension is required");
			let dataURL = this.toDataURL(type);
			let base64 = dataURL.split(",")[1];
			return ArrayBuffer.fromBase64(base64);
		}
	}

	class ImageExt extends Extension {
		static async fromBytes(bytes, type = "png", image = new Image()) {
			return new Promise((resolve, reject) => {
				image.onload = () => {
					URL.revokeObjectURL(image.src);
					resolve(image);
				};
				image.onerror = reject;
				image.src = URL.createObjectURL(new Blob([bytes.buffer || bytes], {type : `image/${type}`}));
			});
		}
	}

	class PromiseExt extends Extension {
		static async sleep(time = 16) {
			return new Promise((resolve, reject) => setTimeout(resolve, time));
		}
	}

	class DOMPointExt extends Extension {
		transform(matrix) {
			if (!(matrix instanceof DOMMatrix)) matrix = DOMMatrix.fromMatrix(matrix);
			return this.matrixTransform(matrix);
		}
		toString(point2D = false) {
			return `point(${this.x}, ${this.y}${point2D ? "" : `, ${this.z}`})`;
		}
	}

	class DOMQuadExt extends Extension {
		transform(matrix) {
			if (!(matrix instanceof DOMMatrix)) matrix = DOMMatrix.fromMatrix(matrix);
			return new DOMQuad(this.p1.transform(matrix), this.p2.transform(matrix), this.p3.transform(matrix), this.p4.transform(matrix));
		}
		contains(point) {
			let isLeftXZ = (a, b) => ((b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)) > 0;
			let sideMatch = isLeftXZ(this.p1, this.p2);
			if (isLeftXZ(this.p2, this.p3) != sideMatch) return false;
			if (isLeftXZ(this.p3, this.p4) != sideMatch) return false;
			if (isLeftXZ(this.p4, this.p1) != sideMatch) return false;
			return true;
		}
		toString() {
			return `quad(${this.p1.toString(true)}, ${this.p2.toString(true)}, ${this.p3.toString(true)}, ${this.p4.toString(true)})`;
		}
	}

	class DOMRectExt extends Extension {
		static properties = {
			size: {get: function() {return new DOMSize$1(this.width, this.height)}, configurable: true},
			center: {get: function() {return new DOMPoint((this.left + this.right) / 2, (this.top + this.bottom) / 2)}, configurable: true}
		}
		union(rect) {
			if (!rect) return this;
			return DOMRect.ofEdges(
				Math.min(this.left, rect.left),
				Math.min(this.top, rect.top),
				Math.max(this.right, rect.right),
				Math.max(this.bottom, rect.bottom)
			);
		}
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
		intersects(rect) {
			return (this.left <= rect.right && this.right >= rect.left) && (this.top <= rect.bottom && this.bottom >= rect.top);
		}
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
		contains(point) {
			return this.left <= point.x && this.right >= point.x && this.top <= point.y && this.bottom >= point.y;
		}
		includes(rect) {
			return this.left <= rect.left && this.right >= rect.right && this.top <= rect.top && this.bottom >= rect.bottom;
		}
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
		toString() {
			return `rect(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
		}
		static ofEdges(left, top, right, bottom) {
			return new DOMRect(left, top, right - left, bottom - top);
		}
		static extend() {
			let success = Extension.extend("DOMRect", this);
			if (success)
				globalThis.DOMSize = DOMSize$1;
		}
	}

	let nativeFromMatrix;
	let nativeToString;
	let nativeMultiply;
	let nativeMultiplySelf;
	class DOMMatrixExt extends Extension {
		static overrides = Extension.overrides.concat(["fromMatrix", "multiply", "multiplySelf", "transformPoint"]);
		static properties = {
			tx: {get: function() {return this.e}, set: function(value) {this.e = value;}, enumerable: true},
			ty: {get: function() {return this.f}, set: function(value) {this.f = value;}, enumerable: true},
			dx: {get: function() {return this.e}, set: function(value) {this.e = value;}, enumerable: true},
			dy: {get: function() {return this.f}, set: function(value) {this.f = value;}, enumerable: true},
			multiplicationType: {value: "POST", enumerable: true, writable: true}
		};
		static classProperties = {
			MultiplicationType: {value: {PRE: "PRE", POST: "POST"}, enumerable: true}
		};
		preMultiply(delta) {
			let result = delta.postMultiply(this);
			result.multiplicationType = this.multiplicationType;
			return result;
		}
		postMultiply(delta) {
			return nativeMultiply.call(this, delta);
		}
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
		postMultiplySelf(delta) {
			return nativeMultiplySelf.call(this, delta);
		}
		multiplySelf(delta) {
			if (!(delta instanceof DOMMatrix)) delta = DOMMatrix.fromMatrix(delta);
			if (this.multiplicationType == DOMMatrix.MultiplicationType.POST)
				return this.postMultiplySelf(delta);
			else
				return this.preMultiplySelf(delta);
		}
		transformPoint(point) {
			return DOMPoint.fromPoint(point).matrixTransform(this);
		}
		invert() {
			return this.inverse();
		}
		decompose() {
			return {
				translate: {x: this.tx, y: this.ty},
				rotate: {angle: Math.atan2(this.b, this.a)},
				skew: {angleX: Math.tan(this.c), angleY: Math.tan(this.b)},
				scale: {x: Math.sqrt(this.a * this.a + this.c * this.c), y: Math.sqrt(this.d * this.d + this.b * this.b)},
				matrix: this
			};
		}
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
		static fromTranslate(offset) {
			let translate = isFinite(offset) ? {tx: offset, ty: offset} : {tx: offset.x, ty: offset.y};
			return DOMMatrix.fromMatrix(translate);
		}
		static fromRotate(alpha, anchor) {
			let sin = Math.sin(alpha);
			let cos = Math.cos(alpha);
			let rotate = {a: cos, b: sin, c: -sin, d: cos};
			if (anchor) {
				rotate.tx = anchor.x - (anchor.x * cos - anchor.y * sin);
				rotate.ty = anchor.y - (anchor.x * sin + anchor.y * cos);
			}
			return DOMMatrix.fromMatrix(rotate);
		}
		static fromScale(factor, anchor) {
			if (isFinite(factor)) factor = {x: factor, y: factor};
			let scale = {a: factor.x, d: factor.y};
			if (anchor) {
				scale.tx = anchor.x - anchor.x * factor.x;
				scale.ty = anchor.y - anchor.y * factor.y;
			}
			return DOMMatrix.fromMatrix(scale);
		}
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
			let X = O.invert().preMultiply(F);
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

	class CSSStyleSheetExt extends Extension {
		findRule(selectorText) {
			let result;
			let rules = this.cssRules;
			for (let rule of rules) {
				if (rule.selectorText == selectorText) {
					result = rule;
					break;
				}
			}
			return result;
		}
		findRules(selectorText) {
			return Array.from(this.cssRules).filter(rule => (rule.selectorText == selectorText));
		}
		toTextList() {
			return Array.from(this.cssRules).map(rule => rule.cssText);
		}
		toString() {
			return Array.from(this.cssRules).map(rule => rule.cssText).join("\n");
		}
	}

	class ShadowRootExt extends Extension {
		adoptStyleSheet(text) {
			let sheet;
			if (this.adoptedStyleSheets) {
				sheet = new CSSStyleSheet();
				sheet.replaceSync(text);
				this.adoptedStyleSheets.push(sheet);
			}
			else {
				let style = document.createElement("style");
				style.innerHTML = text;
				this.appendChild(style);
				sheet = style.sheet;
			}
			return sheet;
		}
	}

	var extensions = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ArrayBufferExt: ArrayBufferExt,
		ArrayExt: ArrayExt,
		CSSStyleSheetExt: CSSStyleSheetExt,
		DOMMatrixExt: DOMMatrixExt,
		DOMPointExt: DOMPointExt,
		DOMQuadExt: DOMQuadExt,
		DOMRectExt: DOMRectExt,
		DateExt: DateExt,
		FunctionExt: FunctionExt,
		HTMLElementExt: HTMLElementExt,
		HTMLImageElementExt: HTMLImageElementExt,
		ImageExt: ImageExt,
		LocationExt: LocationExt,
		NumberExt: NumberExt,
		ObjectExt: ObjectExt,
		PromiseExt: PromiseExt,
		ScreenExt: ScreenExt,
		SetExt: SetExt,
		ShadowRootExt: ShadowRootExt,
		SharedArrayBufferExt: SharedArrayBufferExt,
		StringExt: StringExt,
		TypedArrayExt: TypedArrayExt
	});

	if (typeof globalThis == "undefined") {
		if (typeof window !== "undefined") window.globalThis = window;
		else if (typeof self !== "undefined") self.globalThis = self;
		else if (typeof global !== "undefined") global.globalThis = global;
	}
	if (!globalThis.parseBool) {
		globalThis.parseBool = function parseBool(value) {
			let result;
			if (typeof value == "string" && value != "" && isFinite(value))
				value = parseFloat(value);
			switch (typeof value) {
				case "boolean":
					result = value;
					break;
				case "string":
					if (value == "true")
						result = true;
					else if (value == "false")
						result = false;
					else
						result = value != "";
					break;
				case "number":
					result = value != 0;
					break;
				case "undefined":
					result = false;
					break;
				case "object":
					result = value != null;
					break;
				default:
					throw new Error(`value '${value}' of type ${typeof value} is not processed`);
			}
			return result;
		};
	}
	if (!globalThis["JS_EXT_SCOPE"]) {
		const scope = Object.keys(extensions).map(name => name.substring(0, name.length - 3));
		Object.defineProperty(globalThis, "JS_EXT_SCOPE", {value: scope, enumerable: true, configurable: true});
	}
	const extend = new Function("Extension", "name", "Extension.extend(name)");
	for (let name of globalThis["JS_EXT_SCOPE"]) {
		let Extension = extensions[`${name}Ext`];
		if (!Extension)
			throw new Error(`Extension ${name} not found`)
		extend(Extension, name);
	}

	exports.Extension = Extension;
	exports.version = version;

}));
