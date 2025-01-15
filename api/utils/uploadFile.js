const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log('upload');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
    console.log('🗄🗃', filename);
    req.filename = filename;
  },
});

const upload = multer({ storage: storage });

exports.uploadFieldImages = upload.array('fieldImages', 3);
exports.uploadProfileImage = upload.single('file');
