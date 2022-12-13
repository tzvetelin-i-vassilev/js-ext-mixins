Object.defineProperty(document, "cookies", {
	get: () => {
		let cookies = {};

		if (document.cookie) {
			document.cookie.split(/;\s/).forEach(cookie => {
				let name = cookie.substring(0, cookie.indexOf("="));
				let value = cookie.substring(cookie.indexOf("=") + 1);

				cookies[name] = decodeURIComponent(value);
			});
		}

		return cookies;
	}, configurable: true
});

function setCookie(name, value, expires) {
	let d = new Date(expires);
	document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function clearCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
