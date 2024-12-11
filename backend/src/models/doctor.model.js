import mongoose,{Schema} from 'mongoose'

const doctorSchema=new Schema(
    {
        fullName:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true
        },
        userType:{
            type:String,
            required:true
        },
        specializations:{
            type:String,
            required:true
        },
        course:{
            type:String,
            required:true
        },
        profile:{
            type:String,
            required:true
        },
        certificates: {
            type: [String], // Array to store URLs of certificates
            required: true, // Ensures at least one certificate is present
          },
          appointments: [
            {
              patientEmail: {
                type: String,
                
              },
              patientName: {
                type: String,
                
              },
              status: {
                type: String,
                default: 'Pending',
              },
              date: {
                type: String,
                
              },
              time:{
                type:String
              }
            },
          ],
        
    },
    {timestamps:true});

const Doctor=mongoose.model("doctor",doctorSchema);

export default Doctor;