import { PrismaClient, Role, AssetState, AssetCondition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Clear database
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Department", "AssetCategory", "Asset", "AssetAllocation", "Booking", "MaintenanceRequest", "AuditCycle", "AuditItem", "Notification", "ActivityLog" CASCADE;`);

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 2. Create Departments
  const depts = [
    { name: 'Executive' },
    { name: 'Operations' },
    { name: 'Engineering' },
    { name: 'Sales' },
    { name: 'IT Support' },
    { name: 'Audit & Compliance' },
  ];
  const createdDepts = [];
  for (const dept of depts) {
    const d = await prisma.department.create({ data: dept });
    createdDepts.push(d);
  }

  // 3. Create Users
  const users = [
    { name: 'Arpit Patel', email: 'admin@assetflow.ai', role: Role.ADMIN, departmentId: createdDepts[0].id },
    { name: 'Priya Sharma', email: 'manager@assetflow.ai', role: Role.ASSET_MANAGER, departmentId: createdDepts[1].id },
    { name: 'Raj Malhotra', email: 'head@assetflow.ai', role: Role.DEPARTMENT_HEAD, departmentId: createdDepts[2].id },
    { name: 'Amit Verma', email: 'employee@assetflow.ai', role: Role.EMPLOYEE, departmentId: createdDepts[3].id },
    { name: 'Siddharth Roy', email: 'auditor@assetflow.ai', role: Role.AUDITOR, departmentId: createdDepts[5].id },
    { name: 'Vikram Singh', email: 'technician@assetflow.ai', role: Role.TECHNICIAN, departmentId: createdDepts[4].id },
  ];

  const createdUsers = [];
  for (const user of users) {
    const u = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        departmentId: user.departmentId,
        status: 'ACTIVE',
      },
    });
    createdUsers.push(u);
  }

  // Link engineering head
  await prisma.department.update({
    where: { id: createdDepts[2].id },
    data: { managerId: createdUsers[2].id },
  });

  // 4. Create Asset Categories
  const categories = [
    { name: 'Laptops', description: 'Enterprise work laptops' },
    { name: 'Monitors', description: 'Display screens and mounts' },
    { name: 'Mobile Devices', description: 'Testing smartphones and tablets' },
    { name: 'Printers', description: 'Office printers and scanners' },
    { name: 'Servers', description: 'Datacenter server hardware' },
    { name: 'Furniture', description: 'Office chairs, desks and tables' },
    { name: 'Networking', description: 'Routers, switches and hubs' },
    { name: 'Projectors', description: 'Meeting room projectors' },
    { name: 'Accessories', description: 'Keyboards, mice, and docks' },
    { name: 'Vehicles', description: 'Corporate pool cars' },
  ];
  const createdCats = [];
  for (const cat of categories) {
    const c = await prisma.assetCategory.create({ data: cat });
    createdCats.push(c);
  }

  // 5. Create Assets (100 assets)
  const conditions = [AssetCondition.NEW, AssetCondition.GOOD, AssetCondition.FAIR, AssetCondition.POOR];
  const states = [AssetState.AVAILABLE, AssetState.ALLOCATED, AssetState.RESERVED];
  const locations = ['HQ Mumbai', 'Bangalore Branch', 'Delhi Hub', 'Work From Home'];

  const createdAssets = [];
  for (let i = 1; i <= 100; i++) {
    const cat = createdCats[i % createdCats.length];
    const dept = createdDepts[i % createdDepts.length];
    
    const asset = await prisma.asset.create({
      data: {
        name: `${cat.name.slice(0, -1)} Model ${String.fromCharCode(65 + (i % 6))}-${100 + i}`,
        assetTag: `AF-${String(i).padStart(4, '0')}`,
        serialNumber: `SN-${100000 + i}-${Math.floor(1000 + Math.random() * 9000)}`,
        categoryId: cat.id,
        acquisitionDate: new Date(Date.now() - (i % 12) * 30 * 24 * 60 * 60 * 1000),
        acquisitionCost: 200 + (i % 10) * 150,
        condition: conditions[i % conditions.length],
        status: i <= 40 ? AssetState.ALLOCATED : i <= 60 ? AssetState.RESERVED : i <= 70 ? AssetState.UNDER_MAINTENANCE : AssetState.AVAILABLE,
        location: locations[i % locations.length],
        departmentId: dept.id,
        isShared: cat.name === 'Vehicles' || cat.name === 'Projectors' || cat.name === 'Furniture',
      },
    });
    createdAssets.push(asset);
  }

  // 6. Create Allocations (40 allocations)
  for (let i = 0; i < 40; i++) {
    const asset = createdAssets[i];
    const user = createdUsers[i % createdUsers.length];
    await prisma.assetAllocation.create({
      data: {
        assetId: asset.id,
        userId: user.id,
        departmentId: user.departmentId,
        allocatedById: createdUsers[0].id,
        allocatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expectedReturnDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
      },
    });
  }

  // 7. Create Bookings (25 bookings)
  const sharedAssets = createdAssets.filter(a => a.isShared);
  for (let i = 0; i < 25; i++) {
    const asset = sharedAssets[i % sharedAssets.length];
    const user = createdUsers[i % createdUsers.length];
    await prisma.booking.create({
      data: {
        assetId: asset.id,
        userId: user.id,
        startTime: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        status: 'UPCOMING',
      },
    });
  }

  // 8. Create Maintenance Requests (20 requests)
  const maintenanceAssets = createdAssets.filter(a => a.status === AssetState.UNDER_MAINTENANCE);
  for (let i = 0; i < Math.min(20, maintenanceAssets.length); i++) {
    const asset = maintenanceAssets[i];
    const reporter = createdUsers[i % createdUsers.length];
    await prisma.maintenanceRequest.create({
      data: {
        assetId: asset.id,
        reporterId: reporter.id,
        assignedTechnicianId: createdUsers[5].id, // Vikram Singh (technician)
        description: `Screen replacement and battery optimization request for ${asset.name}.`,
        priority: 'MEDIUM',
        status: 'TECHNICIAN_ASSIGNED',
        cost: 150 + i * 10,
      },
    });
  }

  // 9. Create Audit Cycles (2 cycles)
  const auditCycle1 = await prisma.auditCycle.create({
    data: {
      name: 'Q2 Asset Compliance Check',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
      auditorId: createdUsers[4].id, // Siddharth Roy (auditor)
      closedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    },
  });

  const auditCycle2 = await prisma.auditCycle.create({
    data: {
      name: 'Annual Hardware Verification',
      startDate: new Date(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      auditorId: createdUsers[4].id,
    },
  });

  // Create Audit Items for Cycle 2
  for (let i = 0; i < 10; i++) {
    await prisma.auditItem.create({
      data: {
        auditCycleId: auditCycle2.id,
        assetId: createdAssets[i].id,
        verification: 'VERIFIED',
      },
    });
  }

  // 10. Notifications (50 notifications)
  for (let i = 0; i < 50; i++) {
    const user = createdUsers[i % createdUsers.length];
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: i % 2 === 0 ? 'Asset Allocation Update' : 'New Maintenance Request Raised',
        message: `Activity notification regarding transaction details #${1000 + i}.`,
        type: i % 2 === 0 ? 'ALLOCATION' : 'MAINTENANCE',
        isRead: i > 40,
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
