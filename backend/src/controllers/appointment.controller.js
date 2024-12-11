import Appointment from '../models/appointments.model.js'
import Doctor from '../models/doctor.model.js'
import Patient from '../models/patient.model.js'
export const registerAppointment = async (req, res) => {
    try {
        const { doctorEmail, userEmail, preferredDate, preferredTime } = req.body;

        
        if (!doctorEmail || !userEmail || !preferredDate || !preferredTime) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        
        const existedAppointment = await Appointment.findOne({ userEmail ,doctorEmail });

        if (existedAppointment) {
            if (existedAppointment.status === 'Pending') {
                return res.status(200).json({ msg: "Your appointment is already in the queue/pending with this doctor. Please wait for confirmation." });
            }
            if (existedAppointment.status.includes('Confirmed') ){
                return res.status(200).json({ msg: "Your appointment is already confirmed with this doctor. Please be on time." });
            }
        }
const doctor=await Doctor.findOne({email:doctorEmail});
const patient=await Patient.findOne({email:userEmail});

if(!doctor || !patient){
    return res.status(200).json({msg:"doctor/patient details not found"})
}

    
        const newAppointment = new Appointment({
            userEmail,
            doctorEmail,
            preferredDate,
            preferredTime,
            status: "Pending",
            doctorName:doctor.fullName,
            patientName:patient.fullName
        });

        await newAppointment.save();

        return res.status(201).json({ msg: 'Appointment request sent successfully. Wait for confirmation.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};

export const fetchAppointments=async(req,res)=>{
    try {
        
        const appointments=await Appointment.find();
        if(!appointments){
            return res.status(200).json({msg:"no appointments found..."})
        }
        return res.status(200).json({msg:"appointments fetched successfully",appointments})

    } catch (error) {
        return res.status(500).json({msg:'internal error...'})
    }
}
