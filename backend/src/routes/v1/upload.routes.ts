import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../../controllers/upload.controller';
import { authenticate } from '../../middleware/auth';
import { requirePermission, PERMISSIONS } from '../../middleware/rbac';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

router.use(authenticate);

router.post('/image', requirePermission(PERMISSIONS.upload.image), upload.single('file'), uploadController.uploadImage);
router.post('/document', requirePermission(PERMISSIONS.upload.document), upload.single('file'), uploadController.uploadDocument);

export default router;
