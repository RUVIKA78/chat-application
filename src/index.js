import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react'
import ChatProvider from './context/chat.provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <BrowserRouter>
  <ChatProvider>
    
      <ChakraProvider>
        <App />
      </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>


 
);

reportWebVitals();
