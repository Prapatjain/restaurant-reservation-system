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

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    totalTable:{
        type:Number,
        default:1
    }
});

//connection part

const adminData=new mongoose.model("admin",adminSchema);
module.exports= adminData;