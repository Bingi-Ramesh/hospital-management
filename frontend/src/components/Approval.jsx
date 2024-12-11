import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, Box, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import {Snackbar,Alert} from '@mui/material'
const ApprovalPage = () => {
  const [approvals, setApprovals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReceptionistDialog, setOpenReceptionistDialog] = useState(false);
const [receptionistData, setReceptionistData] = useState({
  fullName: '',
  age: '',
  email: '',
  password: '',
  userType: 'receptionist',
});
  const [doctorData, setDoctorData] = useState({
    fullName: '',
    age: '',
    email: '',
    password: '',
    userType: 'doctor', // Default value
    specializations: '',
    course: '',
    profile: null,  // Store the profile image as a file
    certificates: []  // Store certificates as an array of files
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
  // Fetch approval data from the backend
  const fetchApprovals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/getapprovals');
      const data = response.data;
      if (data.msg === 'success' && Array.isArray(data.approvals)) {
        setApprovals(data.approvals);
      } else {
        showSnackbar("unexpected format",'error')
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
     // alert('Failed to fetch approval data.');
    // showSnackbar("failed to fetch approval data",'error')
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleOpenReceptionistDialog = () => setOpenReceptionistDialog(true);
  const handleCloseReceptionistDialog = () => {
    setOpenReceptionistDialog(false);
    setReceptionistData({
      fullName: '',
      age: '',
      email: '',
      password: '',
      userType: 'receptionist',
    });
  };
  
  const handleReceptionistInputChange = (e) => {
    const { name, value } = e.target;
    setReceptionistData({
      ...receptionistData,
      [name]: value,
    });
  };
  
  const handleSubmitReceptionist = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/users/register-receptionist', receptionistData);
      showSnackbar(response.data.msg, 'success');
      handleCloseReceptionistDialog();
    } catch (error) {
      console.error('Error adding receptionist:', error);
      showSnackbar(error.response?.data?.msg || 'Failed to add receptionist.', 'error');
    }
  };
  
  // Handle Admit action
  const handleAdmit = async (approval) => {
    try {
      const data = {
        fullName: approval.fullName,
        age: approval.age,
        email: approval.email,
        password: approval.password,
        userType: approval.userType,
        specializations: approval.specializations,
        course: approval.course,
        certificates: approval.certificates,
        profile: approval.profile
      };

      const respo = await axios.post('http://localhost:8000/api/users/doctors', data);
      if (respo.data.msg.includes('admitted')) {
        //alert('Successfully admitted...');
        showSnackbar("successfully admitted",'success')
      }

      await axios.post('http://localhost:8000/api/users/delete-approval', data);
      fetchApprovals();
    } catch (error) {
      console.error('Admit Error:', error);
     // alert(error.response?.data?.msg || 'Failed to admit user.');
     showSnackbar(error.response?.data?.msg || 'Failed to admit user.','error')
    }
  };

  // Handle Cancel action
  const handleCancel = async (approval) => {
    try {
      const data = {
        email: approval.email,
      };
      const response = await axios.post('http://localhost:8000/api/users/delete-approval', data);
      //alert(response.data.msg);
      showSnackbar(response.data.msg,'success')
      fetchApprovals();
    } catch (error) {
      console.error('Cancel Error:', error);
     // alert(error.response?.data?.msg || 'Failed to cancel approval request.');
     showSnackbar(error.response?.data?.msg || 'Failed to cancel approval request.','error')
    }
  };

  // Handle opening and closing the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDoctorData({
      fullName: '',
      age: '',
      email: '',
      password: '',
      userType: 'doctor',
      specializations: '',
      course: '',
      profile: null, // Reset profile image
      certificates: [] // Reset certificates
    });
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value
    });
  };

  // Handle file input for profile image and certificates
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'profile') {
      setDoctorData({
        ...doctorData,
        profile: files[0] // Only one file for the profile image
      });
    } else if (name === 'certificates') {
      setDoctorData({
        ...doctorData,
        certificates: Array.from(files) // Multiple files for certificates
      });
    }
  };

  // Handle form submission to add doctor
  const handleSubmitDoctor = async () => {
    try {
      const formData = new FormData();

      // Append form data
      Object.keys(doctorData).forEach((key) => {
        if (key === 'certificates') {
          doctorData.certificates.forEach((file, index) => {
            formData.append('certificates', file);
          });
        } else if (doctorData[key]) {
          formData.append(key, doctorData[key]);
        }
      });

      const response = await axios.post('http://localhost:8000/api/users/approvals', formData
       );

     
       // alert(response.data.msg);
       showSnackbar(response.data.msg,'success')
        fetchApprovals();
        handleCloseDialog();
      
    } catch (error) {
      console.error('Error adding doctor:', error);
     // alert('Failed to add doctor.');
     showSnackbar("Failed to add doctor",'error')
    }
  };

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        <Button variant="contained" color="success" onClick={handleOpenDialog}>
          Add Doctor
        </Button>
      </Typography>
      <Typography variant="h4" align="center" gutterBottom>
      <Button variant="contained" color="secondary" onClick={handleOpenReceptionistDialog}>
  Add Receptionist
