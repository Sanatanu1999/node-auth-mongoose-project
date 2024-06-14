const express=require('express')
const route=express.Router();
const{authRegistration, getAuthPost,authLogin,LoginPost,getAuthDetails,logOut,mail_confirmation,getForgetPassword}=require('../Controller/authController')

const multer=require('multer')

const path = require('path');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","auth"),(err,data)=>{
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
    limits:{fieldSize:1024*1024*5}
});

const upload_type=upload.fields([{name:'userimage',maxCount:1},{name:'idProof',maxCount:1}]);

route.get('/Auth/registration',authRegistration);
route.post('/authPost',upload_type,getAuthPost);
route.get('/login',authLogin);
route.post('/loginPost',LoginPost);
route.get('/detail',getAuthDetails);
route.get('/logout',logOut);
route.get('/mail_confirmation/:email/:token',mail_confirmation)
route.get('/auth/forget_login',getForgetPassword)

module.exports=route;