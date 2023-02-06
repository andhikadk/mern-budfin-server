import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
export const getTransactions = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const authUser = await User.find({ refresh_token: refreshToken });
    if (!authUser[0]) return res.sendStatus(403);
    const user = authUser[0]._id;
    if (authUser[0].role === 'admin') {
      const transactions = await Transaction.find(
        {},
        'user category detail type amount date'
      )
        .populate('user', 'name')
        .populate('category', 'name')
        .sort({ created_at: -1 });
      return res.status(200).json(transactions);
    }
    const transactions = await Transaction.find(
      { user },
      'user category detail type amount date'
    )
      .populate('user', 'name')
      .populate('category', 'name')
      .sort({ created_at: -1 });
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
    if (type === 'income') {
      const balance = authUser[0].balance + amount;
      await User.updateOne({ refresh_token: refreshToken }, { balance });
    } else if (type === 'expense') {
      const balance = authUser[0].balance - amount;
      await User.updateOne({ refresh_token: refreshToken }, { balance });
    }
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const authUser = await User.find({ refresh_token: refreshToken });
    if (!authUser[0]) return res.sendStatus(403);
    const updatedTransaction = await Transaction.findById(req.params.id);
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    const { type, amount } = updatedTransaction;
    await Transaction.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body, updated_at: Date.now() } }
    );
    const updatedBalance = req.body.amount - amount;
    if (type === 'income') {
      const balance = authUser[0].balance + updatedBalance;
      await User.updateOne({ refresh_token: refreshToken }, { balance });
    } else if (type === 'expense') {
      const balance = authUser[0].balance - updatedBalance;
      await User.updateOne({ refresh_token: refreshToken }, { balance });
    }
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const authUser = await User.find({ refresh_token: refreshToken });
    if (!authUser[0]) return res.sendStatus(403);
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    const { type, amount } = transaction;
    if (type === 'income') {
      const balance = authUser[0].balance - amount;
      await User.updateOne({ refresh_token: refreshToken }, { balance });
    } else if (type === 'expense') {
      const balance = authUser[0].balance + amount;
      await User.updateOne({ refresh_token: refreshToken }, { balance });
    }
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
