import mongoose,{Schema} from 'mongoose'

const receptionistSchema=new Schema(
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
        profile:{
            type:String,
            required:false
        }
        
    },
    {timestamps:true});

const Receptionist=mongoose.model("receptionist",receptionistSchema);

export default Receptionist;