#!/bin/bash
set -e

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
  docker compose -f $path/docker-compose.yml up -d
  export FDT_ROOT_PATH=$(echo $path | sed 's/\.\./packages/g')
  export FDT_APP_NAME=$app

  cd packages/app-engine
  echo "Config app ${app}"
  pnpm run config
  case "${mode}" in
    dev)
      echo "Starting app ${app} in dev mode"
      pnpm dev
      ;;
    start)
      echo "Building app ${app}"
      pnpm build
      echo "Starting app ${app}"
      pnpm start
      ;;
    *)
      echo "Invalid mode: ${mode}"
      ;;
  esac
else
  echo "App ${app} does not exist at ${path}"
fi
