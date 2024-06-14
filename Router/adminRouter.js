const express = require('express');
const router = express.Router();
const { getProduct, 
    getPost, 
    viewProducts,
    viewEditPage,
    EditPage,
    deleteProduct 
} = require('../Controller/adminController');
const multer = require('multer');

const path = require('path');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads"),(err,data)=>{
            if(err) throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
        })
    }
}); 

const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")
    ){
        callback(null,true);
    }else{
        callback(null,false);
    }
};

const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5},
});
// const upload_type=upload.single('product_image');
const upload_type=upload.array('product_image',2);
router.get('/', getProduct)
router.post('/postData',upload_type,getPost)
router.get('/viewproduct',viewProducts)
router.get('/admin/viewEditPage/:id',viewEditPage)
router.post('/editpost',upload_type,EditPage)
router.get("/admin/deleteProduct/:id",deleteProduct)

module.exports = router;