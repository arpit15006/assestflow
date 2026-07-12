import { Router } from 'express';
import { notificationController } from '../../controllers/notification.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission(PERMISSIONS.notification.view), notificationController.list);
router.get('/unread-count', requirePermission(PERMISSIONS.notification.view), notificationController.unreadCount);
router.post('/read-all', requirePermission(PERMISSIONS.notification.view), notificationController.readAll);
router.post('/:id/read', requirePermission(PERMISSIONS.notification.view), notificationController.read);

export default router;
