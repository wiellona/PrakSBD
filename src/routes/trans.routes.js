const express = require("express");
const router = express.Router();
const transController = require("../controllers/trans.controller");

router.post("/create", transController.createTransaction);
router.post("/pay/:id", transController.payTransaction);
router.delete("/:id", transController.deleteTransaction);
router.get("/", transController.getAllTransactions);

module.exports = router;
