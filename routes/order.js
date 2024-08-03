const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const stripe = require('../config/stripe');
const userModel = require('../model/user');
const router = express.Router();

router.post('/payment',requireLogin,async(req,res) =>{
      try {
            const {cartItems} = req.body;
            const user = await userModel.findOne({_id: req.user.id})
            console.log(cartItems +": CartItems");
            console.log("User : "+user);
            // const params = {
            //       submit_type : "pay",
            //       mode : 'payment',
            //       payment_method_type : ['card'],
            //       billing_address_collection : 'auto',
            //       shipping_options : [
            //             {
            //                   shipping_rate : 'shr_1POcQ1AHfYbT75BqvDrM4ruG',
            //             }
            //       ],
            //       customer_email : user.email,
            //       line_items : cartItems.map((item,index) =>{

            //       })
            // }
            // const session = stripe.checkout.session.create()
      } catch (error) {
            res.json({
                  err: err.message,
                  success: false,
                  error: true
            })
      }
})

module.exports = router;