import Extension from "../Extension.mjs"

/**
 * Function extension
 *
 * @hideconstructor
 * @memberof extensions
 */
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

	/**
	 * Create class with name as argument
	 *
	 * @param {string} name Class name
	 * @param {Class} [parentClass] When is available, class definition extends this class
	 * @returns {Class} Class definition
	 */
	static createClass(name, parentClass) {
		const def = new Function(parentClass ? parentClass.name : undefined, `return class ${name}${parentClass ? ` extends ${parentClass.name}` : ""} {
			constructor() {
				${parentClass ? "super(...arguments);" : ""}
			}
		}`);

		return def(parentClass);
	}
}

export default FunctionExt
