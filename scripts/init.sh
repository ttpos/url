#!/usr/bin/env bash

subdirs=(
  "official-website"
  "user"
  "links"
)

cd apps || { echo "Directory 'apps' does not exist."; exit 1; }

for subdir in "${subdirs[@]}"; do
  echo "Processing directory: $subdir"

  if [ -d "$subdir" ]; then
    cd "$subdir" || { echo "Cannot enter directory '$subdir'."; exit 1; }

    if [ ! -f ".env" ]; then
      echo ".env file not found. Copying from .env.example..."
      cp .env.example .env
      echo ".env file copied."
    else
      echo ".env file already exists."
    fi

    cd ..
  else
    echo "Directory '$subdir' does not exist."
  fi
done

echo "Processing completed successfully!"
