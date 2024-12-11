import Receptionist from '../models/receptionist.model.js'
import cloudinary from 'cloudinary';
import Doctor from '../models/doctor.model.js';
import { memoryStorage } from 'multer';

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const registerReceptionist=async(req,res)=>{
    try {
        
        const{fullName,age,email,password,userType}=req.body;

        if(!fullName || !age || !email || !password || !userType){
                return res.status(400).json({msg:"All fields are required..."})
        }

        const existingReceptionist= await Receptionist.findOne({email});

        if(existingReceptionist){
            return res.status(400).json({msg:"User already exists as receptionist please login..."})
        }

        const newReceptionist=new Receptionist({fullName,age,email,password,userType});

       await newReceptionist.save()

       return res.status(201).json({msg:"Receptionist created successfully..."})

    } catch (err) {
        return res.status(401).json({msg:"error while registering"})
    }
}

export const getReceptionists=async(req,res)=>{
    try {
        const receptionists=await Receptionist.find();
        if(!receptionists){
            return res.status(404).json({msg:"no receptionists found..."})
        }
        return res.status(200).json({msg:"successfully fetched...",receptionists})
    } catch (error) {
        return res.status(500).json({msg:"internal error..."})
    }
}

export const updateReceptionist = async (req, res) => {
    try {
        const { email } = req.body;
        const { fullName, age, password, userType } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required for updating the receptionist data." });
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
        const updatedReceptionist = await Receptionist.findOneAndUpdate({ email }, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Validate before updating
        });

        if (!updatedReceptionist) {
            return res.status(404).json({ msg: "Receptionist with this email not found." });
        }

        res.status(200).json({ msg: "Receptionist updated successfully", data: updatedReceptionist });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export const deleteReceptionist=async(req,res)=>{
    try {
        const {id}=req.body;
        await Receptionist.findByIdAndDelete(id);
        return res.status(200).json({msg:"Receptionist deleted successfully..."})
    } catch (error) {
        return res.status(500).json({msg:"internal error"})
    }
}


