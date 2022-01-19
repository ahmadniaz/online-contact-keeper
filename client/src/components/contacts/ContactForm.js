
import React, {useState, useContext, useEffect} from 'react';
import ContactContext from '../../context/contact/contactContext';
import AlertContext from '../../context/alert/alertContext';




 const ContactForm = () => {
    const alertContext = useContext(AlertContext);
    const {setAlert} = alertContext;
    const contactContext= useContext(ContactContext);
    const {addContact, clearCurrent, current, updateContact}= contactContext;

    const [contact, setContact]= useState({
        name:'',
        email: '',
        phone:'',
        type:'personal'
    });

    const {name, email, phone, type}=contact;

    useEffect(()=>{
        
        if(current!==null){
            setContact(current);
        }
        else{
            setContact({
                name:'',
                email: '',
                phone:'',
                type:'personal'
            });
        }
    }, [contactContext, current]);


    const clearAll=()=>{
         clearCurrent();
    }
   
    

    
    const onChange=event=>
    setContact({...contact, [event.target.name]:event.target.value}
        );

    const onSubmit=event=>{

        event.preventDefault();
        
        if(name==='' || email==='' || phone===''){
            setAlert('All fields must be filled', 'danger')
            return
        }
        
        if(current===null) {
           
            addContact(contact)
        } else {
          updateContact(contact);
        }
        clearAll();
    }
    return (
        
        <form onSubmit={onSubmit}>
            <h2  className='text-primary'> {current? 'Edit Contact' : 'Add New Contact'}</h2>
           <input 
           type='text'
           name='name'
           placeholder='Enter the name here'
           value={name}
           onChange={onChange}
           />
            <input 
           type='email'
           name='email'
           placeholder='Enter the email here'
           value={email}
           onChange={onChange}
           />
            <input 
           type='text'
           name='phone'
           placeholder='Enter the phone here'
           value={phone}
           onChange={onChange}
           /> 
           <h5> Contact Type </h5> 
               <input type='radio' name='type' onChange={onChange} value='personal' defaultChecked={type==='personal'}/>Personal{' '}
               <input type='radio' name='type' onChange={onChange} value='professional' defaultChecked={type==='professional'}/>Professional
           
           <div >
               <input type='submit' value={current? 'Update Contact' : 'Add New Contact'} className='btn btn-primary btn-block'/>
           </div>
           {current && <div>
               <button className='btn btn-dark btn-block' onClick={clearAll}>Clear</button>
               </div>}
        </form>
    )
}
 
export default ContactForm