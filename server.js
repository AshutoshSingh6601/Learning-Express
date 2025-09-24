import express from 'express';
import { open } from 'fs/promises'

const app = express()

const PORT = process.env.PORT || 4000

// for serving static file from public folder
app.use(express.static("public"))

app.get('/', (req, res)=>{
    res.end('Second Middleware')
})
app.get('/video',async(req, res)=>{
//     const fileHandle = await open("hero.mp4");
//   const readStream = fileHandle.createReadStream();
//   const stats = await fileHandle.stat();
//   res.setHeader("Content-Length", stats.size);
//   res.setHeader("Content-Type", "video/mp4");
//   res.setHeader("Accept-Ranges", "bytes");
//   readStream.pipe(res);
    res.sendFile(`${import.meta.dirname}/hero.mp4`)
})

app.listen(PORT, ()=>{
    console.log(`Server Listing of http://localhost:${PORT}`)
})