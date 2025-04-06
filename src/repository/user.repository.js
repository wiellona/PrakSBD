const db = require("../database/pg.database");
const bcrypt = require("bcrypt");

exports.createUser = async ({ email, password, name }) => {
  try {
    const result = await db.query(
      "INSERT INTO users (email, password, name, balance) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, password, name, 0]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user", error);
  }
};

exports.authenticateUser = async (email, password) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  } catch (error) {
    console.error("Error authenticating user", error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user", error);
  }
};

exports.updateUser = async ({ id, name, email, password }) => {
  try {
    const checkUser = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (checkUser.rows.length === 0) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [name, email, hashedPassword, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user", error);
  }
};

exports.deleteUser = async (id) => {
  try {
    const checkUser = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (checkUser.rows.length === 0) return null;

    const deletedUser = checkUser.rows[0];
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user", error);
  }
};

exports.getUserById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

exports.updateBalance = async (id, amount) => {
  const query =
    "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *";
  const result = await db.query(query, [amount, id]);
  return result.rows[0];
};

exports.decreaseUserBalance = async (id, balance) => {
  try {
    await db.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [
      balance,
      id,
    ]);
  } catch (error) {
    console.error("Error decreasing user balance", error);
    throw error;
  }
};
