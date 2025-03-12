const db = require("../database/pg.database");

exports.getAllStores = async () => {
  try {
    const stores = await db.query("SELECT * FROM stores");
    return stores.rows;
  } catch (error) {
    console.error("Error getting stores", error);
  }
};

exports.createStore = async (store) => {
  try {
    const result = await db.query(
      "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
      [store.name, store.address]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating store", error);
  }
};

exports.getStoresByID = async (id) => {
  try {
    const stores = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
    return stores.rows;
  } catch (error) {
    console.error("Error getting stores", error);
  }
};

exports.updateStore = async (id, name, address) => {
  try {
    const checkStore = await db.query("SELECT * FROM stores WHERE id = $1", [
      id,
    ]);

    if (checkStore.rows.length === 0) {
      return null;
    }

    const result = await db.query(
      "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
      [name, address, id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error updating store", error);
    return null;
  }
};

exports.deleteStore = async (id) => {
  try {
    const checkStore = await db.query("SELECT * FROM stores WHERE id = $1", [
      id,
    ]);

    if (checkStore.rows.length === 0) {
      return null;
    }

    await db.query("DELETE FROM stores WHERE id = $1", [id]);
  } catch (error) {
    console.error("Error getting stores", error);
  }
};
