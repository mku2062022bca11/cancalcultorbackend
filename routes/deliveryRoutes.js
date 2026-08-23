const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', deliveryController.getDeliveries);
router.post('/', deliveryController.createDelivery);
router.put('/:id', deliveryController.updateDelivery);

module.exports = router;
