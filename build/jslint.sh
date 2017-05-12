#!/bin/bash
#
# Downloads and runs Google closure linter.
# Guide: https://google.github.io/styleguide/shell.xml
# Link: https://github.com/google/closure-linter
# Source: https://github.com/Datamart/Workspace/blob/master/build/jslint.sh

readonly CWD=$(cd $(dirname $0); pwd)
readonly LIB="${CWD}/lib"
readonly TMP="${CWD}/tmp"

# TODO(user): Replace to project related path.
readonly JS_SOURCES="${CWD}/../src"

readonly JS_LINTER_ZIP="closure-linter.zip"
readonly JS_LINTER_URL="https://github.com/google/closure-linter/archive/v2.3.19.zip"

readonly WGET="$(which wget)"
readonly CURL="$(which curl)"
readonly PYTHON="$(which python)"

readonly CUSTOM_TAGS="version,example,static,namespace,requires,event"


#
# Downloads closure linter.
#
function download() {
  if [[ ! -e "$(which gjslint)" ]]; then
    echo "Downloading closure linter:"
    mkdir -p "${LIB}"
    rm -rf "${TMP}" && mkdir "${TMP}" && cd "${TMP}"
    if [[ -n "$CURL" ]]; then
      $CURL -L "${JS_LINTER_URL}" > "${TMP}/${JS_LINTER_ZIP}"
    else
      $WGET "${JS_LINTER_URL}" -O "${TMP}/${JS_LINTER_ZIP}"
    fi
    echo "Done"

    echo "Extracting closure linter: "
    unzip -q "${TMP}/${JS_LINTER_ZIP}" -d "${LIB}"
    echo "Done"

    echo "Installing closure linter:"
    cd "${LIB}/"closure-linter-*
    $PYTHON setup.py --quiet build && sudo $PYTHON setup.py --quiet install
    echo "Done"

    cd "${CWD}" && rm -rf "${TMP}"
  fi
}

#
# Runs closure linter.
#
function run() {
  echo "Running closure linter:"
  local GJSLINT="$(which gjslint)"
  local FIXJSSTYLE="$(which fixjsstyle)"

  if [[ -d "${JS_SOURCES}" ]]; then
    $FIXJSSTYLE --strict \
                --custom_jsdoc_tags "${CUSTOM_TAGS}" \
                -x "${CWD}/externs.js" \
                -r "${JS_SOURCES}"
    $GJSLINT --strict \
             --custom_jsdoc_tags "${CUSTOM_TAGS}" \
             -x "${CWD}/externs.js" \
             -r "${JS_SOURCES}"
  fi
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
