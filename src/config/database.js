
const mongoose=require('mongoose')


const connectdb=async()=>{
    await mongoose.connect(
     "mongodb+srv://Vansh:OVGlGK50aABeTfpG@nodejs.eer8fzv.mongodb.net/DevTinder" //write your db name at last
)
}

module.exports={
    connectdb
}