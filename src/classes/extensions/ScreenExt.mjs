import Extension from "../Extension.mjs"

import DOMSize from "../add-ons/DOMSize.mjs"

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

