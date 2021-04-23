const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const dbConnect= require('./connexion/db');
const cors=require('cors')
const path=require('path');

dbConnect.authenticate().then(()=>{
    console.log('sequelize fine')
}).catch((err)=>{
    console.log('err',err)
})

app.use(cors())

app.use(express.static(path.join(__dirname,"public")))

//parse application json
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))

//api route
app.use('/apiuser',require('./api/userApi'))
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,('public/index.html'))))

app.listen('8080',()=>console.log("runing on http://localhost:8080/"))