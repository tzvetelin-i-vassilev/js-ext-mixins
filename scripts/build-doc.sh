#!/bin/bash

rm -rf docs

jsdoc -c jsdoc.config.json ./README.md

cp ./scripts/docs/*.* ./docs/scripts
./docs/scripts/nav_update.sh
