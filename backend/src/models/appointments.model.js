import mongoose from 'mongoose'

const appointmentSchema=new mongoose.Schema({
    userEmail:{
        type:String
    },
    doctorEmail:{
        type:String
    },
    patientName:{
        type:String
    },
    doctorName:{
        type:String
    },
    preferredDate:{
        type:String
    },
    preferredTime:{
        type:String
    },
    status:{
        type:String
    }
})

const Appointment=mongoose.model('appointment',appointmentSchema);

export default Appointment