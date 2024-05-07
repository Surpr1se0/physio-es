import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/Appointments.css'

import mainLogo from'../Images/logocolor.png';

const Appointments = () => {
  const [user, setUser] = useState(undefined);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkTokenExpiration = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const token_decoded = await jwtDecode(token);
      setUser(token_decoded.user_id);
      console.log('User:', token_decoded.user_id);
      if (token_decoded && token_decoded.exp * 1000 < Date.now()) {
        setUser(undefined);
        window.location.href = '/login';
      }
    } else {
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
    window.location.href = '/login'; // Redirect to the login page
  };

  const readAppointments = async () => {
    const usr = await jwtDecode(localStorage.getItem('accessToken')).user_id
    try {
      const response = await axios.get(`http://localhost:8000/my-appointments/?user=${usr}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };


  useEffect(() => {
    readAppointments();
    document.title = 'Scheduled Appointments';
    
  }, []);

  return (
    <div className="app-container">
      <div className="app-container">
      <div className="navbar">
        <div className="item">
          <h4 className='Name'>Hello {user ? user : 'Convidado'}</h4>
        </div>
        <div className="item">
        <a href="/home">
            <img className="logo" src={mainLogo}  />
          </a>
        </div>
          <div className="item"> <button className="button" onClick={handleClick1}>Logout</button></div>
        </div>

         <div className="line">
      </div>
      <h1 className="title">Historic</h1>
      <div className="appointments-list">
        {loading ? (
          <p className='Loading-Title'>Loading...</p>
        ) : (
          <ul>
            {appointments.map((appointment, index) => (
              <li key={index} className="appointment-item">
                <div><strong>Name:</strong> {appointment.username.S}</div>
                <div><strong>Day:</strong> {appointment.day.S}</div>
                <div><strong>Hour:</strong> {appointment.hour.S}</div>
                <div><strong>Doctor Name:</strong> {appointment.doctor_name.S}</div>
                <div><strong>Status:</strong> {appointment.status.S}</div>
                <div><strong>Speciality:</strong> {appointment.speciality.S}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default Appointments;
