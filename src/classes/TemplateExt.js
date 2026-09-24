import Extension from "../Extension.js"

/**
 * The shape of an extension, to be copied rather than imported.
 *
 * Three ways of adding something, and a member is added only where the class has none of that name -
 * to replace one on purpose, name it in overrides, which is read for methods and never for accessors.
 * Document what is added the way the rest of these are: a method with a block of its own, an
 * accessor with a block on its entry below. An accessor cannot be described with a class level
 * @property here - the class is @hideconstructor, and jsdoc puts that table in the constructor's
 * section, which is exactly what is being hidden. The @name is what carries it instead.
 *
 * @ignore
 */
class TemplateExt extends Extension {
/*
	static overrides = Extension.overrides.concat(["MethodName"]);

	static properties = {
		propName: {get: function() {}, configurable: true}
	};

	static classProperties = {
		propName: {get: function() {}, configurable: true}
	};

*/
	/**
	 * The names this extension replaces on purpose. Methods only.
	 */
	static get overrides() {
		return Extension.overrides.concat(["MethodName"]);
	}

	/**
	 * Accessors to put on the prototype, as property descriptors.
	 */
	static get properties() {
		return {
			/**
			 * What this accessor gives back. Leave @readonly off when there is a setter.
			 *
			 * @name extensions.ClassNameExt#propName
			 * @type {any}
			 * @readonly
			 */
			propName: {
				get: function() {},
				configurable: true
			}
		};
	}

	/**
	 * The same, put on the class itself rather than on its prototype.
	 */
	static get classProperties() {
		return {
			/**
			 * The same on the class itself, which is a dot in the name rather than a hash.
			 *
			 * @name extensions.ClassNameExt.propName
			 * @type {any}
			 * @readonly
			 */
			propName: {
				get: function() {},
				configurable: true
			}
		};
	}

	/**
	 * A method, put on the prototype. Its block is what the generated reference shows.
	 *
	 * @param {any} arg What it takes
	 * @returns {any} What it gives back
	 */
	method(arg) {
		return arg;
	}

	/**
	 * A method put on the class itself.
	 *
	 * @returns {any} What it gives back
	 */
	static method() {}

	/*
	 * Applied at import time, and a plain comment rather than a doc block: nobody calls this, so it
	 * is not part of what the reference shows. Take a native member here, before the call, when an
	 * override has to hand on to the one it replaces.
	 */
	static extend() {
		let success = Extension.extend("ClassName", this);

		if (success) {
			//
		}
	}
}

export default TemplateExt
