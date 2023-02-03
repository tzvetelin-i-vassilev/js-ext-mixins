import Extension from "../Extension.mjs"

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
					if (!this._query) {
						let value = Object.assign({}, ...this.search.substring(1)
							.split("&")
							.filter(pair => pair)
							.map(pair => pair.split("="))
							.map(pair => ({[pair[0]]: decodeURIComponent(pair[1])}))
						);

						Object.defineProperty(this, "_query", {value})
					}

					return this._query;
				},
				configurable: true
			}
		};
	}
}

export default LocationExt
