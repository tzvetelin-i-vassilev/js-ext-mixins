import "js-ext-mixins/dev"

import assert from "assert"

describe("js-ext-mixins test suite", () => {
	context("=================================== String ===================================", () => {
		let input = "aBц23@";

		it(input, () => {
			assert.deepEqual(input.toCharArray(), [97, 66, 1094, 50, 51, 64]);
			assert.equal(String.fromCharArray([97, 66, 1094, 50, 51, 64]), input);
			assert.equal(input.padStart(8, "+"), "++aBц23@");

			assert.equal("PascalCase".toCamelCase("pascal"), "pascalCase");
			assert.equal("snake_case".toCamelCase("snake"), "snakeCase");
			assert.equal("kebab-case".toCamelCase("kebab"), "kebabCase");
			assert.equal("dot.notation".toCamelCase("dot"), "dotNotation");

			assert.equal("camelCase".toPascalCase("camel"), "CamelCase");
			assert.equal("snake_case".toPascalCase("snake"), "SnakeCase");
			assert.equal("kebab-case".toPascalCase("kebab"), "KebabCase");
			assert.equal("dot.notation".toPascalCase("dot"), "DotNotation");

			assert.equal("camelCase".toSnakeCase("camel", true), "camel_Case");
			assert.equal("PascalCase".toSnakeCase("pascal", true), "Pascal_Case");
			assert.equal("kebab-case".toSnakeCase("kebab", true), "kebab_case");
			assert.equal("dot.notation".toSnakeCase("dot", true), "dot_notation");

			assert.equal("camelCase".toKebabCase("camel", true), "camel-Case");
			assert.equal("PascalCase".toKebabCase("pascal", true), "Pascal-Case");
			assert.equal("snake_case".toKebabCase("snake", true), "snake-case");
			assert.equal("dot.notation".toKebabCase("dot", true), "dot-notation");

			assert.equal("camelCase".toDotNotation("camel"), "camel.case");
			assert.equal("PascalCase".toDotNotation("pascal"), "pascal.case");
			assert.equal("snake_case".toDotNotation("snake"), "snake.case");
			assert.equal("kebab-case".toDotNotation("kebab"), "kebab.case");
		})
	})

	context("=================================== Number ===================================", () => {
		let input = 235;

		it(`${input}`, () => {
			assert.equal(Number.MAX_INT32, 0x7FFFFFFF);
			assert.equal(Number.MAX_UINT32, 0xFFFFFFFF);
			assert.equal(Number.MAX_INT64, 0x7FFFFFFFFFFFFFFFn);
			assert.equal(Number.MAX_UINT64, 0xFFFFFFFFFFFFFFFFn);

			assert.equal(input.format("00000"), "00235");
		})
	})

	context("=================================== Array ===================================", () => {
		let input = ["a", "b", "b", "c", "d"];

		it(input.join(", "), () => {
			assert.equal(input.first, "a");
			assert.equal(input.last, "d");

			assert.deepEqual(input.unique(), ["a", "b", "c", "d"]);
			assert.deepEqual(input.slice().replace("c", [1, 2, 3]), ["a", "b", "b", 1, 2, 3, "d"]);
			assert.deepEqual(input.slice().remove("b", "c"), ["a", "d"]);
		})
	})

	context("=================================== TypedArray ===================================", () => {
		let input = [2.3, 3.8, 45.6];
		let typedInput = input.toFloat32Array();

		it(input.join(", "), () => {
			assert.equal(typedInput.constructor, Float32Array);
			assert.equal(typedInput.toArray().constructor, Array);

			let clonedInput = typedInput.clone();
			clonedInput[1] = 8.8;

			assert.notEqual(typedInput[1], clonedInput[1])
		})
	})

	context("=================================== Object ===================================", () => {
		let inputA = {n: 1}
		let inputB = {n: 1}

		it(`A: ${JSON.stringify(inputA)}, B: ${JSON.stringify(inputB)}`, () => {
			assert.notEqual(inputA, inputB);
			assert.ok(Object.equals(inputA, inputB));

			let inputC = Object.clone(inputA)
			inputC.n = 2;

			assert.notEqual(inputA, inputC);

			Object.defineEnum(inputA, "MyEnum", ["VALUE_A", "VALUE_B", "VALUE_C", "VALUE_Z"], true);
			Object.defineEnum(inputA, "MyEnum", ["VALUE_X", "VALUE_Y", "VALUE_Z"]);

			assert.equal(inputA.MyEnum.VALUE_X.name, "VALUE_X");
		})
	})
})
