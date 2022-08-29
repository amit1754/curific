import express, { Router } from 'express';
import { paymentController } from '../controllers';
import { customerMiddleware } from '../middleware';

const router = express.Router();

// router.get('/get', authMiddleware, packageController.getPackage);
router.post('/create', customerMiddleware, paymentController.addPayment);
router.post('/failedPayment', paymentController.failedPayment);
router.get('/getPayment', paymentController.getPayment);
// router.put('/update/:id', authMiddleware, packageController.updatePackage);
// router.delete('/delete/:id', authMiddleware, packageController.deletePackage);

module.exports = router;
