const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const sellerRoutes = require("./routes/sellerRoutes");
const buyerRoutes = require("./routes/buyerRouter");
const adminRoutes = require("./routes/adminRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const UploadImage = require("./controllers/UploadImage");
const ImageRouter = require("./routes/ImageRoutes");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");


dotenv.config();




const app = express();
const port = process.env.PORT || 3001;


connectDB()


app.use(cors({

  origin: ["http://localhost:3000", "http://localhost:5173"],
  method: ["GET", "POST", "PUT", "DELETE"],
  credentials: true

}))



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(sellerRoutes);
app.use(buyerRoutes);

app.use(adminRoutes);
app.use(loginRoutes);

app.use(registerRoutes);
app.use(ImageRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", ImageRouter);



        
        for (let image of fs.readdirSync(`${path.resolve(__dirname, "./images")}`)) {
            
            fs.unlinkSync(`${path.resolve(__dirname, "./images")}/${image}`);
          
        }
        


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
