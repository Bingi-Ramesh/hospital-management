import Appointment from "../models/appointments.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";


const registerAppointments = async (req, res) => {
    try {
      const { doctorEmail, userEmail,preferredDate,preferredTime } = req.body;
  
      // Validate input fields
      if (!doctorEmail || !userEmail || !preferredDate || !preferredTime) {
        return res.status(404).json({ msg: "All fields are required..." });
      }
  
      // Check if the doctor and patient exist
      const existingDoctor = await Doctor.findOne({ email: doctorEmail });
      const existingPatient = await Patient.findOne({ email: userEmail });
  
      if (!existingDoctor || !existingPatient) {
        return res.status(200).json({ msg: "Doctor or patient not found..." });
      }
  
      // Create appointment entry
      const appointmentDetails = {
        patientEmail: userEmail,
        patientName: existingPatient.fullName,
        status: "Pending",
        date: preferredDate,
        time:preferredTime
      };
  
      const doctorAppointmentDetails = {
        doctorEmail: doctorEmail,
        doctorName: existingDoctor.fullName,
        status: "Pending",
        date: preferredDate,
        time:preferredTime
      };
  
      // Add appointment to Doctor's appointments array
      existingDoctor.appointments.push(appointmentDetails);
  
      // Add appointment to Patient's appointments array
      existingPatient.appointments.push(doctorAppointmentDetails);
  
      // Save the updated doctor and patient documents
      await existingDoctor.save();
      await existingPatient.save();
  
      // Respond with success message
      return res.status(200).json({ msg: "Appointment registered successfully." });
  
    } catch (error) {
      console.error("Error registering appointment:", error);
      return res.status(500).json({ msg: "Internal error",err:error.error });
    }
  };
  


