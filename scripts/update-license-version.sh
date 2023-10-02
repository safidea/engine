sed -i "s/Solumy Engine [0-9]*\.[0-9]*\.[0-9]*/Solumy Engine $1/" LICENSE
sed -i "s/\(Change Date: \).*$/\1$(date -d "+4 years" "+%Y-%m-%d")/" LICENSE
