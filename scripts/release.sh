#! /bin/sh

# Exit on error
set -e

# Check if the git directory is clean
if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]]; then
  echo "Your git directory is unclean"
  exit
fi

current=`json -f package.json version`
read -p "New version number (current is ${current}): " version
export FARGS_VERSION=$version

# Before everything, check if the tests go through
npm run test

# Ask for confirmation
read -p "[All] We'll \`npm publish\` and \`git push\` with \"v$FARGS_VERSION\". Continue (yn)? " -n 1 -r
echo
[[ $REPLY =~ ^[Yy]$ ]] || exit -1

# Build and publish app
# No git-tag-version also disables the commit (See https://github.com/npm/npm/issues/7186)
npm version --no-git-tag-version $FARGS_VERSION
npm run clean
NODE_ENV=production npm run build
cd dist-es5-module/
npm publish
cd ../

# Commit and tag
git add package.json
git commit -m "chore(release): $FARGS_VERSION"
git tag -a "v$FARGS_VERSION" -m "$FARGS_VERSION"

# Generate the ChangeLog
npm run changelog
git add CHANGELOG.md
git commit --amend -m "chore(release): $FARGS_VERSION"

# Re-tag after --amend
git tag -a "v$FARGS_VERSION" -m "$FARGS_VERSION" -f

# Push
git push origin master
git push origin master --tags
