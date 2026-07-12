import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { success, failure } from '../types/api.types';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { logger } from '../lib/logger';

// Configure cloudinary if credentials are provided in env
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export const uploadController = {
  uploadImage: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json(failure('No file uploaded'));
        return;
      }

      // Check if Cloudinary is configured
      if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'assetflow/images',
        });
        res.json(success({ url: result.secure_url, publicId: result.public_id }));
      } else {
        // Fallback mock upload
        logger.info('Cloudinary not configured. Simulating mock image upload.');
        const mockUrl = `https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80`;
        res.json(success({ url: mockUrl, publicId: `mock-img-${Date.now()}` }));
      }
    } catch (err) {
      logger.error({ err }, 'Image upload failed');
      next(err);
    }
  },

  uploadDocument: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json(failure('No file uploaded'));
        return;
      }

      if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'assetflow/documents',
          resource_type: 'raw',
        });
        res.json(success({ url: result.secure_url, publicId: result.public_id }));
      } else {
        // Fallback mock upload
        logger.info('Cloudinary not configured. Simulating mock document upload.');
        res.json(success({ url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', publicId: `mock-doc-${Date.now()}` }));
      }
    } catch (err) {
      logger.error({ err }, 'Document upload failed');
      next(err);
    }
  },
};
