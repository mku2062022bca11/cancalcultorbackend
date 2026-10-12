const Expense = require('../models/Expense');

// Get all expenses with optional filtering
exports.getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(query).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

// Get expense statistics (Today, This Month, Total, Category breakdown)
exports.getExpenseStats = async (req, res) => {
  try {
    const now = new Date();
    
    // Start of Today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of Month & Year
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const allExpenses = await Expense.find();

    let totalExpense = 0;
    let todayExpense = 0;
    let thisMonthExpense = 0;
    let thisYearExpense = 0;
    const categoryBreakdown = {};

    allExpenses.forEach((exp) => {
      const amt = Number(exp.amount) || 0;
      totalExpense += amt;

      const expDate = new Date(exp.date);
      if (expDate >= todayStart) {
        todayExpense += amt;
      }
      if (expDate >= monthStart) {
        thisMonthExpense += amt;
      }
      if (expDate >= yearStart) {
        thisYearExpense += amt;
      }

      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + amt;
    });

    res.json({
      todayExpense,
      thisMonthExpense,
      thisYearExpense,
      totalExpense,
      categoryBreakdown,
      count: allExpenses.length
    });
  } catch (error) {
    console.error('Error calculating expense stats:', error);
    res.status(500).json({ message: 'Error calculating expense stats', error: error.message });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { title, category, amount, date, paymentMode, notes } = req.body;
    
    if (!title || !amount) {
      return res.status(400).json({ message: 'Title and Amount are required' });
    }

    const expense = new Expense({
      title: title.trim(),
      category: category || 'Other',
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      paymentMode: paymentMode || 'Cash',
      notes: notes || ''
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(400).json({ message: 'Error creating expense', error: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const { title, category, amount, date, paymentMode, notes } = req.body;

    if (title !== undefined) expense.title = title.trim();
    if (category !== undefined) expense.category = category;
    if (amount !== undefined) expense.amount = Number(amount);
    if (date !== undefined) expense.date = new Date(date);
    if (paymentMode !== undefined) expense.paymentMode = paymentMode;
    if (notes !== undefined) expense.notes = notes;

    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(400).json({ message: 'Error updating expense', error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
};
