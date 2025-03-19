
const express = require("express");
const upload = require("../middleware/multer.middleware");
const UploadImage = require("../controllers/UploadImage");



const ImageRouter = express.Router();



ImageRouter.post("/uploadImage", upload.array("productImage"), UploadImage);




module.exports = ImageRouter


