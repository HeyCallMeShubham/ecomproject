
const ImageModel = require("../models/Image");
const cloudinaryUploadImage = require("../services/Cloudinary");
const fs = require("fs");
const path = require("path");



const UploadImage = async (req, res, next) => {

    try {



        const images = new ImageModel({

            images: [],
            productId: req.body.productId

            // replace this productId with dynamic product id 

        });

        for (let image of req.files) {

            const url = await cloudinaryUploadImage(image.path);

            images.images.push(url);

            fs.unlinkSync(`${path.resolve(__dirname, "../uploads")}/${image.filename}`);

        }

        await images.save();

        res.status(201).json({ message: "product images uploaded successfully" });



        /// the images url along with their asset and public ids will be stored in database 

    } catch (err) {


        for (let image of fs.readdirSync(`${path.resolve(__dirname, "../uploads")}`)) {

            fs.unlinkSync(`${path.resolve(__dirname, "../uploads")}/${image}`);

        }

        console.log(err);

    }

}



module.exports = UploadImage


