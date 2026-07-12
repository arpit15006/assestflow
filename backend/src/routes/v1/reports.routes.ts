import { Router } from 'express';
import { reportController } from '../../controllers/report.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/:type', requirePermission(PERMISSIONS.report.view), reportController.getReport);
router.post('/export', requirePermission(PERMISSIONS.report.export), reportController.exportReport);

export default router;
