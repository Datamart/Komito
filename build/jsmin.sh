#!/usr/bin/env bash

# https://developers.google.com/closure/compiler/

CWD=$(cd $(dirname $0); pwd)
TMP="${CWD}/tmp"
LIB="${CWD}/lib"

JS_COMPILER_JAR="${LIB}/compiler.jar"
JS_DOWNLOAD_URL=http://dl.google.com/closure-compiler/compiler-latest.zip

WGET="`which wget`"
CURL="`which curl`"

function download() {
    mkdir -p ${LIB}

    if [ ! -f "${JS_COMPILER_JAR}" ]; then
        rm -rf ${TMP} && mkdir ${TMP} && cd ${TMP}
        if [ -n "$WGET" ]; then
            $WGET --no-verbose "${JS_DOWNLOAD_URL}"
        else
            $CURL "${JS_DOWNLOAD_URL}" > ./compiler-latest.zip
        fi
        unzip compiler-latest.zip -d "${LIB}"
        cd ${CWD} && rm -rf ${TMP}
    fi
}

function minify() {
    local SRC_PATH
    local OUT_PATH
    SRC_PATH=$1
    OUT_PATH=$2

    if [ -d "${SRC_PATH}" ]; then
        rm -rf "${OUT_PATH}" && touch "${OUT_PATH}" && chmod 0666 "${OUT_PATH}"

        python -c "import sys;sys.argv.pop(0);print(' --js ' + ' --js '.join(sorted(sys.argv, cmp=lambda x,y: cmp(x.lower(), y.lower()))))" `find "${SRC_PATH}" -name "*.js" -print` |
            xargs java -jar "${JS_COMPILER_JAR}" \
                  --compilation_level ADVANCED_OPTIMIZATIONS \
                  --warning_level VERBOSE \
                  --charset UTF-8 \
                  --use_types_for_optimization \
                  --js_output_file "${OUT_PATH}"
    fi
}

#
# The main function.
#
function main() {
    download
    minify "../src" "../min/komito.js"
}

main "$@"
