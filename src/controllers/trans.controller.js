const transRepository = require("../repository/trans.repository");
const itemRepository = require("../repository/item.repository");
const userRepository = require("../repository/user.repository");
const baseResponse = require("../util/baseResponse.util");

exports.createTransaction = async (req, res) => {
  try {
    const { item_id, user_id, quantity } = req.body;

    if (!item_id || !user_id) {
      return baseResponse(
        res,
        false,
        400,
        "Item ID and User ID are required",
        null
      );
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return baseResponse(
        res,
        false,
        400,
        "Quantity must be a positive integer",
        null
      );
    }

    // Periksa apakah item tersedia
    const item = await itemRepository.getItemById(item_id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    if (item.stock < quantity) {
      return baseResponse(res, false, 400, "Insufficient item stock", null);
    }

    // Periksa apakah harga item valid
    if (!item.price || isNaN(Number(item.price))) {
      return baseResponse(res, false, 400, "Invalid item price", null);
    }

    // Periksa apakah user ada
    const user = await userRepository.getUserById(user_id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    // Hitung total harga transaksi
    const total = item.price * quantity;

    // Simpan transaksi
    const transaction = await transRepository.createTransaction(
      user_id,
      item_id,
      quantity,
      total
    );

    return baseResponse(res, true, 201, "Transaction created", transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return baseResponse(
      res,
      false,
      500,
      `Transaction failed: ${error.message}`,
      null
    );
  }
};

exports.payTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await transRepository.getTransactionById(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }

    const item = await itemRepository.getItemById(transaction.item_id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }

    const user = await userRepository.getUserById(transaction.user_id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    if (user.balance < transaction.total) {
      return baseResponse(res, false, 400, "Failed to pay", null); // Insufficient balance
    }

    if (transaction.status === "paid") {
      return baseResponse(res, false, 400, "Transaction already paid", null);
    }

    await transRepository.updateTransactionStatus(id, "paid");
    await itemRepository.decreaseItemStock(item.id, transaction.quantity);
    await userRepository.decreaseUserBalance(user.id, transaction.total);

    const updatedTransaction = await transRepository.getTransactionById(id);

    return baseResponse(
      res,
      true,
      200,
      "Payment successful",
      updatedTransaction
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return baseResponse(
      res,
      false,
      500,
      `Payment failed: ${error.message}`,
      null
    );
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await transRepository.deleteTransaction(id);
    if (!deletedTransaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }
    baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
  } catch (error) {
    baseResponse(res, false, 500, "Error deleting transaction", null);
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const rows = await transRepository.getAllTransactionsWithDetail();

    const transactions = rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      item_id: row.item_id,
      quantity: row.quantity,
      total: row.total,
      status: row.status,
      created_at: row.created_at,
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.email,
        password: row.password,
        balance: row.balance,
        created_at: row.user_created_at,
      },
      item: {
        id: row.item_id,
        name: row.item_name,
        price: row.price,
        store_id: row.store_id,
        image_url: row.image_url,
        stock: row.stock,
        created_at: row.item_created_at,
      },
    }));

    return baseResponse(res, true, 200, "Transactions found", transactions);
  } catch (error) {
    console.error("Error getting transactions:", error);
    return baseResponse(res, false, 500, "Failed to get transactions", null);
  }
};
