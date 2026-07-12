import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { validate } from '../../middleware/validate';
import { loginSchema } from '../../validators/auth.validator';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.me);

export default router;
