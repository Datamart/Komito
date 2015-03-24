#!/bin/bash
#
# http://google-styleguide.googlecode.com/svn/trunk/shell.xml

#
# Prints message.
# Arguments:
#   message - The message text to print.
#
function println() {
  printf "%s %0$(expr 80 - ${#1})s\n" "$1" | tr "0" "-"
}

#
# The main function.
#
function main() {
  println "[WEB] Running linter:"
  chmod +x jslint.sh && ./jslint.sh

  println "[WEB] Running compiler:"
  chmod +x jsmin.sh && ./jsmin.sh

  println "[WEB] Done"
}

main "$@"
