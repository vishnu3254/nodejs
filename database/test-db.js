const pool = require("./db.config");

async function testDB() {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    console.log("Users from DB:", result.rows);
  } catch (err) {
    console.error("DB error:", err.message);
  } finally {
    await pool.end();
  }
}

testDB();