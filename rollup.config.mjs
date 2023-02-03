import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import cleanup from "rollup-plugin-cleanup"
import eslint from "@rollup/plugin-eslint"
import terser from "@rollup/plugin-terser"

import pkg from "./package.json" assert {type: "json"}

const input = "./src/index.js";
const name = "jsExt";

const babelOptions = {
	babelrc: false,
	babelHelpers: "bundled",
	presets: ["@babel/preset-env"],
	exclude: "node_modules/**"
};

const eslintOptions = {
	overrideConfig: {
		env: {
			browser: true,
			node: true
		},
		globals: {
			DedicatedWorkerGlobalScope: "readonly",
			DOMSize: "readonly"
		}
	}
};

let browserPlugins = [
	resolve({
		browser: true
	}),
	babel(babelOptions),
	commonjs()
];

export default [
	/* ************** UMD ************** */
	{
		input,
		output: {
			format: "umd",
			name,
			file: `./dist/${pkg.name}.js`,
		},
		plugins: [
			eslint(eslintOptions),
			cleanup()
		].concat(browserPlugins)
	},
	{
		input,
		output: {
			format: "umd",
			name,
			file: `./dist/${pkg.name}-min.js`
		},
		plugins: browserPlugins.concat([
			terser()
		])
	},
	/* ************** ESM, CJS ************** */
	{
		input,
		output: [
			{
				format: "esm",
				file: `./dist/${pkg.name}.mjs`,
			},
			{
				format: "cjs",
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
				file: `./dist/${pkg.name}-min.mjs`
			},
			{
				format: "cjs",
				file: `./dist/${pkg.name}-min.cjs`
			}
		],
		plugins: [
			terser()
		]
	},
	/* ************** Polyfill CSSStyleSheet - UMD ************** */
	{
		input: "./src/polyfills/CSSStyleSheet.mjs",
		output: {
			format: "umd",
			name: "CSSStyleSheet",
			file: "./dist/polyfills/css-style-sheet.js"
		},
		plugins: [
			babel(babelOptions),
			eslint(eslintOptions),
			cleanup()
		]
	},
	{
		input,
		output: {
			format: "umd",
			name: "CSSStyleSheet",
			file: "./dist/polyfills/css-style-sheet-min.js",
		},
		plugins: [
			babel(babelOptions),
			terser()
		]
	},
	/* ************** Polyfill CSSStyleSheet - ESM ************** */
	{
		input: "./src/polyfills/CSSStyleSheet.mjs",
		output: {
			format: "esm",
			file: "./dist/polyfills/css-style-sheet.mjs"
		},
		plugins: [
			cleanup()
		]
	},
	{
		input: "./src/polyfills/CSSStyleSheet.mjs",
		output: {
			format: "esm",
			file: "./dist/polyfills/css-style-sheet-min.mjs"
		},
		plugins: [
			terser()
		]
	}
];
