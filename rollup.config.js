import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import cleanup from "rollup-plugin-cleanup"

import pkg from "./package.json" with {type: "json"}

const input = "./src/index.js";
const name = "jsExt";

// the entry is the subpath a page imports - '' for the library itself, 'polyfills/css-style-sheet'
// and the like for the ones that have a door of their own
function getLicenseHeader(entry) {
	return `
		/**
		 * [${pkg.name}${entry ? `/${entry}` : ""}]{@link ${pkg.homepage}}
		 *
		 * @namespace ${name}
		 * @version ${pkg.version}
		 * @author ${pkg.author}
		 * @copyright ${pkg.author} 2020-${(new Date()).getFullYear()}
		 * @license ${pkg.license}
		 */
	`.trim().replaceAll("\t", "");
}

export default [
	/* ************** UMD ************** */
	{
		input,
		output: {
			format: "umd",
			name,
			intro: getLicenseHeader(),
			file: `./dist/${pkg.name}.js`
		},
		plugins: [
			resolve(),
			commonjs(),
			cleanup()
		]
	},
	{
		input,
		output: {
			format: "umd",
			name,
			intro: getLicenseHeader(),
			file: `./dist/${pkg.name}-min.js`
		},
		plugins: [
			resolve(),
			commonjs(),
			terser()
		]
	},
	/* ************** ESM, CJS ************** */
	{
		input,
		output: [
			{
				format: "esm",
				intro: getLicenseHeader(),
				file: `./dist/${pkg.name}.mjs`,
			},
			{
				format: "cjs",
				intro: getLicenseHeader(),
				file: `./dist/${pkg.name}.cjs`,
			}
		],
		plugins: [
			cleanup()
		]
	},
	{
		input,
		output: [
			{
				format: "esm",
				intro: getLicenseHeader(),
				file: `./dist/${pkg.name}-min.mjs`
			},
			{
				format: "cjs",
				intro: getLicenseHeader(),
				file: `./dist/${pkg.name}-min.cjs`
			}
		],
		plugins: [
			terser()
		]
	},
	/* ************** CustomElementRegistry - UMD ************** */

	/*
	 * Its own bundles rather than a part of the main ones: it carries the custom elements polyfill,
	 * which reads 'self' as it loads and throws where there is none - in the main bundle that would
	 * be a library Node cannot import at all.
	 */
	{
		input: "./src/custom-elements.js",
		output: {
			format: "umd",
			name: "CustomElementRegistryExt",
			intro: getLicenseHeader("custom-elements"),
			file: "./dist/custom-elements.js"
		},
		plugins: [
			resolve(),
			commonjs(),
			cleanup()
		]
	},
	{
		input: "./src/custom-elements.js",
		output: {
			format: "umd",
			name: "CustomElementRegistryExt",
			intro: getLicenseHeader("custom-elements"),
			file: "./dist/custom-elements-min.js"
		},
		plugins: [
			resolve(),
			commonjs(),
			terser()
		]
	},
	/* ************** CustomElementRegistry - ESM ************** */
	{
		input: "./src/custom-elements.js",
		output: {
			format: "esm",
			intro: getLicenseHeader("custom-elements"),
			file: "./dist/custom-elements.mjs"
		},
		plugins: [
			resolve(),
			commonjs(),
			cleanup()
		]
	},
	{
		input: "./src/custom-elements.js",
		output: {
			format: "esm",
			intro: getLicenseHeader("custom-elements"),
			file: "./dist/custom-elements-min.mjs"
		},
		plugins: [
			resolve(),
			commonjs(),
			terser()
		]
	},
	/* ************** Polyfill CSSStyleSheet - UMD ************** */
	{
		input: "./src/classes/polyfills/CSSStyleSheet.js",
		output: {
			format: "umd",
			name: "CSSStyleSheet",
			intro: getLicenseHeader("polyfills/css-style-sheet"),
			file: "./dist/polyfills/css-style-sheet.js"
		},
		plugins: [
			cleanup()
		]
	},
	{
		input: "./src/classes/polyfills/CSSStyleSheet.js",
		output: {
			format: "umd",
			name: "CSSStyleSheet",
			intro: getLicenseHeader("polyfills/css-style-sheet"),
			file: "./dist/polyfills/css-style-sheet-min.js"
		},
		plugins: [
			terser()
		]
	},
	/* ************** Polyfill CSSStyleSheet - ESM ************** */
	{
		input: "./src/classes/polyfills/CSSStyleSheet.js",
		output: {
			format: "esm",
			intro: getLicenseHeader("polyfills/css-style-sheet"),
			file: "./dist/polyfills/css-style-sheet.mjs"
		},
		plugins: [
			cleanup()
		]
	},
	{
		input: "./src/classes/polyfills/CSSStyleSheet.js",
		output: {
			format: "esm",
			intro: getLicenseHeader("polyfills/css-style-sheet"),
			file: "./dist/polyfills/css-style-sheet-min.mjs"
		},
		plugins: [
			terser()
		]
	}
];
