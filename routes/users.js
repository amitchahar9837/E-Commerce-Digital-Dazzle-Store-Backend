const express = require('express');
const router = express.Router();
const userModel = require('../model/user');
const requireLogin = require('../middleware/requireLogin');

router.get('/allusers',requireLogin,(req,res) =>{
    userModel.find()
    .select('-password')
    .then(user =>{
        res.json({data:user});
    }).catch(err=>{
        res.json({err:err.message});
    })
})

router.put('/updateUser',requireLogin,(req,res) =>{

    const {userId,email,name,role,profilePic} = req.body
    const payload ={
        ...(email && {email:email}),
        ...(name && {name:name}),
        ...(role && {role:role}),
        ...(profilePic && {profilePic:profilePic})
    }

    userModel.findByIdAndUpdate(userId,payload,{
        new:true
    })
    .select("name _id email role createdAt profilePic")
    .then(result =>{
        res.json({data:result,msg:"user updated"})
    }).catch((err) =>{
        res.json({err:err.msg});
    })
})
router.get('/userCount',requireLogin,async(req,res) =>{
    try {
        const userId = req.user.id;
        const user = await userModel.findOne({_id:userId})
        if(user?.role == 'ADMIN'){
            const totalUser = await userModel.find().countDocuments();
            res.status(200).json({
                data:totalUser,
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
module.exports = router;