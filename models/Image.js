const mongoose = require("mongoose");




const Images = new mongoose.Schema({

    images: { type: [{

        image_url:{type:String, required:true},
        image_asset_id:{type:String, required:true},
        image_public_id:{type:String, required:true},

    }], required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }

});



const ImageModel = mongoose.model("ProductImage", Images);



module.exports = ImageModel


