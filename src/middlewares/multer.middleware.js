import multer from "multer";
import fs from "fs";
import path from "path"; // path 모듈을 import해야 합니다.

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('upload 폴더가 없어 uploads 폴더를 생성합니다');
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, 'uploads/');
    },
    filename: (req, file, done) => {
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// multerMiddleware 변수를 정의하고 내보냅니다.
const multerMiddleware = upload.fields([
    { name: 'image1' },
    { name: 'image2' },
    { name: 'image3' }
]);

export { multerMiddleware };
