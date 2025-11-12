const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authController = require("../middleware/authMiddleware");

router.use(authController.protect);
router.post("/", requestController.sendSellerReq);

router.use(authController.allowedTo("admin"));
router.get("/", requestController.sendSellerReq);
router.post("/:id", requestController.processDecision);
