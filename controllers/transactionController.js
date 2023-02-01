import Transaction from '../models/Transaction.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
export const getTransactions = async (req, res) => {};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Public
export const getTransactionById = async (req, res) => {};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Public
export const createTransaction = async (req, res) => {
  try {
    const { user, category, detail, type, amount, date } = req.body;
    await Transaction.create({
      user,
      category,
      detail,
      type,
      amount,
      date,
    });
    const createdTransaction = await Transaction.findOne();
    res.status(201).json({
      message: 'Transaction created successfully',
      data: createdTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
