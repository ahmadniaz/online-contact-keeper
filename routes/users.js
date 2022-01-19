const express = require('express');
const User=require('../models/User')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt= require('jsonwebtoken');

// POST request creating a user.
router.post('/', [
    check('name', 'Please add a valid name').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password must be more than 6 characters').isLength({min:6 })
], async(req, res)=>{
   const errors=validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json( { errors: errors.array() } );
   }

   const {name, email, password}= req.body;

   try {
    let user= await User.findOne({email});
    if(user){
        return res.status(400).json({msg:'user already exists with this email'})
    }
    user= new User ({
         name,
         email,
         password
     });

     const salt= await bcrypt.genSalt(10);
     user.password= await bcrypt.hash(password, salt);
     await user.save();

     const payload= {
        user: {
              id:user.id
         }
        
    }
    jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 36000
    }, (err, token)=>{
        if(err) return err;
        res.json({token}); 
    })
   } catch (error) {
       console.error(error.message);
      res.status(500).json('server error')
         }
 });

module.exports=router;