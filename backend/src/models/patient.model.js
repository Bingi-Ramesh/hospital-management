import mongoose, { Schema } from 'mongoose';

const patientSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Consider adding unique constraint to prevent duplicate emails
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: false,
    },
    appointments: [
      {
        doctorEmail: {
          type: String,
          
        },
        doctorName: {
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
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
