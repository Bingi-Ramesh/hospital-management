import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import {Snackbar,Alert} from '@mui/material'
import ReceptionistAppointments from './ReceptionistAppointments';
function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', or 'info'
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const userProfile = JSON.parse(localStorage.getItem('user')) || {};
  const userEmail = userProfile.email;
  const userType = userProfile.userType;

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/users/getappointments', {
        params: { userEmail, userType },
      });
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
     // alert("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await axios.get('http://localhost:8000/api/users/getdoctors');
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      //alert("Failed to fetch doctors' details.");
      showSnackbar("Failed to fetch doctors details",'error')
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    if (userType === 'admin') {
      fetchDoctors();
    } else if (userEmail && userType) {
      fetchAppointments();
    }
  }, [userEmail, userType]);

  const handleViewAppointments = (appointments) => {
    setSelectedDoctorAppointments(appointments);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctorAppointments(null);
  };

  const handleConfirmAppointment = async (patientEmail) => {
    try {
      const response = await axios.put(
        'http://localhost:8000/api/users/confirm-appointment',
        { patientEmail, doctorEmail: userEmail },
        { headers: { 'Content-Type': 'application/json' } }
      );
     // alert(response.data.msg);
     showSnackbar(response.data.msg,'success')
      fetchAppointments();
    } catch (error) {
      console.error("Error in handleConfirmAppointment:", error.response || error.message);
     // alert(error.response?.data?.msg || "Failed to confirm appointment. Please try again.");
     showSnackbar(error.response?.data?.msg || "Failed to confirm appointment. Please try again.",'error')
    }
  };

  const handleRejectAppointment = async (patientEmail) => {
    try {
      const response = await axios.put(
        'http://localhost:8000/api/users/reject-appointment',
        { patientEmail, doctorEmail: userEmail },
        { headers: { 'Content-Type': 'application/json' } }
      );
     // alert(response.data.msg);
     showSnackbar(response.data.msg,'success')
      fetchAppointments();
    } catch (error) {
      console.error("Error in handleRejectAppointment:", error.response || error.message);
      //alert(error.response?.data?.msg || "Failed to reject appointment. Please try again.");
      showSnackbar(error.response?.data?.msg || "Failed to reject appointment. Please try again.",'error')
    }
  };

  const currentDate = new Date();

  const sortedAppointments = (list) => {
    const upcoming = list.filter((appointment) => new Date(appointment.date) >= currentDate);
    const past = list.filter((appointment) => new Date(appointment.date) < currentDate);

    return { upcoming, past };
  };

  const { upcoming: upcomingAppointments, past: pastAppointments } = sortedAppointments(appointments);

  const renderAppointments = (list, label) => (
    <>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        {label}
      </Typography>
      {list.length > 0 ? (
        <Grid container spacing={3} sx={{ marginTop: 1 }}>
          {list.map((appointment, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 400, margin: 'auto' }}>
                <Box sx={{ padding: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{appointment.doctorName || appointment.patientName}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {appointment.doctorEmail || appointment.patientEmail}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color:
                          label === "Past Appointments"
                            ? "blue"
                            : appointment.status.includes("Confirmed")
                            ? "green"
                            : appointment.status.includes("Rejected")
                            ? "red"
                            : "green",
                      }}
                    >
                      Status: {label === "Past Appointments" ? "Completed" : appointment.status}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Date: {appointment.date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Time: {appointment.time}
                    </Typography>
                   
                    {userType === 'doctor' && label !== "Past Appointments" &&  appointment.status.includes('ending') && (
                      <Box sx={{ marginTop: 2 }}>
                        <Button
                          variant="outlined"
                          color="success"
                          sx={{ marginRight: 2 }}
                          onClick={() => handleConfirmAppointment(appointment.patientEmail)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRejectAppointment(appointment.patientEmail)}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No {label.toLowerCase()} found.</Typography>
      )}
    </>
  );
  

  if (loading || (userType === 'admin' && loadingDoctors)) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }
if(userType==='receptionist'){
  return(
    <ReceptionistAppointments />
  )
}
  if (userType === 'admin') {
    return (
      <Grid container spacing={3} sx={{ padding: '20px' }}>
        {doctors.map((doctor, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 400, margin: 'auto' }}>
              <Box sx={{ padding: 2 }}>
                <CardContent>
                  <Typography variant="h6">{doctor.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {doctor.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Appointments: {doctor.appointments?.length || 0}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={() => handleViewAppointments(doctor.appointments)}
                  >
                    View Appointments
                  </Button>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Doctor's Appointments</DialogTitle>
          <DialogContent>
            {selectedDoctorAppointments ? (
              <Grid container spacing={2}>
                {selectedDoctorAppointments.map((appointment, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ maxWidth: 400, margin: 'auto' }}>
                      <Box sx={{ padding: 2 }}>
                        <CardContent>
                          <Typography variant="h6">Patient Name: {appointment.patientName}</Typography>
                          <Typography
                            variant="body2"
                            style={{
                              color: appointment.status.includes("Confirmed")
                                ? "green"
                                : appointment.status.includes("Rejected")
                                ? "red"
                                : "red",
                            }}
                          >
                            Status: {appointment.status}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Date: {appointment.date}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Time: {appointment.time}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No appointments available.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }

  return (
    <>
      {renderAppointments(upcomingAppointments, "Upcoming Appointments")}
      {renderAppointments(pastAppointments, "Past Appointments")}
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
      border: '3px solid', // Increases the border thickness
      borderColor: snackbar.severity === 'success' ? '#66bb6a' : // Medium Green
                   snackbar.severity === 'error' ? '#ef5350' : // Medium Red
                   snackbar.severity === 'warning' ? '#ffb74d' : '#64b5f6', // Medium Yellow and Blue
      backgroundColor: snackbar.severity === 'success' ? '#66bb6a' : // Medium Green
                        snackbar.severity === 'error' ? '#ef5350' : // Medium Red
                        snackbar.severity === 'warning' ? '#ffb74d' : '#64b5f6', // Medium Yellow and Blue
      color: 'white', // Ensures the text is visible
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
    </>
  );
}

export default Appointments;


