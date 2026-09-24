const CSSStyleSheetOrigin = window.CSSStyleSheet;
const protoProps = Object.getOwnPropertyNames(CSSStyleSheetOrigin.prototype).slice(1);

/**
 * Constructable stylesheets, for the runtimes without them. The stand-in holds no sheet of its own
 * until replaceSync is called: a style element goes into the head, and the sheet the browser makes
 * for it is what every other member is forwarded to.
 *
 * It takes the place of window.CSSStyleSheet only where replaceSync is missing, so a runtime that
 * has its own keeps it - and the static 'polyfill' is how a page tells which of the two it got.
 *
 * @memberof polyfills
 */
class CSSStyleSheet {
	/**
	 * True, and defined only here - the platform's own CSSStyleSheet has no such member, so this
	 * is how a page tells which of the two it is holding.
	 *
	 * @type {boolean}
	 */
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
