import express from 'express';
import { 
    getOccupancyReport, 
    getFinancialReport, 
    getPendingRequestsReport, 
    getMonthlyRevenueReport 
} from '../controllers/reportController.js';
import { verifyOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// Occupancy report (Requires authentication)
router.get('/occupancy', verifyOwner, getOccupancyReport);

// Financial report (Requires authentication)
router.get('/financial', verifyOwner, getFinancialReport);

// Pending requests report (Requires authentication)
router.get('/requests', verifyOwner, getPendingRequestsReport);

// Monthly revenue report (Requires authentication)
router.get('/revenue', verifyOwner, getMonthlyRevenueReport);

export default router;
