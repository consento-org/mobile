#!/bin/bash --no-profile --norc

#
# This script will update the versions in the app.json file.
#
# For publishing files in testflight we need the "next"-branch to set the ios buildnumber to the
# <version-number>d<number> where the number is from 0-255. This script looks for the commits since
# the last version number to calculate this number. In the "master"-branch it will just use the
# buildNumber.
#
# https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/plist/info/CFBundleVersion
#
# It will also set the versionCode for Android to the number of commits in the branch.
#

VERSION_CODE=`git rev-list --count HEAD`
CURRENT=`npx json -f app.json expo.version`

if [ -z $1 ]; then
  BUILD_NUMBER="${CURRENT}"
else
  BUILD=1
  while IFS= read -r COMMIT; do
    COMMIT_VERSION=`git show ${COMMIT}:app.json | npx json "expo.version"`
    if [ $COMMIT_VERSION != $CURRENT ]; then
      break
    fi
    ((BUILD++))
  done < <(git --no-pager log -254 --pretty=format:"%H" app.json)
  BUILD_NUMBER="${CURRENT}${1}${BUILD}"
fi

updateAppJson () {
  echo $1
  npx json -I -f app.json -e "this.$1" > /dev/null 2>&1
}

updateAppJson "expo.ios.buildNumber='${BUILD_NUMBER}'"
updateAppJson "expo.android.versionCode=${VERSION_CODE}"
