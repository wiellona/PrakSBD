const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

const corsOptions = {
  origin: "htttps://os.netlabdte.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/trans.routes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
