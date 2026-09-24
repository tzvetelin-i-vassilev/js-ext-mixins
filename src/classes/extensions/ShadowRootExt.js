import Extension from "../Extension.js"

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
	 * @param {string | CSSStyleSheet} content Style sheet content
	 * @param {boolean} [copy=false] Adopt sheet copy
	 * @returns {CSSStyleSheet} Adopted style sheet
	 */
	adoptStyleSheet(content, copy = false) {
		let sheet;

		if (typeof content == "string" || copy) {
			sheet = new CSSStyleSheet();
			sheet.replaceSync(content);
		}
		else
			sheet = content;

		this.adoptedStyleSheets.push(sheet);

		return sheet;
	}
}

export default ShadowRootExt
