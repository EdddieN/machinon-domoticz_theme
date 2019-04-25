#!/bin/sh
# 
# License: MIT
# Based on https://gist.github.com/stefanbuck/ce788fee19ab6eb0b4447a85fc99f447

# Parameters
NAME="machinon"
REPOSITORY="EdddieN/machinon-domoticz_theme"
GH_TOKEN="$1"

if [ $# -eq 0 ]
  then
    echo "You need to pass your Github token as parameter"
    echo "$0 githubtoken"
    exit 1
fi

# Check if we are inside git repo
if [ "true" != "$(git rev-parse --is-inside-work-tree 2> /dev/null)" ]
  then
    echo "It must be run in a Git repository.\n"
    exit
fi

# Get release number from theme.json
VERSION=$(grep version theme.json | grep -E -o "([0-9]+\.?)*")
FULLNAME=$NAME-$VERSION

read -p "Create files for release $VERSION?" var

git archive --format=zip --prefix=$NAME/ --output=$FULLNAME.zip HEAD
ls -l $FULLNAME.zip
git archive --format=tar.gz --prefix=$NAME/ --output=$FULLNAME.tar.gz HEAD
ls -l $FULLNAME.tar.gz

read -p "Initialize release on Github?" var

GH_API="https://api.github.com"
GH_UPLOAD="https://uploads.github.com"
GH_REPO="$GH_API/repos/$REPOSITORY"
GH_TAGS="$GH_REPO/releases/tags/$VERSION"
AUTH="Authorization: token $GH_TOKEN"
BODY="{\"tag_name\":\"v$VERSION\",\"name\":\"v$VERSION\",\"draft\":true}"

# Validate token
curl -o /dev/null -sH "$AUTH" $GH_REPO || { echo "Error: Invalid repository, token or network issue!";  exit 1; }

response=$(curl -s -X POST -H "Accept: application/json" --data ''$BODY'' -H "$AUTH" "$GH_REPO/releases")

# Get ID of the asset based on given filename
eval $(echo "$response" | grep -m 1 "id.:" | grep -w id | tr : = | tr -cd '[[:alnum:]]=')
[ "$id" ] || { echo "Error: Failed to get release id for tag: $VERSION"; echo "$response" | awk 'length($0)<100' >&2; exit 1; }

URL=$(echo "$response" | grep -m 1 "html_url" | cut -d"\"" -f4)

# Upload asset
echo "Uploading files... "

# Upload files
GH_ASSET="$GH_UPLOAD/repos/$REPOSITORY/releases/$id/assets?name=$FULLNAME.zip"
curl -o /dev/null -s --data-binary @"$FULLNAME.zip" -H "$AUTH" -H "Content-Type: application/octet-stream" "$GH_ASSET"
GH_ASSET="$GH_UPLOAD/repos/$REPOSITORY/releases/$id/assets?name=$FULLNAME.tar.gz"
curl -o /dev/null -s --data-binary @"$FULLNAME.tar.gz" -H "$AUTH" -H "Content-Type: application/octet-stream" "$GH_ASSET"

rm -f $FULLNAME.zip
rm -f $FULLNAME.tar.gz

echo "Edit and publish the release on Github:"
echo $URL
