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
      }
    };

    checkSession();
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm />}
        />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/destinations"
          element={isLoggedIn ? <Destinations /> : <Navigate to="/login" />}
        />
        <Route
          path="/destination/:id"
          element={
            isLoggedIn ? <DestinationDetails /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
