import createHttpError from "http-errors";
import multer from "multer";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype) {
      return callback(createHttpError(415, "Mime type is missing"));
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        createHttpError(415, "Only image/jpeg, image/png, image/webp, image/gif are allowed"),
      );
    }

    callback(null, true);
  },
});

export default upload;
