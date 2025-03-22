
const cloudinary = require("cloudinary").v2




cloudinary.config({

    // replace these field with your cloudinary configs here

    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY

});


const cloudinaryUploadImage = async (imagePath) => {

    try {

        const result = await cloudinary.uploader.upload(imagePath, {

            use_filename: true,
            unique_filename: false,
            overwrite: true

        });


        return { image_url: result.url, image_asset_id: result.asset_id, image_public_id: result.public_id }

    } catch (err) {

        console.log(err);

    }


}




module.exports = cloudinaryUploadImage



