import Extension from "../Extension.js"

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
	 * @param {Class} parentClass Class definition extends this class
	 * @param {JSON} [options={}] Class semantic
	 * @example <caption>Options sample</caption>
	 * {
	 *   constructorSrc: `
	 *     this.#init();
	 *   `,
	 *   methods: `
	 *     #init() {
	 *       let options = helper.getConfiguration();
	 *       // set custom configuration
	 *     }
	 *   `,
	 *   args: {helper: MyHelper}
	 * }
	 * @returns {Class} Class definition
	 */
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

export default FunctionExt
