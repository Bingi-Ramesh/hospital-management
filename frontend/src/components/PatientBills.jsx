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
  Grid,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', or 'info'
  });
  const userProfile = JSON.parse(localStorage.getItem("user")) || {};
  const userEmail = userProfile?.email;

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/get-bills");
        const filteredBills = response.data.bills.filter(
          (bill) => bill.patientEmail === userEmail
        );
        setBills(filteredBills);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [userEmail]);

  const handleShowMoreDetails = (bill) => {
    setSelectedBill(bill);
    setOpen(true);
  };

  const handleCloseDetails = () => {
    setOpen(false);
    setSelectedBill(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bills
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : bills.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No bills found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginY: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Doctor Name</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill, index) => (
                <TableRow key={bill._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{bill.patientName}</TableCell>
                  <TableCell>{bill.doctorName}</TableCell>
                  <TableCell>{bill.totalCost}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleShowMoreDetails(bill)}
                    >
                      Show More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for showing bill details */}
      <Dialog open={open} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#3f51b5",
            color: "white",
          }}
        >
          Bill Details
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDetails}
            aria-label="close"
            sx={{ padding: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 4 }}>
          {selectedBill && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Patient Name:
                </Typography>
                <Typography>{selectedBill.patientName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Doctor Name:
                </Typography>
                <Typography>{selectedBill.doctorName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Patient Email:
                </Typography>
                <Typography>{selectedBill.patientEmail}</Typography>
              </Grid>
             
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Appointment Charge:
                </Typography>
                <Typography>{selectedBill.appointmentCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Consultation Charge:
                </Typography>
                <Typography>{selectedBill.consultationCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Blood Test Charge:
                </Typography>
                <Typography>{selectedBill.bloodTestCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  X-Ray Charge:
                </Typography>
                <Typography>{selectedBill.xrayCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  MRI Charge:
                </Typography>
                <Typography>{selectedBill.mriCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  CT Scan Charge:
                </Typography>
                <Typography>{selectedBill.ctScanCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Treatment Charge:
                </Typography>
                <Typography>{selectedBill.treatmentCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Room Charge:
                </Typography>
                <Typography>{selectedBill.roomCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Diet Charge:
                </Typography>
                <Typography>{selectedBill.dietCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Ambulance Charge:
                </Typography>
                <Typography>{selectedBill.ambulanceCharge}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total Cost:
                </Typography>
                <Typography>{selectedBill.totalCost}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillsPage;
