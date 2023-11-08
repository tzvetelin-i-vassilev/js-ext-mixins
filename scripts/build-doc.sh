#!/bin/bash

SCRIPT="
<script>
addEventListener('DOMContentLoaded', () => {
    if (window == top) return;

    Array.from(document.querySelectorAll('a'))
        .filter(a => !a.href.includes(location.host))
        .forEach(a => a.target = '_blank');
});
</script>"

echo "$SCRIPT" > ./scripts/README_SCRIPT.js

cat ./README.md ./scripts/README_SCRIPT.js > ./scripts/README.md

rm -rf ./docs
jsdoc -c jsdoc.config.json ./scripts/README.md

rm ./scripts/README_SCRIPT.js
rm ./scripts/README.md
