import React from 'react'
import { useEffect, useState } from 'react'
import '../styles/Appointments.css'

import {jwtDecode} from 'jwt-decode';

import axios from 'axios'; 
import { useHistory } from 'react-router-dom';
import mainLogo from'../Images/logocolor.png';

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
    window.location.href = '/login'; // Redirect to the login page
  };

  const readDoctors = async () => {
    try {
      const response = await axios.get('http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/appointment/');
      setDoctors(response.data);
      console.log('List of Doctors:', response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    readDoctors();
    document.title = 'Appointment Schedule';
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
      const response = await axios.post(`http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/save/?speciality=${selectedSpecialty}&doctor=${selectedDoctor}&time=${selectedTimeSlot}&day=${selecteddaySlot}&user=${user.user_id }`);
      console.log('Appointment Saved:', response.data);
      window.location.href = '/my-appointments';
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };


  const fetchAvailableTimes = async () => {
    setSelectedTimeSlot(null);
    try {
      const response = await axios.get(`http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/test/?speciality=${selectedSpecialty}&doctor=${selectedDoctor}`);
      setAvailableTimes(response.data);
      console.log('Available Times:', response.data);
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
            <img className="logo" src={mainLogo}  />
          </a>
        </div>
          <div className="item"> <button className="button" onClick={handleClick1}>Logout</button></div>
        </div>

         <div className="line">
      </div>
      <h1 className="title">Appointment Schedule</h1>
       
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
          {doctorAvailability.availability[day].length >= 1 && ( // Verifica se há mais de um horário disponível para o dia
            <>
              <strong>{day}:</strong>
              <ul>
                {doctorAvailability.availability[day].map((timeSlot, timeIndex) => (
                  <li key={timeIndex} className='slot' onClick={() => handleTimeSlotSelect(timeSlot, doctorAvailability.doctor,day)}>
                    {timeSlot}
                  </li>
                ))}
              </ul>
            </>
          )}
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