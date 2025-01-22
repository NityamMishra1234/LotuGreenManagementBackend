import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
        },
        totalBeds: {
            type: Number,
            required: true,
        },
        occupiedBeds: {
            type: Number,
            default: 0,
        },
        pgOwnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student',
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
