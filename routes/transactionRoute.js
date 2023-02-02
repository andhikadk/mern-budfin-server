import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

router
  .get('/transactions', getTransactions)
  .get('/transactions/:id', getTransactionById)
  .post('/transactions', createTransaction)
  .put('/transactions/:id', updateTransaction)
  .delete('/transactions/:id', deleteTransaction);

export default router;
