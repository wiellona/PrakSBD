const db = require("../database/pg.database");

exports.createItem = async (item) => {
  try {
    const checkStore = await db.query("SELECT * FROM stores WHERE id = $1", [
      item.store_id,
    ]);
    if (checkStore.rows.length === 0) {
      throw new Error("Store doesn't exist");
    }

    const result = await db.query(
      "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [item.name, item.price, item.store_id, item.image_url, item.stock]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating item", error);
    throw error;
  }
};

exports.getAllItems = async () => {
  try {
    const stores = await db.query("SELECT * FROM items");
    return stores.rows;
  } catch (error) {
    console.error("Error getting stores", error);
  }
};

exports.getItemById = async (id) => {
  try {
    const stores = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    return stores.rows;
  } catch (error) {
    console.error("Error getting stores", error);
  }
};

exports.getItemsByStoreId = async (storeId) => {
  try {
    const result = await db.query("SELECT * FROM items WHERE store_id = $1", [
      storeId,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Error getting items", error);
    throw error;
  }
};

exports.updateItem = async (id, item) => {
  try {
    const result = await db.query(
      "UPDATE items SET name = $1, price = $2, store_id = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *",
      [item.name, item.price, item.store_id, item.stock, item.image_url, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating item", error);
    throw error;
  }
};
