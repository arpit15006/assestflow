import { Router } from 'express';
import { dashboardController } from '../../controllers/dashboard.controller';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/admin', requireRole('ADMIN'), dashboardController.admin);
router.get('/asset-manager', requireRole('ASSET_MANAGER'), dashboardController.assetManager);
router.get('/department-head', requireRole('DEPARTMENT_HEAD'), dashboardController.departmentHead);
router.get('/employee', requireRole('EMPLOYEE'), dashboardController.employee);
router.get('/auditor', requireRole('AUDITOR'), dashboardController.auditor);
router.get('/technician', requireRole('TECHNICIAN'), dashboardController.technician);

export default router;
