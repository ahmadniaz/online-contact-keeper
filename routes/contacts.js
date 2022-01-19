const express = require('express');
const Contact=require('../models/Contact');
const User=require('../models/User');
const authMiddleware= require('../middleware/authMiddleware')
const { check, validationResult } = require('express-validator');

const router = express.Router();

// GET =>  get all users contacts.
router.get('/', authMiddleware, async(req, res)=>{
    try {
        const contacts= await Contact.find({user:req.user.id}).sort({date:-1}); 
        res.json(contacts)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
});

// POST=> adding a new contact.
router.post('/', [authMiddleware, [
          check('name', 'Name is required').not().isEmpty()
]],
async (req, res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors: errors.array() } );
    }

    const{name, email, phone, type}=req.body;
    try {
        const newContact= new Contact ({
            name,
            email,
            phone,
            type,
            user:req.user.id
        });
        const contact= await newContact.save();
        res.json(contact);
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
  
});

// PUT=> updating a contact.
router.put('/:id',authMiddleware, async (req, res)=>{
    const{name, email, phone, type}=req.body;
    const contactFields={};
    if(name) contactFields.name=name;
    if(email) contactFields.email=email;
    if(phone) contactFields.phone=phone;
    if(type) contactFields.type=type;

    try {
        let contact= await Contact.findById(req.params.id);
        if(!contact) {return res.status(401).json({msg:'Not Found'})}
        

          contact = await Contact.findByIdAndUpdate(req.params.id,
            {$set: contactFields},
            {new: true});

            res.json(contact)
    } catch (error){
      res.status(500).send('Server Error')
    }
});


// DELETE=> deleting a contact.
router.delete('/:id', authMiddleware, async(req, res)=>{
    try {
        
        let contact= await Contact.findById(req.params.id);
        if(!contact) {return res.status(401).json({msg:'Not Found'})}
    
        await Contact.findByIdAndRemove(req.params.id,
        {$set: {}});

            res.json({msg:'Contact Deleted'})
    } catch (error) {
        res.status(500).send('Server Error')
    }
});

module.exports=router;