import version from "./version.mjs"

// https://javascript.info/mixins
import * as extensions from "./classes/extensions/index.mjs"
import Extension from "./classes/Extension.mjs"

if (typeof globalThis == "undefined") {
	if (typeof window !== "undefined") window.globalThis = window;
	else if (typeof self !== "undefined") self.globalThis = self;
	else if (typeof global !== "undefined") global.globalThis = global;
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
