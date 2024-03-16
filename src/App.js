import { useEffect, useContext ,useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import { UserAuthContext, UserAuthProvider } from "./utils/UserAuthContext";


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

const ProtectedRoute = ({element}) => {
  const { isAuthenticated } = useContext(UserAuthContext);

  if(!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
    <Navbar />
    {element}
    </>

  );

  
};

function AppContent() {
  const {isAuthenticated, setIsAuthenticated } = useContext(UserAuthContext);
 const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/users/check-session`,
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isLoggedIn);
        console.log(response.data.user);
        setUser(response.data.user);
      
      } catch (error) {
        console.error(error);
     
    };

   


  }
   // only check session if isAuthenticated is false
   
  if (!isAuthenticated) {
    checkSession();
  }
  }, [isAuthenticated, setIsAuthenticated]);




  return (
    <Routes>
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<ProtectedRoute element={<Destinations/>}/>} />
      <Route path="/destination/:id" element={<ProtectedRoute element={<DestinationDetails />} />} />

      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/plan/trip" element={<ProtectedRoute element={<PlanTrip user={user}/>} />} />
    </Routes>
  )
  
}

function App() {
  return (
    <UserAuthProvider>
      <Router>
        
        <AppContent />
        <Footer />
      </Router>
    </UserAuthProvider>
  );

}

export default App;
