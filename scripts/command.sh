#!/bin/bash
set -e

while getopts ":c:" opt; do
  case ${opt} in
    c)
      mode=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

shift $((OPTIND-1))

app=$(jq -r '.name' app/config.json)
mode="${mode:-"start"}"

source app/.env

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

