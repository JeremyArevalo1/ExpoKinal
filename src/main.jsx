import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SurveillanceProvider } from './context/SurveillanContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SurveillanceProvider>
      <App />
    </SurveillanceProvider>
  </BrowserRouter>
);
