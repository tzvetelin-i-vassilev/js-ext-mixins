import Extension from "../Extension.js"

let native;

/**
 * Document extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class DocumentExt extends Extension {
	static overrides = Extension.overrides.concat(["createElement"]);

	/**
	 * Creates an element, and remembers what it was asked to be.
	 *
	 * Creating a customized built-in leaves no trace of it: the specification keeps the 'is' value
	 * inside the element, does not write it as an attribute, and gives no property to read it back.
	 * So an element created in code cannot be told from a plain one - not by a selector, not by
	 * serialising it, not by looking. Both are put here, which is also what the parser gives when the
	 * same element is written as &lt;button is="my-button"&gt;.
	 *
	 * @param {string} name Tag name
	 * @param {object} [options] As the platform takes them, 'is' included
	 * @returns {HTMLElement} The element
	 */
	createElement(name, options) {
		const element = native.call(this, name, options);

		if (options && options.is) {
			element.is = options.is;
			element.setAttribute("is", options.is);
		}

		return element;
	}

	/*
	 * The native one is taken before it is replaced, which is what an override that has to call the
	 * one it replaced has to do.
	 *
	 * It goes on Document.prototype rather than on the document of this page, so every document of
	 * this realm answers the same - the ones document.implementation makes among them, which the
	 * wrapper it grew out of left behind by sitting on the page's own document.
	 *
	 * A document from another realm is not one of them and cannot be: an iframe has a Document class
	 * of its own, and its prototype is not this one. Measured, not assumed.
	 */
	static extend() {
		if (typeof Document == "undefined" || native) return false;

		native = Document.prototype.createElement;

		return Extension.extend("Document", this);
	}
}

export default DocumentExt
