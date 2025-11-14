#!/bin/bash
# Пример contract теста с Schemathesis
# Разместить в: scripts/contract-tests.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация
BASE_URL="${API_URL:-https://api.go2asia.space}"
OPENAPI_DIR="docs/openapi"
SCHEMATHESIS_OPTS="--checks all --hypothesis-max-examples=20"

echo -e "${YELLOW}Running contract tests with Schemathesis...${NC}"
echo "Base URL: $BASE_URL"
echo ""

# Проверка наличия Schemathesis
if ! command -v schemathesis &> /dev/null; then
    echo -e "${RED}Schemathesis not found. Installing...${NC}"
    pip install schemathesis
fi

# Функция для запуска тестов
run_contract_tests() {
    local spec_file=$1
    local service_name=$2
    
    echo -e "${YELLOW}Testing $service_name...${NC}"
    
    if schemathesis run \
        --base-url "$BASE_URL" \
        $SCHEMATHESIS_OPTS \
        "$spec_file"; then
        echo -e "${GREEN}✓ $service_name tests passed${NC}"
        return 0
    else
        echo -e "${RED}✗ $service_name tests failed${NC}"
        return 1
    fi
}

# Запуск тестов для каждого сервиса
FAILED=0

if [ -f "$OPENAPI_DIR/content.yaml" ]; then
    run_contract_tests "$OPENAPI_DIR/content.yaml" "Content Service" || FAILED=1
fi

if [ -f "$OPENAPI_DIR/auth.yaml" ]; then
    run_contract_tests "$OPENAPI_DIR/auth.yaml" "Auth Service" || FAILED=1
fi

if [ -f "$OPENAPI_DIR/token.yaml" ]; then
    run_contract_tests "$OPENAPI_DIR/token.yaml" "Token Service" || FAILED=1
fi

if [ -f "$OPENAPI_DIR/referral.yaml" ]; then
    run_contract_tests "$OPENAPI_DIR/referral.yaml" "Referral Service" || FAILED=1
fi

# Итоговый результат
echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All contract tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some contract tests failed${NC}"
    exit 1
fi


