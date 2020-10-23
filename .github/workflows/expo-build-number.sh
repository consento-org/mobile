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

echo "> fetching"
git fetch

echo "---"
HEAD_REF=`git rev-parse --abbrev-ref HEAD`
if [[ "$HEAD_REF" == 'HEAD' ]]; then
  HEAD_REF="origin/${GITHUB_HEAD_REF}"
else
  HEAD_REF="origin/${HEAD_REF}"
fi
echo "> HEAD_REF=${HEAD_REF}"
VERSION_CODE=`git rev-list --count ${HEAD_REF}`
echo "> VERSION_CODE=${VERSION_CODE}"
CURRENT=`npx json -f app.config.json expo.version`
echo "> CURRENT=${CURRENT}"

if [ "${GITHUB_HEAD_REF}" == "main" ]; then
  BUILD=0
else
  BUILD=1
  while IFS= read -r COMMIT; do
    echo "> Getting version for commit: ${COMMIT}"
    COMMIT_VERSION=`git show ${COMMIT}:app.config.json | npx json "expo.version"`
    echo "> COMMIT_VERSION=${COMMIT_VERSION}"
    if [ $COMMIT_VERSION != $CURRENT ]; then
      break
    fi
    ((BUILD++))
  done < <(git --no-pager log -999 --pretty=format:"%H" app.json)
fi

echo "::set-output name=buildNumber::${CURRENT}$(printf "%03d\n" $BUILD)"
echo "::set-output name=versionCode::${VERSION_CODE}"
