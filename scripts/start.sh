#!/bin/bash

path="./apps/$1"
if [ -d $path ]; then
  echo "Load app $1"

  source $path/.env
  export ROOT_PATH=$path

  turbo start
else
  echo "App '$1' does not exist"
fi
