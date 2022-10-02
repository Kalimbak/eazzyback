const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require("cors");
require('dotenv').config()

const app = express()

const {DB_USERNAME,DB_PASSWORD,DB_NAME,NODE_ENV,SESSION_SECRET} = process.env

const port = NODE_ENV === "development"? 4500 : process.env.PORT

const mongoUrl = `mongodb+srv://eazy:987654321k@cluster0.88vdgop.mongodb.net/kevin?retryWrites=true&w=majority`
console.log('your DB has been connected');

app.use(express.json())

app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(session({
  store: MongoStore.create({mongoUrl:mongoUrl,ttl:1*60*60}),
  secret:SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{httpOnly:true,maxAge:1*60*60*1000}
}))

app.use('/api/users',require('./routes/users'))


app.get('/',(req,res)=>{
    res.send(`Ei is running on port ${port}`)
})

app.listen(port,()=>{
    console.log(`Server running on PORT: ${port}`)
})

mongoose.connect(mongoUrl).then((connection)=>{
  console.log('Connected to mongo')
}).catch((err)=>{
  console.error(err)
})