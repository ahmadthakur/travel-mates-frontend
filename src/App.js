import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./components/Dashboard";
import Destinations from "./components/Destinations";
import DestinationDetails from "./components/DestinationDetails";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/check-session`,
          { withCredentials: true }
        );
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error(error);
        // Handle error here
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or replace with a loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/destinations" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div>
                <Navbar isLoggedIn={isLoggedIn} />
                <Dashboard />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/destinations"
          element={
            isLoggedIn ? (
              <div>
                <Navbar isLoggedIn={isLoggedIn} />
                <Destinations />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/destination/:id"
          element={
            isLoggedIn ? (
              <div>
                <Navbar isLoggedIn={isLoggedIn} />
                <DestinationDetails />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
