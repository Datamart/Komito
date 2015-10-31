#!/bin/bash
#
# Guide: https://google.github.io/styleguide/shell.xml
# Link: https://github.com/google/closure-linter

readonly CWD=$(cd $(dirname $0); pwd)
readonly LIB="${CWD}/lib"
readonly TMP="${CWD}/tmp"

readonly JS_LINTER_ZIP="closure-linter.zip"
readonly JS_LINTER_URL="https://github.com/google/closure-linter/archive/v2.3.19.zip"
readonly JS_SOURCES="${CWD}/../src"

readonly WGET="`which wget`"
readonly CURL="`which curl`"
readonly PYTHON="`which python`"

readonly CUSTOM_TAGS="version,example,static,namespace,requires,event"


#
# Downloads closure linter
#
function download() {
  if [ ! -e "`which gjslint`" ]; then
    echo "Downloading closure linter:"
    mkdir -p "${LIB}"
    rm -rf "${TMP}" && mkdir "${TMP}" && cd "${TMP}"
    if [ -n "$WGET" ]; then
      $WGET "${JS_LINTER_URL}" -O "${TMP}/${JS_LINTER_ZIP}"
    else
      $CURL "${JS_LINTER_URL}" > "${TMP}/${JS_LINTER_ZIP}"
    fi
    echo -n "Extracting closure linter: "
    unzip -q "${TMP}/${JS_LINTER_ZIP}" -d "${LIB}"
    echo "Done"

    echo "Installing closure linter:"
    cd "${LIB}/"closure-linter-*
    $PYTHON setup.py --quiet build && sudo $PYTHON setup.py --quiet install

    cd "${CWD}" && rm -rf "${TMP}"
  fi
}

#
# Runs closure linter.
#
function run() {
  echo "Running closure linter:"
  local GJSLINT="`which gjslint`"
  local FIXJSSTYLE="`which fixjsstyle`"

  $FIXJSSTYLE --strict \
              --custom_jsdoc_tags "${CUSTOM_TAGS}" \
              -x "${CWD}/externs.js" \
              -r "${JS_SOURCES}"
  $GJSLINT --strict \
           --custom_jsdoc_tags "${CUSTOM_TAGS}" \
           -x "${CWD}/externs.js" \
           -r "${JS_SOURCES}"
  echo "Done"
}

#
# The main function.
#
function main() {
  download
  run
}

main "$@"
