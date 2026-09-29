
import express from "express";

import multer from "multer";

import { registrarProducto } from "../Controllers/ProductoControllers";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/producto",
  upload.single("imagen"),
  registrarProducto
);



export default router;
