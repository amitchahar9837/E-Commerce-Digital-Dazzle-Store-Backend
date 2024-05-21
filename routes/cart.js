const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const cartModel = require('../model/cart');

router.post('/addToCart', requireLogin, async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        const isAvailableItem = await cartModel.findOne({productId});
        if (isAvailableItem) {
            throw new Error("Item Already Exist");
        }
        const payload = {
            productId,
            quantity: 1,
            userId,
        }
        const newItem = await new cartModel(payload);

        const addedItem = await newItem.save();

        res.status(201).json({
            data:addedItem,
            success:true,
            error:false,
            msg:"Item Added Successfully"
        })

    } catch (err) {
        res.json({
            err: err.message,
            success: false,
            error: true
        })
    }
})
router.post('/itemCount',requireLogin,async(req,res) =>{
    try{
        const userId = req.user.id;
        const count = await cartModel.countDocuments({
            userId
        });

        res.status(200).json({
            data:count,
            success:true,
            error:false,
            msg:"ok",
        })
    }catch(err){
        res.json({
            err:err.message,
            error:true,
            success:false,
        })
    }
})

router.get('/allCartItem',requireLogin,async (req,res) =>{
    try{
        const userId = req.user.id;
        const allItems = await cartModel.find({
            userId:userId,
        }).populate('productId')

        res.json({
            data:allItems,
            success:true,
            error:false,
        })
    }catch(err){
        res.json({
            err:err.message,
            success:false,
            error:true,
        })
    }
})
router.put('/updateCartItem',requireLogin,async(req,res) =>{
    try{
        const {cartId,qty} = req.body;
        const updatedCart = await cartModel.findByIdAndUpdate(cartId,{
            quantity:qty,
        });
        res.json({
            data:updatedCart,
            error:false,
            success:true,
            msg:'ok',
        })
    }catch(err){
        res.json({
            err:err.message,
            error:true,
            success:false,
        })
    }
})
router.put('/deleteCartItem',requireLogin,async(req,res) =>{
    try{
        const {cartId} = req.body;
        const updatedCart = await cartModel.findByIdAndDelete(cartId);
        res.json({
            data:updatedCart,
            error:false,
            success:true,
            msg:'ok',
        })
    }catch(err){
        res.json({
            err:err.message,
            error:true,
            success:false,
        })
    }
})
module.exports = router;