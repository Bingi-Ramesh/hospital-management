import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardActions, Button, Typography, Grid, Box, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

function Doctors({ setLoggedIn, setUserProfile }) {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  const userProfile = JSON.parse(localStorage.getItem('user')) || {};
  const loggedIn = !!userProfile?.userType;
  const isAdmin = userProfile?.userType?.toLowerCase() === 'admin';
  const userEmail = userProfile?.email;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/users/getdoctors');
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchReceptionists = async () => {
    if (isAdmin) {
      try {
        const response = await axios.get('http://localhost:8000/api/users/get-receptionists');
        setReceptionists(response.data.receptionists);
      } catch (error) {
        console.error("Error fetching receptionists:", error);
      }
    }
  };

  const fetchPatients = async () => {
    if (isAdmin) {
      try {
        const response = await axios.get('http://localhost:8000/api/users/get-patients');
        setPatients(response.data.patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      setLoggedIn(false);
    }
  }, [loggedIn, setLoggedIn]);

  useEffect(() => {
    fetchDoctors();
    fetchReceptionists();
    fetchPatients();
  }, []);

  const handleBookAppointmentClick = (doctor) => {
    if (!loggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedDoctor(doctor);
    setOpenBookingDialog(true);
  };

  const handleBookingSubmit = async () => {
    if (!preferredDate || !preferredTime) {
      showSnackbar("Please select valid date and time", 'warning');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/register-appointment', {
        doctorEmail: selectedDoctor.email,
        userEmail,
        preferredDate,
        preferredTime,
      });
      showSnackbar(response.data.msg || `Appointment booking request sent with Dr. ${selectedDoctor.fullName}`, 'success');
      const response1 = await axios.post('http://localhost:8000/api/users/appointments', {
        doctorEmail: selectedDoctor.email,
        userEmail,
        preferredDate,
        preferredTime,
      });
      console.log(response1.data)
      setOpenBookingDialog(false);
      setPreferredDate('');
      setPreferredTime('');
    } catch (error) {
      console.error("Error booking appointment:", error);
      showSnackbar("Failed to book an appointment", 'error');
    }
  };

  const handleDeleteDoctor = async (email) => {
    try {
      await axios.delete('http://localhost:8000/api/users/delete-doctor', { data: { email } });
      showSnackbar("Doctor removed successfully", 'success');
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      showSnackbar("Failed to remove doctor", 'error');
    }
  };

  const handleDeleteReceptionist = async (id) => {
    try {
      await axios.post('http://localhost:8000/api/users/delete-receptionist', { id });
      showSnackbar("Receptionist removed successfully", 'success');
      fetchReceptionists();
    } catch (error) {
      console.error("Error deleting receptionist:", error);
      showSnackbar("Failed to remove receptionist", 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserProfile(null);
    setLoggedIn(false);
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <>
     <Typography variant="h5" gutterBottom textAlign={'center'} sx={{ color: '#8A2BE2' }} >Doctors</Typography>
      <Grid container spacing={2} sx={{ padding: '20px' }}>
       
        
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.email}>
            <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth:600, margin: 'auto' }}>
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 2 ,mb:5}}>
      <img
        src={doctor.profile|| 'default-profile.jpg'} // Replace with actual profile image URL or a default image
        alt={doctor.fullName}
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #ccc',
        }}
      />
    </Box>
              <Box sx={{ flex: 1, padding: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{doctor.fullName}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>{doctor.specializations}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>{doctor.course}</Typography>
                  <Typography variant="body2" color="text.secondary">{doctor.email}</Typography>
                </CardContent>
                <CardActions>
                {!isAdmin && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleBookAppointmentClick(doctor)}
                  >
                    Book Appointment
                  </Button>
                )}
                  {loggedIn && isAdmin && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteDoctor(doctor.email)}
                    >
                      Remove Doctor
                    </Button>
                  )}
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      { loggedIn && isAdmin && (
        <> 
         <Typography variant="h5" gutterBottom textAlign={'center'} sx={{ color: '#8A2BE2' }}>Receptionists</Typography>
         <Grid container spacing={2} sx={{ padding: '20px' }}>
       
        
       {receptionists.map((doctor) => (
         <Grid item xs={12} sm={6} md={4} key={doctor.email}>
           <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, margin: 'auto' }}>
           <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 2 ,mb:5}}>
     <img
       src={doctor.profile|| 'default-profile.jpg'} // Replace with actual profile image URL or a default image
       alt={doctor.fullName}
       style={{
         width: 100,
         height: 100,
         borderRadius: '50%',
         objectFit: 'cover',
         border: '2px solid #ccc',
       }}
     />
   </Box>
             <Box sx={{ flex: 1, padding: 2 }}>
               <CardContent>
                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{doctor.fullName}</Typography>
                 <Typography variant="body1" sx={{ color: 'text.secondary' }}>Receptionist</Typography>
                 <Typography variant="body2" color="text.secondary">{doctor.email}</Typography>
               </CardContent>
               <CardActions>
              
                 {loggedIn && isAdmin && (
                   <Button
                     size="small"
                     variant="outlined"
                     color="error"
                     onClick={() => handleDeleteReceptionist(doctor._id)}
                   >
                     Remove Receptionist
                   </Button>
                 )}
               </CardActions>
             </Box>
           </Card>
         </Grid>
       ))}
     </Grid>
        </>
      )}

      

{ loggedIn && isAdmin && (
        <> 
         <Typography variant="h5" gutterBottom textAlign={'center'} sx={{ color: '#8A2BE2' }}>Patients</Typography>
         <Grid container spacing={2} sx={{ padding: '20px' }}>
       
        
       {patients.map((doctor) => (
         <Grid item xs={12} sm={6} md={4} key={doctor.email}>
           <Card sx={{ display: 'flex', flexDirection: 'row', maxWidth: 600, margin: 'auto' }}>
           <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 2 ,mb:5}}>
     <img
       src={doctor.profile|| 'default-profile.jpg'} // Replace with actual profile image URL or a default image
       alt={doctor.fullName}
       style={{
         width: 100,
         height: 100,
         borderRadius: '50%',
         objectFit: 'cover',
         border: '2px solid #ccc',
       }}
     />
   </Box>
             <Box sx={{ flex: 1, padding: 2 }}>
               <CardContent>
                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{doctor.fullName}</Typography>
                 <Typography variant="body1" sx={{ color: 'text.secondary' }}>Patient</Typography>
                 <Typography variant="body2" color="text.secondary">{doctor.email}</Typography>
               </CardContent>
              
             </Box>
           </Card>
         </Grid>
       ))}
     </Grid>
        </>
      )}





      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)}>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="Preferred Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Preferred Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingSubmit} color="primary">Submit</Button>
          <Button onClick={() => setOpenBookingDialog(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>You need to log in to book an appointment.</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => setShowLoginPrompt(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            border: '3px solid',
            borderColor: snackbar.severity === 'success' ? 'green' : 
                         snackbar.severity === 'error' ? 'red' : 
                         snackbar.severity === 'warning' ? 'yellow' : 'blue',
            backgroundColor: snackbar.severity === 'success' ? 'green' : 
                             snackbar.severity === 'error' ? 'red' : 
                             snackbar.severity === 'warning' ? 'yellow' : 'blue',
            color: 'white',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Doctors;
