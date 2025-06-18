const express=require('express');
const app=express();

app.listen(3333,()=>
console.log('done...'));

app.use((req,res)=>{
res.send('hello from server')
})