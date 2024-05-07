const mongoose=require('mongoose');
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    image: {
        type: String,
        required: true  // Ensure the image field is required
    },
    password:{
        type:String,
        required:true
    },
    blog:{
        type:Array,
        ref:'Post'
    },
    resetPasswordToken:{
        type:String,
        default:null
    }
    
    
},
{timestamps:true}
)

const User=mongoose.model('User',UserSchema);
module.exports=User;