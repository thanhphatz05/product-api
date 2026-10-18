
#!/bin/bash
set -e
curl -fsS http://localhost:3000/health
echo "CI TEST PASSED!"
