#!/usr/bin/env bash
##
# Clean development files from release branch
##
DIR_ROOT=${DIR_ROOT:-$(cd "$(dirname "$0")/../../" && pwd)}

rm "${DIR_ROOT}/.babelrc"
rm "${DIR_ROOT}/.eslintrc.js"
rm "${DIR_ROOT}/bin/tequila.mjs"
rm -fr "${DIR_ROOT}/doc/"
rm -fr "${DIR_ROOT}/node_modules/"
rm -fr "${DIR_ROOT}/package-lock.json"
rm -fr "${DIR_ROOT}/test/"
rm -fr "${DIR_ROOT}/tmp/"
rm -fr "${DIR_ROOT}/var/"
