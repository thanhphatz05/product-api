
// const assert = require("node:assert/strict");

// const BASE_URL = process.env.API_URL || "http://localhost:3000";

// async function runTests() {
//   console.log("=== START PRODUCT API TEST ===");

//   // TEST 1: Healthcheck
//   console.log("TEST 1: Check API health");

//   const healthRes = await fetch(`${BASE_URL}/health`);
//   assert.equal(healthRes.status, 200);

//   const health = await healthRes.json();
//   assert.equal(health.status, "ok");

//   console.log("PASS: API healthy");

//   // Tao PID rieng de khong trung P001
//   const pid = `CI-${Date.now()}`;

//   // TEST 2: CREATE
//   console.log("TEST 2: Create product");

//   const createRes = await fetch(`${BASE_URL}/api/products`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       pid: pid,
//       pname: "CI Test Product",
//       price: 10000,
//       quantity: 5
//     })
//   });

//   assert.equal(createRes.status, 201);
//   console.log("PASS: Create product");

//   // TEST 3: READ
//   console.log("TEST 3: Read product");

//   const readRes = await fetch(
//     `${BASE_URL}/api/products/${pid}`
//   );

//   assert.equal(readRes.status, 200);

//   const product = await readRes.json();
//   assert.equal(product.pid, pid);

//   console.log("PASS: Read product");

//   // TEST 4: UPDATE
//   console.log("TEST 4: Update product");

//   const updateRes = await fetch(
//     `${BASE_URL}/api/products/${pid}`,
//     {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         pname: "Updated CI Product",
//         price: 20000,
//         quantity: 10
//       })
//     }
//   );

//   assert.equal(updateRes.status, 200);

//   const updated = await updateRes.json();
//   assert.equal(updated.price, 20000);

//   console.log("PASS: Update product");

//   // TEST 5: DELETE
//   console.log("TEST 5: Delete product");

//   const deleteRes = await fetch(
//     `${BASE_URL}/api/products/${pid}`,
//     {
//       method: "DELETE"
//     }
//   );

//   assert.equal(deleteRes.status, 200);

//   console.log("PASS: Delete product");

//   console.log("=== ALL TESTS PASSED ===");
// }

// runTests().catch((error) => {
//   console.error("TEST FAILED:", error);
//   process.exitCode = 1;
// });

const assert = require("node:assert/strict");

const BASE = "http://localhost:3000";
const pid = `CI-${Date.now()}`;

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  return {
    status: res.status,
    data: await res.json()
  };
}

async function test() {
  let created = false;

  try {
    // TEST 1: HEALTHCHECK
    let r = await api("GET", "/health");
    assert.equal(r.status, 200);
    assert.equal(r.data.mongodb, "connected");
    console.log("PASS 1: HEALTHCHECK");

    // TEST 2: CREATE
    r = await api("POST", "/api/products", {
      pid,
      pname: "CI Test Laptop",
      price: 100000,
      quantity: 10
    });
    created = r.status === 201;
    assert.equal(r.status, 201);
    console.log("PASS 2: CREATE");

    // TEST 3: READ ALL
    r = await api("GET", "/api/products");
    assert.equal(r.status, 200);
    assert.ok(r.data.some(p => p.pid === pid));
    console.log("PASS 3: READ ALL");

    // TEST 4: READ BY ID
    r = await api("GET", `/api/products/${pid}`);
    assert.equal(r.status, 200);
    assert.equal(r.data.pid, pid);
    console.log("PASS 4: READ BY ID");

    // TEST 5: UPDATE
    r = await api("PUT", `/api/products/${pid}`, {
      price: 200000,
      quantity: 20
    });
    assert.equal(r.status, 200);
    assert.equal(r.data.price, 200000);
    assert.equal(r.data.quantity, 20);
    console.log("PASS 5: UPDATE");

    // TEST 6: DELETE
    r = await api("DELETE", `/api/products/${pid}`);
    assert.equal(r.status, 200);
    created = false;
    console.log("PASS 6: DELETE");

    // TEST 7: VERIFY DELETE
    r = await api("GET", `/api/products/${pid}`);
    assert.equal(r.status, 404);
    console.log("PASS 7: VERIFY DELETE");

    console.log("=== ALL CRUD TESTS PASSED ===");
  } finally {
    if (created) {
      await api("DELETE", `/api/products/${pid}`)
        .catch(() => {});
    }
  }
}

test().catch(err => {
  console.error("TEST FAILED:", err.message);
  process.exitCode = 1;
});
