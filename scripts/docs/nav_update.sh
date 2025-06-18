#!/bin/bash

cd "${0%/*}"
cat ./linenumber.js ./nav_update.js > ./temp.js
rm ./linenumber.js
rm ./nav_update.js
mv ./temp.js ./linenumber.js
rm ./nav_update.sh
