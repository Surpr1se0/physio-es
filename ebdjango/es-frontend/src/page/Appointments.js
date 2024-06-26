import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/Appointments.css';

import mainLogo from '../Images/logocolor.png';

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
    window.location.href = '/login'; 
  };

  const readAppointments = async () => {
    const usr = await jwtDecode(localStorage.getItem('accessToken')).user_id;
    try {
      const response = await axios.get(`http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/my-appointments/?user=${usr}`);
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

  const handlePayment = async (appointmentId) => {
    console.log('Payment for appointment ID:', appointmentId.N);
    const usr = await jwtDecode(localStorage.getItem('accessToken')).user_id;
    try {
      const response = await axios.post(`http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/payment/?user=${usr}&appointment=${appointmentId.N}`);
      console.log('Payment response:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <div className="item">
          <h4 className='Name'>Hello {user ? user : 'Convidado'}</h4>
        </div>
        <div className="item">
          <a href="/home">
            <img className="logo" src={mainLogo} alt="Main Logo" />
          </a>
        </div>
        <div className="item">
          <button className="button" onClick={handleClick1}>Logout</button>
        </div>
      </div>

      <div className="line"></div>
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
                {appointment.status.S === 'pending_payment' && (
                  <button className="PaymentButton" onClick={() => handlePayment(appointment.appointment_id)}>Pay Now</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Appointments;
