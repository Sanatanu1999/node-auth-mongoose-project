const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ProductSchema=new Schema({
    product_name:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_company:{
        type:String,
        required:true
    },
    // product_image:{
    //     type:String,
    //     required:true
    // }
    product_image:{
        type:[String],
        required:true
    }

},{
    timestamps:true,
    versionKey:false

})

const ProductModel=new mongoose.model("product_details",ProductSchema);
module.exports=ProductModel;