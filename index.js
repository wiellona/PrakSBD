const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/store", require("./src/routes/store.route"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
