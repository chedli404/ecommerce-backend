import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        
    },
    items:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        }
    }],
    totalPrice:{
        type:Number,
        default:0
    }

    
});

cartSchema.pre('save', async function (next) {
    let totalPrice = 0;
    for (const item of this.items) {
        const product = await mongoose.model('product').findById(item.productId);
        if (product) {
            totalPrice += product.price * item.quantity;
        }
    }
    this.totalPrice = totalPrice;
    next();
} )

export default mongoose.model('cart', cartSchema);
