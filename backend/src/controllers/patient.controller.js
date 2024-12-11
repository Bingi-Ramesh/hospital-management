import Patient from '../models/patient.model.js'



import cloudinary from 'cloudinary';

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const registerPatient=async(req,res)=>{
    try {
        
        const{fullName,age,email,password,userType}=req.body;

        if(!fullName || !age || !email || !password || !userType){
                return res.status(400).json({msg:"All fields are required..."})
        }

        const existingPatient= await Patient.findOne({email});

        if(existingPatient){
            return res.status(400).json({msg:"User already exists  please login..."})
        }

        const newPatient=new Patient({fullName,age,email,password,userType});

       await newPatient.save()

       return res.status(201).json({msg:"Patient created successfully..."})

    } catch (err) {
        return res.status(401).json({msg:"error while registering"})
    }
}

export const getPatients=async(req,res)=>{
    try {
       const patients= await Patient.find();
       if(!patients || patients.length===0){
        return res.status(404).json({msg:"no patients found..."})
       }

       return res.status(200).json({msg:"successfully fetched patients",patients})

    } catch (error) {
        return res.status(500).json({msg:"Internal error..."})
    }
}




export const updatePatient = async (req, res) => {
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
        const updatedPatient = await Patient.findOneAndUpdate({ email }, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Validate before updating
        });

        if (!updatedPatient) {
            return res.status(404).json({ msg: "Patient with this email not found." });
        }

        res.status(200).json({ msg: "Patient updated successfully", data: updatedPatient });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export default registerPatient;