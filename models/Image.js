const mongoose = require("mongoose");




const Images = new mongoose.Schema({

    images: { type: [String], required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }

});



const ImageModel = mongoose.model("ProductImage", Images);



module.exports = ImageModel


