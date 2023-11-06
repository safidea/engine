#!/bin/bash

VERSION=$1
LICENSE_FILE="LICENSE"

# Detect the platform (Linux or macOS)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    SED_CMD="sed -i"
    DATE_CMD="date -d '+4 years' '+%Y-%m-%d'"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # On macOS, sed -i requires an explicit argument for in-place editing
    # and date uses -v instead of -d
    SED_CMD="sed -i ''"
    DATE_CMD="date -v +4y '+%Y-%m-%d'"
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

# Update the version number
$SED_CMD "s/Solumy Engine [0-9]*\.[0-9]*\.[0-9]*/Solumy Engine $VERSION/" $LICENSE_FILE

# Update the change date
CHANGE_DATE=$($DATE_CMD)
$SED_CMD "s/\(Change Date: \).*$/\1$CHANGE_DATE/" $LICENSE_FILE
