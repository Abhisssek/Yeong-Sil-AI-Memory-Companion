const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { chatWithAI } = require("../controller/aiController");
const upload = multer({ dest: "uploads/" });


// router.post("/ai-chat", chatWithAI);


router.post("/voice-chat", upload.single("audio"), chatWithAI);

module.exports = router;
