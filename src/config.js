const mongoose=require('mongoose');
const connect=mongoose.connect("mongodb://localhost:27017/login-auth");
//check database connected or not

connect.then(()=>{
    console.log("DataBase Connected Successfully")
})
.catch(()=>{
    console.log("DataBase cannot be Connected")
})
//create a schema

const LoginSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true 
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

//connection part

const collection=new mongoose.model("users",LoginSchema);
module.exports= collection;