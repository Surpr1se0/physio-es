import React from 'react'
import { useEffect, useState } from 'react'
import '../styles/AdminPage.css'
import axios from 'axios'; 
import mainLogo from'../Images/logocolor.png';





const Teste = () => {
  const [data, setData] = useState([]);

  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);

  const [loading, setLoading] = useState(true);

  const handleUpdateStatus = async (appointmentId) => {
   

    const updatedAppointment = { ...appointments.find((item) => item.appointment_id === appointmentId), id: appointmentId };
    setError(null);
    const response = await axios.put('http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/update/', updatedAppointment);
    console.log('Appointment status updated successfully!');
    window.location.href = '/adminpage'
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://phisiotherapy-es-env.eba-5duxqbri.us-east-1.elasticbeanstalk.com/listadmin/'); 
     
      setData(response.data);
      setLoading(false);
    };
    document.title = 'Admin Page';

    fetchData();
  }, []);

  return (
    <div className="appointment-list">
    <div className="navbar">
      <div className="item"><h4 className='Name'>Hello Admin</h4></div>
      <div className="item">
        <img className="logo" src={mainLogo} />
      </div>
      <div className="item"><h4 className='Name'>Good Work</h4></div>
    </div>
  
    <div className="line"></div>
    <h2 className='Name2'>Appointment List</h2>
    {loading ? (
      <p className='Loading-Title'>Loading...</p>
    ) : (
      <ul>
        <li className="appointment-header">  {/* Added a header row */}
          <span className='types'>Client</span>
          <span className='types'>Doctor</span>
          <span className='types'>Speciality</span>
          <span className='types'>Day</span>
          <span className='types'>Hour</span>
          <span className='types'>Status</span>
        </li>
        {data.map((item) => (
          <li key={item.appointment_id}> {/* Added a unique key for each item */}
            <span>{item.username}</span>
            <span>{item.doctor_name}</span>
            <span>{item.speciality}</span>
            <span>{item.day}</span>
            <span>{item.hour}</span>
            <span className={ // Condição para definir a classe CSS
              item.status === "pending_payment" ? "payment-status" :
              item.status === "schedule" ? "schedule-status" :
              "finished-status"
            }>{item.status}</span>
            {(item.status !== 'finished' && item.status !== 'pending_payment') ? (
              <button onClick={() => handleUpdateStatus(item.appointment_id)} disabled={loading} className='blue-button'>
                Change to Finished
              </button>
            ) : (
              <span style={{ visibility: 'hidden' }}>
                <button disabled={true} className='blue-button'>
                  Hidden Button
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>)
  
        };
  
  export default Teste;