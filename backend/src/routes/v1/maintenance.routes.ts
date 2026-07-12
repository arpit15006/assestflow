import { Router } from 'express';
import { maintenanceController } from '../../controllers/maintenance.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createMaintenanceSchema, assignTechnicianSchema, resolveMaintenanceSchema } from '../../validators/maintenance.validator';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission(PERMISSIONS.maintenance.create), maintenanceController.list);
router.get('/:id', requirePermission(PERMISSIONS.maintenance.create), maintenanceController.getById);
router.post('/', requirePermission(PERMISSIONS.maintenance.create), validate(createMaintenanceSchema), maintenanceController.create);
router.post('/:id/approve', requirePermission(PERMISSIONS.maintenance.approve), maintenanceController.approve);
router.post('/:id/assign', requirePermission(PERMISSIONS.maintenance.assign), validate(assignTechnicianSchema), maintenanceController.assign);
router.post('/:id/resolve', requirePermission(PERMISSIONS.maintenance.resolve), validate(resolveMaintenanceSchema), maintenanceController.resolve);

export default router;
