#!/bin/bash
#
# Guide: https://google.github.io/styleguide/shell.xml

readonly CWD=$(cd $(dirname $0); pwd)
readonly USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0"
readonly HTTP_REFERER="https://wordpress.org/plugins/komito-analytics/"
readonly PLUGIN_FILE="komito-analytics.zip"
readonly PLUGIN_URL="https://downloads.wordpress.org/plugin/${PLUGIN_FILE}"

#
# Prints message.
# Arguments:
#   message - The message text to print.
#
function println() {
  printf "%s %0$(expr 80 - ${#1})s\n" "$1" | tr "0" "-"
}

#
# Downloads WordPress plugin.
#
function download() {
  curl --user-agent "${USER_AGENT}" \
       --referer "${HTTP_REFERER}" \
       --cookie "wporg_locale=en_US" \
       "${PLUGIN_URL}" > ${PLUGIN_FILE}
  rm -rf ${PLUGIN_FILE}
}

#
# The main function.
#
function main() {
  println "[BUILD] Running linter:"
  chmod +x "${CWD}/jslint.sh" && "${CWD}/jslint.sh"

  println "[BUILD] Running compiler:"
  chmod +x "${CWD}/jsmin.sh" && "${CWD}/jsmin.sh"

  println "[BUILD] Downloading WordPress plugin:"
  download

  println "[BUILD] Done"
}

main "$@"
