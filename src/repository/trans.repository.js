const db = require("../database/pg.database");

exports.createTransaction = async (user_id, item_id, quantity, total) => {
  try {
    const query = `
      INSERT INTO transactions (user_id, item_id, quantity, total, status, created_at) 
      VALUES ($1, $2, $3, $4, 'pending', NOW()) 
      RETURNING *`;
    const result = await db.query(query, [user_id, item_id, quantity, total]);

    if (result.rows.length === 0) {
      throw new Error("Transaction insertion failed.");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error creating transaction:", error.message);
    throw error;
  }
};

exports.getTransactionById = async (id) => {
  try {
    const transaction = await db.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );
    return transaction.rows[0];
  } catch (error) {
    console.error("Error getting transaction:", error);
  }
};

exports.updateTransactionStatus = async (id, status) => {
  try {
    const query = `
      UPDATE transactions SET status = $1, created_at = NOW() WHERE id = $2 RETURNING *`;
    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      throw new Error("Transaction update failed.");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error updating transaction status:", error.message);
    throw error;
  }
};

exports.deleteTransaction = async (id) => {
  try {
    const deletedTransaction = await db.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING *",
      [id]
    );
    return deletedTransaction.rows[0];
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
};

exports.getAllTransactionsWithDetail = async () => {
  try {
    const query = `
      SELECT 
        t.*, 
        u.id AS user_id, u.name AS user_name, u.email, u.password, u.balance, u.created_at AS user_created_at,
        i.id AS item_id, i.name AS item_name, i.price, i.store_id, i.image_url, i.stock, i.created_at AS item_created_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      JOIN items i ON t.item_id = i.id
      ORDER BY t.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error getting transactions with details:", error.message);
    throw error;
  }
};
