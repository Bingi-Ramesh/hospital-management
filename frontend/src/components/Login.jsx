import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginBg from '../assets/loginBg.jpg'
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Snackbar,
  Alert 
} from '@mui/material';
import { useUser } from '../context/UserContext';

const Login = ({ setLoggedIn }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    password: '',
    userType: '',
    specializations: '',
    course: '',
    certificates: null,
    profile: null,
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

  const navigate = useNavigate();
  const { setUserProfile } = useUser();

  // Toggle between login and signup
  const handleToggle = () => {
    setIsSignup(!isSignup);
    setFormData({
      fullName: '',
      age: '',
      email: '',
      password: '',
      userType: '',
      specializations: '',
      course: '',
      certificates: null,
      profile: null,
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Helper function to determine the correct API endpoint
  const getSignupEndpoint = (userType) => {
    switch (userType) {
      case 'admin':
        return 'http://localhost:8000/api/users/admins';
      case 'doctor':
        return 'http://localhost:8000/api/users/approvals';
      case 'patient':
        return 'http://localhost:8000/api/users/patients';
      case 'receptionist':
        return 'http://localhost:8000/api/users/register-receptionist';
      default:
        return '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!isSignup) {
        // LOGIN FUNCTIONALITY
        const response = await axios.post('http://localhost:8000/api/users/login', formData, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data.msg.includes('login successful')) {
          showSnackbar(response.data.msg, 'success'); 
          setTimeout(() => {
            setLoggedIn(true);
            setUserProfile(response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
          }, 3000); 
        } else {
          showSnackbar('Login failed. Please try again.', 'error');
        }
      } else {
        // SIGNUP FUNCTIONALITY
        const endpoint = getSignupEndpoint(formData.userType);
        let data = formData.userType === 'doctor' ? new FormData() : { ...formData };

        if (formData.userType === 'doctor') {
          data.append('fullName', formData.fullName);
          data.append('age', formData.age);
          data.append('email', formData.email);
          data.append('password', formData.password);
          data.append('userType', formData.userType);
          data.append('specializations', formData.specializations);
          data.append('course', formData.course);
          if (formData.certificates) data.append('certificates', formData.certificates);
          if (formData.profile) data.append('profile', formData.profile);
        }

        const headers =
          formData.userType === 'doctor'
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        const response = await axios.post(endpoint, data, { headers });
        showSnackbar(response.data.msg, 'success');
        setIsSignup(false);
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(error.response?.data?.msg || 'An error occurred. Please try again.', 'error');
    }
  };

  return (
  
    <div   >
    <Container maxWidth="xs">
      <Box
        sx={{
         
          mt: 5,
          mb: 5,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '##1E3A8A',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}

<Grid item xs={12}>
  <FormControl fullWidth>
    <InputLabel
      shrink={formData.userType !== ""  } // Ensures label shrinks when a value is selected
   
      style={{ textDecoration: "none" }} // Removes strikethrough from the label
    >
      User Type
    </InputLabel>
    <Select
      name="userType"
     
      display:none
      value={formData.userType}
      onChange={handleChange}
      required
    >
      <MenuItem value="doctor">Doctor</MenuItem>
      <MenuItem value="patient">Patient</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
      <MenuItem value="receptionist">Receptionist</MenuItem>
    </Select>
  </FormControl>
</Grid>


            {isSignup && formData.userType === 'doctor' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specializations"
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Upload Certificates (PDF/Image)</Typography>
                  <input
                    type="file"
                    name="certificates"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    required
                    style={{ display: 'block', marginTop: '10px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Upload Profile Image (Image only)</Typography>
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    style={{ display: 'block', marginTop: '10px' }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            {isSignup && formData.userType === 'admin' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Admin Password"
                    name="specializations"
                    
                    required
                  />
                </Grid>
                </>)}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                
                {isSignup ? (formData.userType === 'patient' ||formData.userType === '' ? 'Sign Up' : 'Send Joining Request') : 'Login'}

              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography align="center">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <Button onClick={handleToggle} color="secondary">
                  {isSignup ? 'Login' : 'Sign Up'}
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
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
      borderColor: snackbar.severity === 'success' ? 'green' : 
                   snackbar.severity === 'error' ? 'red' : 
                   snackbar.severity === 'warning' ? 'yellow' : 'blue', // Border color based on severity
      backgroundColor: snackbar.severity === 'success' ? 'green' : 
                        snackbar.severity === 'error' ? 'red' : 
                        snackbar.severity === 'warning' ? 'yellow' : 'blue', // Background color based on severity
      color: 'white', // Ensures the text is visible
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

    </Container>
    </div>
    
  );
};

export default Login;
