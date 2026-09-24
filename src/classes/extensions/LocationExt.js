import Extension from "../Extension.js"

/**
 * Location extension
 *
 * @property {JSON} query Decoded query parameters
 *
 * @hideconstructor
 * @memberof extensions
 */
class LocationExt extends Extension {
	static get properties() {
		return {
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
