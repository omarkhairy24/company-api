const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./img')
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})


exports.uploadImage = upload.single('image');

exports.uploadImages = upload.fields([{
    name:'images',maxCount:5
}]);