import React from 'react'
import { useEffect, useState } from 'react'
import '../styles/Appointments.css'

import { jwtDecode } from 'jwt-decode';

import axios from 'axios';
import { useHistory } from 'react-router-dom';
import mainLogo from '../Images/logocolor.png';

const Appointment = () => {
  const [user, setUser] = useState(undefined);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


  const checkTokenExpiration = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const token_decoded = await jwtDecode(token);
      setUser(token_decoded);
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
    window.location.href = '/login'; 
  };


  useEffect(() => {
    fetchAvailableTimes();
    document.title = 'Appointment Schedule Day';
  }, []);





  const fetchAvailableTimes = async () => {

    const usr = await jwtDecode(localStorage.getItem('accessToken')).user_id;
    try {
      console.log(usr);
      const response = await axios.get(`http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/next_appointment/?user=${usr}`);
      setAppointments(response.data);
      setLoading(false);

      //setAvailableTimes(response.data);


    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <div className="item">
          <h4 className='Name'>Hello {user ? user.user_id : 'Convidado'} </h4>
        </div>
        <div className="item">
          <a href="/home">
            <img className="logo" src={mainLogo} />
          </a>
        </div>
        <div className="item"> <button className="button" onClick={handleClick1}>Logout</button></div>
      </div>

      <div className="line">
      </div>
      <h1 className="title">Next Appointment</h1>
      <div className="appointments-list">

        {loading ? (
          <p className='Loading-Title'>Loading...</p>
        ) : (

          <ul>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <li key={index} className="appointment-item">
                  <div><strong>Name:</strong> {appointment.username.S}</div>
                  <div><strong>Day:</strong> {appointment.day.S}</div>
                  <div><strong>Hour:</strong> {appointment.hour.S}</div>
                  <div><strong>Doctor Name:</strong> {appointment.doctor_name.S}</div>
                  <div><strong>Speciality:</strong> {appointment.speciality.S}</div>
                  <div><strong>Room:</strong> {appointment.room}</div>
                </li>
              ))
            ) : (
              <li className="no-appointments-message">Não há consultas disponíveis.</li>
            )}
          </ul>

        )}
      </div>
    </div>
  );
};

export default Appointment;