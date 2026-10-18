
const assert = require("node:assert/strict");

const BASE_URL = process.env.API_URL || "http://localhost:3000";

async function runTests() {
  console.log("=== START PRODUCT API TEST ===");

  // TEST 1: Healthcheck
  console.log("TEST 1: Check API health");

  const healthRes = await fetch(`${BASE_URL}/health`);
  assert.equal(healthRes.status, 200);

  const health = await healthRes.json();
  assert.equal(health.status, "ok");

  console.log("PASS: API healthy");

  // Tao PID rieng de khong trung P001
  const pid = `CI-${Date.now()}`;

  // TEST 2: CREATE
  console.log("TEST 2: Create product");

  const createRes = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pid: pid,
      pname: "CI Test Product",
      price: 10000,
      quantity: 5
    })
  });

  assert.equal(createRes.status, 201);
  console.log("PASS: Create product");

  // TEST 3: READ
  console.log("TEST 3: Read product");

  const readRes = await fetch(
    `${BASE_URL}/api/products/${pid}`
  );

  assert.equal(readRes.status, 200);

  const product = await readRes.json();
  assert.equal(product.pid, pid);

  console.log("PASS: Read product");

  // TEST 4: UPDATE
  console.log("TEST 4: Update product");

  const updateRes = await fetch(
    `${BASE_URL}/api/products/${pid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pname: "Updated CI Product",
        price: 20000,
        quantity: 10
      })
    }
  );

  assert.equal(updateRes.status, 200);

  const updated = await updateRes.json();
  assert.equal(updated.price, 20000);

  console.log("PASS: Update product");

  // TEST 5: DELETE
  console.log("TEST 5: Delete product");

  const deleteRes = await fetch(
    `${BASE_URL}/api/products/${pid}`,
    {
      method: "DELETE"
    }
  );

  assert.equal(deleteRes.status, 200);

  console.log("PASS: Delete product");

  console.log("=== ALL TESTS PASSED ===");
}

runTests().catch((error) => {
  console.error("TEST FAILED:", error);
  process.exitCode = 1;
});
