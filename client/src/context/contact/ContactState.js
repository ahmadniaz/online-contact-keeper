import React, {useReducer} from 'react';
import axios from 'axios';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';

import {
    ADD_CONTACT,
    GET_CONTACTS,
    CLEAR_CONTACTS,
    DELETE_CONTACT,
    SET_CURRENT,
    UPDATE_CONTACT,
    CLEAR_CURRENT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    SET_ALERT,
    REMOVE_ALERT,
    CONTACT_ERROR
} from '../types';


const ContactState =(props)=>{
        const initialState ={
            contacts :null, 
            current:null,
            filtered: null,
            alert:null,
            error:null,
            
        };
        const [state, dispatch]= useReducer(contactReducer, initialState);

        // GET contacts
        const getContacts= async () => {
          try {
            const res= await axios.get('/api/contacts');
            dispatch({ 
                type: GET_CONTACTS, 
                payload:res.data
            }) 
          } catch (error) {
              dispatch({
                type: CONTACT_ERROR,              
                  payload:error
              })
          }
             
       }

        //Add Contact

      const addContact= async (contact) => {
          const config = {
               headers :{
                  'Content-Type': 'application/json'
              }
          }
          try {
            const res= await axios.post('/api/contacts', contact, config);
            dispatch({ 
                type: ADD_CONTACT, 
                payload:res.data
            }) 
          } catch (error) {
              dispatch({
                type: CONTACT_ERROR,
                payload:error
              })
          }
             
       }
        //Delete Contact

        const deleteContact = async (id) =>{
             try {                                                                    
             await axios.delete(`/api/contacts/${id}`);
            dispatch({type:DELETE_CONTACT, payload: id})
          } catch (err) {
              dispatch({
                type: CONTACT_ERROR,
                payload:err.response.msg
              })
          }
           
        }

          //Update Contact
          const updateContact=async(contact)=> {
            const config = {
                headers :{
                   'Content-Type': 'application/json'
               }
           }
            try {                                                                   
             const res=await axios.put(`/api/contacts/${contact._id}`, contact, config);
            dispatch({type:UPDATE_CONTACT, payload: res.data})
          } catch (err) {
              dispatch({
                type: CONTACT_ERROR,
                payload:err.response.msg
              })
          }
         }


         //CLEAR current contact

            const clearContacts = () =>{
            dispatch({type:CLEAR_CONTACTS})
        }

        //Set Current Contact

        const setCurrent = contact =>{
            dispatch({type:SET_CURRENT, payload: contact})
        }

        //CLEAR current contact

            const clearCurrent = () =>{
            dispatch({type:CLEAR_CURRENT})
        }

      
        //Filter Contacts
        const filterContacts = text =>{
            dispatch({type:FILTER_CONTACTS, payload: text})
        }

      
        //Clear Filter

        const clearFilter = ()=>{
            dispatch({type:CLEAR_FILTER})
        }

        //Set alert

        const setAlert =(msg, type)=>{
            dispatch({
                type: SET_ALERT,
                payload:{msg, type}
            })
            setTimeout(()=>dispatch({type:REMOVE_ALERT}), 3000)
        }


        return(
           <ContactContext.Provider  
           value={{
               contacts: state.contacts,
               current: state.current,
               filtered: state.filtered,
               alert:state.alert,
               error: state.error,
               addContact, 
               setCurrent,
               clearCurrent,
               deleteContact,
               updateContact,
               filterContacts,
               clearFilter, 
               setAlert,
               getContacts,
               clearContacts
           }}
           >
               {props.children}
           </ContactContext.Provider>
        )
}

export default ContactState; 