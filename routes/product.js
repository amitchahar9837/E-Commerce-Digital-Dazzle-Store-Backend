const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const productModel = require('../model/product');
const userModel = require('../model/user');
const Router = express.Router();

Router.post('/uploadProduct', requireLogin, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        const { productName, brandName, category, productImage, description, price, sellingPrice } = req.body;
        if (user.role === 'ADMIN') {
            if (!productName || !brandName || !category || !productImage[0] || !description || !price ||  !sellingPrice) {
                throw new Error("Please Include all fields");
            } else {
                const uploadProduct = new productModel(req.body)
                const savedProduct = await uploadProduct.save();

                res.status(201).json({
                    msg: "Product uploaded",
                    success: true,
                    error: false,
                    data: savedProduct,
                })
            }
        } else {
            throw new Error("Permission Denied :)");
        }
    } catch (err) {
        res.json({
            err: err.message,
            success: false,
            error: true,
        })
    }
})

Router.get('/allProduct', async (req, res) => {
    try {
        const allProduct = await productModel.find().sort({ createdAt : -1})

                res.status(201).json({
                    msg: "All Products",
                    success: true,
                    error: false,
                    data: allProduct,
                })
    } catch (err) {
        res.json({
            err: err.message,
            success: false,
            error: true,
        })
    }
})

Router.put('/updateProduct', requireLogin, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        const {_id, ...restBody} = req.body;
        if (user.role === 'ADMIN') {
            const updatedProduct =await productModel.findByIdAndUpdate(_id,restBody,{
                new:true,
            })
            res.status(201).json({
                msg: "Product updated successfully",
                success: true,
                error: false,
                data: updatedProduct,
            })
        } else {
            throw new Error("Permission Denied :)");
        }
    } catch (err) {
        res.json({
            err: err.message,
            success: false,
            error: true,
        })
    }
})

Router.get('/getCategoryProduct',async(req,res) => {
    try{
        const productCategory = await productModel.distinct("category");

        //array to store one product from each category
        const productData = []

        for(const category of productCategory){
            const product = await productModel.findOne({category})
            if(product){
                productData.push(product);
            }
        }

        res.status(200).json({
            data:productData,
            success:true,
            error:false,
        })
    }catch(err){
        res.status(400).json({
            err:err.message,
            error:true,
            success:false,
        })
    }
})

Router.post('/categoryWiseProduct',async(req,res) =>{
    const {category} = req.body || req.query;
    try{
        const product = await productModel.find({category})

        res.json({
            data:product,
            msg:'Ok',
            success:true,
            error:false,
        })
    }catch(err){
        res.json({
            err:err.message,
            error:true,
            success:false,
        })
    }
})

Router.post('/productDetail',async(req,res) =>{
    try{
        const {productId} = req.body;
        const productDetail = await productModel.findById(productId);
        res.status(200).json({
            data:productDetail,
            success:true,
            error:false,
            msg:'ok',
        })
    }catch(err){
        res.json({
            err:err.message,
            success:false,
            error:true,
        })
    }
})
Router.get("/search",async(req,res) =>{
    try{
        const query = await req.query.q;
        const Regex = new RegExp(query,'i','g');

        const product = await productModel.find({
            "$or":[
                {
                    productName:Regex,
                },
                {
                    category:Regex,
                }
            ]
        })
        res.json({
            data:product,
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
Router.post('/filterProduct',async(req,res) =>{
    try{
        const categoryList = req.body?.category || [];
        
        const filteredProduct = await productModel.find({
            category:{
                "$in":categoryList
            }
        });
        res.json({
            data:filteredProduct,
            msg:'ok',
            success:true,
            error:false
        })
    }catch(err){
        res.json({
            err:err.message,
            success:false,
            error:true,
        })
    }
})
Router.get('/productCount',requireLogin,async(req,res) =>{
    try {
        const userId = req.user.id;
        const user = await userModel.findOne({_id:userId})
        if(user?.role == 'ADMIN'){
            const totalProduct = await productModel.find().countDocuments();
            res.status(200).json({
                data:totalProduct,
                success:true,
                error:false,
            })
        }else{
            throw new Error("Access Denied!");
        }
    } catch (error) {
        res.json({
            err:error.message,
            success:false,
            error:true,
        })
    }
})
Router.delete('/deleteProduct',requireLogin,async(req,res) =>{
    try {
        const userId = req.user.id;
        const userRole = await userModel.findById({_id:userId})
        if(userRole.role === 'ADMIN'){
            const productId = req.body.productId;
            const deletedProduct = await productModel.findByIdAndDelete(productId)
            res.status(200).json({
                data:deletedProduct,
                success:true,
                error:false,
            })
        }else{
            throw new Error("Access Denied!")
        }
    } catch (error) {
        res.json({
            err:error.message,
            success:false,
            error:true,
        })
    }
})
module.exports = Router;