#!/bin/bash
set -e

echo "=== PRODUCT CI TEST ==="
curl -fsS http://localhost:3000/health
echo
curl -fsS http://localhost:3000/api/products > /dev/null
echo "CI TEST PASSED!"