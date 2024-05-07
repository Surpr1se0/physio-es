import React from 'react'
import { useEffect, useState } from 'react'
import '../styles/teste.css'

import {jwtDecode} from 'jwt-decode';

import axios from 'axios'; 





const Teste = () => {
  const [data, setData] = useState([]);

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateStatus = async (appointmentId) => {
   

    const updatedAppointment = { ...appointments.find((item) => item.appointment_id === appointmentId), id: appointmentId };
    setError(null);
    const response = await axios.put('http://localhost:8000/update/', updatedAppointment);
    console.log('Appointment status updated successfully!');
    window.location.href = '/teste'
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:8000/listadmin/'); // Replace with your Django API URL
     
      setData(response.data);
    };

    fetchData();
  }, []);

  return (
    <div className="appointment-list">
      <div>
        <img src="path/to/your/logo.png" alt="Logo (replace with alt text)"></img>
      </div>
      
      <h2>Appointment List</h2>
      <ul>
        {data.map((item) => (
          <li>
          {/* Display item data using JSX */}
          <span>Client: {item.username}</span>
          <span>Doctor: {item.doctor_name}</span>
          <span>Speciality: {item.speciality}</span>
          <span>Day: {item.day}</span>
          <span>Hour: {item.hour}</span>
          <span>Status: {item.status}</span>
          {item.status !== 'finished' && (
                <button onClick={() => handleUpdateStatus(item.appointment_id)} disabled={isLoading}>
                  Change Schedule to Finished
                </button>)
}
        </li>
        ))}
      </ul>
    </div>
  );
        };
  
  export default Teste;