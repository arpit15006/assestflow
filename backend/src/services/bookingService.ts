import { bookingRepository } from '../repositories/booking.repository';
import { assetRepository } from '../repositories/asset.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { CreateBookingInput } from '../validators/booking.validator';
import { prisma } from '../config/database';

export const bookingService = {
  list: (params: any) => bookingRepository.findAll(params),

  create: async (data: CreateBookingInput, userId: string) => {
    const asset = await assetRepository.findById(data.assetId);
    if (!asset) throw Object.assign(new Error('Asset not found'), { status: 404 });
    if (!asset.isShared) throw Object.assign(new Error('Asset is not bookable'), { status: 400 });
    if (asset.status === 'UNDER_MAINTENANCE') throw Object.assign(new Error('Asset cannot be booked during maintenance'), { status: 409 });
    if (asset.status === 'RETIRED' || asset.status === 'DISPOSED') throw Object.assign(new Error('Asset is not available for booking'), { status: 409 });

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const conflict = await bookingRepository.findConflict(data.assetId, start, end);
    if (conflict) throw Object.assign(new Error('Booking conflicts with an existing reservation'), { status: 409 });

    const booking = await bookingRepository.create({ assetId: data.assetId, userId, startTime: start, endTime: end });
    return booking;
  },

  cancel: async (id: string, userId: string) => {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw Object.assign(new Error('Booking not found'), { status: 404 });
    if (booking.userId !== userId) throw Object.assign(new Error('Cannot cancel another user\'s booking'), { status: 403 });
    if (booking.status === 'CANCELLED') throw Object.assign(new Error('Booking already cancelled'), { status: 400 });
    return bookingRepository.cancel(id);
  },

  countActive: () => bookingRepository.countActive(),
};
