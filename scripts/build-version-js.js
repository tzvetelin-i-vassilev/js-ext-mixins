#!/usr/bin/env node

const fs = require("fs");
const pkg = require("../package.json");

fs.writeFileSync("src/version.mjs", `export default "${pkg.version}"\n`);
