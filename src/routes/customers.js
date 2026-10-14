import express from 'express';
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  toggleCustomerBlock,
} from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roleGuard.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorizeRoles('super_admin', 'company_admin'), getCustomers);
router.post('/create', authorizeRoles('super_admin', 'company_admin'), createCustomer);
router.put('/:id', authorizeRoles('super_admin', 'company_admin'), updateCustomer);
router.delete('/:id', authorizeRoles('super_admin', 'company_admin'), deleteCustomer);
router.put('/:id/block', authorizeRoles('super_admin', 'company_admin'), toggleCustomerBlock);

export default router;
