import Extension from "../Extension.js"

/**
 * Date extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class DateExt extends Extension {
	/**
	 * Formats underlying date
	 *
	 * @param {string} pattern Pattern format:
	 * - Y Year
	 * - M Month (1-12)
	 * - D Day in month  (1-31)
	 * - h Hour in day (0-23)
	 * - m Minute in hour  (0-59)
	 * - s Second in minute (0-59)
	 * - S Millisecond (0-1000)
	 * @example DD.MM.YYYY hh:mm:ss.S
	 * @returns {string} Formatted date
	 */
	format(pattern) {
		let result = pattern;

		function resolve(search, value) {
			let rs = RegExp(`${search}+`).exec(result);

			if (rs) {
				let match = rs[0];
				let pattern = match.replace(new RegExp(match.substring(0, 1), "g"), "0");
				if (search == "Y" && match == "YY") value = parseInt(value.toString().substring(2));

				result = result.replace(match, value.format(pattern));
			}
		}

		resolve("Y", this.getFullYear());
		resolve("M", this.getMonth()+1);
		resolve("D", this.getDate());
		resolve("h", this.getHours());
		resolve("m", this.getMinutes());
		resolve("s", this.getSeconds());
		resolve("S", this.getMilliseconds());

		if (result.match(/[a-zA-Z]/))
			throw new Error(`Invalid pattern found in ${pattern}: ${result.match(/[a-zA-Z]+/)[0]}`);

		return result;
	}

	/**
	 * Formats given date
	 *
	 * @param {string} pattern
	 * @param {number} [timestamp=Date.now()] A number representing the milliseconds elapsed since the ECMAScript epoch.
	 * @returns {string} Formatted date
	 */
	static format(pattern, timestamp = Date.now()) {
		return (new Date(timestamp)).format(pattern);
	}
}

export default DateExt
