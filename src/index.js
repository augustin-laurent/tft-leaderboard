import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/tailwind.css';
import App from './components/TFTTable';
import Timer from './components/Timer';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="bg-meteor bg-no-repeat bg-cover">
      <div>
        <h1 className='text-6xl antialiased font-bold text-center text-slate-50'>Leaderboard du Discord qui pue là</h1>
      </div>
      <Timer />
      <App />
    </div>
  </React.StrictMode>
);

reportWebVitals();
