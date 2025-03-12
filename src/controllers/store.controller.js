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
