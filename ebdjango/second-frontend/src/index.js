import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Teste from './page/teste';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/adminpage' element={<Teste />} />
    </Routes>
  </BrowserRouter>

)


