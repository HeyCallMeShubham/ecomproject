
const ImageModel = require("../models/Image");
const cloudinaryUploadImage = require("../services/Cloudinary");
const fs = require("fs");
const path = require("path");



const UploadImage = async (req, res, next) => {

    try {

        console.log(req.body, 'body');
        console.log(req.files, 'file');

        const images = new ImageModel({

            images: [],
            productId: "67d1b879686b9ac183963cf9"

        });

        for (let image of req.files) {

            const url = await cloudinaryUploadImage(image.path);

            images.images.push(url);


            fs.unlinkSync(`${path.resolve(__dirname, "../images")}/${image.filename}`);


        }

        await images.save();


    } catch (err) {
 
        
        for (let image of fs.readdirSync(`${path.resolve(__dirname, "../images")}`)) {
            
            fs.unlinkSync(`${path.resolve(__dirname, "../images")}/${image}`);
          
        }
        
        console.log(err);

    }

}



module.exports = UploadImage


