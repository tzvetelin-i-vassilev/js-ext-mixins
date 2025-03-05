import Extension from "../Extension.js"

import DOMSize from "../add-ons/DOMSize.js"

/**
 * Screen extension
 *
 * @property {DOMSize} size Screen size
 * @property {DOMSize} resolution Screen resolution
 *
 * @hideconstructor
 * @memberof extensions
 */
class ScreenExt extends Extension {
	static properties = {
		size: {get: () => new DOMSize(Math.floor(screen.width), Math.floor(screen.height)), configurable: true},
		resolution: {get: () => new DOMSize(Math.floor(screen.width * devicePixelRatio), Math.floor(screen.height * devicePixelRatio)), configurable: true}
	}
}

export default ScreenExt

