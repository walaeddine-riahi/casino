#!/bin/bash

for app in apps/*/ ; do
    if [[ -f "${app}.env.example" ]]; then
    # Create .env file by copying content from .env.example file
    cp "${app}.env.example" "${app}.env"
    echo ".env file created in ${app}"
  else
    echo ".env.example file not found in ${app}"
  fi
done