</Button>

      </Typography>

      <Typography variant="h4" align="center" gutterBottom>
        Approval Requests
      </Typography>

      <Grid container spacing={3}>
        {approvals.length > 0 ? (
          approvals.map((approval) => (
            <Grid item xs={12} sm={6} md={4} key={approval._id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={approval.profile}
                  alt="Profile Image"
                />
                <CardContent>
                  <Typography variant="h6">{approval.fullName}</Typography>
                  <Typography variant="body2">Age: {approval.age}</Typography>
                  <Typography variant="body2">Email: {approval.email}</Typography>
                  <Typography variant="body2">User Type: {approval.userType}</Typography>

                  {approval.userType === 'doctor' && (
                    <>
                      <Typography variant="body2">
                        Specializations: {approval.specializations}
                      </Typography>
                      <Typography variant="body2">Course: {approval.course}</Typography>
                    </>
                  )}

                  {/* Display certificates */}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Certificates:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {approval.certificates.map((certificate, index) => (
                      <a
                        key={index}
                        href={certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2', textDecoration: 'underline' }}
                      >
                        View Certificate {index + 1}
                      </a>
                    ))}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAdmit(approval)}
                    >
                      Admit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleCancel(approval)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography align="center" sx={{ mt: 3 }}>
            No approval requests found.
          </Typography>
        )}
      </Grid>

      {/* Add Doctor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Doctor</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            name="fullName"
            value={doctorData.fullName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={doctorData.age}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={doctorData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={doctorData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Specializations"
            name="specializations"
            value={doctorData.specializations}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Course"
            name="course"
            value={doctorData.course}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {/* Profile Image Upload */}
          <Box sx={{ mb: 2 }}>
            <label htmlFor="profile">Profile Image</label>
            <input
              id="profile"
              name="profile"
              type="file"
              onChange={handleFileChange}
            />
          </Box>
          {/* Certificates Upload */}
          <Box sx={{ mb: 2 }}>
            <label htmlFor="certificates">Certificates</label>
            <input
              id="certificates"
              name="certificates"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitDoctor} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReceptionistDialog} onClose={handleCloseReceptionistDialog}>
  <DialogTitle>Add Receptionist</DialogTitle>
  <DialogContent>
    <TextField
      label="Full Name"
      name="fullName"
      value={receptionistData.fullName}
      onChange={handleReceptionistInputChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Age"
      name="age"
      type="number"
      value={receptionistData.age}
      onChange={handleReceptionistInputChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Email"
      name="email"
      value={receptionistData.email}
      onChange={handleReceptionistInputChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Password"
      name="password"
      type="password"
      value={receptionistData.password}
      onChange={handleReceptionistInputChange}
      fullWidth
      margin="normal"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseReceptionistDialog} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSubmitReceptionist} color="primary">
      Submit
    </Button>
  </DialogActions>
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
    </Container>
  );
};

export default ApprovalPage;
