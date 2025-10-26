const express = require("express");
const dotenv = require("dotenv");
const productRouter = require("./routes/productRouter");
const app = express();

dotenv.config({ path: "./.env" });
const port = process.env.PORT;

app.use(express.json());

app.use("/api/products", productRouter);

app.listen(port, () => {
  console.log("server running port 3000");
});
