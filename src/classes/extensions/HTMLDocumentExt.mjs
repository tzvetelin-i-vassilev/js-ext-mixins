import Extension from "../Extension.mjs"

/**
 * HTMLDocument extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class HTMLDocumentExt extends Extension {
	/**
	 * Adopts CSS style sheet with underlying document
	 *
	 * @param {string} text Style sheet content
	 * @param {string} [name] Style sheet name
	 * @returns {CSSStyleSheet} Adopted style sheet
	 */
	async adoptStyleSheet(src, name) {
		let sheet;

		if (this.adoptedStyleSheets) {
			let Module = await import(src, {assert: {type: "css"}});
			sheet = Module.default;

			sheet.remove = function() {
				document.adoptedStyleSheets.remove(this);
			}

			this.adoptedStyleSheets.push(sheet);
		}
		else {
			let respone = await fetch(src);
			let text = await respone.text();

			let style = document.createElement("style");
			style.innerHTML = text;

			if (name) style.setAttribute("name", name);

			this.head.appendChild(style);

			sheet = style.sheet;

			sheet.remove = function() {
				style.remove();
			}
		}

		if (name) sheet.name = name;

		return sheet;
	}
}

export default HTMLDocumentExt
