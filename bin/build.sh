#!/bin/sh

plugin=jquery.orderly

mkdir -p dist
uglifyjs --screw-ie8 --compress -o dist/${plugin}.min.js src/${plugin}.js
