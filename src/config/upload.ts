import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

// __dirname - File path
// Final path to local storage
// tmpFolder - Path to storage
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      // Random text generation for the file name
      const fileHash = crypto.randomBytes(10).toString('HEX');
      // Mounting the file name
      const filename = `${fileHash}-${file.originalname}`;
      return callback(null, filename);
    },
  }),
};
