const Payment = require('../models/Payment');
const Customer = require('../models/Customer');

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('customerId', 'name phone').sort({ date: -1, createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();

    // Deduct amount from customer balance
    const customer = await Customer.findById(payment.customerId);
    if (customer) {
      customer.balance -= payment.amount;
      await customer.save();
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating payment', error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const oldAmount = payment.amount;
    const newAmount = req.body.amount !== undefined ? Number(req.body.amount) : oldAmount;

    // Update the payment
    payment.amount = newAmount;
    if (req.body.method) payment.method = req.body.method;
    if (req.body.status) payment.status = req.body.status;
    if (req.body.notes !== undefined) payment.notes = req.body.notes;
    await payment.save();

    // Adjust customer balance based on difference
    const diff = newAmount - oldAmount;
    if (diff !== 0) {
      const customer = await Customer.findById(payment.customerId);
      if (customer) {
        customer.balance -= diff;
        await customer.save();
      }
    }

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating payment', error: error.message });
  }
};
