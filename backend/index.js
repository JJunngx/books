const express = require("express");
const Multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const app = express();
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.use(require("cors")());
app.use(express.json());
app.use(require("helmet")());
app.use(require("compression")());
// const fileStorage = multer.diskStorage({
//   destination: "images",
// });
// app.use(multer({ storage: fileStorage }).single("imageUrl"));
const storage = new Multer.memoryStorage();
// const upload = Multer({
//   storage,
// });
app.use(Multer({ storage: storage }).single("imageUrl"));
require("mongoose").connect(process.env.URL_MONGODB);

app.use(require("./router/auth"));
app.use("/admin", require("./router/admin"));
app.use(require("./router/client"));
app.listen(process.env.PORT || 5000);
