/*global document */
(() => {
    const source = document.getElementsByClassName('prettyprint source linenums');
    let i = 0;
    let lineNumber = 0;
    let lineId;
    let lines;
    let totalLines;
    let anchorHash;

    if (source && source[0]) {
        anchorHash = document.location.hash.substring(1);
        lines = source[0].getElementsByTagName('li');
        totalLines = lines.length;

        for (; i < totalLines; i++) {
            lineNumber++;
            lineId = `line${lineNumber}`;
            lines[i].id = lineId;
            if (lineId === anchorHash) {
                lines[i].className += ' selected';
            }
        }
    }
})();

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
