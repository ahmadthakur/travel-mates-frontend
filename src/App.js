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
import AdminLoginForm from "./components/AdminLoginForm";
import AdminDashboard from "./components/AdminDashboard";
import AdminDestinationsPanel from "./components/AdminDestinationsPanel";
import AdminUsersPanel from "./components/AdminUsersPanel";
import NotFoundPage from "./components/NotFoundPage";
import PlanTrip from "./components/PlanTrip";
import AdminTripsPanel from "./components/AdminTripsPanel";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/users/check-session`,
          { withCredentials: true }
        );
        setIsLoggedIn(response.data.isLoggedIn);
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        // Handle error here
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdminSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/admin/check-session`,
          { withCredentials: true }
        );
        setIsAdminLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error(error);
        // Handle error here
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    checkAdminSession();
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
        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <div>
                <Navigate to="/admin/dashboard" />
              </div>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/admin/login" element={<AdminLoginForm />} />
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
        <Route
          path="/plan/trip"
          element={
            isLoggedIn ? (
              <div>
                <Navbar isLoggedIn={isLoggedIn} />
                <PlanTrip user={user} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/destinations/*"
          element={
            isAdminLoggedIn ? (
              <div>
                <AdminDestinationsPanel />
              </div>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/admin/users/*"
          element={
            isAdminLoggedIn ? (
              <div>
                <AdminUsersPanel />
              </div>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/admin/users/:userId/trips/*"
          element={
            isAdminLoggedIn ? (
              <div>
                <AdminTripsPanel />
              </div>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />{" "}
        {/* This should be the last Route */}
      </Routes>
    </Router>
  );
}

export default App;
