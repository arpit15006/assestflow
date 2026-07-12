export type MaintenanceStatus = 'Pending' | 'Approved' | 'Technician Assigned' | 'In Progress' | 'Resolved';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MaintenanceComment {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName: string;
  issue: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  requestedBy: string;
  department: string;
  dateRequested: string;
  technician?: string;
  comments: MaintenanceComment[];
  activityLog: { date: string; action: string }[];
}

export const MOCK_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'MR-0062',
    assetId: 'AF-0194',
    assetName: 'Projector bulb',
    issue: 'Not turning on',
    description: 'The projector in Room B2 is completely unresponsive. No lights.',
    priority: 'High',
    status: 'Pending',
    requestedBy: 'Priya Shah',
    department: 'Engineering',
    dateRequested: '2026-07-10',
    comments: [],
    activityLog: [{ date: '2026-07-10 09:15', action: 'Request created' }],
  },
  {
    id: 'MR-0051',
    assetId: 'AF-005',
    assetName: 'AC Unit',
    issue: 'Noisy compressor',
    description: 'Loud rattling noise when AC kicks in.',
    priority: 'Medium',
    status: 'Approved',
    requestedBy: 'Arjun Nair',
    department: 'Design',
    dateRequested: '2026-07-09',
    comments: [{ id: 'c1', author: 'Admin', date: '2026-07-09', text: 'Approved for external repair.' }],
    activityLog: [
      { date: '2026-07-09 10:00', action: 'Request created' },
      { date: '2026-07-09 14:30', action: 'Status changed to Approved' }
    ],
  },
  {
    id: 'MR-0048',
    assetId: 'AF-0098',
    assetName: 'Forklift',
    issue: 'Hydraulic leak',
    description: 'Minor fluid leak near the right lift cylinder.',
    priority: 'Critical',
    status: 'Technician Assigned',
    technician: 'Mike Mechanics',
    requestedBy: 'Warehouse Manager',
    department: 'Logistics',
    dateRequested: '2026-07-11',
    comments: [],
    activityLog: [
      { date: '2026-07-11 08:00', action: 'Request created' },
      { date: '2026-07-11 08:15', action: 'Status changed to Approved' },
      { date: '2026-07-11 09:00', action: 'Assigned to Mike Mechanics' }
    ],
  },
  {
    id: 'MR-0112',
    assetId: 'AF-0112',
    assetName: 'Printer Main',
    issue: 'Paper jam error',
    description: 'Continuous paper jam error despite no visible paper.',
    priority: 'Medium',
    status: 'In Progress',
    technician: 'IT Support',
    requestedBy: 'Samantha Lee',
    department: 'Procurement',
    dateRequested: '2026-07-11',
    comments: [{ id: 'c2', author: 'IT Support', date: '2026-07-11', text: 'Parts ordered, awaiting delivery.' }],
    activityLog: [
      { date: '2026-07-11 11:00', action: 'Request created' },
      { date: '2026-07-11 11:30', action: 'Status changed to Approved' },
      { date: '2026-07-11 13:00', action: 'Assigned to IT Support' },
      { date: '2026-07-11 15:00', action: 'Status changed to In Progress' }
    ],
  },
  {
    id: 'MR-0034',
    assetId: 'AF-072',
    assetName: 'Ergonomic Chair',
    issue: 'Broken wheel',
    description: 'One caster wheel has snapped off.',
    priority: 'Low',
    status: 'Resolved',
    technician: 'Facilities',
    requestedBy: 'Arjun Nair',
    department: 'Design',
    dateRequested: '2026-07-05',
    comments: [{ id: 'c3', author: 'Facilities', date: '2026-07-07', text: 'Wheel replaced with new set.' }],
    activityLog: [
      { date: '2026-07-05 10:00', action: 'Request created' },
      { date: '2026-07-06 09:00', action: 'Assigned to Facilities' },
      { date: '2026-07-07 14:00', action: 'Status changed to Resolved' }
    ],
  }
];
