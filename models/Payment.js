import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        amountPaid: {
            type: Number,
            default: 0,
        },
        remainingAmount: {
            type: Number,
            default: 7000, // Monthly fixed fee
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Paid', 'Pending'],
            default: 'Pending',
        },
        month: {
            type: String,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true, // Monthly fixed fee
        },
        paymentType: {
            type: String,
            enum: ['Cash', 'UPI'],    
        },
        notificationSent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
