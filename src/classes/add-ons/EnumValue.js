/**
 * Enum object
 *
 * @readonly
 * @typedef Enum
 * @property {add-ons.EnumValue} UserDefinedNameA
 * @property {add-ons.EnumValue} UserDefinedNameB
 * @property {add-ons.EnumValue} UserDefinedNameC
 * @property {add-ons.EnumValue} ...
 * @property {Array<add-ons.EnumValue>} values
 */

/**
 * EnumValue add-on
 *
 * @property {string} name
 * @property {string} value
 * @property {int} index
 *
 * @memberof add-ons
 */
class EnumValue {
	/**
	 * @param {string} name
	 * @param {string} value
	 * @param {int} index
	 */
	constructor(name, value, index) {
		Object.defineProperty(this, "type", {value: name, enumerable: true});
		Object.defineProperty(this, "name", {value: value, enumerable: true});
		Object.defineProperty(this, "value", {value: index, enumerable: true});
	}

	/**
	 * The entry's name, so an enum value printed or joined reads as what it is called rather
	 * than as [object Object].
	 *
	 * @returns {string} The name
	 */
	toString() {
		return this.name;
	}
}

export default EnumValue
