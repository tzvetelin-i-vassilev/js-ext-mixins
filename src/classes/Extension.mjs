class Extension {
	static overrides = ["toString"];

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

		return true;
	}
}

export default Extension
