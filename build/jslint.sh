#!/usr/bin/env bash

# http://code.google.com/p/closure-linter/downloads/list
# https://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz

DOWNLOAD_URL=http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
CUSTOM_TAGS="version,example,static,namespace,requires,event"
WGET="`which wget`"
CURL="`which curl`"
PYTHONPATH=$(python -c "import sys; print sys.path[-1]")

function linter::download() {
    if [ ! -f "${PYTHONPATH}/closure_linter/fixjsstyle.py" ]; then
        if [ "x`which gjslint`" == "x" ]; then
            rm -rf tmp && mkdir tmp && cd tmp

            if [ -n "$WGET" ]; then
                $WGET --no-verbose "${DOWNLOAD_URL}"
            else
                $CURL "${DOWNLOAD_URL}" > ./closure_linter-latest.tar.gz
            fi
            tar -xvzf closure_linter-*.tar.gz -C ./
            cd closure_linter*
            python setup.py build && sudo python setup.py install
            cd ../

            rm -rf tmp
        fi
    fi
}

function linter::run() {
    local SRC_PATH
    SRC_PATH="$1"

    if [ -d "${SRC_PATH}" ]; then
        if [ -n "`which fixjsstyle`" ]; then
            fixjsstyle \
                --strict \
                --custom_jsdoc_tags "${CUSTOM_TAGS}" \
                -x 'externs.js' \
                -r "${SRC_PATH}"
        else
            python "${PYTHONPATH}/closure_linter/fixjsstyle.py" \
                --strict \
                --custom_jsdoc_tags "${CUSTOM_TAGS}" \
                -x 'externs.js' \
                -r "${SRC_PATH}"
        fi


        if [ -n "`which gjslint`" ]; then
            gjslint \
                --strict \
                --custom_jsdoc_tags "${CUSTOM_TAGS}" \
                -x 'externs.js' \
                -r "${SRC_PATH}"
        else
            python "${PYTHONPATH}/closure_linter/gjslint.py" \
                --strict \
                --custom_jsdoc_tags "${CUSTOM_TAGS}" \
                -x 'externs.js' \
                -r "${SRC_PATH}"
        fi
    fi
}

#
# The main function.
#
function main() {
    linter::download
    linter::run "../src"
}

main "$@"
