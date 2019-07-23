#!/bin/bash

readonly CWD=$(cd $(dirname $0); pwd)
readonly NPM="$(which npm)"
readonly TMP="${CWD}/komito"

mkdir "${TMP}" && cd "${TMP}"

"${NPM}" init --force
"${NPM}" i komito-analytics

rm -rf "${TMP}"
