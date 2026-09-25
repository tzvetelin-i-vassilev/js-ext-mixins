/**
 * CustomElementRegistry define options
 *
 * @typedef ExtOptions
 * @memberof CustomElementRegistryExt
 * @property {boolean} abstract Register nothing - the class is set up and left undefined, which is
 * what a base class needs
 * @property {CSSStyleSheet} style Global scope stylesheet definition
 * @property {FontFaceSettings} font Font face descriptor
 * @property {string} font.name Font family
 * @property {Array<string>} font.format Extensions of provided fonts
 * @property {boolean} assets Provides instance methods - icon, image, html (URL resolvers, based on relative path to the asset)
 * @property {URL} clazzURL Class meta url - defines baseURL, use document.currentScript?.src || import.meta.url as value
 * @property {string} extends Tag of the built-in element being customized, as the platform means
 * it. The class also gets an 'is' of its own, so an instance can say what it was made as
 * @property {object} define Options to hand to the platform's define instead of these - the whole
 * of the options is replaced by it, so it carries extends itself when there is one
 */

const FONT_FORMATS = {
	eot: "embedded-opentype",
	otc: "collection",
	ttc: "collection",
	otf: "opentype",
	ttf: "truetype",
	woff: "woff",
	woff2: "woff2"
};

let native;

/**
 * CustomElementRegistry wrapper - a define that takes more than the specification put in it.
 *
 * What a component needs at the moment it is registered is not only its name and its class: where
 * it was served from, so it can find its own icons; a stylesheet for the document rather than for
 * its shadow root; a font to declare. All of that is a line each here, instead of being written out
 * again in every component.
 *
 * The platform's third argument is where all of it goes, and the specification leaves exactly one
 * key in it - extends, which is handed on as it was found.
 *
 * So this does not derive from Extension, and that is the kind of thing it is rather than an
 * oversight. An extension puts members on a class that is missing them; a wrapper stands in front
 * of a method that is already there and takes more than it used to. Nor is it a polyfill, which
 * fills a gap against a specification and becomes a no-op once the runtime closes it - no runtime
 * will ship these options, because nobody has specified them. It is not in JS_EXT_SCOPE either -
 * it is asked for by importing it:
 *
 * @example
 * import "js-ext-mixins"
 * import "js-ext-mixins/custom-elements"
 *
 * customElements.define("my-thing", MyThing, {clazzURL: import.meta.url, assets: true});
 *
 * @hideconstructor
 * @memberof extensions
 */
class CustomElementRegistryExt {
	/**
	 * Registers a custom element, having done whatever its options ask for first.
	 *
	 * @param {string} name Tag name
	 * @param {Function} clazz Element class
	 * @param {CustomElementRegistryExt.ExtOptions} [options={}] What to do besides registering
	 */
	define(name, clazz, options = {}) {
		let baseURL;

		if (options.clazzURL) {
			/*
			 * The folder the class was served from. Split on the host the address is only the path
			 * when it is served from here, and the whole address when it is served from somewhere
			 * else - both are usable as a prefix, and both are kept. Splitting on the text of the
			 * host, which this used to do, cuts at the first place that text appears, so an address
			 * with the host repeated in its path lost everything before the second occurrence.
			 */
			let url = new URL(options.clazzURL, document.baseURI);
			let folder = href => href.substring(0, href.lastIndexOf("/"));

			baseURL = url.origin == location.origin ? folder(url.pathname) : folder(url.href);

			clazz.prototype.baseURL = baseURL;
		}

		if (options.style) {
			// a path used to be accepted here as well, and was fetched - what is left of that is
			// the commented line below, so the type is what is wrong now, not the missing url
			if (!(options.style instanceof CSSStyleSheet)) {
				// document.head.importCSS(`${baseURL}/styles/${name}.css`);
				throw new Error("Option style type CSSStyleSheet is expected");
			}

			options.style.name = name;

			document.adoptedStyleSheets.push(options.style);
		}

		if (options.font) {
			if (!("baseURL" in clazz.prototype))
				throw new Error("Option clazzURL is expected when font include is needed");

			const sheet = new CSSStyleSheet();
			sheet.name = options.font.name;

			let src = [];

			src.push(`local("${sheet.name}")`);

			for (let ext of options.font.format) {
				let format = FONT_FORMATS[ext];
				if (!format) throw new Error(`Unknown font format found: ${ext}. Supported formats: ${Object.keys(FONT_FORMATS).join(", ")}`);

				src.push(`url("${baseURL}/fonts/${name}/${sheet.name}.${ext}") format("${format}")`);
			}

			sheet.replaceSync(`
				@font-face {
					font-family: "${sheet.name}";
					src: ${src.join(", ")};
				}
			`);

			document.adoptedStyleSheets.push(sheet);
		}

		if (options.assets) {
			if (!("baseURL" in clazz.prototype))
				throw new Error("Option clazzURL is expected when assets are needed");

			clazz.prototype.icon = CustomElementRegistryExt.icon;
			clazz.prototype.image = CustomElementRegistryExt.image;
			clazz.prototype.html = CustomElementRegistryExt.html;
		}

		if (!options.abstract) {
			if (options.define) options = options.define;

			if (options.extends)
				clazz.prototype.is = name;

			native(name, clazz, options);
		}
	}

