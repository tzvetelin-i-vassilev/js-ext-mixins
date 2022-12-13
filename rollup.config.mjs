import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import cleanup from "rollup-plugin-cleanup"
import eslint from "@rollup/plugin-eslint"
import terser from "@rollup/plugin-terser"
// import {sizeSnapshot} from "rollup-plugin-size-snapshot"

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

let minPlugins = [
	// sizeSnapshot(),
	terser({
		output: {comments: /^!/}
	})
];

export default [
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
		plugins: browserPlugins.concat(minPlugins)
	},
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
			cleanup()
		].concat(minPlugins)
	}
];
