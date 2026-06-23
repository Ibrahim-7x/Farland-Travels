import fs from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { asyncHandler, ApiError } from "../../utils/http";
import { randomId } from "../../utils/slug";
import { UPLOADS_DIR, UPLOADS_URL_PREFIX, ensureUploadsDir } from "../../config/uploads";

export const uploadsAdminRouter = Router();

// In-memory upload: we re-encode through sharp anyway, so never touch a temp
// file on disk. 8 MB cap on the raw upload; output is compressed WebP.
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED.has(file.mimetype)) {
      cb(new ApiError(415, "Only JPEG, PNG, WebP or AVIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

// POST /api/admin/uploads — multipart field "image". Resizes (max 1600px wide,
// no upscaling), converts to WebP, writes to UPLOADS_DIR, returns its URL.
uploadsAdminRouter.post(
  "/",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "No image file provided");

    ensureUploadsDir();
    const filename = `${Date.now().toString(36)}-${randomId()}.webp`;
    const destPath = path.join(UPLOADS_DIR, filename);

    try {
      await sharp(req.file.buffer)
        .rotate() // honour EXIF orientation before stripping metadata
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(destPath);
    } catch {
      throw new ApiError(422, "Could not process that image file");
    }

    res.status(201).json({ url: `${UPLOADS_URL_PREFIX}/${filename}` });
  }),
);
