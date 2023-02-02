import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find(
      {},
      'user category detail type amount date'
    )
      .populate('user', 'name')
      .populate('category', 'name');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Public
export const getTransactionById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  try {
    const transaction = await Transaction.findById(
      req.params.id,
      'user category detail type amount date'
    )
      .populate('user', 'name')
      .populate('category', 'name');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Public
export const createTransaction = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const authUser = await User.find({ refresh_token: refreshToken });
    if (!authUser[0]) return res.sendStatus(403);
    const user = authUser[0]._id;
    const { category, detail, type, amount, date } = req.body;
    const createdTransaction = await Transaction.create({
      user,
      category,
      detail,
      type,
      amount,
      date,
    });
    res.status(201).json({
      message: 'Transaction created successfully',
      data: createdTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Public
export const updateTransaction = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  try {
    const updatedTransaction = await Transaction.findById(req.params.id);
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    await Transaction.updateOne({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public
export const deleteTransaction = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};