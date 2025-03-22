
const express = require("express");
const upload = require("../middleware/multer.middleware");
const UploadImage = require("../controllers/UploadImage");
const { authenticateUser } = require("../middleware/authMiddleware");



const ImageRouter = express.Router();



ImageRouter.post("/uploadImage", authenticateUser, upload.array("productImage"), UploadImage);




module.exports = ImageRouter




