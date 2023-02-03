import Extension from "../Extension.mjs"

/**
 * ShadowRoot extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class ShadowRootExt extends Extension {
	/**
	 * Adopts CSS style sheet with underlying document fragment
	 *
	 * @param {string} text Style sheet content
	 * @returns {CSSStyleSheet} Adopted style sheet
	 */
	adoptStyleSheet(text) {
		let sheet;

		if (this.adoptedStyleSheets) {
			sheet = new CSSStyleSheet();
			sheet.replaceSync(text);

			this.adoptedStyleSheets.push(sheet);
		}
		else {
			let style = document.createElement("style");
			style.innerHTML = text;

			this.appendChild(style);

			sheet = style.sheet;
		}

		return sheet;
	}
}

export default ShadowRootExt
