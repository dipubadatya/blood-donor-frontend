import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import App from "./App";
import "./index.css";
import './App.css' // <--- CRITICAL IMPORT
import 'leaflet/dist/leaflet.css' // Required for Map visuals
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-right" />
          <App />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);