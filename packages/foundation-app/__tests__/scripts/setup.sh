#!/bin/bash
set -e

app=$1
path="../utils-test/apps/${app}"
if [ ! -z "${app}" ] && [ -d $path ]; then

  key=$(openssl rand -hex 16)
  test_app="${app}_${key}"
  test_path="../utils-test/data/${test_app}"

  echo "Setup test app ${app} => ${test_app}"
  cp -r $path $test_path

  port=3000
  while netstat -an | grep $port >/dev/null; do
    port=$((port + 1))
  done

  export APP_NAME=$test_app
  export PORT=$port

  playwright test --config=__tests__/apps/${app}/playwright.config.ts

  echo "Teardown app ${test_app}"

  rm -rf "$test_path"
  rm -rf ".next/${test_app}"
  cd "../foundation-common/src/server/apps/"
  grep -v "export \* as ${test_app} from '\./${test_app}'" index.ts > temp.ts && mv temp.ts index.ts
  rm -rf "${test_app}.ts"
else
  echo "App '$1' does not exist"
fi
