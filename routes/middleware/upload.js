var multer = require('multer');

module.exports = {

  createMulter : function() {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/uploads')
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
      },
    });
  
    return multer({ storage: storage });  
  },
}