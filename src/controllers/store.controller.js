const storeRepository = require("../repository/store.repository");
const baseRespones = require("../util/baseResponse.util");

exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    baseRespones(res, true, 200, "Stores retrieved successfully", stores);
  } catch (error) {
    baseRespones(res, false, 500, "Error getting stores", null);
  }
};

exports.createStore = async (req, res) => {
  if (!req.body.name || !req.body.address) {
    return baseRespones(res, false, 400, "Name and address are required", null);
  }
  try {
    const store = await storeRepository.createStore(req.body);
    baseRespones(res, true, 201, "Store created successfully", store);
  } catch (error) {
    baseRespones(res, false, 500, error.message || "Server error", null);
  }
};

exports.getStoresByID = async (req, res) => {
  try {
    const store = await storeRepository.getStoresByID(req.params.id);
    if (store.length === 0) {
      return baseRespones(res, false, 404, "Store not found", null);
    }
    baseRespones(res, true, 200, "Store found", store);
  } catch (error) {
    baseRespones(res, false, 500, "Error getting store", null);
  }
};

exports.updateStore = async (req, res) => {
  const { id, name, address } = req.body;

  if (!id || !name || !address) {
    return baseRespones(
      res,
      false,
      400,
      "ID, Name, and Address are required",
      null
    );
  }

  try {
    const updatedStore = await storeRepository.updateStore(id, name, address);

    if (!updatedStore) {
      return baseRespones(res, false, 404, "Store not found", null);
    }

    baseRespones(res, true, 200, "Store updated successfully", updatedStore);
  } catch (error) {
    baseRespones(res, false, 500, error.message || "Server error", null);
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await storeRepository.getStoresByID(req.params.id);
    if (store.length === 0) {
      return baseRespones(res, false, 404, "Store not found", null);
    }

    await storeRepository.deleteStore(req.params.id);
    baseRespones(res, true, 200, "Store deleted", store);
  } catch (error) {
    baseRespones(res, false, 500, "Error getting store", null);
  }
};
