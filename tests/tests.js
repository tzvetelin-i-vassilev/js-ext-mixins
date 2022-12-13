let x = {
	a: 1,
	b: "ehooo",
	c: () => 3,
	d: {
		e: 7,
		r: () => 7
	},
	method() {
		return 5;
	}
};

class abc {
	// #x = 0;
	// #y;
	z;

	constructor(x, y) {
		// this.#x = x;
		// this.#y = y;
		this.x = x;
		this.y = y;
		this.z = "zzzz";
	}

	getX() {
		// return this.#x;
		return this.x;
	}

	getY() {
		// console.log(this.#getS())
		// return this.#y;
		return this.y;
	}

	// #getS() {
	// 	return this.z;
	// }
}

function xyz() {
	return 3;
}

let f = () => 5

globalThis.testJSExt = () => {
	console.log("=================================== String ===================================")
	let s = "aBц23@"

	console.log("toCharArray", s, s.toCharArray())
	console.log("fromCharArray", String.fromCharArray(s.toCharArray()))
	console.log("startsWith(a) / endsWith(@)", s.startsWith("a"), s.endsWith("@"))
	console.log("pad(8, +)", "abc", "abc".pad(8, "+"))

	// console.log("charsCode", "abc", "ц".charsCode())

	console.log("=================================== Number ===================================")
	let n = 235
	let nf = 2.34657

	console.log("pad(8)", n, n.pad(8))

	console.log("=================================== Array ===================================")
	let arr = ["a", "b", "b", "c", "d"]

	console.log("arr", arr)
	console.log("arr.first", arr.first)
	console.log("arr.last", arr.last)
	console.log("apply unique filter", arr.unique())
	console.log("replace b with [1, 2, 3]", arr.replace("b", [1, 2, 3]))
	console.log("remove b, c", arr.remove("b", "c"))

	console.log("=================================== TypedArray ===================================")
	let fa32Data = [2.3, 3.8, 45.6];
	let fa32 = fa32Data.toFloat32Array();
	let fa32Clone = fa32.clone();
	fa32Clone[1] = 8.8;

	console.log("fa32", fa32)
	console.log("fa32 clone / toArray", fa32, fa32Clone, fa32Clone.toArray())

	console.log("=================================== Object ===================================")
	let oA = {n: 1}
	let oB = {n: 1}

	console.log("oA / oB", oA, oB)
	console.log("oA == oB / equals", oA == oB, Object.equals(oA, oB))

	let oC = Object.clone(oA)
	oC.n = 2;
	oC.pow = function(p) {return Math.pow(this.n, p)}

	console.log("clone oA / oC", oA, oC)

	Object.defineEnum(abc, "OEnum", ["VALUE_A", "VALUE_B", "VALUE_C", "VALUE_Z"])

	console.log("f / o enum", abc.FEnum, abc.OEnum)
}
