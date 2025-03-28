import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

})







export default mongoose.model('user', userSchema);
