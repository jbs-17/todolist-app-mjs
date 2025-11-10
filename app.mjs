import CONFIG from './config/config.mjs';
import express from 'express';



const app = express();



app.use((req, res, next)=>{
  res.on('finish', ()=>{
    
  })
  next();
})