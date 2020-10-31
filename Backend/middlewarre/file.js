const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //console.log(file.mimetype)
      const inValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid Mime Type");
      if (inValid)
        error = null;
      cb(error, "Backend/images")
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
    }
  });

  module.exports = multer({ storage: storage }).single("image");