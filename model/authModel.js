const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const AuthSchema=new Schema({
    First_name:{
        type:String,
        required:true
    },
    
    
    Last_name:{
        type:String,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    City:{
        type:String,
        required:true
    },
    Pincode:{
        type:Number,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },


    // product_image:{
    //     type:String,
    //     required:true
    // }
    User_image:{
        type:String,
        required:true
    },
    Identity_Proof:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
        
    }

},{
    timestamps:true,
    versionKey:false

})

const AuthModel=new mongoose.model("Auth_details",AuthSchema);
module.exports=AuthModel;