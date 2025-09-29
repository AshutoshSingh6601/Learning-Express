import express from 'express'
import {readdir} from 'fs/promises'

const app = express()
const port = 4000

// Enabling cors
app.use((req, res, next)=>{
    res.set("Access-Control-Allow-Origin", "*")
    next()
})

// app.use(express.static('storage'))

// Serving Files
app.use((req, res, next)=>{
    if(req.query.action === 'download'){
        res.set("Content-Disposition", "attachment")
    }
    const serveStatic = express.static('storage')
    serveStatic(req, res, next)
})

// Serving dir content
app.get('/', async(req, res)=>{
    const filesList = await readdir("./storage")
    res.json(filesList)
})

app.listen(port, ()=>{
    console.log(`Server Listening on http://localhost:${port}`)
})