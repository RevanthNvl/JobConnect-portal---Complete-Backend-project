import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    company:{
        type: String,
        required:[true, 'Company name is required']
    },
    position:{
        type:String,
        required:[true, 'Job position is required'],
    },
    status:{
        type:String,
        enum: ['pending', 'reject', 'interview'],
        default: 'pending'
    },
    workType:{
        type:String,
        enum: ['full-time', 'part-time', 'internship', 'contract'],
        default: 'full-time'
    },
    workLocation:{
        type:String,
        required: [true, 'Job location is a required field'],
        default: 'Mumbai'
    },
    // creating relationship between user and jobs models
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }

}, {timestamps:true})

export default mongoose.model('job', jobSchema)