// Route: GET /api/users/getappointments
export const getAppointments= async (req, res) => {
    try {
      const { userEmail, userType } = req.query;
  
      if (!userEmail || !userType) {
        return res.status(400).json({ msg: "User email and user type are required." });
      }
  
      let user;
      if (userType.toLowerCase() === 'patient') {
        user = await Patient.findOne({ email: userEmail });
      } else if (userType.toLowerCase() === 'doctor') {
        user = await Doctor.findOne({ email: userEmail });
      }
  
      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }
  
      return res.status(200).json({ appointments: user.appointments });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ msg: "Internal server error." });
    }
  };
  


  export const confirmAppointment = async (req, res) => {
    try {
      const { doctorEmail, patientEmail } = req.body;
  
      if (!doctorEmail || !patientEmail) {
        return res.status(200).json({ msg: "Doctor or patient email is missing." });
      }
  
      const existingDoctor = await Doctor.findOne({ email: doctorEmail });
      const existingPatient = await Patient.findOne({ email: patientEmail });
  
      if (!existingDoctor || !existingPatient) {
        return res.status(404).json({ msg: "Doctor or patient not found." });
      }
  
      const doctorUpdate = await Doctor.updateOne(
        { email: doctorEmail, "appointments.patientEmail": patientEmail },
        { $set: { "appointments.$.status": "Confirmed" } }
      );
  
      const patientUpdate = await Patient.updateOne(
        { email: patientEmail, "appointments.doctorEmail": doctorEmail },
        { $set: { "appointments.$.status": "Confirmed - Be ready on time" } }
      );
      const existingAppointment=await Appointment.findOne({doctorEmail,userEmail:patientEmail});

      if(!existingAppointment){
        return res.status(200).json({msg:"no appointment found"})
      }

      const appointmentUpdate = await Appointment.updateOne(
        { doctorEmail: doctorEmail, userEmail: patientEmail },
        { $set: { status: "Confirmed" } }
      );
  
      if (doctorUpdate.modifiedCount === 0 || patientUpdate.modifiedCount === 0 || appointmentUpdate.modifiedCount===0) {
        return res.status(400).json({ msg: "Failed to confirm the appointment." });
      }
  
      return res.status(200).json({ msg: "Appointment confirmed successfully." });
    } catch (error) {
      console.error("Error confirming appointment:", error);
      return res.status(500).json({ msg: "Internal server error." });
    }
  };
  



  export const rejectAppointment = async (req, res) => {
    try {
      const { doctorEmail, patientEmail } = req.body;
  
      if (!doctorEmail || !patientEmail) {
        return res.status(400).json({ msg: "Doctor or patient email is missing." });
      }
  
      const existingDoctor = await Doctor.findOne({ email: doctorEmail });
      const existingPatient = await Patient.findOne({ email: patientEmail });
  
      if (!existingDoctor || !existingPatient) {
        return res.status(404).json({ msg: "Doctor or patient not found." });
      }
  
      const doctorUpdate = await Doctor.updateOne(
        { email: doctorEmail, "appointments.patientEmail": patientEmail },
        { $set: { "appointments.$.status": "Rejected " } }
      );
  
      const patientUpdate = await Patient.updateOne(
        { email: patientEmail, "appointments.doctorEmail": doctorEmail },
        { $set: { "appointments.$.status": "Rejected due to not availability" } }
      );
  
      const existingAppointment=await Appointment.findOne({doctorEmail,userEmail:patientEmail});

      if(!existingAppointment){
        return res.status(200).json({msg:"no appointment found"})
      }

      const appointmentUpdate = await Appointment.updateOne(
        { doctorEmail: doctorEmail, userEmail: patientEmail },
        { $set: { status: "Rejected -due to not availability" } }
      );

      if (doctorUpdate.modifiedCount === 0 || patientUpdate.modifiedCount === 0 || appointmentUpdate.modifiedCount===0) {
        return res.status(400).json({ msg: "Failed to reject the appointment." });
      }
  
      return res.status(200).json({ msg: "Appointment rejected successfully." });
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      return res.status(500).json({ msg: "Internal server error." });
    }
  };
  


  export const completeAppointment = async (req, res) => {
    try {
      const { doctorEmail, patientEmail } = req.body;
  
      if (!doctorEmail || !patientEmail) {
        return res.status(200).json({ msg: "Doctor or patient email is missing." });
      }
  
      const existingDoctor = await Doctor.findOne({ email: doctorEmail });
      const existingPatient = await Patient.findOne({ email: patientEmail });
  
      if (!existingDoctor || !existingPatient) {
        return res.status(404).json({ msg: "Doctor or patient not found." });
      }
  
      const doctorUpdate = await Doctor.updateOne(
        { email: doctorEmail, "appointments.patientEmail": patientEmail },
        { $set: { "appointments.$.status": "Completed" } }
      );
  
      const patientUpdate = await Patient.updateOne(
        { email: patientEmail, "appointments.doctorEmail": doctorEmail },
        { $set: { "appointments.$.status": "Completed" } }
      );
      const existingAppointment=await Appointment.findOne({doctorEmail,userEmail:patientEmail});

      if(!existingAppointment){
        return res.status(200).json({msg:"no appointment found"})
      }

      const appointmentUpdate = await Appointment.updateOne(
        { doctorEmail: doctorEmail, userEmail: patientEmail },
        { $set: { status: "Completed" } }
      );
  
      if (doctorUpdate.modifiedCount === 0 || patientUpdate.modifiedCount === 0 || appointmentUpdate.modifiedCount===0) {
        return res.status(400).json({ msg: "Failed to complete the appointment." });
      }
  
      return res.status(200).json({ msg: "Appointment completed successfully." });
    } catch (error) {
      console.error("Error confirming appointment:", error);
      return res.status(500).json({ msg: "Internal server error." });
    }
  };


  export const completeBill = async (req, res) => {
    try {
      const { doctorEmail, patientEmail } = req.body;
  
      if (!doctorEmail || !patientEmail) {
        return res.status(200).json({ msg: "Doctor or patient email is missing." });
      }
  
      const existingDoctor = await Doctor.findOne({ email: doctorEmail });
      const existingPatient = await Patient.findOne({ email: patientEmail });
  
      if (!existingDoctor || !existingPatient) {
        return res.status(404).json({ msg: "Doctor or patient not found." });
      }
  
      const doctorUpdate = await Doctor.updateOne(
        { email: doctorEmail, "appointments.patientEmail": patientEmail },
        { $set: { "appointments.$.status": "Completed" } }
      );
  
      const patientUpdate = await Patient.updateOne(
        { email: patientEmail, "appointments.doctorEmail": doctorEmail },
        { $set: { "appointments.$.status": "Bill Payed" } }
      );
      const existingAppointment=await Appointment.findOne({doctorEmail,userEmail:patientEmail});

      if(!existingAppointment){
        return res.status(200).json({msg:"no appointment found"})
      }

      const appointmentUpdate = await Appointment.updateOne(
        { doctorEmail: doctorEmail, userEmail: patientEmail },
        { $set: { status: "Bill payed" } }
      );
  
      if (doctorUpdate.modifiedCount === 0 || patientUpdate.modifiedCount === 0 || appointmentUpdate.modifiedCount===0) {
        return res.status(400).json({ msg: "Failed to complete the appointment." });
      }
  
      return res.status(200).json({ msg: "Appointment bill payment completed successfully." });
    } catch (error) {
      console.error("Error confirming appointment:", error);
      return res.status(500).json({ msg: "Internal server error." });
    }
  };


  export default registerAppointments;