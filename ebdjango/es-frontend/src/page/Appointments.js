import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/Appointments.css'

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
  }, []);

  return (
    <div className="appointments-container">
      <h1>Appointments</h1>
      <button className="logout-button" onClick={handleClick1}>Logout</button>
      <div className="appointments-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {appointments.map((appointment, index) => (
              <li key={index} className="appointment-item">
                <div><strong>Username:</strong> {appointment.username.S}</div>
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
  );
};

export default Appointments;
