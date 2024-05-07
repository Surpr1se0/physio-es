import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminPage from './page/AdminPage';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/adminpage' element={<AdminPage />} />
    </Routes>
  </BrowserRouter>

)


