import { Router } from 'express';
import { assetController } from '../../controllers/asset.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createAssetSchema, updateAssetSchema } from '../../validators/asset.validator';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission(PERMISSIONS.asset.read), assetController.list);
router.get('/stats', requirePermission(PERMISSIONS.asset.read), assetController.stats);
router.get('/:id', requirePermission(PERMISSIONS.asset.read), assetController.getById);
router.post('/', requirePermission(PERMISSIONS.asset.create), validate(createAssetSchema), assetController.create);
router.put('/:id', requirePermission(PERMISSIONS.asset.update), validate(updateAssetSchema), assetController.update);
router.delete('/:id', requirePermission(PERMISSIONS.asset.delete), assetController.delete);

export default router;
