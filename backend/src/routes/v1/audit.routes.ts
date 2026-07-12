import { Router } from 'express';
import { auditController } from '../../controllers/audit.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/active', requirePermission(PERMISSIONS.audit.conduct), auditController.getActiveAudit);
router.patch('/active/items/:assetId', requirePermission(PERMISSIONS.audit.conduct), auditController.updateItemStatus);
router.get('/', requirePermission(PERMISSIONS.audit.conduct), auditController.list);
router.post('/', requirePermission(PERMISSIONS.audit.create), auditController.create);
router.post('/:id/close', requirePermission(PERMISSIONS.audit.close), auditController.close);

export default router;
