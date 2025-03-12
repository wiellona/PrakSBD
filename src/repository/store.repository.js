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
