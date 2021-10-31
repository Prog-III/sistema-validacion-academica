import {ExpressRequestHandler, toInterceptor} from '@loopback/express';
import {HttpErrors} from '@loopback/rest';
import multer, {StorageEngine} from 'multer';
import path from 'path';
import {v4 as uuid} from 'uuid';

const storage: StorageEngine = multer.diskStorage({ // guardo el archivo para despues utilizar la inf de como acceder a él
  destination: path.resolve(__dirname, '../../files'),
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  },
});

const multerMiddleware: ExpressRequestHandler = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const mimetype = filetypes.test(file.mimetype);


    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetype && extname) return cb(null, true);

    cb(
      new HttpErrors.BadRequest(
        'File extension no valid << Valid extensions : (.jpg , .jpeg, .png , .gif , .svg) >>',
      ),
    );
  },
}).single('image_file');

const multerMiddlewareFile: ExpressRequestHandler = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /plain|pdf|txt|zip|rar|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
;

    if (mimetype && extname) return cb(null, true);

    cb(
      new HttpErrors.BadRequest(
        'File extension no valid << Valid extensions : (.pdf , .txt, .zip , .rar , .doc, .docx, .plain) >>',
      ),
    );
  },
}).single('file');

const imagesInterceptor = toInterceptor(multerMiddleware);
const filesInterceptor = toInterceptor(multerMiddlewareFile);

export {imagesInterceptor, filesInterceptor};
