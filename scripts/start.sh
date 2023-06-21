#!/bin/bash
set -e

# Get params
while getopts ":m:f:d:" opt; do
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
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done
shift $((OPTIND-1))
mode="${mode:-"prod"}"
folder="${folder:-"app"}"
database_provider="${database_provider:-"prisma"}"

# Get app folder path
script_dir="$(cd "$(dirname "$0")" && pwd -P)"
app_path="$script_dir/$folder"

# Set env variables
source $app_path/.env
export APP_PATH=$app_path
export DATABASE_PROVIDER=$database_provider

# Get app name
app_name=$(jq -r '.name' $app_path/config.json)

# Start app
cd packages/app-engine
echo "\nConfig app ${app_name}"
pnpm run config
case "${mode}" in
  dev)
    echo "\nStarting app ${app_name} in development mode"
    pnpm dev
    ;;
  prod)
    echo "\nBuilding app ${app_name}"
    pnpm build
    echo "\nStarting app ${app_name} in production mode"
    pnpm start
    ;;
  *)
    echo "\nInvalid mode: ${mode}"
    ;;
esac

