#!/bin/bash
# Database migration script
# Usage: ./scripts/db-migrate.sh [service] [environment] [action]

set -e

SERVICE=${1:-content-service}
ENV=${2:-staging}
ACTION=${3:-up}

echo "Running migration: $SERVICE/$ENV/$ACTION"

cd "services/$SERVICE"

if [ "$ACTION" = "generate" ]; then
  pnpm db:migrate:generate
elif [ "$ACTION" = "up" ]; then
  pnpm db:migrate:up
elif [ "$ACTION" = "down" ]; then
  pnpm db:migrate:down
elif [ "$ACTION" = "status" ]; then
  pnpm db:migrate:status
else
  echo "Unknown action: $ACTION"
  exit 1
fi

