// instead of writing auth logic inside the .get,.post methods, create it like this globally and next() to jump 
// whenever required..

const Auth =(req,res,next)=>{  //in case of .use() '/admin' works for all admin related / paths...

    const token='hello';
    if(token=='hello'){
   next();               //make use of next(), if condition satisfied, then only jump to other methods
    }
    else
    res.status(401).send('unauthorized request');
}


module.exports={
Auth,
}