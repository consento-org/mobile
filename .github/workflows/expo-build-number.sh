#!/bin/bash --noprofile --norc

#
# This script will update the versions in the app.json file.
#
# For publishing with ios we need unique builds which all need a unique semver id. As a build is not
# necessarily equal to an id, and we might want to test a version before publishing it, we specify
# for ios that the version has 3 extra digits that represent the number of commits since the previous
# version number. e.g. 3 commits after 1.0.2 becomes 1.0.2003. This is only computed if a command line
# argument is passed in. Without the argument (for the master branch) we use 000 -> 1.0.2000
#
# https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion
#
# It will also set the versionCode for Android to the number of commits in the branch.
#

VERSION_CODE=`git rev-list --count HEAD`
CURRENT=`npx json -f app.json expo.version`

if [ -z $1 ]; then
  BUILD=0
else
  BUILD=1
  while IFS= read -r COMMIT; do
    COMMIT_VERSION=`git show ${COMMIT}:app.json | npx json "expo.version"`
    if [ $COMMIT_VERSION != $CURRENT ]; then
      break
    fi
    ((BUILD++))
  done < <(git --no-pager log -999 --pretty=format:"%H" app.json)
fi

updateAppJson () {
  echo $1
  npx json -I -f app.json -e "this.$1" > /dev/null 2>&1
}

updateAppJson "expo.ios.buildNumber='${CURRENT}$(printf "%03d\n" $BUILD)'"
updateAppJson "expo.android.versionCode=${VERSION_CODE}"
