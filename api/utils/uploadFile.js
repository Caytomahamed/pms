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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 5MB file size limit
    files: 3,                 // Limit the number of files
    fieldNameSize: 100,       // Max length of field name
    fieldSize: 2 * 1024 * 1024, // 2MB for field data
  },
});

exports.uploadFieldImages = upload.array('fieldImages', 3);
exports.uploadFile = upload.single('file');
