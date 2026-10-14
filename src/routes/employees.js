import express from 'express';
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeBlock,
} from '../controllers/employeeController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roleGuard.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorizeRoles('super_admin', 'company_admin'), getEmployees);
router.post('/create', authorizeRoles('super_admin', 'company_admin'), createEmployee);
router.put('/:id', authorizeRoles('super_admin', 'company_admin'), updateEmployee);
router.delete('/:id', authorizeRoles('super_admin', 'company_admin'), deleteEmployee);
router.put('/:id/block', authorizeRoles('super_admin', 'company_admin'), toggleEmployeeBlock);

export default router;
