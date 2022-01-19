import {
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';

const authReducer=(state, action)=>{
   switch (action.type) {

    case USER_LOADED:
        return {
            ...state, 
            isAuthenticated:true,
            user:action.payload,
            loading:false
        }
    
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
           localStorage.setItem('token', action.payload.token)
           return {
               ...state, 
               ...action.payload, 
               isAuthenticated:true,
               loading: false
           }

        case REGISTER_FAILED:    
        case LOGIN_FAIL:
            localStorage.removeItem('token')
            return{
                   ...state,
                   token:false,
                   isAuthenticated: false,
                   loading:false,
                   user:null,
                   error:action.payload.response.data.msg
                }

        case LOGOUT:
        case AUTH_ERROR:
                localStorage.removeItem('token')
                return{
                            ...state,
                            token:false,
                            isAuthenticated: false,
                            loading:false,
                            user:null,
                            error:action.payload
                    }
        case CLEAR_ERRORS:
                return {
                    ...state,
                    error:null
                }
   
       default:
           return state;
   }
}

export default authReducer;