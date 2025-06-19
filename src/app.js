const express=require('express');
const app=express();

app.listen(3333,()=>console.log('server built'));

app.get("/",(req,res)=>{
 res.send('hello from serve')
})

app.post('/',(req,res)=>{
    res.send({name:'data added'})
})
