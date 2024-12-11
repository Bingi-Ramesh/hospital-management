import Bill from "../models/bill.model.js";
import Patient from "../models/patient.model.js";

export const generateBill=async(req,res)=>{
    try {
        const{ patientName,
            patientEmail,
            doctorName,
            appointmentCharge,
            consultationCharge,
            bloodTestCharge,
            xrayCharge,
            mriCharge,
            ctScanCharge,
            treatmentCharge,
            roomCharge,
            dietCharge,
            totalCost,
            ambulanceCharge}=req.body;

            if(!patientName || !totalCost ||
                !patientEmail ||
                !doctorName ||
                !appointmentCharge ||
                !consultationCharge ||
                !bloodTestCharge ||
                !xrayCharge ||
                !mriCharge ||
                !ctScanCharge ||
                !treatmentCharge ||
                !roomCharge ||
                !dietCharge ||
                !ambulanceCharge){
                    return res.stus(404).json({msg:"all fields required..."})
                }

                const patient=await Patient.findOne({email:patientEmail})
                if(!patient){
                    return res.status(404).json({msg:"patient not found..."})
                }

                const newBill=new Bill({
                    patientName,
                    patientEmail,
                    doctorName,
                    appointmentCharge,
                    consultationCharge,
                    bloodTestCharge,
                    xrayCharge,
                    mriCharge,
                    ctScanCharge,
                    treatmentCharge,
                    roomCharge,
                    dietCharge,
                    ambulanceCharge,
                    totalCost
                })

                await newBill.save();
            return res.status(201).json({msg:"bill genersted successfully...",newBill})


    } catch (error) {
        return res.status(500).json({msg:"Internal error"})
    }
}

export const getBillDetails=async(req,res)=>{
    try {
        
        const bills=await Bill.find({});

        if(!bills){
            return res.status(404).json({msg:"no bills found..."})
        }
return res.status(200).json({msg:"fetched successfully...",bills})

    } catch (error) {
        return res.status(500).json({msg:"internal error..."})
    }
}