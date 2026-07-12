import { Router } from 'express';
import { userController } from '../../controllers/user.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, requireRole, PERMISSIONS } from '../../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission(PERMISSIONS.asset.read), userController.list);
router.patch('/:id/role', requireRole('ADMIN'), userController.promote);
router.delete('/:id', requireRole('ADMIN'), userController.delete);

export default router;
