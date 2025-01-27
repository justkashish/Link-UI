import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../../utils';
import './Signup.css';
import cuvette from '../../assets/cuvette.png';
 function Signup() {

    const[signupInfo , setSignupInfo] = useState({
        name : '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNo: '',
    });

    const navigate = useNavigate();
    const handleChange = (e) =>{
         const {name ,value} = e.target;
         const copySignupInfo = { ...signupInfo};
         copySignupInfo[name] = value;
         setSignupInfo(copySignupInfo);
    }
    

    const handleSignup = async (e) => {
        e.preventDefault();
        const {name , email , password , mobileNo , confirmPassword}  = signupInfo;

        if(password !== confirmPassword){
          return handleError('Passwords do not match.')
        }
        if(!name || !email || !password){
            return handleError('All fields are required.')
        }

        const payload = { name, email, password, mobileNo,confirmPassword };

        try {
           const url = "http://localhost:8080/api/v1/auth/signup" ;
           const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(payload),
           });
           const result = await response.json();

           const {success , message , error } = result;

           if(success){
            handleSuccess(message);
            setTimeout(()=>{
                navigate('/login');
            },1000)
           } else if(error){
            const details = error?.details[0].message;
            handleError(details);
           } else if(!success){
            handleError(message);
           }
           console.log(result);
        } catch(err) {
            console.error('Network error:', err)
            handleError(err);
        }
         
    }
  return (
    <div className='signup-container'>
      <div className="top-right-buttons">
        <button className="signup-button">SignUp</button>
        <button className="login-button" onClick={()=>{
          navigate('/login')
        }}>Login</button>
      </div>
        <div className="left-section">
        <img src={cuvette} alt="Scenic background" className="cuvette-image" />
      </div>
      <div className='right-section'>
        <div className='form-container'>
        <h2>Join us Today!</h2>
      <form onSubmit={handleSignup}>
        <div>
            <input 
            onChange={handleChange}
            type='text' 
            name='name'
            autoFocus
            placeholder='Name'
            value={signupInfo.name}
            />
        </div>
        <div>  
            <input 
            onChange={handleChange}
            type='email' 
            name='email'
            placeholder='Email id'
            value={signupInfo.email}
            />
        </div>
        <div>
            <input 
            onChange={handleChange}
            type='tel' 
            name='mobileNo'
            placeholder='Mobile no.'
            value={signupInfo.mobileNo}
            />
        </div>
        <div>
           
            <input 
            onChange={handleChange}
            type='password' 
            name='password'
            placeholder='Password'
            value={signupInfo.password}
            />
        </div>
        <div>
           
            <input 
            onChange={handleChange}
            type='password' 
            name='confirmPassword'
            placeholder='Confirm Password'
            value={signupInfo.confirmPassword}
            />
        </div>
        <button className='register-button' type='submit'>Register</button>
        <p>Already have an account ? 
            <Link to='/login'>Login</Link>
        </p>
      </form>
      <ToastContainer />
        </div>
      </div>
      
    </div>
  )
}

export default Signup
