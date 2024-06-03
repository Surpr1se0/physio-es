import React from "react";
import { Link, Navigate } from "react-router-dom";
import '../styles/LoginPage.css';
import { useEffect, useState } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import mainLogo from '../Images/logocolor.png';
import frec from '../Images/frec.png';

function Login() {
    const [user, setUser] = useState(undefined);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [errorsLogin1, setErrorsLogin1] = useState([]); // Separate state for login1 errors
    const [errorsLogin2, setErrorsLogin2] = useState([]); // Separate state for login2 errors
    const [redirectTo, setRedirectTo] = useState(null); // New state to track redirection
    const [imagePreview, setImagePreview] = useState(null); // State for image preview

    const checkTokenExpiration = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const token_decoded = await jwtDecode(token);
            setUser(token_decoded);
            if (token_decoded && token_decoded.exp * 1000 < Date.now()) {
                setUser(undefined);
            } else {
                setRedirectTo('/home');
            }
        }
    };

    useEffect(() => {
        checkTokenExpiration();
        document.title = 'Login';

    }, []);

    setInterval(checkTokenExpiration, 5 * 60 * 1000);

    const login = () => {
        let error = [];
        let val = 0;
        if (!username) {
            error.push("You must enter a username!");
            val = 1;
        }
        if (!password) {
            error.push("You must enter a password!");
            val = 1;
        }
        setErrorsLogin1(error); 

        if (val === 0) {
            axios.post('http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/login/', { username, password })
                .then(res => {
                    if (res.data.valid === '1') {
                        const accessToken = res.data.access_token;
                        const refreshToken = res.data.refresh_token;
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('data', res.data.id.toString());

                        const decodedToken = jwtDecode(accessToken);
                        setUser(decodedToken);
                        setRedirectTo('/home'); 
                    } else {
                        setErrorsLogin1(['Invalid username or password']);
                    }
                })
                .catch(err => {
                    setErrorsLogin1(["Invalid username or password"]);
                });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const loginWithFacialRecognition = () => {
        if (!image) {
            setErrorsLogin2(["You must upload an image for facial recognition!"]); 
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        axios.post('http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/facial-login/', formData)
            .then(res => {
                if (res.data.valid === '1') {
                    const accessToken = res.data.access_token;
                    const refreshToken = res.data.refresh_token;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('data', res.data.id.toString());

                    const decodedToken = jwtDecode(accessToken);
                    setUser(decodedToken);
                    setRedirectTo('/next_appointment'); 
                } else {
                    setErrorsLogin2(['Facial recognition failed']);
                }
            })
            .catch(err => {
                setErrorsLogin2(["Facial recognition failed"]);
            });
    };

    if (redirectTo) {
        return <Navigate to={redirectTo} />;
    }

    return (
        <div className="appointment-container">
            <link rel="icon" href={mainLogo} />
            <div className="navbar">
                <div className="item">
                    <h4 className='Name'>Hello! </h4>
                </div>
                <div className="item">
                    <img className="logo" src={mainLogo} />
                </div>
                <div className="item">
                    <h4 className='Name'>Welcome </h4>
                </div>
            </div>

            <div className="line"></div>
            <h2 className='Name2'>Login Page</h2>
            <div className="account">
                <input className="writingField" placeholder="username" type="username" onChange={(e) => { setUsername(e.target.value); }} />
                <input className="writingField" placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value); }} />
                <button onClick={login} className="btn">Login</button>
                {
                    errorsLogin1.map((error, index) => <div key={index} className="error">{error}</div>) 
                }
            </div>
            <div className="Login2">
                <img className="logo2" src={imagePreview || frec} alt="Facial Recognition" /> {}


                <input type="file" name="file" accept="image/*" onChange={handleImageChange} className="image-input" id="imageInput" />


                <button onClick={loginWithFacialRecognition} className="fr-login">Login With Facial Recognition</button>
                {
                    errorsLogin2.map((error, index) => <div key={index} className="error">{error}</div>) 
                }
            </div>
        </div>
    );
}

export default Login;
