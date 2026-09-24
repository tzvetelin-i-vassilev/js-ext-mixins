import js from "@eslint/js"
import globals from "globals"

export default [
	{
		ignores: ["**/_*.js"]
	},

	js.configs.recommended,

	{
		files: ["**/*.js"],

		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				Atomics: "readonly",
				DedicatedWorkerGlobalScope: "readonly",
				SharedArrayBuffer: "readonly",
				DOMSize: "readonly"
			}
		},

		rules: {
			"no-unused-vars": ["error", {
				"argsIgnorePattern": "^(e|event|reject|receiver)$",
				"caughtErrorsIgnorePattern": "^e$"
			}]
		}
	}
]
