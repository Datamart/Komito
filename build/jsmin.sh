#!/bin/bash
#
# Downloads and runs Google closure compiler.
# Guide: https://google.github.io/styleguide/shell.xml
# Link: https://developers.google.com/closure/compiler/
# Source: https://github.com/Datamart/Workspace/blob/master/build/jsmin.sh

readonly CWD=$(cd $(dirname $0); pwd)
readonly LIB="${CWD}/lib"
readonly TMP="${CWD}/tmp"

# TODO(user): Replace to project related path.
readonly JS_COMPILED="${CWD}/../min/komito.js"
readonly JS_SOURCES="${CWD}/../src"

# readonly JS_COMPILER_ZIP="compiler-latest.zip"
readonly JS_COMPILER_ZIP="compiler-20200204.zip"
readonly JS_COMPILER_URL="https://dl.google.com/closure-compiler/${JS_COMPILER_ZIP}"
readonly JS_COMPILER_JAR="${LIB}/compiler.jar"

readonly WGET="$(which wget)"
readonly CURL="$(which curl)"
readonly PYTHON="$(which python)"
readonly JAVA="$(which java)"
readonly UNZIP="$(which unzip)"
# Hot fix for clean installation of OS X El Capitan.
readonly JAVA_OSX="/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home/bin/java"

readonly LICENSE="/* @license http://www.apache.org/licenses/LICENSE-2.0 */"
readonly NEW_LINE=$'\n'


#
# Downloads closure compiler.
#
function download() {
  if [[ ! -f "${JS_COMPILER_JAR}" ]]; then
    echo "Downloading closure compiler:"
    mkdir -p "${LIB}"
    rm -rf "${TMP}" && mkdir "${TMP}" && cd "${TMP}"
    if [[ -n "$WGET" ]]; then
      $WGET "${JS_COMPILER_URL}" -O "${TMP}/${JS_COMPILER_ZIP}"
    else
      $CURL -L "${JS_COMPILER_URL}" > "${TMP}/${JS_COMPILER_ZIP}"
    fi
    echo "Done"

    echo -n "Extracting closure compiler: "
    $UNZIP -q "${TMP}/${JS_COMPILER_ZIP}" -d "${LIB}"
    if [[ ! -f "${JS_COMPILER_JAR}" ]]; then
      mv "${LIB}"/*compiler*.jar "${JS_COMPILER_JAR}"
    fi
    echo "Done"

    cd "${CWD}" && rm -rf "${TMP}"
  fi
}

#
# Runs closure compiler.
#
function run() {
  echo "Running closure compiler:"
  local JAVA_BIN="${JAVA}"
  if [[ -f "${JAVA_OSX}" ]]; then
    JAVA_BIN="${JAVA_OSX}"
  fi

  if [ -d "${JS_SOURCES}" ]; then
    rm -rf "${JS_COMPILED}"
    touch "${JS_COMPILED}" && chmod 0666 "${JS_COMPILED}"

    $PYTHON -c "import sys;sys.argv.pop(0);print(' --js ' + ' --js '.join(sorted(sys.argv, key=str.lower)))" `find "${JS_SOURCES}" -name "*.js" -print` \
      | xargs "${JAVA_BIN}" -jar "${JS_COMPILER_JAR}" \
          --compilation_level ADVANCED_OPTIMIZATIONS \
          --warning_level VERBOSE \
          --charset UTF-8 \
          --use_types_for_optimization \
          --jscomp_warning=lintChecks \
          --js_output_file "${JS_COMPILED}"

    echo "${LICENSE}${NEW_LINE}(function(){" | cat - $JS_COMPILED > /tmp/out && mv /tmp/out $JS_COMPILED
    echo '})();' >> $JS_COMPILED
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
