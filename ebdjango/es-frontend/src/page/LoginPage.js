import React from "react";
import { Link, Navigate } from "react-router-dom"
import '../styles/LoginPage.css'
import { useEffect, useState } from "react"
import axios from 'axios'
import {jwtDecode} from 'jwt-decode';
import mainLogo from'../Images/logocolor.png';
import frec from'../Images/frec.png';
function Login(){
    
    const [user, setUser] = useState(undefined);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);




    const checkTokenExpiration = async () => {
        const token = localStorage.getItem('accessToken');
        if(token ){
            const token_decoded = await jwtDecode(token);
            setUser(token_decoded);
            console.log(token)
            if (token_decoded && token_decoded.exp * 1000 < Date.now()) {
                console.log('expired')  
                setUser(undefined);
              }
           
        }
    
    };
    useEffect(() => {
        checkTokenExpiration();
        document.title = 'Login';
    }, []);


    setInterval(checkTokenExpiration, 5 * 60 * 1000);

    const login = () => {
        var error = []
        let val = 0
        if(!username){
            error.push("You must enter an username!");
            val = 1;
        }
        if(!password){
            error.push("You must enter a password!");
            val = 1;
        }
        setErrors(error)

        if(val === 0){
            axios.post('http://localhost:8000/login/', { username, password })
            .then(res => {
                if(res.data.valid === '1') {
                    //====== TOKEN =========
                    const accessToken = res.data.access_token;
                    const refreshToken = res.data.refresh_token;

                    // Store the tokens in localStorage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('data', res.data.id.toString());

                    const decodedToken = jwtDecode(accessToken);

                    setUser(decodedToken);
                } else {
                    console.log('aqui')
                    setErrors(['Invalid username or password'])
                }
            })
            .catch(err => {
                setErrors(["Invalid username or password"])
            });
        }
    }



    return (
        user ?
        <Navigate to="/home" />
        :
        
        <div className="appointment-container">
            <link rel="icon" href={mainLogo} />
            <div className="navbar">
            <div className="item">
            <h4 className='Name'>Hello! </h4>
            </div>
            <div className="item">
        
                <img className="logo" src={mainLogo}  />
                        </div>
            <div className="item"><h4 className='Name'>Welcome </h4></div>
            </div>
           

            <div className="line">
        </div>
         <h2 className='Name2'>Login Page</h2>
            <div className="account" >
                <input className="writingField" placeholder=" username" type="username" onChange={(e) => {setUsername(e.target.value);}}/>
                <input className="writingField" placeholder=" Password" type="password" onChange={(e) => {setPassword(e.target.value);}}/>
                <button onClick={() => login()} className="btn"> Login </button>
                {
                    errors.map((error, index) => <div key={index} className="error">{error}</div>)
                }
            </div>
            <div className="Login2">
            <img className="logo2" src={frec}  />
                <button onClick={() => login()} className="fr-login"> Login With Facial Recognition </button>
                {
                    errors.map((error, index) => <div key={index} className="error">{error}</div>)
                }
            </div>
        </div>
    )
}

export default Login