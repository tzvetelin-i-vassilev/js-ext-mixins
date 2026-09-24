/**
 * The base every extension derives from, and the thing that applies one.
 *
 * An extension is a class that holds the members to be put on a built-in one. What it declares is
 * read in four ways, and each of them is only ever a way of adding something that is not there:
 *
 *   * methods on its prototype become methods on the class's prototype
 *   * static methods become static methods - its own 'extend' is never one of them
 *   * 'properties', a map of name to property descriptor, becomes accessors on the prototype
 *   * 'classProperties', the same, on the class itself
 *
 * A descriptor that is falsy is passed over, which is how a member can be left out where the runtime
 * cannot have it - Number.MAX_INT64 is written that way, absent where there is no BigInt.
 *
 * @example
 * class SetExt extends Extension {
 *     map(callback) { ... }
 * }
 *
 * Extension.extend("Set", SetExt);
 *
 * @hideconstructor
 */
class Extension {
	/**
	 * The members this extension replaces on purpose, by name.
	 *
	 * Everything else steps aside for what is already there, which is what makes an extension safe to
	 * keep once a runtime grows its own. A name here says the opposite: put mine over it. 'toString'
	 * is in the list from the start because every class already has one, and without it no extension
	 * could give a class a readable one.
	 *
	 * A subclass that needs its own adds to these rather than replacing them -
	 * Extension.overrides.concat(["fromMatrix"]) - or it loses the toString rule with them.
	 *
	 * Only methods are read from it. An accessor in 'properties' or 'classProperties' is never put
	 * over one that exists, whatever this list says.
	 *
	 * @type {Array<string>}
	 */
	static overrides = ["toString"];

	/**
	 * Prints what was defined, overridden and passed over, class by class, as it happens.
	 *
	 * It is read while the extensions are applied, which is the import itself, so it is of use from
	 * the sources - the line is in src/index.js, commented - rather than from a page that has already
	 * imported the built library.
	 *
	 * @type {boolean}
	 */
	static debug = false;

	/**
	 * The classes that were really extended, in the order it happened.
	 *
	 * JS_EXT_SCOPE is the other half of the picture and the two are not the same: that one is the
	 * list of what to try, written before anything is tried, and a name stays in it whether the
	 * runtime had such a class or not. This one is written as each extension lands, so a name absent
	 * here was asked for and skipped - which in a page is a class the browser does not have yet, and
	 * in Node is most of the DOM.
	 *
	 * These are the classes themselves, so one name asked for can land as several: 'TypedArray' is
	 * not a class anything has, and what it leaves here is Int8Array, Uint8Array and the nine others.
	 *
	 * @type {Array<string>}
	 */
	static applied = [];

	/**
	 * Puts an extension on a class, adding only what the class does not already have.
	 *
	 * A class that is not there is not an error: the runtime simply has no such thing - no DOMMatrix
	 * in a worker, no ShadowRoot in Node - and false is the answer, so the rest of the extensions go
	 * on being applied.
	 *
	 * An extension that has to do more than this has a static 'extend' of its own and calls this one
	 * from inside it, which is how a member that replaces another reaches the one it replaced, and how
	 * one extension lands on several classes.
	 *
	 * @param {Function | string} clazz The class, or the name to find it under in the global scope
	 * @param {Function} [extension=this] The extension to apply
	 * @returns {boolean} True when the class was there and was extended
	 */
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
				console.warn(`Class ${name} not found`)

			return false;
		}

		if (this.debug)
			console.log("extend", clazz.name, extension.name)

		Object.getOwnPropertyNames(extension.prototype).filter(name => name != "constructor").forEach(name => {
			if (name in clazz.prototype && !extension.overrides.includes(name)) {
				if (this.debug) console.log(`%cexclude ${name}`, "color: red");
				return;
			}

			if (this.debug) {
				if (extension.overrides.includes(name))
					console.log(`%coverride ${name}`, "color: chartreuse")
				else
					console.log(`%cdefine ${name}`, "color: green")
			}

			// clazz.prototype[name] = extension.prototype[name];
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
					console.log(`%coverride static ${name}`, "color: chartreuse")
				else
					console.log(`%cdefine static ${name}`, "color: orange")
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
					if (this.debug) console.log(`%cdefine prop ${name}`, "color: darkseagreen")
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
					if (this.debug) console.log(`%cdefine static prop ${name}`, "color: chocolate")
					Object.defineProperty(clazz, name, extension.classProperties[name]);
				}
			});
		}

		// on Extension itself rather than on 'this', so that a subclass extending in its own way adds here
		if (!Extension.applied.includes(name))
			Extension.applied.push(name);

		return true;
	}
}

export default Extension
