import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../../utils';
import cuvette from '../../assets/cuvette.png';
import './Login.css';


function Login() {
    const[loginInfo , setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) =>{
         const {name ,value} = e.target;
         console.log(name,value);
         const copyLoginInfo = { ...loginInfo};
         copyLoginInfo[name] = value;
         setLoginInfo(copyLoginInfo);
    }
    

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email , password} = loginInfo;
        if( !email || !password){
            return handleError('All fields are required.')
        }
        try {
           const url = "http://localhost:8080/api/v1/auth/login" ;
           const response = await fetch(url,{
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(loginInfo)
           });
           const result = await response.json();
           const {success , message , token , name , error } = result;
           console.log(result);
           if(success){
            handleSuccess(message);
            localStorage.setItem('token', token);
            localStorage.setItem('loggedInUser', name);
            setTimeout(()=>{
                navigate('/home');
            },1000)
           } else if(error){
            const details = error?.details[0].message;
            handleError(details);
           } else if(!success){
            handleError(message);
           }
           console.log(result);
        } catch(err) {
            handleError(err);
        }
         
    }
  return (
    <div className='login-container'>
        <div className='top-right-buttons'>
        
        <button className='signup-button' onClick={()=>{
            navigate('/signup')
        }}>SignUp</button>
        <button className='login-button'>Login</button>
      </div>
      <div className='left-section'>
        <img src={cuvette} alt='Scenic background' className='cuvette-image' />
      </div>
      <div className='right-section'>
      <div className='form-container'>
        <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
            
            <input 
            onChange={handleChange}
            type='email' 
            name='email'
            placeholder='Enter your Email...'
            value={loginInfo.email}
            />
        </div>
        <div>
            
            <input 
            onChange={handleChange}
            type='password' 
            name='password'
            placeholder='Enter your Password...'
            value={loginInfo.password}
            />
        </div>
        <button className='login-button' type='submit'>Login</button>
        <span>Don't have an account ? 
            <Link to='/signup'>Signup</Link>
        </span>
      </form>
        </div>
      
      </div>
       
      <ToastContainer />
    </div>
  )
}

export default Login