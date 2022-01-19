const express = require('express');
const User=require('../models/User')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt= require('jsonwebtoken');
const authMiddleware= require('../middleware/authMiddleware')



// GET request getting a logged in user.
router.get('/', authMiddleware, async(req, res)=>{
    try {
        const user= await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        res.status(500).send('Internal server error')
    }
});

// POST request Logging in a user.

router.post('/',[ check('email', 'Please enter an email address').isEmail(),
                 check('password', 'password must not be empty').exists()
],
async(req, res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors: errors.array() } );
    }
 
    const { email, password}= req.body;
   try {
    let user= await User.findOne({email});
    if(!user){
        return res.status(400).json({msg:'Invalid Credentials'})
    }

    const isMatching= await bcrypt.compare(password, user.password)
    if(!isMatching){
        return res.status(400).json({msg:'Incorrect Password'});
    }

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