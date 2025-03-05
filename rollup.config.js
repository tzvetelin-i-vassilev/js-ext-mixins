import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import eslint from "@rollup/plugin-eslint"
import terser from "@rollup/plugin-terser"
import cleanup from "rollup-plugin-cleanup"

import pkg from "./package.json" assert {type: "json"}

const input = "./src/index.js";
const name = "jsExt";

function getLicenseHeader(polyfill) {
	return `
		/**
		 * [${pkg.name}${polyfill ? `/polyfills/${polyfill}` : ""}]{@link ${pkg.homepage}}
		 *
		 * @namespace ${name}
		 * @version ${pkg.version}
		 * @author ${pkg.author}
		 * @copyright ${pkg.author} 2020-${(new Date()).getFullYear()}
		 * @license ${pkg.license}
		 */
	`.trim().replaceAll("\t", "");
}

const eslintOptions = {
	overrideConfig: {
		globals: {
			DOMSize: "readonly"
		}
	}
};

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
			eslint(eslintOptions),
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
	/* ************** Polyfill CSSStyleSheet - UMD ************** */
	{
		input: "./src/classes/polyfills/CSSStyleSheet.js",
		output: {
			format: "umd",
			name: "CSSStyleSheet",
			intro: getLicenseHeader("css-style-sheet"),
			file: "./dist/polyfills/css-style-sheet.js"
		},
		plugins: [
			eslint(eslintOptions),
			cleanup()
		]
	},
	{
		input: "./src/classes/polyfills/CSSStyleSheet.js",
		output: {
			format: "umd",
			name: "CSSStyleSheet",
			intro: getLicenseHeader("css-style-sheet"),
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
			intro: getLicenseHeader("css-style-sheet"),
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
			intro: getLicenseHeader("css-style-sheet"),
			file: "./dist/polyfills/css-style-sheet-min.mjs"
		},
		plugins: [
			terser()
		]
	}
];
