const Delivery = require('../models/Delivery');
const Customer = require('../models/Customer');

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('customerId', 'name phone').sort({ date: -1, createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();

    // Update customer balance and pending empty cans
    const customer = await Customer.findById(delivery.customerId);
    if (customer) {
      customer.balance += delivery.totalAmount;
      
      // Calculate empty cans delta (delivered - collected) for 20L water
      let cansDelivered = 0;
      delivery.items.forEach(item => {
        if (item.itemType === '20L Water' || item.itemType === '20L Water Can') {
          cansDelivered += item.quantity;
        }
      });
      
      customer.pendingEmptyCans += (cansDelivered - delivery.emptyCansCollected);
      await customer.save();
    }

    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ message: 'Error creating delivery', error: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    const oldEmptyCansCollected = delivery.emptyCansCollected || 0;
    const newEmptyCansCollected = req.body.emptyCansCollected !== undefined ? Number(req.body.emptyCansCollected) : oldEmptyCansCollected;

    // Update the delivery
    delivery.emptyCansCollected = newEmptyCansCollected;
    if (req.body.status) delivery.status = req.body.status;
    if (req.body.notes !== undefined) delivery.notes = req.body.notes;
    await delivery.save();

    // Adjust customer pending cans based on difference
    const diff = newEmptyCansCollected - oldEmptyCansCollected;
    if (diff !== 0) {
      const customer = await Customer.findById(delivery.customerId);
      if (customer) {
        customer.pendingEmptyCans -= diff;
        await customer.save();
      }
    }

    res.json(delivery);
  } catch (error) {
    res.status(400).json({ message: 'Error updating delivery', error: error.message });
  }
};
