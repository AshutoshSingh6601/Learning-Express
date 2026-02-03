import express from 'express'
import { mkdir, readdir, stat } from "fs/promises";
import path from "path";

const router = express.Router()

// Read directory
router.get("/{*dirname}", async (req, res) => {
  const { dirname } = req.params;
  try {
    let filePath = path.join("/", dirname ? dirname?.join("/") : '');
    const fullDirName = `./storage/${filePath ? filePath : ""}`;
    const filesList = await readdir(fullDirName);
    const resData = [];
    for (const item of filesList) {
      const stats = await stat(`${fullDirName}/${item}`);
      resData.push({ name: item, isDirectory: stats.isDirectory() });
    }
    res.json(resData);
  } catch (error) {
    res.json({error: error.message})
  }
});

// create new directory
router.post("/{*dirname}", async (req, res) => {
  const { dirname } = req.params;
  try {
    let filePath = path.join("/", dirname ? dirname?.join("/") : '');
    await mkdir(`./storage/${filePath}`);
    res.status(200).json({ message: "Directory created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router