const express = require("express");
const dotenv = require("dotenv");
const productRouter = require("./routes/productRouter");
const userRoutes = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRouter");
const favlistRouter = require("./routes/favlistRouter");
const initDB = require("./db/initDB");
dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/favlist", favlistRouter);

app.listen(port, () => {
  console.log("server running port 3000");
});
