import React from 'react';
import ReactDOM from 'react-dom/client';


import Login from './page/LoginPage';

import Home from './page/HomePage';

import Appointment from './page/Appointment';

import Appointments from './page/Appointments';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/appointment' element={<Appointment />} />
      <Route path='/my-appointments' element={<Appointments />} />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/swagger" element={<SwaggerUI url="swagger.yml" />} />
    
    </Routes>
  </BrowserRouter>

)


