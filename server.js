const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const productRouter = require("./routes/productRouter");
const userRoutes = require("./routes/userRouter");
const cartRouter = require("./routes/cartRouter");
const favlistRouter = require("./routes/favlistRouter");
const reviewRoutes = require("./routes/review");
const addressRoutes = require("./routes/address");
const categoryRoutes = require("./routes/category");
const orderRouter = require("./routes/orderRoutes");
const requestRouter = require("./routes/requestRouter");
const initDB = require("./db/initDB");
dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/favlist", favlistRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/requests", requestRouter);

app.listen(port, () => {
  console.log("server running port 3000");
});
