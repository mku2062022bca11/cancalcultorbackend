const Customer = require('../models/Customer');
const Delivery = require('../models/Delivery');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalCustomers = await Customer.countDocuments();
    
    // Total pending balance across all customers
    const customers = await Customer.find();
    const pendingPaymentsTotal = customers.reduce((sum, cust) => sum + (cust.balance > 0 ? cust.balance : 0), 0);
    const totalMissingCans = customers.reduce((sum, cust) => sum + (cust.pendingEmptyCans > 0 ? cust.pendingEmptyCans : 0), 0);

    // Today's Deliveries
    const todayDeliveries = await Delivery.find({ date: { $gte: today } });
    const todayDeliveriesCount = todayDeliveries.length;
    
    // Today's Income (Payments received today)
    const todayPayments = await Payment.find({ date: { $gte: today } });
    const todayIncome = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalCustomers,
      pendingPaymentsTotal,
      todayDeliveriesCount,
      todayIncome,
      totalMissingCans
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
