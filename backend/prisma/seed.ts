import { PrismaClient, Role, AssetState, AssetCondition, MaintenancePriority, MaintenanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Clear database
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Department", "AssetCategory", "Asset", "AssetAllocation", "Booking", "MaintenanceRequest", "AuditCycle", "AuditItem", "Notification", "ActivityLog" CASCADE;`);

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 2. Create Departments
  const deptData = [
    { name: 'Executive' },
    { name: 'Operations' },
    { name: 'Engineering' },
    { name: 'Sales' },
    { name: 'IT Support' },
    { name: 'Audit & Compliance' },
    { name: 'Human Resources' },
    { name: 'Finance' },
  ];
  const createdDepts: any[] = [];
  for (const dept of deptData) {
    const d = await prisma.department.create({ data: dept });
    createdDepts.push(d);
  }

  // 3. Create Users (8 users across all roles)
  const userData = [
    { name: 'Arpit Patel',       email: 'admin@assetflow.ai',       role: Role.ADMIN,            departmentId: createdDepts[0].id },
    { name: 'Priya Sharma',      email: 'manager@assetflow.ai',     role: Role.ASSET_MANAGER,    departmentId: createdDepts[1].id },
    { name: 'Raj Malhotra',      email: 'head@assetflow.ai',        role: Role.DEPARTMENT_HEAD,  departmentId: createdDepts[2].id },
    { name: 'Amit Verma',        email: 'employee@assetflow.ai',    role: Role.EMPLOYEE,         departmentId: createdDepts[3].id },
    { name: 'Siddharth Roy',     email: 'auditor@assetflow.ai',     role: Role.AUDITOR,          departmentId: createdDepts[5].id },
    { name: 'Vikram Singh',      email: 'technician@assetflow.ai',  role: Role.TECHNICIAN,       departmentId: createdDepts[4].id },
    { name: 'Neha Gupta',        email: 'neha.gupta@assetflow.ai',  role: Role.EMPLOYEE,         departmentId: createdDepts[6].id },
    { name: 'Rahul Khanna',      email: 'rahul.khanna@assetflow.ai',role: Role.EMPLOYEE,         departmentId: createdDepts[7].id },
  ];

  const createdUsers: any[] = [];
  for (const user of userData) {
    const u = await prisma.user.create({
      data: { name: user.name, email: user.email, passwordHash, role: user.role, departmentId: user.departmentId, status: 'ACTIVE' },
    });
    createdUsers.push(u);
  }

  // Link department manager
  await prisma.department.update({ where: { id: createdDepts[2].id }, data: { managerId: createdUsers[2].id } });

  // 4. Create Asset Categories
  const categoryData = [
    { name: 'Laptops',        description: 'Enterprise notebooks and ultrabooks' },
    { name: 'Monitors',       description: '4K and HD display monitors' },
    { name: 'Mobile Devices', description: 'Smartphones and tablets for testing' },
    { name: 'Printers',       description: 'Laser and inkjet office printers' },
    { name: 'Servers',        description: 'Rack and tower datacenter servers' },
    { name: 'Furniture',      description: 'Ergonomic chairs, desks, and shelving' },
    { name: 'Networking',     description: 'Managed switches, routers, and APs' },
    { name: 'Projectors',     description: 'Conference room laser projectors' },
    { name: 'Accessories',    description: 'Keyboards, mice, docking stations, headsets' },
    { name: 'Vehicles',       description: 'Corporate fleet pool cars and vans' },
  ];
  const createdCats: any[] = [];
  for (const cat of categoryData) {
    const c = await prisma.assetCategory.create({ data: cat });
    createdCats.push(c);
  }

  // 5. Create Assets — realistic named assets
  const conditions = [AssetCondition.NEW, AssetCondition.GOOD, AssetCondition.GOOD, AssetCondition.FAIR, AssetCondition.POOR];
  const locations = ['HQ Mumbai — Floor 3', 'Bangalore Office — East Wing', 'Delhi Hub — Level 2', 'Remote / Work-From-Home', 'Server Room — Rack B'];

  const assetDefinitions = [
    // Laptops
    { name: 'Dell Latitude 5540', cat: 0, isShared: false },
    { name: 'Dell Latitude 5540', cat: 0, isShared: false },
    { name: 'Apple MacBook Pro 14"', cat: 0, isShared: false },
    { name: 'Apple MacBook Pro 14"', cat: 0, isShared: false },
    { name: 'Apple MacBook Air M2', cat: 0, isShared: false },
    { name: 'Lenovo ThinkPad X1 Carbon', cat: 0, isShared: false },
    { name: 'Lenovo ThinkPad T14s', cat: 0, isShared: false },
    { name: 'HP EliteBook 840 G10', cat: 0, isShared: false },
    { name: 'HP ProBook 450 G9', cat: 0, isShared: false },
    { name: 'Asus ProArt Studiobook', cat: 0, isShared: false },
    { name: 'Microsoft Surface Pro 9', cat: 0, isShared: false },
    { name: 'Acer TravelMate P6', cat: 0, isShared: false },
    // Monitors
    { name: 'Dell UltraSharp U2723D 27"', cat: 1, isShared: false },
    { name: 'Dell UltraSharp U2723D 27"', cat: 1, isShared: false },
    { name: 'LG 27UK850 4K Monitor', cat: 1, isShared: false },
    { name: 'Samsung Odyssey G7 32"', cat: 1, isShared: false },
    { name: 'BenQ PD3220U Designer Monitor', cat: 1, isShared: false },
    { name: 'ViewSonic VP2768 27"', cat: 1, isShared: false },
    { name: 'ASUS ProArt PA278CGV', cat: 1, isShared: false },
    // Mobile Devices
    { name: 'Apple iPhone 15 Pro', cat: 2, isShared: false },
    { name: 'Apple iPhone 15 Pro', cat: 2, isShared: false },
    { name: 'Apple iPad Pro 12.9"', cat: 2, isShared: false },
    { name: 'Samsung Galaxy S24 Ultra', cat: 2, isShared: false },
    { name: 'Samsung Galaxy Tab S9', cat: 2, isShared: false },
    { name: 'OnePlus 12', cat: 2, isShared: false },
    // Printers
    { name: 'HP LaserJet Pro M404dn', cat: 3, isShared: true },
    { name: 'Canon imageRUNNER 2630', cat: 3, isShared: true },
    { name: 'Epson WorkForce Pro WF-4820', cat: 3, isShared: true },
    { name: 'Brother HL-L8360CDW', cat: 3, isShared: true },
    // Servers
    { name: 'Dell PowerEdge R750', cat: 4, isShared: false },
    { name: 'Dell PowerEdge R750', cat: 4, isShared: false },
    { name: 'HP ProLiant DL380 Gen10', cat: 4, isShared: false },
    { name: 'Lenovo ThinkSystem SR650', cat: 4, isShared: false },
    { name: 'Supermicro SuperServer 6029P', cat: 4, isShared: false },
    // Furniture
    { name: 'Herman Miller Aeron Chair', cat: 5, isShared: false },
    { name: 'Herman Miller Aeron Chair', cat: 5, isShared: false },
    { name: 'Steelcase Gesture Chair', cat: 5, isShared: false },
    { name: 'IKEA BEKANT Sit/Stand Desk', cat: 5, isShared: false },
    { name: 'Varidesk ProDesk 60 Electric', cat: 5, isShared: false },
    // Networking
    { name: 'Cisco Catalyst 9200 Switch', cat: 6, isShared: true },
    { name: 'Cisco Catalyst 9200 Switch', cat: 6, isShared: true },
    { name: 'Ubiquiti UniFi Dream Machine Pro', cat: 6, isShared: false },
    { name: 'Palo Alto PA-820 Firewall', cat: 6, isShared: false },
    { name: 'Aruba AP-535 Access Point', cat: 6, isShared: true },
    // Projectors (shared bookable)
    { name: 'Epson EB-PQ2220B Laser Projector', cat: 7, isShared: true },
    { name: 'Sony VPL-FHZ85 Laser Projector', cat: 7, isShared: true },
    { name: 'BenQ LH820ST Laser Projector', cat: 7, isShared: true },
    // Accessories
    { name: 'Logitech MX Master 3S Mouse', cat: 8, isShared: false },
    { name: 'Apple Magic Keyboard', cat: 8, isShared: false },
    { name: 'Logitech C920 HD Webcam', cat: 8, isShared: false },
    { name: 'Dell WD22TB4 Thunderbolt Dock', cat: 8, isShared: false },
    { name: 'CalDigit TS4 Thunderbolt Dock', cat: 8, isShared: false },
    { name: 'Sony WH-1000XM5 Headset', cat: 8, isShared: false },
    // Vehicles (shared bookable)
    { name: 'Toyota Camry 2024 — MH 12 AB 1234', cat: 9, isShared: true },
    { name: 'Maruti Suzuki Ertiga — MH 12 CD 5678', cat: 9, isShared: true },
    { name: 'Mahindra Scorpio N — MH 04 EF 9012', cat: 9, isShared: true },
    { name: 'Tata Nexon EV — MH 14 GH 3456', cat: 9, isShared: true },
    // Extra laptops for volume
    { name: 'Dell Precision 5580 Workstation', cat: 0, isShared: false },
    { name: 'HP ZBook Studio G10', cat: 0, isShared: false },
    { name: 'Razer Blade 15 Studio', cat: 0, isShared: false },
    { name: 'Lenovo IdeaPad Pro 5', cat: 0, isShared: false },
    // Extra monitors
    { name: 'AOC U27V4EA 4K Monitor', cat: 1, isShared: false },
    { name: 'Philips 279P1 USB-C Monitor', cat: 1, isShared: false },
    // Extra mobiles
    { name: 'Apple iPhone 14', cat: 2, isShared: false },
    { name: 'Google Pixel 8 Pro', cat: 2, isShared: false },
    // Conference room items (bookable)
    { name: 'Polycom Studio X52 Video Bar', cat: 8, isShared: true },
    { name: 'Owl Labs Meeting Owl Pro', cat: 8, isShared: true },
  ];

  const createdAssets: any[] = [];
  for (let i = 0; i < assetDefinitions.length; i++) {
    const def = assetDefinitions[i];
    const cat = createdCats[def.cat];
    const dept = createdDepts[i % createdDepts.length];
    const idx = i + 1;

    // Assign statuses realistically
    let status: AssetState = AssetState.AVAILABLE;
    if (idx <= 30) status = AssetState.ALLOCATED;
    else if (idx <= 38) status = AssetState.UNDER_MAINTENANCE;
    else if (def.isShared) status = AssetState.AVAILABLE;

    const asset = await prisma.asset.create({
      data: {
        name: def.name,
        assetTag: `AF-${String(idx).padStart(4, '0')}`,
        serialNumber: `SN-${200000 + idx}-${String(Math.floor(1000 + Math.random() * 9000))}`,
        categoryId: cat.id,
        acquisitionDate: new Date(Date.now() - (idx % 18) * 30 * 24 * 60 * 60 * 1000),
        acquisitionCost: 800 + (idx % 15) * 250,
        condition: conditions[idx % conditions.length],
        status,
        location: locations[idx % locations.length],
        departmentId: dept.id,
        isShared: def.isShared,
      },
    });
    createdAssets.push(asset);
  }

  // 6. Create Allocations (first 30 assets are ALLOCATED)
  const employees = [createdUsers[3], createdUsers[6], createdUsers[7], createdUsers[2], createdUsers[1]]; // non-admin
  const allocationNotes = [
    'Standard employee onboarding kit',
    'Project team equipment deployment',
    'Remote worker home office setup',
    'Temporary device loan for external engagement',
    'Department head workstation upgrade',
    'Design team creative workstation',
    'Developer hardware provisioning',
    'Sales team mobile field kit',
  ];
  for (let i = 0; i < 30; i++) {
    const asset = createdAssets[i];
    const user = employees[i % employees.length];
    await prisma.assetAllocation.create({
      data: {
        assetId: asset.id,
        userId: user.id,
        departmentId: user.departmentId,
        allocatedById: createdUsers[1].id, // Asset Manager allocates
        allocatedAt: new Date(Date.now() - (5 + i * 3) * 24 * 60 * 60 * 1000),
        expectedReturnDate: new Date(Date.now() + (180 + i * 5) * 24 * 60 * 60 * 1000),
        notes: allocationNotes[i % allocationNotes.length],
        status: 'ACTIVE',
      },
    });
  }

  // 7. Create Bookings for shared assets spread across today, tomorrow, and this week
  const sharedAssets = createdAssets.filter((a: any) => a.isShared);
  const bookingTitles = [
    'Q3 Sprint Planning Session',
    'Product Roadmap Review',
    'Engineering Sync — Weekly Standup',
    'Client Demo — Presentation Prep',
    'HR Town Hall Meeting',
    'Budget Review FY2025',
    'Design Sprint Workshop',
    'Vendor Evaluation Call',
    'Department KPI Review',
    'Sales Kickoff Strategy',
    'Security Awareness Training',
    'New Hire Orientation Session',
    'Leadership Roundtable',
    'Technical Architecture Review',
    'Monthly All-Hands Meeting',
    'Customer Success Review',
    'IT Infrastructure Planning',
    'Compliance Audit Briefing',
    'Investor Relations Prep',
    'Product Launch Celebration',
    'Cross-department Collaboration',
    'Remote Team Video Sync',
    'Partnership Negotiation',
    'Finance Review — Quarterly',
    'Annual Performance Reviews',
    'Supplier Contract Discussion',
    'Legal & Compliance Meeting',
    'Field Trip to Client Site',
    'Executive Strategy Meeting',
    'Stakeholder Presentation',
  ];
  const bookingPurposes = [
    'Review sprint backlog, assign story points, and plan team velocity for Q3.',
    'Align on product vision and prioritize features for the upcoming quarter.',
    'Weekly engineering standup to unblock tasks and track ongoing sprint health.',
    'Rehearse live product demo for the Enterprise client visit on Friday.',
    'Quarterly HR town hall to address policy updates and employee Q&A.',
    'Review department spending, identify variances, and approve next quarter budget.',
    'Two-day design sprint to ideate solutions for customer onboarding friction.',
    'Evaluate shortlisted vendors for the new ERP procurement project.',
    'Monthly KPI review and departmental performance tracking.',
    'Sales strategy kick-off for the new financial year.',
    'Mandatory security awareness and phishing prevention training session.',
    'Orientation program for new hires joining this month.',
    'Leadership team strategy discussion for long-term growth.',
    'Review current system architecture and plan technical debt reduction.',
    'Monthly all-hands meeting to share company-wide updates.',
    'Review open customer success tickets and renewal pipeline.',
    'Plan IT infrastructure upgrades for the next fiscal year.',
    'Brief team on upcoming compliance audit requirements.',
    'Prepare materials for upcoming investor relations call.',
    'Team celebration for the successful product launch milestone.',
    'Cross-team planning session to align on shared dependencies.',
    'Remote team video conference for distributed team coordination.',
    'Partnership discussion and negotiation for strategic alliance.',
    'Quarterly finance review with department heads.',
    'Annual performance appraisal discussion with HR and department heads.',
    'Supplier contract renewal discussion and negotiation.',
    'Legal review of pending compliance and regulatory matters.',
    'Field visit to key client site for account relationship building.',
    'Executive leadership strategy planning for upcoming quarter.',
    'Stakeholder presentation of quarterly achievements and roadmap.',
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let bookingIndex = 0;
  for (let dayOffset = 0; dayOffset <= 14; dayOffset++) {
    const bookingDay = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);

    // Create 2-3 bookings per day spread across different shared assets
    const slotsForDay = [
      { startH: 9, endH: 10 },
      { startH: 11, endH: 13 },
      { startH: 14, endH: 15 },
    ];

    for (let slot = 0; slot < Math.min(slotsForDay.length, sharedAssets.length); slot++) {
      if (bookingIndex >= bookingTitles.length) break;
      const asset = sharedAssets[slot % sharedAssets.length];
      const user = createdUsers[bookingIndex % createdUsers.length];
      const slotTimes = slotsForDay[slot];

      const startTime = new Date(bookingDay);
      startTime.setHours(slotTimes.startH, 0, 0, 0);
      const endTime = new Date(bookingDay);
      endTime.setHours(slotTimes.endH, 0, 0, 0);

      await prisma.booking.create({
        data: {
          assetId: asset.id,
          userId: user.id,
          startTime,
          endTime,
          title: bookingTitles[bookingIndex],
          purpose: bookingPurposes[bookingIndex],
          attendees: 3 + (bookingIndex % 10),
          status: dayOffset < 0 ? 'COMPLETED' : 'UPCOMING',
        },
      });
      bookingIndex++;
    }
  }

  // 8. Create Maintenance Requests — spread across all statuses realistically
  const maintenanceAssets = createdAssets.slice(30, 38); // UNDER_MAINTENANCE assets
  const maintenanceDescriptions = [
    'Screen flickering intermittently during presentations — power cycling not resolving.',
    'Battery life reduced to 40% of original capacity within 18 months of use.',
    'Keyboard keys W and S are unresponsive. Possible liquid damage from spill incident.',
    'Overheating issues during intensive compute tasks — fan running at full speed constantly.',
    'Monitor showing horizontal line artifacts at 1440p resolution.',
    'Printer paper jam sensor triggering false positives — paper feeds normally.',
    'Network interface card failing — dropping packets intermittently causing connectivity issues.',
    'USB-C port physically damaged — unable to connect to docking station.',
    'Hard drive clicking noise — potential mechanical failure risk. Backup needed urgently.',
    'Vehicle AC unit not functioning — requires compressor inspection and refrigerant top-up.',
    'Projector lamp showing DLP color wheel degradation — colors appear washed out.',
    'Office chair hydraulic lift mechanism failing — chair not holding height position.',
    'Phone microphone distorted — callers reporting audio quality issues on calls.',
    'Router firmware crash loop — factory reset required with reconfiguration.',
    'Server RAID array showing degraded status — one disk drive failure detected.',
    'Ergonomic desk motor failed — sit-stand mechanism not responding to controls.',
    'Laptop fan bearing worn — grinding noise during operation, risk of overheating.',
    'Access point intermittently disconnecting clients — spanning tree protocol issue suspected.',
    'Vehicle rear-view camera system malfunction — reverse parking safety risk.',
    'Tablet touchscreen dead zones — unresponsive in lower-left quadrant region.',
  ];
  const allStatuses = [
    MaintenanceStatus.PENDING, MaintenanceStatus.APPROVED, MaintenanceStatus.TECHNICIAN_ASSIGNED,
    MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.RESOLVED,
    MaintenanceStatus.PENDING, MaintenanceStatus.TECHNICIAN_ASSIGNED, MaintenanceStatus.IN_PROGRESS,
    MaintenanceStatus.PENDING, MaintenanceStatus.APPROVED,
    MaintenanceStatus.RESOLVED, MaintenanceStatus.IN_PROGRESS,
    MaintenanceStatus.PENDING, MaintenanceStatus.TECHNICIAN_ASSIGNED,
    MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.PENDING,
    MaintenanceStatus.APPROVED, MaintenanceStatus.TECHNICIAN_ASSIGNED,
    MaintenanceStatus.PENDING, MaintenanceStatus.RESOLVED,
  ];
  const allPriorities = [
    MaintenancePriority.HIGH, MaintenancePriority.MEDIUM, MaintenancePriority.CRITICAL,
    MaintenancePriority.HIGH, MaintenancePriority.MEDIUM, MaintenancePriority.LOW,
    MaintenancePriority.CRITICAL, MaintenancePriority.HIGH, MaintenancePriority.MEDIUM,
    MaintenancePriority.LOW, MaintenancePriority.HIGH, MaintenancePriority.MEDIUM,
    MaintenancePriority.CRITICAL, MaintenancePriority.HIGH, MaintenancePriority.LOW,
    MaintenancePriority.MEDIUM, MaintenancePriority.HIGH, MaintenancePriority.MEDIUM,
    MaintenancePriority.CRITICAL, MaintenancePriority.LOW,
  ];

  for (let i = 0; i < 20; i++) {
    const asset = maintenanceAssets[i % maintenanceAssets.length];
    const reporter = createdUsers[i % (createdUsers.length - 1)];
    const status = allStatuses[i];
    const isAssigned = [MaintenanceStatus.TECHNICIAN_ASSIGNED, MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.RESOLVED].includes(status);

    await prisma.maintenanceRequest.create({
      data: {
        assetId: asset.id,
        reporterId: reporter.id,
        assignedTechnicianId: isAssigned ? createdUsers[5].id : null,
        description: maintenanceDescriptions[i],
        priority: allPriorities[i],
        status,
        cost: status === MaintenanceStatus.RESOLVED ? 150 + i * 25 : null,
        resolutionNotes: status === MaintenanceStatus.RESOLVED
          ? `Issue diagnosed and resolved. Parts replaced. Unit tested and verified in working condition. Closed on ${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}.`
          : null,
      },
    });
  }

  // 9. Create Audit Cycles
  const auditCycle1 = await prisma.auditCycle.create({
    data: {
      name: 'Q2 FY2025 Asset Compliance Audit',
      startDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
      auditorId: createdUsers[4].id,
      closedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  });

  const auditCycle2 = await prisma.auditCycle.create({
    data: {
      name: 'Annual Hardware Verification FY2025',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      auditorId: createdUsers[4].id,
    },
  });

  for (let i = 0; i < 15; i++) {
    await prisma.auditItem.create({
      data: {
        auditCycleId: auditCycle2.id,
        assetId: createdAssets[i].id,
        verification: i % 4 === 0 ? 'MISSING' : i % 7 === 0 ? 'DAMAGED' : 'VERIFIED',
        notes: i % 4 === 0 ? 'Asset not found at registered location — last seen at remote site.' : undefined,
      },
    });
  }

  // 10. Create Notifications (one per user, realistic set)
  const notifTemplates = [
    { title: 'Asset Allocated Successfully', message: 'Dell Latitude 5540 (AF-0001) has been allocated to you by Priya Sharma.', type: 'ALLOCATION' },
    { title: 'Maintenance Request Approved', message: 'Your maintenance request for MacBook Pro has been approved and a technician assigned.', type: 'MAINTENANCE' },
    { title: 'Resource Booking Confirmed', message: 'Your booking for Conference Room A on today at 9:00 AM has been confirmed.', type: 'BOOKING' },
    { title: 'Asset Return Due Tomorrow', message: 'HP EliteBook 840 G10 (AF-0008) is due for return tomorrow. Please initiate the return process.', type: 'ALLOCATION' },
    { title: 'New Maintenance Request Raised', message: 'An urgent maintenance request has been raised for Server Dell PowerEdge R750.', type: 'MAINTENANCE' },
    { title: 'Audit Cycle Initiated', message: 'Annual Hardware Verification audit cycle has been initiated. Verify your assets.', type: 'SYSTEM' },
    { title: 'Transfer Request Received', message: 'Raj Malhotra has requested a transfer of Lenovo ThinkPad X1 Carbon to Engineering department.', type: 'ALLOCATION' },
    { title: 'Booking Reminder', message: 'Your booking for Toyota Camry starts in 30 minutes. Please pick up keys from reception.', type: 'BOOKING' },
  ];

  for (let i = 0; i < createdUsers.length; i++) {
    const user = createdUsers[i];
    const tmpl = notifTemplates[i % notifTemplates.length];
    await prisma.notification.create({
      data: { userId: user.id, title: tmpl.title, message: tmpl.message, type: tmpl.type, isRead: i > 4 },
    });
    // Extra notification for admin
    if (i === 0) {
      await prisma.notification.create({
        data: { userId: user.id, title: 'System Health Check', message: 'Monthly system health check completed. 2 assets flagged for maintenance.', type: 'SYSTEM', isRead: false },
      });
    }
  }

  console.log(`✅ Seeding complete!`);
  console.log(`   • Departments: ${createdDepts.length}`);
  console.log(`   • Users: ${createdUsers.length}`);
  console.log(`   • Asset Categories: ${createdCats.length}`);
  console.log(`   • Assets: ${createdAssets.length}`);
  console.log(`   • Allocations: 30`);
  console.log(`   • Bookings: ${bookingIndex}`);
  console.log(`   • Maintenance Requests: 20`);
  console.log(`   • Audit Cycles: 2`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
