import Extension from "../Extension.js"

/**
 * Location extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class LocationExt extends Extension {
	static get properties() {
		return {
			/**
			 * Decoded query parameters
			 *
			 * @name extensions.LocationExt#query
			 * @type {JSON}
			 * @readonly
			 */
			query: {
				get: function() {
					return Object.assign({}, ...this.search.substring(1)
						.split("&")
						.filter(pair => pair)
						.map(pair => pair.split("="))
						.map(pair => ({[pair[0]]: decodeURIComponent(pair[1])}))
					);
				},
				configurable: true
			}
		};
	}
}

export default LocationExt
