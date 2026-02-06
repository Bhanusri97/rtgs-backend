const express = require("express");
const router = express.Router();

const webexCalls = require("../controllers/webexController")

router.post("/auth/token", webexCalls.exchangeToken);