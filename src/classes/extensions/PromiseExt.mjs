import Extension from "../Extension.mjs"

/**
 * Promise extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class PromiseExt extends Extension {
	/**
	 * Pause execution for desired time
	 *
	 * @param {int} [time=16] Sleep time in milliseconds
	 */
	static async sleep(time = 16) {
		return new Promise((resolve, reject) => setTimeout(resolve, time));
	}
}

export default PromiseExt
