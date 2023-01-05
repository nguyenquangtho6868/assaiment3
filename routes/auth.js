const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.post("/singup", authController.register);
router.get("/singing", authController.getSingIn);
router.post("/singing", authController.singIn);

module.exports = router;
