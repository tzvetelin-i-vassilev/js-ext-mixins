import Extension from "../Extension.js"

import DOMSize from "../add-ons/DOMSize.js"

/**
 * Screen extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class ScreenExt extends Extension {
	static properties = {
		/**
		 * Screen size
		 *
		 * @name extensions.ScreenExt#size
		 * @type {DOMSize}
		 * @readonly
		 */
		size: {get: () => new DOMSize(Math.floor(screen.width), Math.floor(screen.height)), configurable: true},

		/**
		 * Screen resolution
		 *
		 * @name extensions.ScreenExt#resolution
		 * @type {DOMSize}
		 * @readonly
		 */
		resolution: {get: () => new DOMSize(Math.floor(screen.width * devicePixelRatio), Math.floor(screen.height * devicePixelRatio)), configurable: true}
	}
}

export default ScreenExt

