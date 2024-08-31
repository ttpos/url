#!/bin/bash

# Set the default PAGES_PROJECT if not already set
PAGES_PROJECT=${PAGES_PROJECT:-a-app-static}

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
OUTPUT_DIR="$SCRIPT_DIR/../.output"
PUBLIC_DIR="$OUTPUT_DIR/public"
EMPTY_DIR="$OUTPUT_DIR/empty"

mkdir -p "$EMPTY_DIR"

# Deploy to worker
npx wrangler deploy

# Create _headers file to support static CORS
HEADERS_FILE="$PUBLIC_DIR/_headers"
echo "/*\n  Access-Control-Allow-Origin: *\n" > "$HEADERS_FILE"

# Deploy static files to pages
npx wrangler pages deploy --project-name "$PAGES_PROJECT" "$PUBLIC_DIR"
