import express from "express";
import cors from "cors";
import { createWriteStream } from "fs";
import { mkdir, readdir, rename, rm, stat } from "fs/promises";
import path from "path";
import directoryRoute from "./routes/directoryRoute.js"
import fileRoute from "./routes/fileRoute.js"

const app = express();
const port = 4000;

app.use(express.json());

app.use(cors());

app.use('/directory', directoryRoute)

app.use('/file', fileRoute)

app.listen(port, () => {
  console.log(`Server Listening on http://localhost:${port}`);
});
