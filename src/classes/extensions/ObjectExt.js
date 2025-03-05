import Extension from "../Extension.js"

import EnumValue from "../add-ons/EnumValue.js"

/**
 * Object extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class ObjectExt extends Extension {
	/**
	 * Compares 2 objects for equality. Each comparsion is by value. Arrays are tested recursively.
	 *
	 * @param {any} x
	 * @param {any} y
	 * @returns {boolean} Are objects equal
	 */
	static equals(x, y) {
		// if both x and y are null or undefined and exactly the same
		if (x === y) return true;

		// if they are not strictly equal, they both need to be Objects
		if (!(x instanceof Object && y instanceof Object)) return false;

		// they must have the exact same prototype chain, the closest we can do is test there constructor.
		if (x.constructor !== y.constructor) return false;

		// array comparison
		if (x instanceof Array || ArrayBuffer.isTypedArray(x)) {
			if (x.length != y.length) return false;

			return x.every((v, i) => Object.equals(v, y[i]));
		}

		for (let p in x) {
			// other properties were tested using x.constructor === y.constructor
			if (!x.hasOwnProperty(p)) continue;

			// allows to compare x[p] and y[p] when set to undefined
			if (!y.hasOwnProperty(p)) return false;

			// if they have the same strict value or identity then they are equal
			if (x[p] === y[p]) continue;

			// Numbers, Strings, Functions, Booleans must be strictly equal
			if (typeof(x[p]) !== "object") return false;

			// Objects and Arrays must be tested recursively
			if (!Object.equals(x[p], y[p])) return false;
		}

		for (let p in y) {
			// allows x[p] to be set to undefined
			if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
		}

		return true;
	}

	/**
	 * Deep copy of the input
	 *
	 * @param {any} oReferance Clone source
	 * @param {boolean} [bDataOnly=false] When is true functions are ignored
	 * @returns {any} Input copy
	 */
	static clone(oReferance, bDataOnly = false) {
		let aReferances = new Array();

		function deepCopy(oSource) {
			if (oSource === null) return null;
			if (typeof(oSource) !== "object" || oSource.immutable) return oSource;
			if (typeof oSource.clone === "function") return oSource.clone();

			for (let i = 0; i < aReferances.length; i++) {
				if (aReferances[i][0] === oSource)
					return aReferances[i][1];
			}

			let oCopy = Object.create(Object.getPrototypeOf(oSource));
			aReferances.push([oSource, oCopy]);

			for (let sPropertyName in oSource) {
				if (bDataOnly && typeof oSource[sPropertyName] === "function")
					continue;

				if (oSource.hasOwnProperty(sPropertyName))
					oCopy[sPropertyName] = deepCopy(oSource[sPropertyName]);
			}

			return oCopy;
		}

		return deepCopy(oReferance);
	}

	/**
	 * Defines enum object in the given context
	 *
	 * @example Object.defineEnum(MyClass, "MyEnum", ["VALUE_A", "VALUE_B", "VALUE_C", ...])
	 *
	 * @param {object} target Enum context
	 * @param {string} name Enum name
	 * @param {Array<string>} values Enum values
	 * @param {boolean} [configurable=false]
	 * @returns {Enum} Created Enum
	 */
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

	/*
	static nameAnonymousFunctions(o, constructorName) {
		for (let name in o) {
			if (typeof o[name] == "function" && !o[name].name) {
				if (name == "constructor" && constructorName)
					Object.defineProperty(o[name], "name", {value: constructorName});
				else
					Object.defineProperty(o[name], "name", {value: name});
			}
		}
	}
	*/
}

export default ObjectExt
