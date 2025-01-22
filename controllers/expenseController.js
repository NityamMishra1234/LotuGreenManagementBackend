import Expense from '../models/Expense.js';

// @desc    Add a new expense
// @route   POST /api/expenses
export const addExpense = async (req, res) => {
    const { pgOwnerId, description, amount, date, category } = req.body;
    try {
        const expense = new Expense({
            pgOwnerId,
            description,
            amount,
            date,
            category,
        });

        await expense.save();
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all expenses by PG Owner ID
// @route   GET /api/expenses/:pgOwnerId
export const getExpensesByOwner = async (req, res) => {
    const { pgOwnerId } = req.params;
    try {
        const expenses = await Expense.find({ pgOwnerId });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:expenseId
export const deleteExpense = async (req, res) => {
    const { expenseId } = req.params;
    try {
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await expense.deleteOne();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
