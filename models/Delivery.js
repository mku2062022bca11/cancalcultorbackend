const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemType: { type: String, required: true }, // e.g., '20L Water', '8-inch Plate'
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true }
});

const deliverySchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  deliveryType: { type: String, enum: ['Water', 'Plates', 'Both'], required: true },
  items: [itemSchema],
  emptyCansCollected: { type: Number, default: 0 }, // For 20L cans
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Delivered', 'Pending', 'Cancelled'], default: 'Delivered' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
