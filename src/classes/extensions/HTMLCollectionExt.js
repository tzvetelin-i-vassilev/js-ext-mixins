import Extension from "../Extension.js"

/**
 * HTMLCollection extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class HTMLCollectionExt extends Extension {
	/**
	 * Parses html and hands back its top level elements, without the wrapper a container would add
	 * and without running anything - the markup goes through a template, where scripts stay inert.
	 *
	 * The collection is live over the parsed fragment, as every HTMLCollection is: moving the
	 * elements out of it empties it as you go, so take a copy first when the loop moves them.
	 *
	 * @param {string} html Markup to parse
	 * @returns {HTMLCollection} The top level elements of it
	 *
	 * @example
	 * for (let element of [...HTMLCollection.fromHTML("<li>one</li><li>two</li>")])
	 *     list.appendChild(element);
	 */
	static fromHTML(html) {
		let template = document.createElement("template");
		template.innerHTML = html;

		return template.content.children;
	}
}

export default HTMLCollectionExt
