const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};
console.log("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "pictures/postpicture");
  },

  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("-");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage });
