#!/bin/bash

VERSION=$1
LICENSE_FILE="LICENSE"

# Update the version number
perl -pi -e "s/La Tech Force Engine [0-9]*\.[0-9]*\.[0-9]*/La Tech Force Engine $VERSION/" "$LICENSE_FILE"

# Determine and update the change date
CHANGE_DATE=$(date '+%Y-%m-%d' -d '+4 years' 2>/dev/null) || CHANGE_DATE=$(date -v +4y '+%Y-%m-%d' 2>/dev/null)

if [ -z "$CHANGE_DATE" ]; then
  echo "Failed to calculate the change date."
  exit 1
fi

perl -pi -e "s/(Change Date: ).*/\${1}$CHANGE_DATE/" "$LICENSE_FILE"