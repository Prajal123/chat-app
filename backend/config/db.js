const mongoose=require('mongoose');


const connectDb=async()=>{

    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to Database");
    }catch(err){
        console.log(err);
    }
}

module.exports=connectDb;