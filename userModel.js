// userModel.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: /(?=.*[A-Z])(?=.*\d)/,
  },
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default mongoose.model('users', userSchema);
