import { Router } from 'express';
import { bookingController } from '../../controllers/booking.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';
import { validate } from '../../middleware/validate';
import { createBookingSchema } from '../../validators/booking.validator';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission(PERMISSIONS.booking.create), bookingController.list);
router.post('/', requirePermission(PERMISSIONS.booking.create), validate(createBookingSchema), bookingController.create);
router.post('/:id/cancel', requirePermission(PERMISSIONS.booking.cancel), bookingController.cancel);

export default router;
