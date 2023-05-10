#!/bin/bash

while getopts ":p:m:" opt; do
  case ${opt} in
    p)
      path=$OPTARG
      ;;
    m)
      mode=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

shift $((OPTIND-1))

app=$1
path="${path:-"./apps"}/${app}"
mode="${mode:-"start"}"

if [ ! -z "${app}" ] && [ -d $path ]; then
  source $path/.env

  export ROOT_PATH=$(echo $path | sed 's/\.\./packages/g')
  export APP_NAME=$app

  case "${mode}" in
    config)
      echo "Config app ${app}"
      export DEBUG=config:*
      turbo config --filter=foundation-config
      ;;
    dev)
      echo "Starting app ${app} in dev mode"
      export DEBUG=config:*,startup:*
      turbo dev --filter=foundation-app
      ;;
    start)
      echo "Starting app ${app}"
      turbo start --filter=foundation-app
      ;;
    *)
      echo "Invalid mode: ${mode}"
      ;;
  esac
else
  echo "App ${app} does not exist at ${path}"
fi
