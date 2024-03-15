import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

import axios from "axios";

//import components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

//import pages
import NotFoundPage from "./pages/NotFoundPage";

//import user pages
import LoginForm from "./pages/user/LoginForm";
import RegistrationForm from "./pages/user/RegistrationForm";
import Dashboard from "./pages/user/Dashboard";
import Destinations from "./pages/user/Destinations";
import DestinationDetails from "./pages/user/DestinationDetails";
import PlanTrip from "./pages/user/PlanTrip";

//import admin pages
import AdminLoginForm from "./pages/admin/AdminLoginForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDestinationsPanel from "./pages/admin/AdminDestinationsPanel";
import AdminUsersPanel from "./pages/admin/AdminUsersPanel";
import AdminTripsPanel from "./pages/admin/AdminTripsPanel";
import AdminAccommodationsPanel from "./pages/admin/AdminAccommodationPanel";
import AdminNotificationsPanel from "./pages/admin/AdminNotificationsPanel";

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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner size="xl" />
      </div>
    );
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
        <Route
          path="/admin/accommodations/*"
          element={
            isAdminLoggedIn ? (
              <div>
                <AdminAccommodationsPanel />
              </div>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/admin/users/:UserID/notifications/*"
          element={
            isAdminLoggedIn ? (
              <div>
                <AdminNotificationsPanel />
              </div>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />{" "}
        {/* This should be the last Route */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
