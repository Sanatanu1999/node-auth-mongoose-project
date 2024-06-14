
const AuthModel = require('../model/authModel')
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcryptjs")
const nodemailer=require("nodemailer");

const TokenModel=require("../model/tokenModel")
const jwt=require("jsonwebtoken")

const transporter=nodemailer.createTransport({
    host:'smtp',
    port:465,
    secure:false,
    requireTLS:true,
    service:'gmail',
    auth:{
        user:'chakrabortysantanu1999@gmail.com',
        pass:'wcwn mqki zplp gqjv'
    }
});

const authRegistration = (req, res) => {
    let errorSms=req.flash("err");
    // console.log("The flash error sms is:",errorSms);
    
    if(errorSms.length>0){
        errorSms=errorSms[0];
    }
    else{
        errorSms=null;
    }
    res.render('auth/registration', {
        title: 'authForm',
        errorData:errorSms
    })
}

const getAuthPost = async (req, res) => {
    try {
        // console.log("Collected data: ", req.body,req.files);
        console.log("Registration: ",req.body);
        if (req.body.password === req.body.cnf_password) {
            let hashPassword = await bcrypt.hash(req.body.password, 12)
            console.log("hashing", hashPassword);

            let formValue = new AuthModel({
                First_name: req.body.fname.toLowerCase(),
                Last_name: req.body.lname.toLowerCase(),
                Gender: req.body.gen,
                City: req.body.cit,
                Pincode: req.body.pin,
                Email: req.body.email,
                Password: hashPassword,
                User_image: req.files.userimage[0].filename,
                Identity_Proof: req.files.idProof[0].filename
            });
            let saved = await formValue.save();
            if (saved) {
                console.log("Registration data saved");
                const token_jwt=jwt.sign(
                    {email:req.body.email},
                    "secretkey123456789@secretkey123456789",
                    {expiresIn:"1h"}
                );
                const Token_data=new TokenModel({
                    token:token_jwt,
                    _userId:saved._id,
                });
                let token_saved=await Token_data.save();
                if(token_saved){
                    let mailOption={
                        from:'chakrabortysantanu1999@gmail.com',
                        to:req.body.email,
                        subject:'Successful registration',
                        text:'Hello '+req.body.fname+
                        ',\n\nYou have succesfully submitted your data to be registered.Please verify your account by clicking the link:\n'+
                        "http://"+
                        req.headers.host+
                        "/mail_confirmation/"+
                        req.body.email+"/"+token_jwt+
                        '\n\nTHank you!\n'
                    }
                transporter.sendMail(mailOption,function(error,info){
                    if(error){
                        console.log("Error to send mail:",error);
                        res.redirect('/Auth/registration')
                    }
                    else{
                        console.log("Email sent:",info.response);
                        res.redirect('/login')
                    }
                })
                }
                else{
                    console.log("Error for saving token");
                }
                
            }
        }
        else {
            res.send("Password mismatch")
        }
         res.redirect('/login');
    }

    catch (err) {
        console.log("Data is not collected", err);
    }
}


const authLogin = (req, res) => {
    let errorSms=req.flash("error");
    
    console.log("The flash error sms is:",errorSms);
    let errSms;

    // if(errorSms.length>0){
    //     errSms=errorSms[0];
    // }else{
    //     errSms=null;
    // }

    res.render('auth/login', {
        title: 'loginAuth',
        errorData:errorSms
    })
}
const LoginPost=async(req,res)=>{
    try{
    // console.log("sign in data",req.body);

    let existingUser= await AuthModel.findOne({Email:req.body.email})
    // console.log("existing_user",existingUser)

    // email
    if(existingUser){
        let result=await bcrypt.compare(req.body.password,existingUser.Password)
        // console.log("check password",result);
        // password 
        if(result)
            {
                req.session.isloggedin=true;
                req.session.user=existingUser;

                await req.session.save(err=>{
                    if(err)
                        {
                            console.log("Session saving error",err);
                        }
                        else{
                            console.log("Login successful");
                             res.redirect("/");
                        }
                });

            }else{
                
                req.flash("error", "Wrong Password")
                res.redirect("/login")
            }
    }
    else{
        req.flash("error", "Invalid email")
        res.redirect("/login")
    }
}
catch(err){
    console.log("user not found",err);
}
}

const getAuthDetails=async(req,res)=>{
    try{
        let id=req.session.user._id;
        console.log(id);
        let user_detail=await AuthModel.findById(id);
        console.log(user_detail);
        if(user_detail){
            res.render('auth/dashboard',{
                title:"user Profile",
                data:user_detail
            })
            res.redirect('/login');
        }
    }
    catch(error){
        console.log("Error to find",error);
    }
}
const logOut=async(req,res)=>{
    req.session.destroy();
    res.redirect('/login')
}
const mail_confirmation=async(req,res)=>{
    try{
        let user_token=await TokenModel.findOne({token:req.params.token});
        console.log("Recived token",user_token);
        if(user_token){
             console.log("Received mail form confirmation mail",req.params.email);
            let user_data=await AuthModel.findOne({Email:req.params.email});
            if(user_data.isVerified){
                console.log("User already Verified");
                req.flash(
                    "msg",
                    "User already Verified,go to login"
                );
                res.send("you are already verify");

            }else{
                user_data.isVerified=true;
                let save_res=await user_data.save();
                if(save_res){
                    console.log("your Account Successfully Verified");
                    res.send("your email is already verify")
                }
            }
        }
        else{
            console.log("token time expried");
        }
    }catch(error){
        console.log("mail verification error",error);
        // res.redirect("/not_verified")
    }
}

const getForgetPassword=(req,res)=>{
    res.render('auth/forgetPassword',{
        title:"login_form"
        
    })
}

module.exports = { authRegistration, getAuthPost,authLogin,LoginPost,getAuthDetails,logOut,mail_confirmation,getForgetPassword}