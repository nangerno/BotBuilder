import React from 'react';
import ReactDOM from 'react-dom/client';
import Basic from './Basic';
import Message from './Message';
import './index.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    {/* <Basic /> */}
    <Message />
  </React.StrictMode>
);
