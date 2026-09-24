import {Extension} from "js-ext-mixins/dev"

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

			assert.equal(input.compareTo(100), 1);
			assert.equal(input.compareTo(300), -1);
			assert.equal(input.compareTo(235), 0);
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

			assert.deepEqual(input.indicesOf("b"), [1, 2]);
			assert.deepEqual(input.slice().removeAt(1), ["a", "b", "c", "d"]);
			assert.deepEqual(input.slice().removeAt(1, 2), ["a", "c", "d"]);

			// insert and clear work on the array rather than handing back a new one
			let inserted = input.slice();
			inserted.insert("x", 1);
			assert.deepEqual(inserted, ["a", "x", "b", "b", "c", "d"]);

			let cleared = input.slice();
			cleared.clear();
			assert.equal(cleared.length, 0);

			// deep, so the nested object is a copy too
			let nested = [{n: {m: 1}}];
			let clone = nested.clone();
			clone[0].n.m = 2;
			assert.equal(nested[0].n.m, 1);

			assert.deepEqual(Array.from("ab"), ["a", "b"]);
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

			assert.deepEqual([...new Uint8Array([1, 2]).concat(new Uint8Array([3]))], [1, 2, 3]);
			assert.deepEqual([...Uint8Array.from([1, 2, 3])], [1, 2, 3]);

			// shared memory where it is allowed, an ordinary buffer where it is not - either way a
			// TypedArray of the length asked for
			assert.equal(Uint8Array.createSharedInstance(3).length, 3);
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

			// by value, and all the way down
			assert.ok(Object.equals({a: {b: [1, 2, {c: 3}]}}, {a: {b: [1, 2, {c: 3}]}}));
			assert.ok(!Object.equals({a: {b: [1, 2]}}, {a: {b: [1, 3]}}));

			// a key that is there and undefined is not the same as a key that is not there
			assert.ok(Object.equals({a: undefined}, {a: undefined}));
			assert.ok(!Object.equals({}, {a: undefined}));

			// and a copy that leaves the methods behind
			assert.equal(typeof Object.clone({f() {}, n: 1}, true).f, "undefined");
		})
	})

	context("=================================== Date ===================================", () => {
		let input = new Date(2026, 8, 24, 15, 4, 5, 60);

		it("2026-09-24 15:04:05.060, local time", () => {
			assert.equal(input.format("DD.MM.YYYY hh:mm:ss.S"), "24.09.2026 15:04:05.60");

			// one letter is the number as it stands, YY is the last two digits of the year
			assert.equal(input.format("YY-M-D"), "26-9-24");

			assert.equal(Date.format("YYYY/MM/DD", input.getTime()), "2026/09/24");

			// a letter left over is a mistake rather than text to keep
			assert.throws(() => input.format("DD.MM.YYYY x"), /Invalid pattern/);
		})
	})

	context("=================================== Function ===================================", () => {
		it("createClass", () => {
			class Base {
				hi() { return "base"; }
			}

			let Made = Function.prototype.createClass.call(function() {}, "Made", Base, {
				methods: "hi() { return 'made'; }"
			});

			assert.equal(Made.name, "Made");
			assert.ok(new Made() instanceof Base);
			assert.equal(new Made().hi(), "made");

			assert.equal((function demo() { return 1; }).body.trim(), "return 1;");
		})
	})

	context("=================================== Set ===================================", () => {
		let input = new Set([1, 2, 3, 4]);

		it([...input].join(", "), () => {
			// both give back a Set rather than an array, which is the point of having them
			assert.equal(input.map(v => v * 2).constructor, Set);
			assert.deepEqual([...input.map(v => v * 2)], [2, 4, 6, 8]);

			assert.equal(input.filter(v => v % 2 == 0).constructor, Set);
			assert.deepEqual([...input.filter(v => v % 2 == 0)], [2, 4]);
		})
	})

	context("=================================== ArrayBuffer ===================================", () => {
		let input = new Uint8Array([72, 101, 108, 108, 111]);

		it(`[${input.join(", ")}]`, () => {
			assert.equal(input.buffer.toBase64(), "SGVsbG8=");
			assert.deepEqual([...new Uint8Array(ArrayBuffer.fromBase64("SGVsbG8="))], [...input]);

			assert.ok(ArrayBuffer.isTypedArray(input));
			assert.ok(!ArrayBuffer.isTypedArray([1, 2, 3]));

			let shared = SharedArrayBuffer.fromArrayBuffer(input.buffer);

			assert.equal(shared.constructor, SharedArrayBuffer);
			assert.deepEqual([...new Uint8Array(shared)], [...input]);
		})
	})

	context("=================================== Promise ===================================", () => {
		it("sleep", async () => {
			let start = Date.now();
			await Promise.sleep(20);

			assert.ok(Date.now() - start >= 19);
		})
	})

	context("=================================== the global scope ===================================", () => {
		it("parseBool", () => {
			assert.equal(parseBool("true"), true);
			assert.equal(parseBool("false"), false);
			assert.equal(parseBool("anything"), true);
			assert.equal(parseBool(""), false);

			// a string that reads as a number is weighed as one, so "0" is false
			assert.equal(parseBool("0"), false);
			assert.equal(parseBool(0), false);
			assert.equal(parseBool(1), true);

			assert.equal(parseBool(undefined), false);
			assert.equal(parseBool(null), false);
			assert.equal(parseBool({}), true);
		})

		it("JS_EXT_SCOPE and Extension.applied", () => {
			// one is what was asked for, the other what landed - and outside a browser they differ
			assert.ok(JS_EXT_SCOPE.includes("Array"));
			assert.ok(JS_EXT_SCOPE.includes("DOMMatrix"));

			assert.ok(Extension.applied.includes("Array"));
			assert.ok(!Extension.applied.includes("DOMMatrix"), "there is no DOMMatrix outside a browser");

			// TypedArray is not a class anything has - what it leaves behind are the concrete ones
			assert.ok(!Extension.applied.includes("TypedArray"));
			assert.ok(Extension.applied.includes("Uint8Array"));
		})
	})
})
