import { Router } from 'express';
import { allocationController } from '../../controllers/allocation.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createAllocationSchema, returnAssetSchema } from '../../validators/allocation.validator';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission(PERMISSIONS.asset.read), allocationController.list);
router.post('/', requirePermission(PERMISSIONS.asset.allocate), validate(createAllocationSchema), allocationController.allocate);
router.post('/:id/return', requirePermission(PERMISSIONS.asset.allocate), validate(returnAssetSchema), allocationController.return);

export default router;
