const crypto = require("crypto");

const app_id = BigInt(
  parseInt(crypto.randomBytes(20).toString("hex"), 16)
).toString(); // random value.

console.log(app_id);
