import Admin from '../models/admin.model.js'
import cloudinary from 'cloudinary';
import Doctor from '../models/doctor.model.js';

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const registerAdmin=async(req,res)=>{
    try {
        
        const{fullName,age,email,password,userType}=req.body;

        if(!fullName || !age || !email || !password || !userType){
                return res.status(400).json({msg:"All fields are required..."})
        }

        const existingAdmin= await Admin.findOne({email});

        if(existingAdmin){
            return res.status(400).json({msg:"User already exists as admin please login..."})
        }

        const newAdmin=new Admin({fullName,age,email,password,userType});

       await newAdmin.save()

       return res.status(201).json({msg:"Admin created successfully..."})

    } catch (err) {
        return res.status(401).json({msg:"error while registering"})
    }
}


export const updateAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        const { fullName, age, password, userType } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required for updating the admin data." });
        }

        
        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (age) updateData.age = age;
        if (password) updateData.password = password;
        if (userType) updateData.userType = userType;

        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "profiles",
            });

            updateData.profile = result.secure_url;
        }

    
        const updatedAdmin = await Admin.findOneAndUpdate({ email }, updateData, {
            new: true,
            runValidators: true, 
        });

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin with this email not found." });
        }

        res.status(200).json({ message: "Admin updated successfully", data: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




export default registerAdmin;