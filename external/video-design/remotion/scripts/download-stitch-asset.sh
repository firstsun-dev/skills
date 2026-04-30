#!/bin/bash

# Download Stitch screen asset with proper handling of Google Cloud Storage URLs
# Usage: ./download-stitch-asset.sh "https://storage.googleapis.com/..." "output-path.png"

set -e

show_help() {
  echo "Usage: $0 <download_url> <output_path>"
  echo "Usage: $0 -h | --help"
  echo ""
  echo "Download Stitch screen asset with proper handling of Google Cloud Storage URLs."
  echo ""
  echo "Example: $0 'https://storage.googleapis.com/stitch/screenshot.png' 'assets/screen.png'"
}

if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
  show_help
  exit 0
fi

if [ $# -ne 2 ]; then
  show_help
  exit 1
fi

DOWNLOAD_URL="$1"
OUTPUT_PATH="$2"

# Create directory if it doesn't exist
OUTPUT_DIR=$(dirname "$OUTPUT_PATH")
mkdir -p "$OUTPUT_DIR"

echo "Downloading from: $DOWNLOAD_URL"
echo "Saving to: $OUTPUT_PATH"

# Use curl with follow redirects and authentication handling
curl -L -o "$OUTPUT_PATH" "$DOWNLOAD_URL"

if [ $? -eq 0 ]; then
  echo "✓ Successfully downloaded to $OUTPUT_PATH"
  
  # Display file size for verification
  if command -v stat &> /dev/null; then
    FILE_SIZE=$(stat -f%z "$OUTPUT_PATH" 2>/dev/null || stat -c%s "$OUTPUT_PATH" 2>/dev/null)
    echo "  File size: $FILE_SIZE bytes"
  fi
else
  echo "✗ Download failed"
  exit 1
fi
