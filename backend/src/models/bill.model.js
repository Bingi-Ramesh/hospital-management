import mongoose from 'mongoose'
const billSchema=new mongoose.Schema({
    patientName:{
        type:String
    },
    doctorName:{
        type:String
    },
    patientEmail:{
        type:String
    },
  
    appointmentCharge:{
        type:Number
    },
    consultationCharge:{
        type:Number
    },
    bloodTestCharge:{
        type:Number
    },
    xrayCharge:{
        type:Number
    },
    mriCharge: {
        type:Number
    },
    ctScanCharge:{
        type:Number
    },
    treatmentCharge:{
        type:Number
    },
    roomCharge:{
        type:Number
    },
    dietCharge:{
        type:Number
    },
    ambulanceCharge:{
        type:Number
    },
    totalCost:{
        type:Number
    }

})

const Bill=mongoose.model("bill",billSchema)

export default Bill;