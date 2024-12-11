import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Snackbar,Alert} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const GenerateBillPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [billDetails, setBillDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', or 'info'
  });

  // const loggedIn = !!userProfile?.userType;
  
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/get-appointments");
        const data = response.data.appointments;

        if (Array.isArray(data)) {
          const completedAppointments = data.filter(
            (appointment) => appointment.status === "Completed"
          );
          setAppointments(completedAppointments);
        } else {
          throw new Error("Invalid response structure: 'appointments' is not an array");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchBills = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/get-bills");
        setBills(response.data.bills || []);
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };

    fetchAppointments();
    fetchBills();
  }, []);

  const handleOpenForm = (appointment) => {
    setSelectedAppointment(appointment);
    setBillDetails({
      patientName: appointment.patientName,
      doctorEmail:appointment.doctorEmail,
      patientEmail: appointment.userEmail,
      doctorName: appointment.doctorName,
      appointmentCharge: "",
      consultationCharge: "",
      bloodTestCharge: "",
      xrayCharge: "",
      mriCharge: "",
      ctScanCharge: "",
      treatmentCharge: "",
      roomCharge: "",
      dietCharge: "",
      ambulanceCharge: "",
    });
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const handleInputChange = (field, value) => {
    setBillDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const calculateTotalCost = () => {
    const {
      appointmentCharge,
      consultationCharge,
      bloodTestCharge,
      xrayCharge,
      mriCharge,
      ctScanCharge,
      treatmentCharge,
      roomCharge,
      dietCharge,
      ambulanceCharge,
    } = billDetails;

    return (
      Number(appointmentCharge || 0) +
      Number(consultationCharge || 0) +
      Number(bloodTestCharge || 0) +
      Number(xrayCharge || 0) +
      Number(mriCharge || 0) +
      Number(ctScanCharge || 0) +
      Number(treatmentCharge || 0) +
      Number(roomCharge || 0) +
      Number(dietCharge || 0) +
      Number(ambulanceCharge || 0)
    );
  };

  const handleGenerateBill = async () => {
    try {
      const totalCost = calculateTotalCost();
      const billData = { ...billDetails, totalCost };
      await axios.post("http://localhost:8000/api/users/generate-bill", billData);
      //alert("Bill generated successfully!");
      showSnackbar("Bill generated Successfully...",'success')
      handleCloseForm();
    const respo=  await axios.put("http://localhost:8000/api/users/complete-bill", billData);  
   // alert(respo.data.msg)
      // Fetch bills again to update the displayed list
      const response = await axios.get("http://localhost:8000/api/users/get-bills");
      setBills(response.data.bills || []);
    } catch (err) {
      console.error("Error generating bill:", err);
     // alert("Failed to generate the bill.");
     showSnackbar("failed to generate bill",'error')
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBills = bills.filter((bill) =>
    bill.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Bill
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : appointments.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No completed appointments found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginY: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.preferredDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenForm(appointment)}
                    >
                      Generate Bill
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h5" gutterBottom>
        Generated Bills
      </Typography>
      <TextField
        label="Search by Patient Name"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: 2 }}
      />
      <TableContainer component={Paper} sx={{ marginY: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBills.length > 0 ? (
              filteredBills.map((bill, index) => (
                <TableRow key={bill._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{bill.patientName}</TableCell>
                  <TableCell>{bill.doctorName}</TableCell>
                  <TableCell>{bill.totalCost}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No bills found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>Generate Bill</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Patient Name"
                  value={billDetails.patientName}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Patient Email"
                  value={billDetails.patientEmail}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Doctor Name"
                  value={billDetails.doctorName}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Appointment Charge"
                  type="number"
                  value={billDetails.appointmentCharge}
                  onChange={(e) => handleInputChange("appointmentCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Consultation Charge"
                  type="number"
                  value={billDetails.consultationCharge}
                  onChange={(e) => handleInputChange("consultationCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Blood Test Charge"
                  type="number"
                  value={billDetails.bloodTestCharge}
                  onChange={(e) => handleInputChange("bloodTestCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="X-Ray Charge"
                  type="number"
                  value={billDetails.xrayCharge}
                  onChange={(e) => handleInputChange("xrayCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="MRI Charge"
                  type="number"
                  value={billDetails.mriCharge}
                  onChange={(e) => handleInputChange("mriCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="CT Scan Charge"
                  type="number"
                  value={billDetails.ctScanCharge}
                  onChange={(e) => handleInputChange("ctScanCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Treatment Charge"
                  type="number"
                  value={billDetails.treatmentCharge}
                  onChange={(e) => handleInputChange("treatmentCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Room Charge"
                  type="number"
                  value={billDetails.roomCharge}
                  onChange={(e) => handleInputChange("roomCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Diet Charge"
                  type="number"
                  value={billDetails.dietCharge}
                  onChange={(e) => handleInputChange("dietCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ambulance Charge"
                  type="number"
                  value={billDetails.ambulanceCharge}
                  onChange={(e) => handleInputChange("ambulanceCharge", e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography variant="h6">Total Cost: {calculateTotalCost()}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateBill}
            sx={{ marginTop: 2 }}
          >
            Generate Bill
          </Button>
        </DialogContent>
      </Dialog>
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
};

export default GenerateBillPage;
