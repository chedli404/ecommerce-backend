import mongoose from 'mongoose';


const ProductSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    description:{
        
        type:String
    },
    category:{
        required:true,
        type:String
    },
    imageUrl:{
       required:true,
        type:String
    },
    Stock:{
        
        type:Number
    }
    
})
export default mongoose.model('product', ProductSchema);