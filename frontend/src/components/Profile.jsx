import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Divider, Avatar, TextField, Dialog } from '@mui/material';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [profileDetails, setProfileDetails] = useState(null);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    password: '',
    profile: null,
    profilePreview: '',
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
  // If the user is not logged in, show a message prompting to log in
  if (!user) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" color="textSecondary" sx={{ mt: 5 }}>
          You are not logged in. Please log in to view your profile.
        </Typography>
      </Container>
    );
  }

  
  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/users/profile-details", {
        email: user.email,
        userType: user.userType,
      });
      const data = response.data.user[0];
      setProfileDetails(data);
      setFormData({
        fullName: data.fullName || '',
        age: data.age || '',
        email: data.email || '',
        password: '',
        profile: null,
        profilePreview: data.profile || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const handleLogout = () => {
    logout(); // Call logout first to clear the user state
    navigate('/login'); // Then navigate to the login page
  };

  const handleUpdateClick = () => {
    setOpenUpdateForm(true);
  };

  const handleCloseForm = () => {
    setOpenUpdateForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile: file,
        profilePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async () => {
    const updateUrl = {
      patient: '/update-patient',
      doctor: '/update-doctor',
      admin: '/update-admin',
      receptionist:'/update-receptionist',
    }[user.userType];

    const form = new FormData();
    form.append('fullName', formData.fullName);
    form.append('age', formData.age);
    form.append('email', formData.email);
    form.append('password', formData.password);

    if (formData.profile) {
      form.append('profile', formData.profile);
    }

    try {
     const response= await axios.put(`http://localhost:8000/api/users${updateUrl}`, form);
     showSnackbar(response.data.msg, 'success'); 
     // alert(response.data.msg);
      setOpenUpdateForm(false);
      fetchUserProfile(); // Refresh profile details
    } catch (error) {
      console.error('Error updating profile:', error);
     // alert('Failed to update profile. Please try again.');
     showSnackbar("Failed to update profile. Please try again.", 'success'); 
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5,mb:5 }}>
        <Card
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: '#d0e7ff',
            padding: 3,
            '&:hover': {
              boxShadow: 10,
              // backgroundColor: '#b3e0ff',
            },
          }}
        >
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom color="primary">
              User Profile
            </Typography>
            <Divider sx={{ mb: 2}} />

            {profileDetails ? (
              <Grid container spacing={2}>
                {/* Profile Image Section */}
                <Grid item xs={12} md={3} align="center">
                  <Avatar
                    src={formData.profilePreview}
                    alt="Profile Image"
                    sx={{ width: 150, height: 150, borderRadius: '50%', boxShadow: 2 }}
                  />
                </Grid>

                {/* User Details Section */}
                <Grid item xs={12} md={7}  display={'flex'}>
                <Grid item xs={12} md={15} >
                  <Typography variant="h6">Full Name:</Typography>
                  <Typography>{profileDetails.fullName}</Typography>

                  <Typography variant="h6">User Type:</Typography>
                  <Typography>{profileDetails.userType}</Typography>
              </Grid>
              <Grid item xs={12} md={5} >
                  <Typography variant="h6">Age:</Typography>
                  <Typography>{profileDetails.age}</Typography>
                  <Typography variant="h6">Email:</Typography>
                  <Typography>{profileDetails.email}</Typography>
                </Grid>
                </Grid>
              </Grid>
            ) : (
              <Typography align="center">Loading profile...</Typography>
            )}

            {/* Update and Logout Buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-evenly' }}>
              <Button variant="contained" onClick={handleUpdateClick}>
                Update
              </Button>
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Update Form Dialog */}
      <Dialog open={openUpdateForm} onClose={handleCloseForm}>
        <Box sx={{ padding: 3, width: 400 }}>
          <Typography variant="h6">Update Profile</Typography>
          <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Age" name="age" value={formData.age} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

          {/* File Upload Section */}
          <Grid item xs={12}>
            <Typography>Upload Profile Image (Image only)</Typography>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 1 }}
            >
              Choose File
              <input
                type="file"
                name="profile"
                accept="image/*"
                onChange={handleFileChange}
                required
                hidden
              />
            </Button>
            {formData.profilePreview && (
              <Typography sx={{ mt: 1, color: 'gray' }}>
                Selected file: {formData.profile?.name}
              </Typography>
            )}
          </Grid>

          <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={handleSubmit}>Save</Button>
            <Button variant="outlined" onClick={handleCloseForm}>Cancel</Button>
          </Box>
        </Box>
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
  );
};

export default Profile;
