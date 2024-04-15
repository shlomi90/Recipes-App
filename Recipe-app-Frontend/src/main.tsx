import React from 'react';
import ReactDOM from 'react-dom/client';
import './Style/index.css'
import App from './components/App.tsx';

import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GoogleOAuthProvider clientId="66612887488-e7t55mjmt0hlurddctqqo89jev78cauo.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
  
);




