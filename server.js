const express = require("express");
const dotenv = require("dotenv");
const productRouter = require("./routes/productRouter");
const userRoutes = require("./routes/userRoutes");
const app = express();
const initDB = require("./db/initDB");
dotenv.config({ path: "./.env" });
const port = process.env.PORT;

app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log("server running port 3000");
});
