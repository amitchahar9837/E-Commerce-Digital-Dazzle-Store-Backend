const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: {
        ref:'product',
        type:String,
    },
    quantity:Number,
    userId:String,
},{timestamps:true})

const cartModel = mongoose.model('cart',cartSchema);

module.exports = cartModel;