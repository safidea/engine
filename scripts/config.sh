#!/bin/bash

path="./apps/$1"
if [ ! -z "$1" ] && [ -d $path ]; then
  echo "Config app $1"

  source $path/.env

  export ROOT_PATH=$path
  export APP_NAME=$1
  export DEBUG=config:*

  turbo config
else
  echo "App '$1' does not exist"
fi
