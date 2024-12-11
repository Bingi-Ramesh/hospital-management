// /routes/user.routes.js
import express from 'express';
import upload from '../middleware/multerConfig.js'; // Import multer configuration
import registerDoctor, { deleteDoctor, getDoctors, updateDoctor } from '../controllers/doctor.controller.js';
import registerPatient, { getPatients, updatePatient } from '../controllers/patient.controller.js';
import registerAdmin, { updateAdmin } from '../controllers/admin.controller.js';
import login from '../controllers/login.controller.js';
import getProfile, { profileDetails } from '../controllers/profile.controller.js';
import registerApproval, { deleteApproval, getApprovals } from '../controllers/approval.controller.js';
import registerAppointments, { completeAppointment, completeBill, confirmAppointment, getAppointments, rejectAppointment } from '../controllers/appointments.controller.js';
import {deleteReceptionist, getReceptionists, registerReceptionist, updateReceptionist} from '../controllers/receptionist.controller.js';
import { fetchAppointments, registerAppointment } from '../controllers/appointment.controller.js';
import { generateBill, getBillDetails } from '../controllers/bill.controller.js';
import { addReview, deleteReview, getReviews } from '../controllers/reviews.controller.js';
const userRouter = express.Router();

// Routes for doctor registration with Multer middleware
userRouter.post("/doctors", registerDoctor);

// Other routes
userRouter.post("/patients", registerPatient);
userRouter.post("/admins", registerAdmin);
userRouter.post("/login", login);
userRouter.get("/profile", getProfile);

// Approvals
userRouter.get("/getdoctors", getDoctors);
userRouter.post("/approvals", upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'certificates', maxCount: 5 }]), registerApproval);
userRouter.get("/getapprovals", getApprovals);
userRouter.post("/delete-approval", deleteApproval);


userRouter.delete("/delete-doctor",deleteDoctor)

userRouter.get("/get-patients",getPatients)
userRouter.put("/update-patient",upload.single("profile"),updatePatient);
userRouter.put("/update-admin",upload.single("profile"),updateAdmin);
userRouter.put("/update-doctor",upload.single("profile"),updateDoctor);
userRouter.put("/update-receptionist",upload.single("profile"),updateReceptionist);

userRouter.post("/profile-details",profileDetails)


userRouter.post("/appointments",registerAppointments)
userRouter.get("/getAppointments",getAppointments)
userRouter.post("/register-appointment",registerAppointment)
userRouter.get("/get-appointments",fetchAppointments)


userRouter.put("/confirm-appointment",confirmAppointment);
userRouter.put("/reject-appointment",rejectAppointment)
userRouter.put("/complete-appointment",completeAppointment)

userRouter.post("/register-receptionist",registerReceptionist)
userRouter.get("/get-receptionists",getReceptionists)
userRouter.post("/delete-receptionist",deleteReceptionist)

userRouter.post("/generate-bill",generateBill)
userRouter.get("/get-bills",getBillDetails)
userRouter.put("/complete-bill",completeBill)


userRouter.post("/add-reviews",addReview)
userRouter.get("/get-reviews",getReviews)
userRouter.post("/delete-review",deleteReview)
export default userRouter;
