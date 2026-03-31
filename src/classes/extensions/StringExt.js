import Extension from "../Extension.js"

/**
 * String extension
 *
 * @hideconstructor
 * @memberof extensions
 */
class StringExt extends Extension {
	/**
	 * Formats underlying string with padding from the left side
	 *
	 * @example padded string 'MyString' with length 10 and char ' ' will result to  '  MyString'
	 *
	 * @param {int} length Number length that needs padding
	 * @param {char} [char='-'] Padding value
	 * @returns {string} Formatted string
	 */
	padStart(length, char = "-") {
		return (this.length < length) ? (new Array(length - this.length + 1)).join(char) + this : this.toString();
	}
/*
	charsCode() {
		return this.split("").reduce((previous, current) => previous + current.charCodeAt(0), 0)
	}
*/
	/**
	 * Converts string in ('PascalCase' | 'SNAKE_case' | 'KEBAB-case' | 'DOT.notation') notation to 'camelCase' string notation
	 *
	 * @param {string} sourceCase Source string notation, oneof(camel, pascal, snake, kebab, dot)
	 * @return {string} 'camelCase' notation value
	 */
	toCamelCase(sourceCase) {
		switch (sourceCase) {
			case "camel": return this;
			case "pascal": return this.replace(/^./, c => c.toLowerCase());
			case "snake": return this.toLowerCase().replace(/_([a-z])/g, (m, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
			case "kebab": return this.toLowerCase().replace(/-([a-z])/g, (m, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
			case "dot": return this.toLowerCase().replace(/\.([a-z])/g, (m, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());

			default: throw new Error(`Unsupported source case: ${sourceCase}, expected oneof(camel, pascal, snake, kebab, dot)`);
		}
	}

	/**
	 * Converts string in ('camelCase' | 'SNAKE_case' | 'KEBAB-case' | 'DOT.notation') notation to 'PascalCase' string notation
	 *
	 * @param {string} sourceCase Source string notation, oneof(camel, pascal, snake, kebab, dot)
	 * @return {string} 'PascalCase' notation value
	 */
	toPascalCase(sourceCase) {
		switch (sourceCase) {
			case "pascal": return this;
			case "camel": return this.replace(/^./, c => c.toUpperCase());
			case "snake": return this.toLowerCase().replace(/_([a-z])/g, (m, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
			case "kebab": return this.toLowerCase().replace(/-([a-z])/g, (m, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
			case "dot": return this.toLowerCase().replace(/\.([a-z])/g, (m, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase());

			default: throw new Error(`Unsupported source case: ${sourceCase}, expected oneof(camel, pascal, snake, kebab, dot)`);
		}
	}

	/**
	 * Converts string in ('camelCase' | 'PascalCase' | 'KEBAB-case' | 'DOT.notation') notation to 'SNAKE_case' string notation
	 *
	 * @param {string} sourceCase Source string notation, oneof(camel, pascal, snake, kebab, dot)
	 * @param {boolean} [keepCase=false] By default result is in lower register
	 * @return {string} 'SNAKE_case' notation value
	 */
	toSnakeCase(sourceCase, keepCase = false) {
		let value;

		switch (sourceCase) {
			case "snake":
				value = this;
				break;

			case "kebab":
				value = this.replaceAll("-", "_");
				break;

			case "dot":
				value = this.replaceAll(".", "_");
				break;

			case "camel":
				value = this.replace(/[A-Z]/g, m => "_" + m);
				break;

			case "pascal":
				value = this.replace(/([a-z])([A-Z])/g, "$1_$2");
				break;

			default: throw new Error(`Unsupported source case: ${sourceCase}, expected oneof(camel, pascal, snake, kebab, dot)`);
		}

		return keepCase ? value : value.toLowerCase();
	}

	/**
	 * Converts string in ('camelCase' | 'PascalCase' | 'SNAKE_case' | 'DOT.notation') notation to 'KEBAB-case' string notation
	 *
	 * @param {string} sourceCase Source string notation, oneof(camel, pascal, snake, kebab, dot)
	 * @param {boolean} [keepCase=false] By default result is in lower register
	 * @return {string} 'KEBAB-case' notation value
	 */
	toKebabCase(sourceCase, keepCase = false) {
		let value;

		switch (sourceCase) {
			case "kebab":
				value = this;
				break;

			case "snake":
				value = this.replaceAll("_", "-");
				break;

			case "dot":
				value = this.replaceAll(".", "-");
				break;

			case "camel":
				value = this.replace(/([a-z])([A-Z])/g, "$1-$2");
				break;

			case "pascal":
				value = this.replace(/([a-z])([A-Z])/g, "$1-$2");
				break;

			default: throw new Error(`Unsupported source case: ${sourceCase}, expected oneof(camel, pascal, snake, kebab, dot)`);
		}

		return keepCase ? value : value.toLowerCase();
	}

	/**
	 * Converts string in ('camelCase' | 'PascalCase' | 'SNAKE_case' | 'KEBAB-case') notation to 'dot.Notation' string notation
	 *
	 * @param {string} sourceCase Source string notation, oneof(camel, pascal, snake, kebab, dot)
	 * @param {boolean} [keepCase=false] By default result is in lower register
	 * @return {string} 'DOT.notation' value
	 */
	toDotNotation(sourceCase, keepCase = false) {
		let value;

		switch (sourceCase) {
			case "dot":
				value = this;
				break;

			case "snake":
				value = this.replaceAll("_", ".");
				break;

			case "kebab":
				value = this.replaceAll("-", ".");
				break;

			case "camel":
				value = this.replace(/([a-z])([A-Z])/g, "$1.$2");
				break;

			case "pascal":
				value = this.replace(/([a-z])([A-Z])/g, "$1.$2");
				break;

			default: throw new Error(`Unsupported source case: ${sourceCase}, expected oneof(camel, pascal, snake, kebab, dot)`);
		}

		return keepCase ? value : value.toLowerCase();
	}

	/**
	 * Converts string to char array
	 *
	 * @param {boolean} [bytes=false] Result type, When is true but string contains multi-bytes symbols is treated as false
	 * @returns {Array<int> | Uint8Array} Char array, where type depends for bytes property
	 */
	toCharArray(bytes = false) {
		let list = [];
		let byteList = true;

		for (let i = 0; i < this.length; i++) {
			let code = this.charCodeAt(i);

			if (code > 255) byteList = false;
			list[i] = code;
		}

		if (bytes) {
			if (!byteList) throw new Error("Current value is not byte string");
			list = new Uint8Array(list);
		}

		return list;
	}

	/**
	 * Converts char array to string
	 *
	 * @param {Array<byte> | Uint8Array} data Bytes to serialize
	 * @returns {string} Binary data as string
	 */
	static fromCharArray(data) {
		return data.reduce((binary, byte) => binary + String.fromCharCode(byte), "");
	}
}

export default StringExt
