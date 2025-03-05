const CSSStyleSheetOrigin = window.CSSStyleSheet;
const protoProps = Object.getOwnPropertyNames(CSSStyleSheetOrigin.prototype).slice(1);

/**
 * DOMSize add-on
 *
 * @memberof polyfills
 */
class CSSStyleSheet {
	static get polyfill() { return true; }

	#sheet;

	constructor() {
		for (let name of protoProps) {
			let property = Object.getOwnPropertyDescriptor(CSSStyleSheetOrigin.prototype, name);

			if (typeof property.value == "function") {
				if (this.#sheet)
					this[name] = property.value.bind(this.#sheet);
				else
					this[name] = function(...args) { return property.value.apply(this.#sheet, args); };
			}
			else {
				Object.defineProperty(this, name, {
					get: () => this.#sheet[name],
					configurable: property.configurable,
					enumerable: property.enumerable
				});
			}
		}
	}

	/**
	 * Synchronously replaces the content of the stylesheet with the content passed into it
	 *
	 * @param {string} text Style sheet content
	 */
	replaceSync(text) {
		let style = document.createElement("style");
		style.innerHTML = text;

		document.head.appendChild(style);

		this.#sheet = style.sheet;
	}
}

if (!CSSStyleSheetOrigin.prototype.replaceSync)
	window.CSSStyleSheet = CSSStyleSheet;
