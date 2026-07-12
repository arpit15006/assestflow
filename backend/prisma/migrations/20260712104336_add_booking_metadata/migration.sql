-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "attendees" INTEGER DEFAULT 1,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "title" TEXT;
