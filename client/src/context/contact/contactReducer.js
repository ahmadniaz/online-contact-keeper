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


const contactReducer=(state, action)=>{
switch (action.type) {

    case GET_CONTACTS:
    return{
        ...state,
        contacts:action.payload,
        loading:false
    }
    case ADD_CONTACT:
       return {
            ...state,
            contacts: [...state.contacts, action.payload] ,
            loading:false
              };
    case DELETE_CONTACT:
        return{   
            ...state,
            contacts: state.contacts.filter(contact=>contact._id!==action.payload),
            loading:false

        };
    case CLEAR_CONTACTS:
        return{
            ...state,
            contacts:null, 
            error:null, 
            current:null, 
            filtered:null
        }
    case UPDATE_CONTACT:
            return{
                ...state,
                contacts: state.contacts.map(contact=> contact._id===action.payload._id? action.payload: contact) ,
                loading:false
    
            }
            
    case SET_CURRENT:
        return{
            ...state,
            current:action.payload

        }
    case CLEAR_CURRENT:
        return{
            ...state,
            current: null
        }

        case FILTER_CONTACTS:
            return{
                ...state,
                filtered: state.contacts.filter(contact=> {
                  const regex= new RegExp(`${action.payload}`, 'gi');
                  return contact.name.match(regex) || contact.email.match(regex)
                })
            }

            case CLEAR_FILTER:
            return{
                ...state,
                filtered: null
    
            }

            case SET_ALERT:
            return{
                ...state,
                alert: action.payload
             
    
            }
            case REMOVE_ALERT:
            return{
                ...state,
                alert: null
    
            }
            case CONTACT_ERROR:
                
                return{
                     error:action.payload
                }
            default:
            return state;
};
}

export default contactReducer;