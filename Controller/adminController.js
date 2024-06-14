const ProductModel = require('../model/product')
const fs=require('fs');
const path=require('path');

const getProduct = (req, res) => {
    res.render('admin/addProduct', {
        title: "admin product"
    })

}
const getPost = async (req, res) => {
    try {
        console.log("Collected data: ", req.body,req.files);
        let imgArray=req.files.map(file=>file.filename)
        //  console.log("imageArray",imgArray);
         let formValue = new ProductModel({
            product_name:req.body.pname.toLowerCase(),
            product_price:req.body.pprice,
            product_company:req.body.pcompany.toLowerCase(),
            // product_image:req.file.filename //
            product_image:imgArray
         });                
        let saved = await formValue.save();
        if (saved) {
            console.log("Product is saved");
        }
        res.redirect('/viewproduct');
    }

     catch (err) {
         console.log("Data is not collected", err);
     }
}


const viewProducts = async (req, res) => {
    try {
        let product = await ProductModel.find();
        if (product) {
            res.render('Admin/viewProductAdmin', {
                title: "all product",
                data: product
            })
        }
    }
    catch (err) {
        console.log("Data not fetched", err);
    }
}
const viewEditPage=async(req,res)=>{
    try{
        let product_id=req.params.id;
        let old= await ProductModel.findById(product_id);
        console.log("Collected old product by id:",old);
        if(old){
            res.render("admin/editProduct",{
                title:"edit product",
                data:old
            })
        }
    }catch(err){
        console.log("Product not found",err);
    }
}

const EditPage=async(req,res)=>{
    try{
        const prod_id=req.body.pid;
        console.log("Collected id for edit",prod_id);
       console.log("collected files",req.files);
        // collecting values from edit form and storing in variables
        const updated_pname=req.body.pname;
        const updated_price=req.body.ppreic;
        const updated_company=req.body.pcompany;
        
        let new_imgArray=req.files.map(file=>file.filename)
        
        // finding the existing data to edit
        let ProductData=await ProductModel.findById(prod_id);
        // set new collected value for the existing product
        console.log("Existing data",ProductData);
        ProductData.product_name=updated_pname;
        ProductData.product_price=updated_price;
        ProductData.product_company=updated_company;
        ProductData.product_image=new_imgArray
        // saving it
        let saved=await ProductData.save();
        if(saved)
            {
                console.log("product is updated");
                res.redirect("/viewproduct");
            }

    }catch(err){
        console.log("Error for edit",err);
    }
}
const deleteProduct=async(req,res)=>{
    try{
        let product_id=req.params.id;
        console.log("the id to delete the product is",product_id);
        //  let deleted=await ProductModel.deleteOne({_id:product_id}) //deleteOne is pre-defined method
        let deleted=await ProductModel.findOneAndDelete({_id:product_id})//return the deleted value ,it is pre-defined method.
        console.log("Deleted",deleted);
        //  console.log(deleted);
        if(deleted){
            deleted.product_image.forEach((file)=>{
                // console.log("Unlink",file);
                let filePath=path.join(__dirname,"..","uploads",file)
                fs.unlinkSync(filePath);
            })
            res.redirect('/viewproduct');
            
        }
         

    }
    catch(error){
        console.log("Error in deletion",error);

    }
}

module.exports = {
    getProduct,
    getPost,
    viewProducts,
    viewEditPage,
    EditPage,
    deleteProduct
}

