#!/bin/bash
set -e 
curl -fsS http://localhost:3000/health
curl -fsS http://localhost:3000/api/products > /dev/null
echo "ALL CI TEST PASSED"