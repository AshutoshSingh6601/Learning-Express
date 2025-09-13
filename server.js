import express from 'express';

const app = express()

const PORT = process.env.PORT || 4000

//Parsing json body (Custom middleware)
// app.use((req, res, next)=>{
//     req.on("data", (chunk)=>{
//         // console.log(JSON.parse(chunk.toString()))
//         const reqBody = JSON.parse(chunk.toString())
//         req.body = reqBody
//         next()
//     })
// })

// express middleware
app.use(express.json())

app.get('/', (req, res)=>{
    res.end('Home page')
    // res.send('Home page')
})

app.post('/', (req, res)=>{
    console.log(req.body)
    res.end('Home page')
})

// app.use('/', (req, res, next)=>{
//     res.send('First Middleware')
// })

app.listen(PORT, ()=>{
    console.log(`Server Listing of http://localhost:${PORT}`)
})