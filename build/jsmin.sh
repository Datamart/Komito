#!/usr/bin/env bash

# https://developers.google.com/closure/compiler/

CWD=$(cd $(dirname $0); pwd)
TMP="${CWD}/tmp"
LIB="${CWD}/lib"

JS_COMPILER_JAR="${LIB}/compiler.jar"
CSS_COMPILER_JAR="${LIB}/closure-stylesheets.jar"

JS_DOWNLOAD_URL=http://dl.google.com/closure-compiler/compiler-latest.zip
CSS_DOWNLOAD_URL=http://closure-stylesheets.googlecode.com/files/closure-stylesheets-20111230.jar

WGET="`which wget`"
CURL="`which curl`"

function minify::download() {
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

    if [ ! -f "${CSS_COMPILER_JAR}" ]; then
        if [ -n "$WGET" ]; then
            $WGET --no-verbose "${CSS_DOWNLOAD_URL}"
        else
            $CURL "${CSS_DOWNLOAD_URL}" > ./closure-stylesheets-20111230.jar
        fi
        mv closure-stylesheets-20111230.jar "${CSS_COMPILER_JAR}"
        rm -rf closure-stylesheets-20111230.jar
    fi
}

function minify::js() {
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

function minify::css() {
    local SRC_PATH
    local OUT_PATH
    SRC_PATH=$1
    OUT_PATH=$2

    if [ -d "${SRC_PATH}" ]; then
        rm -rf "${OUT_PATH}" && touch "${OUT_PATH}" && chmod 0666 "${OUT_PATH}"

        find "${SRC_PATH}" -name "*.css" -print |
         sed 's/.*/ &/' | sort -n |
           xargs java -jar "${CSS_COMPILER_JAR}" \
              --allow-unrecognized-properties \
              --allow-unrecognized-functions \
              --output-file "${OUT_PATH}"
    fi
}

#
# The main function.
#
function main() {
    minify::download
    minify::js "../src" "../min/komito.js"
}

main "$@"
