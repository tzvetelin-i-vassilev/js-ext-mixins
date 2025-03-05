#!/usr/bin/env node

import fs from "fs"
import pkg from "../package.json" assert {type: "json"}

const src = `
/**
 * ${pkg.name} ${pkg.version}
 *
 * @name version
 * @constant {string}
 */

export default "${pkg.version}"
`;

fs.writeFileSync("src/version.js", `${src.trim()}\n`);
