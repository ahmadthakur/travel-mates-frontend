import React, { useEffect, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import { UserAuthContext, UserAuthProvider } from "./utils/UserAuthContext";
import { AdminAuthContext, AdminAuthProvider } from "./utils/AdminAuthContext";


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


// Protected route component for user
const ProtectedRoute = ({ element }) => {

  const { isAuthenticated } = useContext(UserAuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
    {React.cloneElement(element, { navbar: <Navbar /> })}
  </>
  );
};

// Protected route component for admin
const AdminProtectedRoute = ({ element }) => {
  const { isAdminAuthenticated } = useContext(AdminAuthContext);  
   
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" />;
  }

 return element;
};

function AppContent() {
  const {isAuthenticated, setIsAuthenticated } = useContext(UserAuthContext);
  const {isAdminAuthenticated,  setIsAdminAuthenticated } = useContext(AdminAuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/users/check-session`,
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isLoggedIn);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.isLoggedIn));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    const checkAdminSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/admins/check-session`,
          { withCredentials: true }
        );
        setIsAdminAuthenticated(response.data.isLoggedIn);
        setUser(response.data.user);
        localStorage.setItem('admin', JSON.stringify(response.data.isLoggedIn));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    const isUserLoggedIn = JSON.parse(localStorage.getItem('user'));
  const isAdminLoggedIn = JSON.parse(localStorage.getItem('admin'));

  if (isUserLoggedIn !== null) {
    setIsAuthenticated(isUserLoggedIn);
    setUser(isUserLoggedIn.user);
    setLoading(false);
  } else {
    checkSession();
  }

  if (isAdminLoggedIn !== null) {
    setIsAdminAuthenticated(isAdminLoggedIn);
    setLoading(false);
  } else {
    checkAdminSession();
  }
}, [setIsAuthenticated, setIsAdminAuthenticated, setUser]);

  if (loading) {
    return <div>Loading...</div>; // Render loading spinner
  }

  // Render actual content
  return (
    <Routes>
      {/* User routes */}
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<ProtectedRoute element={<Destinations />} />} />
      <Route
        path="/destination/:id"
        element={<ProtectedRoute element={<DestinationDetails />} />}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route
        path="/plan/trip"
        element={<ProtectedRoute element={<PlanTrip user={user} />} />}
      />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginForm />} />
      <Route
        path="/admin/"
        element={<AdminProtectedRoute element={<AdminDashboard />} />}
      />
      <Route
        path="/admin/destinations"
        element={<AdminProtectedRoute element={<AdminDestinationsPanel />} />}
      />
      <Route
        path="/admin/users"
        element={<AdminProtectedRoute element={<AdminUsersPanel />} />}
      />
      <Route
        path="/admin/users/:userId/trips"
        element={<AdminProtectedRoute element={<AdminTripsPanel />} />}
      />
      <Route
        path="/admin/accommodations"
        element={<AdminProtectedRoute element={<AdminAccommodationsPanel />} />}
      />
      <Route
        path="/admin/users/:UserID/notifications"
        element={<AdminProtectedRoute element={<AdminNotificationsPanel />} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <UserAuthProvider>
      <AdminAuthProvider>
      <Router>
        <AppContent />
        <Footer />
      </Router>
      </AdminAuthProvider>
    </UserAuthProvider>
  );
}

 

export default App;
