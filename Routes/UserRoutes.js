const express=require('express');
const userRoute=express();
const multer=require('multer'); 

const path=require('path');

userRoute.use(express.urlencoded({extended:true}));

const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
})

const upload=multer({storage:Storage})
userRoute.use('/uploads', express.static('uploads'));


const userController = require('../Controller/UserController');

userRoute.post('/register',upload.single('image'),userController.CreateUser);
userRoute.post('/login',userController.LoginUser);
userRoute.post('/forget',userController.Forget);
userRoute.post('/reset_pass',userController.Reset);





module.exports=userRoute