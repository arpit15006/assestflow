import { Router } from 'express';
import { departmentController } from '../../controllers/department.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createDepartmentSchema, updateDepartmentSchema } from '../../validators/department.validator';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission(PERMISSIONS.asset.read), departmentController.list);
router.get('/:id', requirePermission(PERMISSIONS.asset.read), departmentController.getById);
router.post('/', requirePermission(PERMISSIONS.org.manage), validate(createDepartmentSchema), departmentController.create);
router.put('/:id', requirePermission(PERMISSIONS.org.manage), validate(updateDepartmentSchema), departmentController.update);
router.delete('/:id', requirePermission(PERMISSIONS.org.manage), departmentController.delete);

export default router;
