import mongoose,{Schema} from 'mongoose'

const approvalSchema=new Schema(
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
          }
        
    },
    {timestamps:true});

const Approval=mongoose.model("approval",approvalSchema);

export default Approval;