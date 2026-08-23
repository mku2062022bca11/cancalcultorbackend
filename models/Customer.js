const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  customerType: { type: String, enum: ['Regular', 'Function', 'Catering'], default: 'Regular' },
  businessType: { type: String, enum: ['Water', 'Plates', 'Both'], default: 'Both' },
  balance: { type: Number, default: 0 },
  pendingEmptyCans: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
