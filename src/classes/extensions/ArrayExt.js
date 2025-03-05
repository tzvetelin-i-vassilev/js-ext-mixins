import Extension from "../Extension.js"

/**
 * Array extension
 *
 * @property {any} first Refference to the first element
 * @property {any} last Refference to the last element
 *
 * @hideconstructor
 * @memberof extensions
 */
class ArrayExt extends Extension {
	static properties = {
		first: {get: function() {return this[0]}, configurable: true},
		last: {get: function() {return this[this.length-1]}, configurable: true}
	};

	/**
	 * Removes all elements
	 */
	clear() {
		this.length = 0;
	}

	/**
	 * Deep clone of instance and it's elements
	 *
	 * @returns {Array} Cloned array
	 */
	clone() {
		if (!Object.clone) throw new Error("Object extension is required");
		return this.map(item => Object.clone(item));
	}

	/**
	 * Filter unique elements (by refference)
	 *
	 * @returns {Array} Filtered array with non repeated values
	 */
	unique() {
		return this.filter((item, index) => this.indexOf(item) == index);
	}

	/**
	 * Push element on particular index
	 *
	 * @param {any} item Array element
	 * @param {int} [index=0] Array element index
	 */
	insert(item, index = 0) {
		this.splice(index, 0, item);
	}

	/**
	 * Finds all item occurrences in the underlying array
	 *
	 * @param {any} item Array element
	 * @returns {Array<int>} Indices of the given element
	 */
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

	/**
	 * Removes all occurrences of the ginven elements
	 *
	 * @param {...any} itemN The elements to remove from the array
	 * @returns {Array} Updated instance, e.g. this
	 */
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
			// .forEach(index => this.removeAt(index));

		group(indices)
			.forEach(group => this.removeAt(group.last, group.length))

		return this;
	}

	/**
	 * Removes element at index
	 *
	 * @param {int} index Index of element to remove
	 * @param {int} [count=1] One or more elements on this index
	 * @returns {Array} Updated instance, e.g. this
	 */
	removeAt(index, count = 1) {
		if (index > -1)
			this.splice(index, count);

		return this;
	}

	/**
	 * Replace item (first match) with one or more values
	 *
	 * @param {any} item Array element
	 * @param {any | Array<any>} replaceWith One or more values to replace
	 * @param {boolean} [exact=false] Controlls how to process replaceWith option when it is Array.
	 *   If exact is true value is replaced as is, when is false - values are spreaded.
	 * @returns {Array} Updated instance, e.g. this
	 */
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

	/**
	 * Converts single value collection to Array
	 *
	 * @param {ArrayLike} collection Iterable collection
	 * @returns {Array} Converted collection
	 */
	static from(collection) {
		return Array.prototype.slice.call(collection);
	}
}

export default ArrayExt
