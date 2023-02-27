import mongoose from 'mongoose';
import { isEmail } from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  refresh_token: {
    type: String,
    default: null,
  },
});

export default mongoose.model('User', userSchema);
