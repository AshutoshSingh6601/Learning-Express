import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../fileDB.json" with {type: "json"}

const router = express.Router()

// view image and download
router.get("/:id", (req, res) => {
  const { id } = req.params;
  // console.log({id})
  const fileName = filesData.find((file)=> file.id === id)
  // console.log({fileName})
  if (req.query.action === "download") {
    res.set("Content-Disposition", "Attachment");
  }
  // path.dirname(import.meta.dirname) -->  D:\Backend\AnuragSingh\storage-app\storage-app-backend
  // import.meta.dirname -->  D:\Backend\AnuragSingh\storage-app\storage-app-backend\routes
  //${path.dirname(import.meta.dirname)} --> for getting absolute path Dynamically
  res.sendFile(`${path.dirname(import.meta.dirname)}/storage/${id}${fileName.extension}`, (err)=>{
    if(err)
    res.json({error: err.message})
  });
});

// create new file
router.post("/:filename", (req, res) => {
  const { filename } = req.params;
  const uniqueFileName = crypto.randomUUID()
  const extension = path.extname(filename)
  const fullFileName = `${uniqueFileName}${extension}`
  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);
  req.on("end", async () => {
    filesData.push({id: uniqueFileName, name: filename, extension})
    console.log(filesData)
    await writeFile('./fileDB.json', JSON.stringify(filesData, null, 2))
    res.json({ message: "File uploaded" });
  });
});

// delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // const fileDetails = filesData.find((file)=>file.id === id)
    // await rm(`${import.meta.dirname}/../storage/${fileDetails.id}${fileDetails.extension}`, { recursive: true });
    // const newFilesData = filesData.filter((file)=>file.id !== id)
    // await writeFile('./fileDB.json', JSON.stringify(newFilesData, null, 2))
    const fileIndex = filesData.findIndex((file)=> file.id === id)
    const fileData = filesData[fileIndex]
    await rm(`${path.dirname(import.meta.dirname)}/storage/${fileData.id}${fileData.extension}`)
    filesData.splice(fileIndex, 1)
    await writeFile('./fileDB.json', JSON.stringify(filesData, null, 2))
    res.status(200).json({ Message: "File Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ Message: "File Deletion Unsuccessfully" });
  }
});

// update
router.patch("/:id", async (req, res) => {
  const {id} = req.params
  const { newFilename } = req.body
  try {

      // const fileDetails = filesData.find((file)=>file.id === id )
      // let filename = `${fileDetails.id}${fileDetails.extension}`
      // const newFile = crypto.randomUUID()
      // const newFileExt = path.extname(newFilename)
      // const newFullFileName = `${newFile}${newFileExt}`

      // await rename(`./storage/${filename}`, `./storage/${newFullFileName}`);
      // const filteredData = filesData.filter((file)=>file.id !== id )
      // const newFilesData = filteredData.push({id: newFile, name: newFilename, extension: newFileExt})
      // await writeFile('./fileDB.json', JSON.stringify(filteredData, null, 2))

    const fileDetail = filesData.find((file)=>file.id === id )
    fileDetail.name = newFilename
    await writeFile('./fileDB.json', JSON.stringify(filesData, null, 2))

    res.status(200).json({ Message: "File Updated Successfully" });
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

export default router