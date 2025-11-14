#!/bin/bash
# Contract tests using Schemathesis
# Usage: ./scripts/contract-tests.sh [base-url]

set -e

BASE_URL=${1:-${PREVIEW_URL:-https://api-preview.go2asia.space}}

echo "Running contract tests against: $BASE_URL"

# Install Schemathesis if not already installed
if ! command -v schemathesis &> /dev/null; then
  echo "Installing Schemathesis..."
  pip install schemathesis
fi

# Run contract tests for all OpenAPI specs
schemathesis run \
  --base-url "$BASE_URL" \
  --checks all \
  --hypothesis-max-examples=20 \
  --show-errors-tracebacks \
  docs/openapi/content.yaml \
  docs/openapi/auth.yaml \
  docs/openapi/token.yaml \
  docs/openapi/referral.yaml

echo "Contract tests completed successfully!"

