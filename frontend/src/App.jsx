import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './components/Home';
import About from './components/Aboutus';
import Profile from './components/Profile';
import Appointments from './components/Appointments';
import Login from './components/Login';
import Footer from './pages/Footer';
import Doctors from './components/Doctors';
import ApprovalPage from './components/Approval';
import GenerateBillPage from './components/Bills';
import RatingsAndReviews from './components/Reviews';
import BillsPage from './components/PatientBills';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Track login status
  const [userProfile, setUserProfile] = useState(null); // Store user profile

  useEffect(() => {
    // Check localStorage for token and user data on app load
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setLoggedIn(true);
      setUserProfile(JSON.parse(user));
    }
  }, []);

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<RatingsAndReviews   />} />
          <Route path="/doctors" element={<Doctors setLoggedIn={setLoggedIn} setUserProfile={setUserProfile} />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/approvals" element={<ApprovalPage />} />
          <Route path="/bills" element={<GenerateBillPage />} />
          <Route path="/billsPatient" element={<BillsPage />} />
          {/* Protect profile route with conditional redirect */}
          <Route path="/profile" element={loggedIn ? <Profile userProfile={userProfile} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUserProfile={setUserProfile} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
