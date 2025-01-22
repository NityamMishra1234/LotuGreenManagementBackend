import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        fatherName: {
            type: String,
            required: true,
        },
        fatherPhone: {
            type: String,
            required: true,
        },
        fatherOccupation: {
            type: String,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
        bedNumber: {
            type: Number,
            required: true,
        },
        profileImage: {
            type: String, // Cloudinary URL
        },
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Payment',
            }
        ]
    },
    { timestamps: true }
);

// Hash password before saving
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model('Student', studentSchema);
