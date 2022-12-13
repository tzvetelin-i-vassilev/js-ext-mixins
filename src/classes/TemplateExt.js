import Extension from "../Extension.js"

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
	static get overrides() {
		return Extension.overrides.concat(["MethodName"]);
	}

	static get properties() {
		return {
			propName: {
				get: function() {},
				configurable: true
			}
		};
	}

	static get classProperties() {
		return {
			propName: {
				get: function() {},
				configurable: true
			}
		};
	}

	method() {}

	static method() {}

	static extend() {
		let success = Extension.extend("ClassName", this);

		if (success) {
			//
		}
	}
}

export default TemplateExt
