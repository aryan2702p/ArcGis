const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  
  name: { type: String, default: 'New User' },
 
  Created: { type: Date, required: true, default: Date.now },
  salt: Buffer
  
 
});



exports.User = mongoose.model('User', userSchema);