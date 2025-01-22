import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

// Add Payment
export const addPayment = async (req, res) => {
    const { studentId, amountPaid, paymentType, month, totalAmount } = req.body;


    const validPaymentTypes = ['Cash', 'UPI'];
    const validMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (!validPaymentTypes.includes(paymentType)) {
        return res.status(400).json({ message: `Invalid paymentType. Allowed values are: ${validPaymentTypes.join(', ')}` });
    }

    if (!validMonths.includes(month)) {
        return res.status(400).json({ message: `Invalid month. Allowed values are: ${validMonths.join(', ')}` });
    }

    if (amountPaid <= 0) {
        return res.status(400).json({ message: 'Amount paid must be greater than zero.' });
    }

    if (!totalAmount) {
        return res.status(400).json({ message: 'Total amount is required.' });
    }

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let payment = await Payment.findOne({ studentId, month });
        if (!payment) {
            payment = new Payment({
                studentId,
                amountPaid,
                paymentType,
                month,
                remainingAmount: Math.max(totalAmount - amountPaid, 0), // Calculate remainingAmount
                totalAmount, // Use the totalAmount sent from frontend
                status: amountPaid >= totalAmount ? 'Paid' : 'Pending', // Determine payment status
            });
        } else {
            payment.amountPaid += amountPaid;
            payment.remainingAmount = Math.max(payment.totalAmount - payment.amountPaid, 0);
            payment.status = payment.remainingAmount === 0 ? 'Paid' : 'Pending';
        }

        if (payment.status === 'Pending' && !payment.notificationSent) {
            // Send notification (placeholder logic)
            console.log(`Sending notification for pending payment of student ${studentId}`);
            payment.notificationSent = true;
        }

        await payment.save();

        res.status(201).json({ message: 'Payment recorded successfully', payment });
    } catch (error) {
        console.error('Error while processing payment:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// Get Monthly Breakdown for a Student
export const getMonthlyBreakdown = async (req, res) => {
    const { studentId } = req.params;

    try {
        const payments = await Payment.find({ studentId });

        if (!payments.length) {
            return res.status(404).json({ message: 'No payments found for this student' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate Payment Bill
export const generatePaymentBill = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findById(paymentId).populate('studentId', 'name email phone');
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        const doc = new PDFDocument();
        const filePath = `bills/payment_${paymentId}.pdf`;
        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(20).text('PG Payment Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Student Name: ${payment.studentId.name}`);
        doc.text(`Email: ${payment.studentId.email}`);
        doc.text(`Phone: ${payment.studentId.phone}`);
        doc.text(`Month: ${payment.month}`);
        doc.text(`Amount Paid: ₹${payment.amountPaid}`);
        doc.text(`Total Amount: ₹${payment.totalAmount}`);
        doc.text(`Remaining Balance: ₹${payment.remainingAmount}`);
        doc.text(`Payment Type: ${payment.paymentType}`);
        doc.text(`Payment Status: ${payment.status}`);

        doc.end();

        res.status(200).json({ message: 'Bill generated successfully', filePath });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Payments
export const getAllPayments = async (req, res) => {
    const { studentId, month } = req.query;

    try {
        let filter = {};

        // If studentId is provided, add it to the filter
        if (studentId) {
            filter.studentId = studentId;
        }

        // If month is provided, add it to the filter
        if (month) {
            filter.month = month;
        }

        // Find payments based on the filter
        const payments = await Payment.find(filter).populate('studentId', 'name email phone');

        if (!payments.length) {
            return res.status(404).json({ message: 'No payments found' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
