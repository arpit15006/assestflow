export type ResourceType = 'Conference Room' | 'Vehicle' | 'Projector' | 'Shared Equipment';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity?: number;
  location: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string;
  attendees: number;
  status: BookingStatus;
  bookedBy: string;
  department: string;
}

export const MOCK_RESOURCES: Resource[] = [
  { id: 'res-001', name: 'Conference Room B2', type: 'Conference Room', capacity: 12, location: 'Floor 2' },
  { id: 'res-002', name: 'Executive Boardroom', type: 'Conference Room', capacity: 8, location: 'Floor 4' },
  { id: 'res-003', name: 'Company Van (MH-12)', type: 'Vehicle', capacity: 7, location: 'Basement Parking' },
  { id: 'res-004', name: '4K Projector A', type: 'Projector', location: 'IT Storage' },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    resourceId: 'res-001',
    title: 'Procurement Team Sync',
    date: '2026-07-12',
    startTime: '09:00',
    endTime: '10:00',
    purpose: 'Weekly sync with vendors',
    attendees: 5,
    status: 'Confirmed',
    bookedBy: 'Samantha Lee',
    department: 'Procurement',
  },
  {
    id: 'bk-102',
    resourceId: 'res-001',
    title: 'Product Design Review',
    date: '2026-07-12',
    startTime: '13:00',
    endTime: '14:30',
    purpose: 'Review Q3 roadmap',
    attendees: 8,
    status: 'Confirmed',
    bookedBy: 'Arjun Nair',
    department: 'Design',
  },
];
