import express from "express";
import { createWriteStream } from "fs";
import { rename, rm } from "fs/promises";
import path from "path";

const router = express.Router()

// view image and download
router.get("/*dirname", (req, res) => {
  const { dirname } = req.params;
  let filePath = path.join("/", dirname ? dirname?.join("/") : '');
  if (req.query.action === "download") {
    res.set("Content-Disposition", "Attachment");
  }
  res.sendFile(`${path.dirname(import.meta.dirname)}/storage/${filePath}`, (err)=>{
    if(err)
    res.json({error: err.message})
  });
});

// create new file
router.post("/*dirname", (req, res) => {
  const { dirname } = req.params;
  let filename = path.join("/", dirname ? dirname?.join("/") : '');
  const writeStream = createWriteStream(`./storage/${filename}`);
  req.pipe(writeStream);
  req.on("end", () => {
    res.json({ message: "File uploaded" });
  });
});

// delete
router.delete("/*dirname", async (req, res) => {
  const { dirname } = req.params;
  try {
    let filename = path.join("/", dirname ? dirname?.join("/") : '');
    await rm(`${import.meta.dirname}/../storage/${filename}`, { recursive: true });
    res.status(200).json({ Message: "File Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ Message: "File Deletion Unsuccessfully" });
  }
});

// update
router.patch("/*dirname", async (req, res) => {
  const { dirname } = req.params;
  try {
      let filename = path.join("/", dirname ? dirname?.join("/") : '');
      await rename(`./storage/${filename}`, `./storage/${req.body.newFilename}`);
      res.json({ Message: "File Updated Successfully" });
  } catch (error) {
    res.json({error: error.message})
  }
});

export default router