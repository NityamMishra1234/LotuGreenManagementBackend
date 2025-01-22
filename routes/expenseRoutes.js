import express from 'express';
import { addExpense, getExpensesByOwner, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/:pgOwnerId', getExpensesByOwner);
router.delete('/:expenseId', deleteExpense);

export default router;
