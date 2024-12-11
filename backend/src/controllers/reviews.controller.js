import Review from "../models/reviews.model.js";

export const addReview=async(req,res)=>{
    try {
        const{ cleanliness,
            management,
            name,
            payment,
            roomFacilities,
            ambulanceFacility,
            parkingFacility,
            patientCare,
            reviewText}=req.body;

            if(!cleanliness || !name ||
                !management ||
                !payment ||
                !roomFacilities ||
                !ambulanceFacility ||
                !parkingFacility ||
                !patientCare ||
                !reviewText){
                    return res.status(404).json({msg:"all fields required..."})
                }

                const newReview=new Review({
                    cleanliness,
            management,
            payment,
            roomFacilities,
            ambulanceFacility,
            parkingFacility,
            patientCare,
            reviewText,
            name
                })

            await newReview.save();
            return res.status(201).json({msg:"Review added successfully...",newReview})
    } catch (error) {
        return res.status(500).json({msg:"Internal error..."})
    }
}

export const getReviews=async(req,res)=>{
    try {
        const reviews=await Review.find({});

        if(!reviews){
            return res.status(404).json({msg:" no reviews available..."})
        }

        return res.status(200).json({msg:"Reviews fetched successfully...",reviews})

    } catch (error) {
        return res.status(500).json({msg:"internal error..."})
    }
}

export const deleteReview=async(req,res)=>{
    try {
        const { reviewId } = req.body;

       const deletedReview= await Review.findByIdAndDelete(reviewId);
       if(!deletedReview){
        return res.status(404).json({msg:"No review found..."})
       }

        return res.status(200).json({msg:"Review Deleted successfully..."})
    } catch (error) {
        return res.status(500).json({msg:"Internal error..."})
    }
}