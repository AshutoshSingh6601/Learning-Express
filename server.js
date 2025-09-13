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

// req.url === routeName
// "/Home" === "/Home"

// app.get('/Home', (req, res)=>{
//     res.end('Home page')
//     // res.send('Home page')
// })

// app.post('/', (req, res)=>{
//     console.log(req.body)
//     res.end('Home page')
// })

// req.url === routeName
// "/users".startsWith("/users")
// "/users" => one block
// if "/users" comes in sec block with some additional block "/users/12" then also the first middleware will call bcz the first block of the both middleware were match so these will call first middleware instead of second

app.use('/users/23', (req, res, next)=>{
    res.send('First Middleware')
})
app.use('/users/12', (req, res, next)=>{
    res.send('Second Middleware')
})

app.listen(PORT, ()=>{
    console.log(`Server Listing of http://localhost:${PORT}`)
})