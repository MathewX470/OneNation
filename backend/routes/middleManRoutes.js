const express = require("express");
const { logsMiddleMan } = require("../controllers/middleManController");
const router = express.Router();

router.post("/logs", logsMiddleMan);

module.exports = router;