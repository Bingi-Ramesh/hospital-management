// import Doctor from '../models/doctor.model.js'
 import Approval from '../models/approval.model.js';
// const registerApproval=async(req,res)=>{
//     try {
        
//         const{fullName,age,email,password,userType,specializations,course}=req.body;

//         if(!fullName || !age || !email || !password || !userType || !specializations || !course){
//                 return res.status(400).json({msg:"All fields are required..."})
//         }
//         const existingDoctor= await Doctor.findOne({email});
//         return res.status(404).json({msg:"you already a doctor you no need of admin approval please login..."})
//         const existingApproval= await Approval.findOne({email});

//         if(existingApproval){
//             return res.status(400).json({msg:"User already exists please wait for admin confirmation..."})
//         }

//         const newApproval=new Approval({fullName,age,email,password,userType,specializations,course});

//        await newApproval.save()

//        return res.status(201).json({msg:"Doctor request sent to admin successfully..."})

//     } catch (err) {
//         return res.status(401).json({msg:"error while registering"})
//     }
// }


import Doctor from '../models/doctor.model.js';
import cloudinary from 'cloudinary';

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerApproval = async (req, res) => {
  try {
    // Extract fields from the request body
    const { fullName, age, email, password, userType, specializations, course } = req.body;
    const files = req.files;  // Multer will handle the file uploads

    // Check if all required fields are provided
    if (!fullName || !age || !email || !password || !userType || !specializations || !course) {
      return res.status(400).json({ msg: 'All fields are required...' });
    }

    // Validate that at least one certificate is provided
    if (!files || !files.certificates || files.certificates.length === 0) {
      return res.status(400).json({ msg: 'At least one certificate is required.' });
    }

    // Ensure a profile image is uploaded
    if (!files.profile || files.profile.length === 0) {
      return res.status(400).json({ msg: 'Profile image is required.' });
    }

    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    const existingApproval = await Approval.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ msg: 'Already u r doctor please login...' });
    }
    if (existingApproval) {
      return res.status(400).json({ msg: 'Already sent approval request wait for confirmation...' });
    }

    // Upload profile image to Cloudinary and store URL
    let profileImageUrl = '';
    if (files.profile) {
      const profileResult = await cloudinary.v2.uploader.upload(files.profile[0].path, { folder: 'profile-images' });
      profileImageUrl = profileResult.secure_url;  // Store the URL of the uploaded profile image
    }

    // Upload certificates to Cloudinary and store URLs
    let certificates = [];
    if (files.certificates) {
      for (const file of files.certificates) {
        const result = await cloudinary.v2.uploader.upload(file.path, { folder: 'certificates' });
        certificates.push(result.secure_url);  // Store the URL of the uploaded certificate
      }
    }

    // Create a new doctor document
    const newApproval =await new Approval({
      fullName,
      age,
      email,
      password,
      userType,
      specializations,  // Handled as a string
      course,
      profile: profileImageUrl, // Store the Cloudinary URL of the profile image
      certificates,  // Store the Cloudinary URLs of certificates
    });

    // Save the doctor to the database
    await newApproval.save();

    return res.status(201).json({ msg: 'Approval sent successfully...', doctor: newApproval });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error while registering', error: err.message });
  }
};



export const getApprovals = async (req, res) => {
    try {
        const approvals = await Approval.find({});
        if (!approvals || approvals.length === 0) {
            return res.status(401).json({msg: "No requests found..."});
        }
        return res.status(200).json({msg: "success", approvals});
    } catch (error) {
        return res.status(500).json({msg: "Failed to get approval' details..."});
    }
};

export const deleteApproval = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ msg: "Email is required." });
      }
  
      const deleted = await Approval.findOneAndDelete({ email });
  
      if (!deleted) {
        return res.status(404).json({ msg: "Approval request not found." });
      }
  
      return res.status(200).json({ msg: "Successfully deleted approval request." });
    } catch (error) {
      console.error('Delete Approval Error:', error);
      return res.status(500).json({ msg: "Failed to delete approval request." });
    }
  };
  

export default registerApproval;