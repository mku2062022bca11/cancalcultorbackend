const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', paymentController.getPayments);
router.post('/', paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);

module.exports = router;
