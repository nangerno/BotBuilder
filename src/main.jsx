import React from 'react';
import ReactDOM from 'react-dom/client';
import Basic from './Basic';
import Message from './Message';
import TestComponent from './TestComponent';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    {/* <Basic /> */}
    {/* <TestComponent /> */}
    <Message />
  </React.StrictMode>
);
