import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        issueType: {
            type: String,
            enum: ['Maintenance', 'Complaint'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Request', requestSchema);
