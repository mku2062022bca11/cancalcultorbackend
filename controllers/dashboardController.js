const Customer = require('../models/Customer');
const Delivery = require('../models/Delivery');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');

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
    
    // Start of month & start of year
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    // Payments
    const allPayments = await Payment.find();
    let todayIncome = 0;
    let thisMonthIncome = 0;
    let thisYearIncome = 0;
    let totalIncome = 0;

    allPayments.forEach(p => {
      const amt = Number(p.amount) || 0;
      totalIncome += amt;
      const pDate = new Date(p.date);
      if (pDate >= today) todayIncome += amt;
      if (pDate >= monthStart) thisMonthIncome += amt;
      if (pDate >= yearStart) thisYearIncome += amt;
    });

    // Expenses
    const allExpenses = await Expense.find();
    let todayExpense = 0;
    let thisMonthExpense = 0;
    let thisYearExpense = 0;
    let totalExpense = 0;

    allExpenses.forEach(e => {
      const amt = Number(e.amount) || 0;
      totalExpense += amt;
      const eDate = new Date(e.date);
      if (eDate >= today) todayExpense += amt;
      if (eDate >= monthStart) thisMonthExpense += amt;
      if (eDate >= yearStart) thisYearExpense += amt;
    });

    const todayNetProfit = todayIncome - todayExpense;
    const thisMonthNetProfit = thisMonthIncome - thisMonthExpense;
    const thisYearNetProfit = thisYearIncome - thisYearExpense;
    const totalNetProfit = totalIncome - totalExpense;

    res.json({
      totalCustomers,
      pendingPaymentsTotal,
      todayDeliveriesCount,
      todayIncome,
      todayExpense,
      todayNetProfit,
      thisMonthIncome,
      thisMonthExpense,
      thisMonthNetProfit,
      thisYearIncome,
      thisYearExpense,
      thisYearNetProfit,
      totalIncome,
      totalExpense,
      totalNetProfit,
      totalMissingCans
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
