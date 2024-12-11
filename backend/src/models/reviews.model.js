import mongoose from 'mongoose'

const reviewSchema=new mongoose.Schema({
    name:{
        type:String
    },
    cleanliness:{
        type:Number
    },
    management: {
        type:Number
    },
    payment: {
        type:Number
    },
    roomFacilities: {
        type:Number
    },
    ambulanceFacility: {
        type:Number
    },
    parkingFacility: {
        type:Number
    },
    patientCare: {
        type:Number
    },
    reviewText: {
        type:String
    }
})

const Review=mongoose.model("review",reviewSchema)

export default Review;