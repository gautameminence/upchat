import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { App } from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./assets/scss/style.scss";

ReactDOM.createRoot(document.getElementById("chat-bot")).render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);
