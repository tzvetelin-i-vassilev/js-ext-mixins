if (typeof Worker === "function") {
	Worker.prototype.on = function on(name, listener) {
		this[`on${name}`] = e => {
			let message = (name == "message") ? e.data : e;
			listener(message)
		};
	}
}

if (typeof DedicatedWorkerGlobalScope === "function") {
	DedicatedWorkerGlobalScope.prototype.on = function on(name, listener) {
		this[`on${name}`] = e => {
			let message = (name == "message") ? e.data : e;
			listener(message)
		};
	}
}
