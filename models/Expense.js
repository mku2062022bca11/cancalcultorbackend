const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Fuel',                 // டீசல் / பெட்ரோல்
      'Water Refill',         // கேன் கொள்முதல் / பிளாண்ட் ரீஃபில்
      'Plates/Materials',     // தட்டுகள் / பேக்கிங் பொருட்கள்
      'Vehicle Maintenance',  // வண்டி சர்வீஸ் / பழுது
      'Salary/Bata',          // டிரைவர் / ஊழியர் சம்பளம் / படி
      'Electricity/Bills',    // மின்சாரம் / கடை வாடகை
      'Other'                 // இதர செலவுகள்
    ],
    default: 'Other'
  },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'UPI', 'Bank', 'Other'], 
    default: 'Cash' 
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
