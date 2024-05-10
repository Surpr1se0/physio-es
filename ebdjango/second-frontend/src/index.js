import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import AdminPage from './page/AdminPage';




ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/adminpage' element={<AdminPage />} />
      <Route path="/" element={<Navigate to="/adminpage" />} />
    </Routes>
  </BrowserRouter>

)


