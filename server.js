const express = require("express");
const dotenv = require("dotenv");
const productRouter = require("./routes/productRouter");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
const initDB = require("./db/initDB");
dotenv.config({ path: "./.env" });
const port = process.env.PORT;

app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.listen(port, () => {
  console.log("server running port 3000");
});
