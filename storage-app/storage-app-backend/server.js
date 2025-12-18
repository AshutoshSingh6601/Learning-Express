import express from 'express'
// import cors from 'cors'
import { createWriteStream } from 'fs'
// import { rm } from 'fs'
import {readdir, rename, rm, stat} from 'fs/promises'

const app = express()
const port = 4000

app.use(express.json())

// app.use(cors())

// Enabling cors (Cross-Origin Resource sharing)
// app.use((req, res, next)=>{
//     // res.set("Access-Control-Allow-Origin", "*")
//     // res.set("Access-Control-Allow-Methods", "*")
//     res.set({
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "*",
//         "Access-Control-Allow-Headers": "*",
//     })
//     next()
// })

// allow multiple origins
app.use((req, res, next)=>{
    const allowOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173/']
    if(allowOrigins.includes(req.headers.origin)){
        res.set('Access-Control-Allow-Origin',req.headers.origin)
    }
})

// Read
app.get('/directory', async(req, res)=>{
    const filesList = await readdir('./storage')
    res.json(filesList)
})
// view image and download
app.get('/files/:filename', (req, res)=>{
    const { filename } = req.params
    if(req.query.action === 'download'){
        res.set("Content-Disposition", "Attachment")
    }
    res.sendFile(`${import.meta.dirname}/storage/${filename}`)
})
// create
app.post('/files/:filename', (req, res)=>{
    const writeStream = createWriteStream(`./storage/${req.params.filename}`)
    req.pipe(writeStream)
    req.on('end', ()=>{
        res.json({message: 'File uploaded'})
    })
})
// delete
app.delete('/files/:filename', async(req, res)=>{
    const { filename } = req.params
    console.log(filename)
    await rm(`${import.meta.dirname}/storage/${filename}`)
    res.json({Message: "File Deleted Successfully"})
})
// update
app.patch('/files/:filename', async(req, res)=>{
    const { filename } = req.params
    console.log(filename)
    console.log(req.body)
    await rename(`./storage/${filename}`, `./storage/${req.body.newFilename}`)
    res.json({Message: "File Updated Successfully"})
})


app.listen(port, ()=>{
    console.log(`Server Listening on http://localhost:${port}`)
})