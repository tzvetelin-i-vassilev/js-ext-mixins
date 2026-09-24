import Extension from "../Extension.js"

/**
 * CSSStyleSheet extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class CSSStyleSheetExt extends Extension {
	/**
	 * Allocates rule in sheet - first match
	 *
	 * @param {string} selectorText Rule selector
	 * @returns {CSSRule} Rule if found
	 */
	findRule(selectorText) {
		let result;
		let rules = this.cssRules;

		for (let rule of rules) {
			if (rule.selectorText == selectorText) {
				result = rule;
				break;
			}
		}

		return result;
	}

	/**
	 * Allocates rule in sheet - all matches
	 *
	 * @param {string} selectorText Rule selector
	 * @returns {Array<CSSRule>} Found rules
	 */
	findRules(selectorText) {
		return Array.from(this.cssRules).filter(rule => (rule.selectorText == selectorText));
	}

	/**
	 * Converts style sheet to collection of css definitions
	 *
	 * @returns {Array<string>} Found rules
	 */
	toTextList() {
		return Array.from(this.cssRules).map(rule => rule.cssText);
	}

	/**
	 * Converts sheet to string
	 *
	 * @returns {string} Style sheet
	 */
	toString() {
		return Array.from(this.cssRules).map(rule => rule.cssText).join("\n");
	}
}

export default CSSStyleSheetExt
