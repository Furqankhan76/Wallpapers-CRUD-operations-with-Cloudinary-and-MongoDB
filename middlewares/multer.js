import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, `Datenow ${uniqueSuffix}`);
  },
});

export const upload = multer({
  storage,
});
