import Doctor from '../models/doctor.model.js';
import cloudinary from 'cloudinary';

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Cloudinary Configuration


const registerDoctor = async (req, res) => {
    try {
      // Extract fields from the request body
      const { fullName, age, email, password, userType, specializations, course, profile, certificates } = req.body;
  
      // Check if all required fields are provided
      if (!fullName || !age || !email || !password || !userType || !specializations || !course || !profile || !certificates) {
        return res.status(400).json({ msg: 'All fields including profile and certificates are required.' });
      }
  
      // Check if the doctor already exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ msg: 'Doctor already exists, please login...' });
      }
  
      // Create a new doctor document
      const newDoctor = new Doctor({
        fullName,
        age,
        email,
        password,
        userType,
        specializations,
        course,
        profile,      // Use the profile image URL from the request
        certificates, // Use the certificates URLs array from the request
      });
  
      // Save the doctor to the database
      await newDoctor.save();
  
      return res.status(201).json({ msg: 'Doctor admitted successfully.', doctor: newDoctor });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error while registering', error: err.message });
    }
  };
  

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    if (!doctors || doctors.length === 0) {
      return res.status(401).json({ msg: "No doctors found..." });
    }
    return res.status(200).json({ msg: "Success", doctors });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to get doctors' details..." });
  }
};


export const deleteDoctor=async(req,res)=>{
  try {
    const{email}=req.body;

    if(!email){
      return res.status(404).json({msg:"email is required..."})
    }
    const existingDoctor=await Doctor.findOne({email});

    if(!existingDoctor){
      return res.status(404).json({msg:"doctor is not found..."})
    }

   const deletedDoctor= await Doctor.findOneAndDelete({email})

   if(!deletedDoctor){
    return res.status(401).json({msg:"failed to delete"})
   }
   return res.status(200).json({msg:"successfully removed..."})

  } catch (error) {
      return res.status(500).json({msg:"error while removing try again",error:error.msg})
  }
}


export const updateDoctor= async (req, res) => {
  try {
      const { email } = req.body;
      const { fullName, age, password, userType } = req.body;

      if (!email) {
          return res.status(400).json({ message: "Email is required for updating the patient data." });
      }

      // Create an update object based on provided fields
      const updateData = {};
      if (fullName) updateData.fullName = fullName;
      if (age) updateData.age = age;
      if (password) updateData.password = password;
      if (userType) updateData.userType = userType;

      // Handle profile file upload to Cloudinary if present
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "profiles",
          });

          updateData.profile = result.secure_url;
      }

      // Find the patient by email and update
      const updatedDoctor = await Doctor.findOneAndUpdate({ email }, updateData, {
          new: true, // Return the updated document
          runValidators: true, // Validate before updating
      });

      if (!updatedDoctor) {
          return res.status(404).json({ message: "Doctor with this email not found." });
      }

      res.status(200).json({ msg: "your profile successfully updated", data: updatedDoctor });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default registerDoctor;
