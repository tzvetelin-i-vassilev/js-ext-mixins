import version from "./version.js"

// https://javascript.info/mixins
import * as extensions from "./classes/extensions/index.js"
import Extension from "./classes/Extension.js"

if (typeof globalThis == "undefined") {
	if (typeof window !== "undefined") window.globalThis = window;
	else if (typeof self !== "undefined") self.globalThis = self;
	else if (typeof global !== "undefined") global.globalThis = global;
}

if (!globalThis.parseBool) {
	/**
	 * The parseBool() function parses any and returns a boolean value.
	 *   * string is true when value is "true" or not empty, is false when is "false" or empty
	 *   * number is true when value is not 0
	 *   * object is true when value is not null
	 *   * undefined is always false
	 *
	 * @global
	 * @param {any} value Value to parse
	 * @returns {boolean} Parsed value
	 */
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
	}
}

if (!globalThis["JS_EXT_SCOPE"]) {
	// substring Ext suffix
	const scope = Object.keys(extensions).map(name => name.substring(0, name.length - 3));

	Object.defineProperty(globalThis, "JS_EXT_SCOPE", {value: scope, enumerable: true, configurable: true});
}

// Extension.debug = true;

const extend = new Function("Extension", "name", "Extension.extend(name)");

for (let name of globalThis["JS_EXT_SCOPE"]) {
	let Extension = extensions[`${name}Ext`];

	if (!Extension)
		throw new Error(`Extension ${name} not found`)
/*
	try {
		Extension.extend(name);
	}
	catch(e) {
		// roll-up workaround
		console.error(e);
	}
*/
	extend(Extension, name);
}

// if (typeof AsyncFunction == "undefined")
// 	Object.defineProperty(globalThis, "AsyncFunction", {value: Object.getPrototypeOf(async function() {}).constructor});

export {
	version,
	Extension
}
