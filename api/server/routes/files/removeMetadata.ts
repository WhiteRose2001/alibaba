import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { Router } from "express";
import { fileURLToPath } from "url";
import { getMySqlPool } from "../../../db/mysql/connections.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeMetadata = Router();

removeMetadata.post("/", async (req, res) => {
  const { filename } = req.body;

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({
      success: false,
      message: "Filename is required",
    });
  }

  const safeName = path.basename(filename);
  const filePath = path.resolve(__dirname, "../../storage/files", safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  execFile(
    "exiftool",
    ["-all:all=", "-overwrite_original", filePath],
    async (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "ExifTool failed",
        });
      }

      try {
        const pool = await getMySqlPool();
        await pool.execute(
          "UPDATE files SET METADATA = 'N' WHERE filename = ?",
          [filename],
        );
      } catch (err) {
        console.error("DB update failed:", err);
      }

      return res.json({
        success: true,
        message: "Metadata removed",
      });
    },
  );
});

export default removeMetadata;
