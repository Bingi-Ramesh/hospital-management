// import Doctor from "../models/doctor.model.js";
// import Patient from "../models/patient.model.js";
// import Admin from "../models/admin.model.js";


// const login=async(req,res)=>{
//     try {
        
//         const{email,password,userType}=req.body;

//         if(!email || !password || !userType){
//             return res.status(401).json({msg:"all fields are required..."})
//         }
//         if(userType=='admin'){

//             const existingAdmin=await Admin.findOne({email});

//             if(!existingAdmin){
//                 return res.status(404).json({msg:"You are not an admin..."})
//             }

//             if(password!=existingAdmin.password){
//                 return res.status(401).json({msg:"wrong password..."})
//             }

//             return res.status(200).json({msg:`login successfull welcome Mr./Ms. ${existingAdmin.fullName} to the admin portal`})

//         }

//         if(userType=='patient'){

//             const existingPatient=await Patient.findOne({email});

//             if(!existingPatient){
//                 return res.status(404).json({msg:"You are not an patient email not found..."})
//             }

//             if(password!=existingPatient.password){
//                 return res.status(401).json({msg:"wrong password..."})
//             }

//             return res.status(200).json({msg:`login successfull welcome Mr./Ms. ${existingPatient.fullName} to the patient portal`})

//         }

//         if(userType=='doctor'){

//             const existingDoctor=await Doctor.findOne({email});

//             if(!existingDoctor){
//                 return res.status(404).json({msg:"You are not an doctor email not found..."})
//             }

//             if(password!=existingDoctor.password){
//                 return res.status(401).json({msg:"wrong password..."})
//             }

//             return res.status(200).json({msg:"login successful welcome to admin doctor portal"})

//         }



//     } catch (error) {
//         return res.status(401).json({msg:"error while loggin in..."})
//     }
// }

// export default login;



import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Admin from "../models/admin.model.js";
import Receptionist from "../models/receptionist.model.js";

const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(401).json({ msg: "all fields are required..." });
    }

    let existingUser;

    if (userType === 'admin') {
      existingUser = await Admin.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ msg: "You are not an admin..." });
      }
      if (password !== existingUser.password) {
        return res.status(401).json({ msg: "wrong password..." });
      }
    }
    if (userType === 'receptionist') {
      existingUser = await Receptionist.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ msg: "Receptionist not found register first..." });
      }
      if (password !== existingUser.password) {
        return res.status(401).json({ msg: "wrong password..." });
      }
    }

    if (userType === 'patient') {
      existingUser = await Patient.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ msg: "You are not a patient..." });
      }
      if (password !== existingUser.password) {
        return res.status(401).json({ msg: "wrong password..." });
      }
    }

    if (userType === 'doctor') {
      existingUser = await Doctor.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ msg: "You are not a doctor..." });
      }
      if (password !== existingUser.password) {
        return res.status(401).json({ msg: "wrong password..." });
      }
    }

    req.session.user = {
      id: existingUser._id,
      email: existingUser.email,
      age:existingUser.age,
      fullName: existingUser.fullName,
      
      userType: userType,
    };

    return res.status(200).json({
      msg: `login successful, welcome  ${existingUser.fullName}`,
      user: req.session.user
    });

  } catch (error) {
    return res.status(401).json({ msg: "error while logging in..." });
  }
};

export default login;
