const mongoose=require('mongoose');
const express = require('express') ;
const app=express();

const userRoutes= require('../Server/Routes/userRoutes');
const DB='mongodb+srv://redskull:redskull2118@cluster0.ti3awfp.mongodb.net/UserRegisterLoginAPI?retryWrites=true&w=majority';

 mongoose.connect(DB,{ useNewUrlParser:true })
 .then(()=>{ 
    console.log(`Connected to DB`);
 })
 .catch((err)=>{ 
    console.log(err);
 })

const cookieParser = require('cookie-parser')
const cors=require('cors');

app.use(express.json());
app.use(cookieParser());


app.use(cors());


app.use('/api', userRoutes); 

  
app.listen(8000);
         