#!/usr/bin/env bash

DIRS_TO_DELETE=(
  "node_modules"
  "apps/*/node_modules"
  "apps/*/dist"
  "apps/*/.nuxt"
  "apps/*/.output"
  "apps/*/.wrangler"
)

echo "Start cleaning up directories: ${DIRS_TO_DELETE[*]}"

for dir in "${DIRS_TO_DELETE[@]}"
do
  rm -rf $dir && echo "Removed $dir directory."
done

echo ""

DIRS_TO_BASH=($(find ./apps -type f -path "*/devfiles/clean.sh"))

for ba in "${DIRS_TO_BASH[@]}"
do
  if [ -f "$ba" ]; then
    bash $ba && echo "Executed $ba script."
    echo ""
  else
    echo "Script not found: $ba"
  fi
done

echo "Cleanup completed successfully!"
