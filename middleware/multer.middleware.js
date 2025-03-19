
const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        console.log(req,'req');
        
        return cb(null, path.resolve(__dirname, "../images"));
        
    },
    
    filename: (req, file, cb) => {
        
        console.log(req,'req');
        
        return cb(null, file.originalname);

    }

});



const upload = multer({ storage });

module.exports = upload


