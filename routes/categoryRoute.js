import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
// import { verifyToken, adminOnly } from '../middleware/authUser.js';

const router = express.Router();

router
  .get('/categories', getCategories)
  .get('/categories/:id', getCategoryById)
  .post('/categories', createCategory)
  .put('/categories/:id', updateCategory)
  .delete('/categories/:id', deleteCategory);

export default router;
