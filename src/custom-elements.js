/*
 * The registry extension, and the polyfill it has to stand on top of, in that order.
 *
 * The order is the reason this file exists rather than the extension being one of the twenty-three
 * the main import applies. ESM evaluates an import before the code that follows it, so the polyfill
 * has installed its own define by the time extend runs and captures it - which cannot be arranged
 * from outside, and is silently wrong when it is not arranged at all.
 *
 * It is also why this is not part of the main import: the polyfill reads 'self' while it loads and
 * throws where there is none, so a library that carries it is a library that cannot be imported in
 * Node - tests, build scripts and all.
 */
import "@ungap/custom-elements"

import CustomElementRegistryExt from "./classes/extensions/CustomElementRegistryExt.js"

CustomElementRegistryExt.extend();

export default CustomElementRegistryExt
