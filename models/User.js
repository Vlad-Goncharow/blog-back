import mongoose from 'mongoose';
const { Schema,model } = mongoose;

const UserShema = new Schema({
  email: {
    type: String,
    required: true
  }, 
  password: {
    type: String,
    required: true
  },
  fullName:   String,
  avatarUrl: String,
}, {
  timestamps: true
});

export const UserModel = model('User', UserShema)