
(() => {
	let sections = ["Namespaces", "Classes"]

	for (let section of sections) {
		Array.from(
			Array.from(document.querySelector("nav").querySelectorAll("h3"))
				.filter(n => n.innerText == section)[0]
				.nextElementSibling
				.querySelectorAll("a")
		)
		.filter(a => (location.host ? a.href.split(location.host)[1] : a.href).replace(".html", "").includes("."))
		.map(a => a.parentNode)
		.forEach(li => li.parentNode.removeChild(li));
	}
})();
