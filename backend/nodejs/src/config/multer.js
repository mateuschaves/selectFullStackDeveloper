import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';
import { pathToFileURL } from 'url';
import { resolveSoa } from 'dns';

export default {
    //Regarding file storage
    storage: multer.diskStorage({

        //Path that the file will be saved
        destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),

        //Regarding file name
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
               if(err) return cb(err);

               //If there was no error, it will transform 16 bytes of random content into a hexadecimal string
               return cb(null, res.toString('hex') + extname(file.originalname))
            });
        }
    }),
}
