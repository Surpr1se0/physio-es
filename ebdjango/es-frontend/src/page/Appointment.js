import React from 'react'
import { useEffect, useState } from 'react'
import '../styles/Appointments.css'

import {jwtDecode} from 'jwt-decode';

import axios from 'axios'; 
import { useHistory } from 'react-router-dom';


const Appointment = () => {
  const [user, setUser] = useState(undefined);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selecteddaySlot, setselecteddaySlot] = useState(null);


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

  const readDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/appointment/');
      setDoctors(response.data);
      console.log('List of Doctors:', response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    readDoctors();
  }, []);

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
    setSelectedDoctor(''); // Reset selected doctor when changing specialty
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleTimeSlotSelect = (timeSlot,doctorIndex,day) => {
    setselecteddaySlot(day);
    setSelectedTimeSlot(timeSlot);
    setSelectedDoctor(doctorIndex);
  };

  const redirectToAppointmentPage = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/save/?speciality=${selectedSpecialty}&doctor=${selectedDoctor}&time=${selectedTimeSlot}&day=${selecteddaySlot}&user=${user}`);
      console.log('Appointment Saved:', response.data);
      window.location.href = '/my-appointments';
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };


  const fetchAvailableTimes = async () => {
    setSelectedTimeSlot(null);
    try {
      const response = await axios.get(`http://localhost:8000/test/?speciality=${selectedSpecialty}&doctor=${selectedDoctor}`);
      setAvailableTimes(response.data);
      console.log('Available Times:', response.data);
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Physio</h1>
        <button className="logout-button" onClick={handleClick1}>Logout</button>
      <div className="selection-container">
        <label>Select Specialty:</label>
        <select value={selectedSpecialty} onChange={handleSpecialtyChange}>
          <option value="">Select</option>
          {[...new Set(doctors.map(doctor => doctor.speciality))].map((specialty, index) => (
            <option key={index} value={specialty}>{specialty}</option>
          ))}
        </select>
        <label>Select Doctor (Optional):</label>
        <select value={selectedDoctor} onChange={handleDoctorChange}>
          <option value="">Select</option>
          {doctors && doctors.filter(doctor => doctor.speciality === selectedSpecialty).map((doctor, index) => (
            <option key={index} value={doctor.name}>{doctor.name}</option>
          ))}
        </select>
        <button onClick={fetchAvailableTimes}>Check Available Times</button>
      </div>
      <div className="appointment-times">
  <h2>Available Appointment Times</h2>
  {availableTimes.map((doctorAvailability, doctorIndex) => (
    <div key={doctorIndex}>
      <h3>{`Doctor ${doctorAvailability.doctor}`}</h3> {/* Display doctor's name */}
      <ul>
        {Object.keys(doctorAvailability.availability).map((day, dayIndex) => (
          <li key={dayIndex}>
            <strong>{day}:</strong>
            <ul>
              {doctorAvailability.availability[day].map((timeSlot, timeIndex) => (
                
                <li key={timeIndex} className='slot' onClick={() => handleTimeSlotSelect(timeSlot, doctorAvailability.doctor,day)}>
                  {timeSlot}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  ))}
  {selectedTimeSlot && (
    <button className='btn' onClick={redirectToAppointmentPage}>Select Slot with {selectedDoctor} {selecteddaySlot} {selectedTimeSlot}</button>
  )}
</div>

    </div>
  );
};

export default Appointment;