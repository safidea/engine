#!/bin/bash

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
  rm -rf $test_path
else
  echo "App '$1' does not exist"
fi
