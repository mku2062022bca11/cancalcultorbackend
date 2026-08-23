const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Cash', 'UPI', 'Credit'], required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'Pending'], default: 'Completed' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
