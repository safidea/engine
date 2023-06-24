#!/bin/bash
set -e

# Get params
while getopts ":m:f:d:p:" opt; do
  case ${opt} in
    m)
      mode=$OPTARG
      ;;
    f) 
      folder=$OPTARG
      ;;
    d) 
      database_provider=$OPTARG
      ;;
    p)
      port=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done
shift $((OPTIND-1))
mode="${mode:-"prod"}"
database_provider="${database_provider:-"prisma"}"
port="${port:-"3000"}"

if [[ -z "$folder" ]]; then
  echo "App folder is not defined."
  exit 1
fi

# Get app folder path
app_path=$(readlink -f "$folder")

# Set env variables
export PORT=$port
source $app_path/.env
export APP_PATH=$app_path
export DATABASE_PROVIDER=$database_provider

# Get app name
app_name=$(jq -r '.name' $app_path/config.json)

# Go to app engine package
cd $(dirname "$0")/../packages/app-engine

# Start app
echo "Config app ${app_name}"
pnpm run config
case "${mode}" in
  dev)
    echo "Starting app ${app_name} on port ${port} in development mode"
    pnpm dev -p $port
    ;;
  prod)
    echo "Starting app ${app_name} on port ${port} in production mode"
    pnpm start -p $port
    ;;
  *)
    echo "Invalid mode: ${mode}"
    ;;
esac

