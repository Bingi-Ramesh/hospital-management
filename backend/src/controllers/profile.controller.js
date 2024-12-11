import Admin from "../models/admin.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Receptionist from "../models/receptionist.model.js";

// controllers/profile.controller.js
const getProfile = (req, res) => {
  // Check if the user is logged in by verifying the session
  if (!req.session.user) {
    return res.status(401).json({ msg: "You are not logged in." });
  }

  // If logged in, return the user details from the session
  return res.status(200).json({
    msg: "User profile fetched successfully.",
    user: req.session.user, // Return the logged-in user details from the session
  });
};


   export const profileDetails=async(req,res)=>{

        try {
          
          const{userType,email}=req.body;

          if(!userType || !email){
              return res.status(401).json({msg:"all fields required"})
          }

        if(userType==='doctor'){
              const existingDoctor=await Doctor.find({email});

              if(!existingDoctor){
                return res.status(401).json({msg:"No doctor found"})
              }
              return res.status(200).json({msg:"success",user:existingDoctor})
        }

        if(userType==='patient'){
          const existingPatient=await Patient.find({email});

          if(!existingPatient){
            return res.status(401).json({msg:"No patient found"})
          }
          return res.status(200).json({msg:"success",user:existingPatient})
    }


    if(userType==='receptionist'){
      const existingReceptionist=await Receptionist.find({email});

      if(!existingReceptionist){
        return res.status(401).json({msg:"No Receptionist found"})
      }
      return res.status(200).json({msg:"success",user:existingReceptionist})
}

    if(userType==='admin'){
      const existingAdmin=await Admin.find({email});

      if(!existingAdmin){
        return res.status(401).json({msg:"No Admin found"})
      }
      return res.status(200).json({msg:"success",user:existingAdmin})
}

        } catch (error) {
          return res.status(500).json({msg:"internal error",err:error.error})
        }
   }

export default getProfile;