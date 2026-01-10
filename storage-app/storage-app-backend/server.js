import express from 'express'
import cors from 'cors'
import { createWriteStream } from 'fs'
// import { rm } from 'fs'
import {mkdir, readdir, rename, rm, stat} from 'fs/promises'

const app = express()
const port = 4000

app.use(express.json())

app.use(cors())

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
// app.use((req, res, next)=>{
//     const allowOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173/']
//     if(allowOrigins.includes(req.headers.origin)){
//         res.set('Access-Control-Allow-Origin',req.headers.origin)
//     }
// })

// Read directory
app.get('/directory/{*dirname}', async(req, res)=>{
    const { dirname} = req.params
    let filePath = dirname?.join('/')
    // console.log('get filename', filePath)
    const fullDirName = `./storage/${filePath? filePath : ''}`
    const filesList = await readdir(fullDirName)
    // console.log('filesList', filesList)
    const resData = []
    for(const item of filesList){
        const stats = await stat(`${fullDirName}/${item}`)
        resData.push({name: item, isDirectory: stats.isDirectory()})
    }
    res.json(resData)
})

// create directory
app.post('/directory/{*dirname}', async(req, res)=>{
    const {dirname} = req.params
    const filePath = dirname.join('/')
    try {
        await mkdir(`./storage/${filePath}`)
        res.status(200).json({message: 'Directory created successfully'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// view image and download
app.get('/files/*dirname', (req, res)=>{
     const { dirname } = req.params;
     let filePath = dirname.join('/')
    if(req.query.action === 'download'){
        res.set("Content-Disposition", "Attachment")
    }
    res.sendFile(`${import.meta.dirname}/storage/${filePath}`)
})
// create
app.post('/files/*dirname', (req, res)=>{
    const { dirname } = req.params
    let filename = dirname.join('/')
    const writeStream = createWriteStream(`./storage/${filename}`)
    req.pipe(writeStream)
    req.on('end', ()=>{
        res.json({message: 'File uploaded'})
    })
})
// delete
app.delete('/files/*dirname', async(req, res)=>{
    try {
        const { dirname } = req.params
        let filename = dirname.join('/')
        await rm(`${import.meta.dirname}/storage/${filename}`, {recursive: true})
        res.status(200).json({Message: "File Deleted Successfully"})        
    } catch (error) {
        res.status(500).json({Message: "File Deletion Unsuccessfully"})        
    }
})
// update
app.patch('/files/*dirname', async(req, res)=>{
    const { dirname } = req.params
    let filename = dirname.join('/')
    await rename(`./storage/${filename}`, `./storage/${req.body.newFilename}`)
    res.json({Message: "File Updated Successfully"})
})


app.listen(port, ()=>{
    console.log(`Server Listening on http://localhost:${port}`)
})