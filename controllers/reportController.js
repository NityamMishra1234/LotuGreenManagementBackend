import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Expense from '../models/Expense.js';
import Request from '../models/Request.js';
import Room from '../models/Room.js';

// @desc    Get occupancy report
// @route   GET /api/reports/occupancy/:ownerId
export const getOccupancyReport = async (req, res) => {
    const { ownerId } = req.params;
    try {
        const totalRooms = await Room.countDocuments({ ownerId });
        const occupiedRooms = await Room.countDocuments({ ownerId, occupiedBeds: { $gt: 0 } });
        const totalStudents = await Student.countDocuments({ ownerId });

        res.status(200).json({
            totalRooms,
            occupiedRooms,
            availableRooms: totalRooms - occupiedRooms,
            totalStudents,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get financial report
// @route   GET /api/reports/financial/:ownerId 
export const getFinancialReport = async (req, res) => {
    const { ownerId } = req.params;
    try {
        const totalIncome = await Payment.aggregate([
            { $match: { ownerId } },
            { $group: { _id: null, total: { $sum: '$amountPaid' } } }
        ]);
        const totalExpenses = await Expense.aggregate([
            { $match: { ownerId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.status(200).json({
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpenses[0]?.total || 0,
            netProfit: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending requests report
// @route   GET /api/reports/requests/:ownerId
export const getPendingRequestsReport = async (req, res) => {
    const { ownerId } = req.params;
    try {
        const pendingRequests = await Request.countDocuments({ ownerId, status: 'Pending' });
        const inProgressRequests = await Request.countDocuments({ ownerId, status: 'In Progress' });

        res.status(200).json({
            pendingRequests,
            inProgressRequests,
            resolvedRequests: await Request.countDocuments({ ownerId, status: 'Resolved' }),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly revenue report
// @route   GET /api/reports/revenue/:ownerId
export const getMonthlyRevenueReport = async (req, res) => {
    const { ownerId } = req.params;
    try {
        const revenueByMonth = await Payment.aggregate([
            { $match: { ownerId } },
            {
                $group: {
                    _id: '$month',
                    totalRevenue: { $sum: '$amountPaid' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json(revenueByMonth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
