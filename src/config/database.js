
const mongoose=require('mongoose')


const connectdb=async()=>{
    await mongoose.connect(
     process.env.DB_SECRET //write your db name at last
)
}

module.exports={
    connectdb
}