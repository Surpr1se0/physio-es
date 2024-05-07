import React from 'react'
import { useEffect, useState } from 'react'
import '../styles/HomePage.css'

import {jwtDecode} from 'jwt-decode';

import axios from 'axios'; 





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
    }, []);
   
    const handleClick1 = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('data'); 
        window.location.href = '/login'; // Redirecione para a página de login
      
    };
  
    const handleClick2 = async () => {
        window.location.href = '/appointment';
      };

    const handleClick3 = async () => {
      window.location.href = '/my-appointments';
    };
  
    return (
      <div className="container">
        <h1 className="title">Physio</h1>
        <div className="button-container">
          <button className="button" onClick={handleClick1}>Logout</button>
          <button className="button" onClick={handleClick2}>Marcação</button>
          <button className="button" onClick={handleClick3}>Consultas Marcadas</button>
        </div>
      </div>
    );
  };
  
  export default Home;