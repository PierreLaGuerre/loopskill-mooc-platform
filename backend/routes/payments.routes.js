const express = require("express");

const paymentsController = require("../controllers/payments.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/checkout", verifyToken, paymentsController.createCheckout);
router.post("/subscription/cancel", verifyToken, paymentsController.cancelSubscription);

module.exports = router;
