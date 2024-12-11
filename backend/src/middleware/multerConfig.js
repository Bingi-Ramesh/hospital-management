// /middleware/multerConfig.js

import multer from 'multer';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});


const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profile' || file.fieldname === 'certificates') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

export default upload;
