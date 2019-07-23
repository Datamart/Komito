#!/bin/bash

readonly CWD=$(cd $(dirname $0); pwd)
readonly NPM="$(which npm)"

"${NPM}" init --force
"${NPM}" i komito-analytics

rm -rf node_modules package-lock.json package.json