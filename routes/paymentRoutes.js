import express from 'express';
import {
    addPayment,
    getMonthlyBreakdown,
    generatePaymentBill,
    getAllPayments,
} from '../controllers/paymentController.js';

const router = express.Router();

// Add a new payment
router.post('/payments/Students', addPayment);

// Get all payments or filtered by student/month
router.get('/payments', getAllPayments);

// Get monthly breakdown for a student
router.get('/payments/breakdown/:studentId', getMonthlyBreakdown);

// Generate payment bill
router.get('/payments/bill/:paymentId', generatePaymentBill);

export default router;
