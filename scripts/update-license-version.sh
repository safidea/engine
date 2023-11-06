#!/bin/bash

# Use '' with -i to edit the file in place without a backup on macOS.
sed -i '' "s/Solumy Engine [0-9]*\.[0-9]*\.[0-9]*/Solumy Engine $1/" LICENSE

# On macOS, use '-v' to adjust the date.
sed -i '' "s/\(Change Date: \).*$/\1$(date -v +4y "+%Y-%m-%d")/" LICENSE
