import React from 'react'
import { useEffect, useState } from 'react'
import '../styles/HomePage.css'

import {jwtDecode} from 'jwt-decode';
import mainLogo from'../Images/logocolor.png';






const Home = () => {
    const [user, setUser] = useState(undefined);

  
    const checkTokenExpiration = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const token_decoded = await jwtDecode(token);
        setUser(token_decoded);
        if (token_decoded && token_decoded.exp * 1000 < Date.now()) {
          setUser(undefined);
          window.location.href = '/login'; 
        }
      }else{
        window.location.href = '/login'; 
      }
    };
  
    
    useEffect(() => {
      checkTokenExpiration();
      document.title = 'Home';
    }, []);
   
    const handleClick1 = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('data'); 
        window.location.href = '/login';
      
    };
  
    const handleClick2 = async () => {
        window.location.href = '/appointment';
      };

    const handleClick3 = async () => {
      window.location.href = '/my-appointments';
    };
  
    return (
      
      
      <div className="app-container">
        <div className="navbar">
        <div className="item"><h4 className='Name'>Hello {user ? user.user_id : 'Convidado'} </h4></div>
        <div className="item">
       
            <img className="logo" src={mainLogo}  />
         
      </div>
        <div className="item"> <button className="button" onClick={handleClick1}>Logout</button></div>
      </div>

      <div className="line">
      </div>
        <h1 className="title">OPTIONS</h1>
        <div className="button-container">
        
          <button className="button" onClick={handleClick2}>Appointment Schedule</button>
          <button className="button" onClick={handleClick3}>Scheduled Appointments</button>
        </div>
      </div>
    );
  };
  
  export default Home;