const itemRepository = require("../repository/item.repository");
const baseResponses = require("../util/baseResponse.util");
const cloudinary = require("cloudinary").v2;
const db = require("../database/pg.database");

exports.createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;
    if (!name || !price || !store_id || !stock || !req.file) {
      return baseResponses(res, false, 400, "All fields are required", null);
    }

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) {
          return baseResponses(
            res,
            false,
            500,
            "Cloudinary upload error",
            null
          );
        }

        const imageUrl = result.secure_url;

        const storeCheck = await db.query(
          "SELECT * FROM stores WHERE id = $1",
          [store_id]
        );
        if (storeCheck.rows.length === 0) {
          return baseResponses(res, false, 404, "Store doesn't exist", null);
        }

        const item = await itemRepository.createItem({
          name,
          price,
          store_id,
          stock,
          image_url: imageUrl,
        });

        return baseResponses(res, true, 201, "Item created successfully", item);
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    baseResponses(res, false, 500, error.message || "Server error", null);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    baseResponses(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    baseResponses(res, false, 500, "Error getting items", null);
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    if (!item || item.length === 0) {
      return baseResponses(res, false, 404, "Item not found", null);
    }
    baseResponses(res, true, 200, "Item found", item);
  } catch (error) {
    baseResponses(res, false, 500, error.message || "Server error", null);
  }
};

exports.getItemsByStoreId = async (req, res) => {
  const storeId = req.params.store_id;
  try {
    const storeCheck = await db.query("SELECT * FROM stores WHERE id = $1", [
      storeId,
    ]);

    if (storeCheck.rows.length === 0) {
      return baseResponses(res, false, 404, "Store doesn't exist", null);
    }

    const items = await itemRepository.getItemsByStoreId(storeId);

    baseResponses(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    baseResponses(res, false, 500, error.message || "Server error", null);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, name, price, store_id, stock } = req.body;

    // Periksa apakah item ada
    const itemCheck = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    if (!itemCheck || itemCheck.rows.length === 0) {
      return baseResponses(res, false, 404, "Item not found", null);
    }

    // Periksa apakah store_id valid
    const storeCheck = await db.query("SELECT * FROM stores WHERE id = $1", [
      store_id,
    ]);
    if (!storeCheck || storeCheck.rows.length === 0) {
      return baseResponses(res, false, 404, "Store doesn't exist", null);
    }

    let imageUrl = itemCheck.rows[0].image_url; // Gunakan gambar lama sebagai default

    // Jika ada file baru, upload ke Cloudinary
    if (req.file) {
      // Hapus gambar lama dari Cloudinary jika ada
      if (imageUrl) {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Ambil public_id dari URL
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload gambar baru
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    // Update item di database
    const updatedItem = await itemRepository.updateItem(id, {
      name,
      price,
      store_id,
      stock,
      image_url: imageUrl,
    });

    if (!updatedItem)
      return baseResponses(res, false, 404, "Item not found", null);

    baseResponses(res, true, 200, "Item updated successfully", updatedItem);
  } catch (error) {
    console.error(error); // Untuk debugging
    baseResponses(res, false, 500, error.message || "Server error", null);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const itemCheck = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    if (!itemCheck || itemCheck.rows.length === 0) {
      return baseResponses(res, false, 404, "Item not found", null);
    }

    const deletedItem = itemCheck.rows[0];

    const imageUrl = deletedItem.image_url;

    if (imageUrl) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await db.query("DELETE FROM items WHERE id = $1", [id]);

    baseResponses(res, true, 200, "Item deleted", deletedItem);
  } catch (error) {
    console.error(error);
    baseResponses(res, false, 500, error.message || "Server error", null);
  }
};