	/*
	 * The three that 'assets' hands to the element being registered. They are statics here only
	 * because they need somewhere to live: each is copied onto the class's prototype above and reads
	 * the baseURL and the tag name of the element it ends up on, not of this one.
	 */

	/**
	 * The address of one of this element's icons.
	 *
	 * @param {string} path File name, or a path under the icons folder
	 * @param {string | boolean} [localName=this.localName] The folder to look in; true for the icons
	 * that belong to no single element
	 * @returns {string} The address
	 */
	static icon(path, localName = this.localName) {
		if (localName === true)
			return `${this.baseURL}/icons/${path}`;
		else
			return `${this.baseURL}/icons/${localName}/${path}`;
	}

	/**
	 * The address of one of this element's images.
	 *
	 * @param {string} path File name, or a path under the images folder
	 * @param {string | boolean} [localName=this.localName] The folder to look in; true for the images
	 * that belong to no single element
	 * @returns {string} The address
	 */
	static image(path, localName = this.localName) {
		if (localName === true)
			return `${this.baseURL}/images/${path}`;
		else
			return `${this.baseURL}/images/${localName}/${path}`;
	}

	/**
	 * The address of this element's html fragment.
	 *
	 * @returns {string} The address
	 */
	static html() {
		return `${this.baseURL}/html/${this.localName}.html`;
	}

	/*
	 * Puts the define above in the place of the platform's own.
	 *
	 * Not through Extension.extend, and this is the whole reason the extension has an import of its
	 * own. The wrapper has to sit on the registry instance and hand on to whatever define is current,
	 * so it must be the outermost patch of it. A member put on CustomElementRegistry.prototype -
	 * which is what Extension.extend does - is shadowed by the property the custom elements polyfill
	 * puts on the instance, and that polyfill hands on to the define it captured only for autonomous
	 * elements: given an 'extends' it registers the element itself, and the options above are dropped
	 * without a word. So the order is fixed where it cannot be got wrong - the polyfill is imported
	 * by the entry beside this file, before this runs.
	 *
	 * Done once however many times it is asked for, and the mark it leaves - CustomElementRegistry._ext
	 * - is also how a page tells whether the options are understood. It is on the platform's class
	 * rather than in Extension.applied on purpose: this file is bundled behind its own entry, so the
	 * Extension it would reach is a copy of the one the main import gave the page, and what it wrote
	 * there nobody would ever read.
	 *
	 * True is what it gives back when the registry was there and was patched.
	 */
	static extend() {
		if (typeof customElements == "undefined" || CustomElementRegistry._ext) return false;

		CustomElementRegistry._ext = true;

		native = customElements.define.bind(customElements);
		customElements.define = this.prototype.define;

		return true;
	}
}

export default CustomElementRegistryExt
