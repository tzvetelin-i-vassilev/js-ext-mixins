import Extension from "../Extension.js"

/**
 * Set extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class SetExt extends Extension {
	/**
	 * Creates a new set populated with the results of calling a provided function on every element in the calling set.
	 *
	 * @param {Function} callback Called for every element of set. Each time callback executes, the returned value is added to new set.
	 * @returns {Set} A new set with each element being the result of the callback function.
	 */
	map(callback) {
		let set = new Set();

		for (let value of this) {
			value = callback(value);
			if (value) set.add(value);
		}

		return set;
	}

	/**
	 * Creates a new, filtered down to just the elements from the given set that pass the test implemented by the provided function
	 *
	 * @param {Function} callback Predicate, to test each element of the set. Return a value that coerces to true to keep the element, or to false otherwise.
	 * @returns {Set} A new set filtered down to just the elements from the given set that pass the test implemented by the provided function. If no elements pass the test, an empty set will be returned.
	 */
	filter(callback) {
		let set = new Set();

		for (let value of this) {
			if (callback(value))
				set.add(value);
		}

		return set;
	}
}

export default SetExt
