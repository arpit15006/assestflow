import { Router } from 'express';
import authRoutes from './auth.routes';
import assetRoutes from './assets.routes';
import allocationRoutes from './allocations.routes';
import bookingRoutes from './bookings.routes';
import maintenanceRoutes from './maintenance.routes';
import notificationRoutes from './notifications.routes';
import departmentRoutes from './departments.routes';
import uploadRoutes from './upload.routes';
import dashboardRoutes from './dashboard.routes';
import reportsRoutes from './reports.routes';
import auditRoutes from './audit.routes';
import usersRoutes from './users.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/allocations', allocationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/departments', departmentRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportsRoutes);
router.use('/audit', auditRoutes);
router.use('/users', usersRoutes);

export default router;
