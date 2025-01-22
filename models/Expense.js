import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
    {
        pgOwnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        category: {
            type: String,
            enum: ['Electricity', 'Water', 'Maintenance',"Transport", 'Other',],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
