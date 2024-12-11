import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { Snackbar, Alert } from '@mui/material';
function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState({
    pending: "",
    confirmed: "",
    rejected: "",
    billPaid: "",
    completed: "", // Added for completed appointments search
  });
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
  const userProfile = JSON.parse(localStorage.getItem("user")) || {};
  const userEmail = userProfile.email;

  // Fetch appointments for receptionist
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/users/get-appointments");
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirmAppointment = async (patientEmail, doctorEmail) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/confirm-appointment",
        { patientEmail, doctorEmail },
        { headers: { "Content-Type": "application/json" } }
      );
      //alert(response.data.msg);
      showSnackbar(response.data.msg,'success')
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
     // alert("Failed to confirm appointment.");
     showSnackbar("error to confirm appointment",'error')
    }
  };

  const handleCompleteAppointment = async (patientEmail, doctorEmail) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/complete-appointment",
        { patientEmail, doctorEmail },
        { headers: { "Content-Type": "application/json" } }
      );
     // alert(response.data.msg);
     showSnackbar(response.data.msg,'success')
      fetchAppointments();
    } catch (error) {
      console.error("Error completing appointment:", error);
     // alert("Failed to complete appointment.");
     showSnackbar("Failed to complete appointment",'error')
    }
  };

  const handleRejectAppointment = async (patientEmail, doctorEmail) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/reject-appointment",
        { patientEmail, doctorEmail },
        { headers: { "Content-Type": "application/json" } }
      );
     // alert(response.data.msg);
     showSnackbar(response.data.msg,'success')
      fetchAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
     // alert("Failed to reject appointment.");
     showSnackbar("Failed to reject appointment.",'error')
    }
  };

  // Categorize appointments
  const pendingAppointments = appointments.filter(
    (appointment) =>
      !appointment.status.includes("Confirmed") &&
      !appointment.status.includes("Rejected") &&
      !appointment.status.includes("Completed") &&
      !appointment.status.includes("Bill")
  );

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status.includes("Confirmed")
  );

  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status.includes("Rejected")
  );

  const billPaidAppointments = appointments.filter(
    (appointment) => appointment.status.includes("Bill")
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status.includes("Completed") // Filter for completed appointments
  );

  // Handle search queries for each category
  const handleSearchChange = (category, query) => {
    setSearchQueries((prev) => ({ ...prev, [category]: query }));
  };

  const renderAppointments = (filteredAppointments, category, searchQuery) => {
    const displayedAppointments = filteredAppointments.filter((appointment) =>
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        <TextField
          label={`Search in ${category}`}
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearchChange(category, e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Grid container spacing={3}>
          {displayedAppointments.map((appointment, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 400, margin: "auto" }}>
                <Box sx={{ padding: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Doctor: {appointment.doctorName}</Typography>
                   
                    <Typography variant="h6">Patient: {appointment.patientName}</Typography>
                    
                    <Typography
                      variant="body2"
                      style={{
                        color:
                          appointment.status.includes("Confirmed") ||  appointment.status.includes("Bill")
                            ? "green"
                            : appointment.status.includes("Rejected")
                            ? "red"
                            : appointment.status.includes("Completed")
                            ? "blue" // Blue color for completed status
                            : "orange",
                      }}
                    >
                      Status: {appointment.status}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Date: {appointment.preferredDate}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Time: {appointment.preferredTime}
                    </Typography>
                    {appointment.status.includes("Confirmed") && (
                      <Box sx={{ marginTop: 2 }}>
                        <Button
                          variant="outlined"
                          color="success"
                          sx={{ marginRight: 2 }}
                          onClick={() =>
                            handleCompleteAppointment(
                              appointment.userEmail,
                              appointment.doctorEmail
                            )
                          }
                        >
                          Mark as Completed
                        </Button>
                      </Box>
                    )}
                    {appointment.status.includes("Confirmed") === false &&
                      appointment.status.includes("Rejected") === false &&
                      appointment.status.includes("Completed") === false &&
                      !appointment.status.includes("Bill") && (
                        <Box sx={{ marginTop: 2 }}>
                          <Button
                            variant="outlined"
                            color="success"
                            sx={{ marginRight: 2 }}
                            onClick={() =>
                              handleConfirmAppointment(
                                appointment.userEmail,
                                appointment.doctorEmail
                              )
                            }
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              handleRejectAppointment(
                                appointment.userEmail,
                                appointment.doctorEmail
                              )
                            }
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
      </>
    );
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading appointments...</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">Pending Appointments</Typography>
        {renderAppointments(pendingAppointments, "pending", searchQueries.pending)}
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">Confirmed Appointments</Typography>
        {renderAppointments(confirmedAppointments, "confirmed", searchQueries.confirmed)}
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">Rejected Appointments</Typography>
        {renderAppointments(rejectedAppointments, "rejected", searchQueries.rejected)}
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">Bill Paid Appointments</Typography>
        {renderAppointments(billPaidAppointments, "billPaid", searchQueries.billPaid)}
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">Completed But Bill Not Paid Appointments</Typography>
        {renderAppointments(completedAppointments, "completed", searchQueries.completed)} {/* Added for completed appointments */}
      </Box>
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
    </Box>
  );
}

export default ReceptionistAppointments;
