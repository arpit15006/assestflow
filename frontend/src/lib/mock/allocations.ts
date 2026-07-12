export type AssetCondition = 'New' | 'Good' | 'Fair' | 'Poor';
export type AssetStatus = 'Available' | 'Allocated' | 'In Maintenance' | 'Retired';

export interface Employee {
  id: string;
  name: string;
  department: string;
  avatarUrl: string;
}

export interface Asset {
  id: string;
  tag: string;
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  status: AssetStatus;
  condition: AssetCondition;
  location: string;
  acquisitionDate: string;
  imageUrl: string;
  allocatedTo?: Employee;
  expectedReturnDate?: string;
}

export interface AllocationHistoryRecord {
  id: string;
  date: string;
  allocatedTo: string;
  department: string;
  returnedBy?: string;
  returnCondition?: AssetCondition;
  status: 'Allocated' | 'Returned';
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-001', name: 'Priya Shah', department: 'Engineering', avatarUrl: 'https://i.pravatar.cc/150?u=priya' },
  { id: 'emp-002', name: 'Arjun Nair', department: 'Design', avatarUrl: 'https://i.pravatar.cc/150?u=arjun' },
  { id: 'emp-003', name: 'Samantha Lee', department: 'Procurement', avatarUrl: 'https://i.pravatar.cc/150?u=samantha' },
];

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'asset-101',
    tag: 'AF-0194',
    name: 'Dell XPS 15 Laptop',
    serialNumber: 'DL-XPS-9832A',
    category: 'Laptops',
    department: 'Engineering',
    status: 'Allocated',
    condition: 'Good',
    location: 'Mumbai Office - Floor 3',
    acquisitionDate: '2025-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
    allocatedTo: MOCK_EMPLOYEES[0],
    expectedReturnDate: '2026-12-31',
  },
  {
    id: 'asset-102',
    tag: 'AF-0195',
    name: 'MacBook Pro 16"',
    serialNumber: 'MBP-16-M3X',
    category: 'Laptops',
    department: 'Design',
    status: 'Available',
    condition: 'New',
    location: 'Bangalore Office - Floor 2',
    acquisitionDate: '2026-03-10',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
  }
];

export const MOCK_ALLOCATION_HISTORY: AllocationHistoryRecord[] = [
  {
    id: 'hist-1',
    date: '2026-03-12',
    allocatedTo: 'Priya Shah',
    department: 'Engineering',
    status: 'Allocated'
  },
  {
    id: 'hist-2',
    date: '2025-01-04',
    allocatedTo: 'Arjun Nair',
    department: 'Engineering',
    returnedBy: 'Arjun Nair',
    returnCondition: 'Good',
    status: 'Returned'
  }
];
