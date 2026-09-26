import { randomUUID, createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import {
  DomainType,
  DomainVerificationStatus,
  FeatureOverrideMode,
  InstitutionType,
  SubscriptionStatus,
  TenantStatus,
  UserStatus,
} from './enums';
import { PrismaClient } from './client';

const prisma = new PrismaClient();

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

async function main() {
  console.log('🌱 Starting database seed...');

  // =========================================================
  // 1. PERMISSIONS
  // =========================================================

  const permissionDefinitions = [
    // Tenant
    ['tenant.read', 'View tenant information'],
    ['tenant.update', 'Update tenant information'],

    // Users
    ['users.read', 'View users'],
    ['users.create', 'Create users'],
    ['users.update', 'Update users'],
    ['users.delete', 'Delete users'],

    // Roles
    ['roles.read', 'View roles'],
    ['roles.create', 'Create roles'],
    ['roles.update', 'Update roles'],
    ['roles.delete', 'Delete roles'],

    // Permissions
    ['permissions.read', 'View permissions'],

    // Invitations
    ['invitations.read', 'View invitations'],
    ['invitations.create', 'Create invitations'],
    ['invitations.revoke', 'Revoke invitations'],

    // Domains
    ['domains.read', 'View domains'],
    ['domains.create', 'Create domains'],
    ['domains.update', 'Update domains'],
    ['domains.delete', 'Delete domains'],

    // Settings
    ['settings.read', 'View tenant settings'],
    ['settings.update', 'Update tenant settings'],

    // Theme
    ['theme.read', 'View tenant theme'],
    ['theme.update', 'Update tenant theme'],

    // Audit
    ['audit.read', 'View audit logs'],

    // Subscription
    ['subscription.read', 'View subscription'],
    ['subscription.manage', 'Manage subscription'],

    // Features
    ['features.read', 'View features'],
    ['features.manage', 'Manage features'],

    // Platform
    ['platform.admin', 'Full platform administration'],
  ];

  const permissions = new Map<string, { id: string }>();

  for (const [code, description] of permissionDefinitions) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: {
        description,
      },
      create: {
        code,
        description,
      },
    });

    permissions.set(code, permission);
  }

  console.log(`✓ Seeded ${permissions.size} permissions`);

  // =========================================================
  // 2. GLOBAL ROLES
  // =========================================================

  const allPermissionIds = [...permissions.values()].map((p) => p.id);

  const tenantAdminPermissions = [
    'tenant.read',
    'tenant.update',

    'users.read',
    'users.create',
    'users.update',
    'users.delete',

    'roles.read',
    'roles.create',
    'roles.update',
    'roles.delete',

    'permissions.read',

    'invitations.read',
    'invitations.create',
    'invitations.revoke',

    'domains.read',
    'domains.create',
    'domains.update',
    'domains.delete',

    'settings.read',
    'settings.update',

    'theme.read',
    'theme.update',

    'audit.read',

    'subscription.read',

    'features.read',
  ];

  const staffPermissions = [
    'tenant.read',

    'users.read',

    'roles.read',

    'permissions.read',

    'invitations.read',
    'invitations.create',

    'domains.read',

    'settings.read',

    'theme.read',

    'audit.read',

    'subscription.read',

    'features.read',
  ];

  const viewerPermissions = [
    'tenant.read',
    'users.read',
    'roles.read',
    'permissions.read',
    'domains.read',
    'settings.read',
    'theme.read',
    'subscription.read',
    'features.read',
  ];

  const globalRoleDefinitions = [
    {
      name: 'PLATFORM_ADMIN',
      description: 'Full platform administrator',
      permissions: allPermissionIds,
    },
    {
      name: 'TENANT_ADMIN',
      description: 'Administrator of a tenant',
      permissions: tenantAdminPermissions.map(
        (code) => permissions.get(code)!.id,
      ),
    },
    {
      name: 'STAFF',
      description: 'Tenant staff member',
      permissions: staffPermissions.map((code) => permissions.get(code)!.id),
    },
    {
      name: 'VIEWER',
      description: 'Read-only tenant member',
      permissions: viewerPermissions.map((code) => permissions.get(code)!.id),
    },
  ];

  const roles = new Map<string, { id: string }>();

  for (const roleDefinition of globalRoleDefinitions) {
    const role = await prisma.role
      .upsert({
        where: {
          // For PostgreSQL nullable tenantId, Prisma's compound unique
          // lookup with null can be awkward depending on Prisma version.
          // Therefore we locate global roles explicitly.
          id: '00000000-0000-0000-0000-000000000000',
        },
        update: {},
        create: {
          name: roleDefinition.name,
          description: roleDefinition.description,
        },
      })
      .catch(async () => {
        const existing = await prisma.role.findFirst({
          where: {
            tenantId: null,
            name: roleDefinition.name,
          },
        });

        if (existing) {
          return prisma.role.update({
            where: { id: existing.id },
            data: {
              description: roleDefinition.description,
            },
          });
        }

        return prisma.role.create({
          data: {
            name: roleDefinition.name,
            description: roleDefinition.description,
          },
        });
      });

    roles.set(roleDefinition.name, role);

    // Make role permissions idempotent.
    await prisma.rolePermission.deleteMany({
      where: {
        roleId: role.id,
      },
    });

    await prisma.rolePermission.createMany({
      data: roleDefinition.permissions.map((permissionId) => ({
        roleId: role.id,
        permissionId,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`✓ Seeded ${roles.size} global roles`);

  // =========================================================
  // 3. FEATURES
  // =========================================================

  const featureDefinitions = [
    {
      key: 'dashboard',
      name: 'Dashboard',
      description: 'Access to the tenant dashboard',
    },
    {
      key: 'users',
      name: 'User Management',
      description: 'Manage tenant users',
    },
    {
      key: 'roles',
      name: 'Role Management',
      description: 'Manage roles and permissions',
    },
    {
      key: 'invitations',
      name: 'Invitations',
      description: 'Invite users to the tenant',
    },
    {
      key: 'domains',
      name: 'Custom Domains',
      description: 'Manage tenant domains',
    },
    {
      key: 'billing',
      name: 'Billing',
      description: 'Access billing functionality',
    },
    {
      key: 'invoices',
      name: 'Invoices',
      description: 'Manage invoices',
    },
    {
      key: 'reports',
      name: 'Reports',
      description: 'Access reporting functionality',
    },
    {
      key: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Access advanced analytics',
    },
    {
      key: 'api_access',
      name: 'API Access',
      description: 'Access platform APIs',
    },
    {
      key: 'audit_logs',
      name: 'Audit Logs',
      description: 'View audit logs',
    },
  ];

  const features = new Map<string, { id: string }>();

  for (const definition of featureDefinitions) {
    const feature = await prisma.feature.upsert({
      where: {
        key: definition.key,
      },
      update: {
        name: definition.name,
        description: definition.description,
        isActive: true,
      },
      create: {
        key: definition.key,
        name: definition.name,
        description: definition.description,
      },
    });

    features.set(definition.key, feature);
  }

  console.log(`✓ Seeded ${features.size} features`);

  // =========================================================
  // 4. SUBSCRIPTION PLANS
  // =========================================================

  const plans = new Map<string, { id: string }>();

  const planDefinitions = [
    {
      name: 'FREE',
      description: 'Free plan for small institutions',
      price: 0,
      currency: 'USD',
      features: ['dashboard', 'users', 'invitations'],
    },
    {
      name: 'PRO',
      description: 'Professional plan for growing institutions',
      price: 999,
      currency: 'USD',
      features: [
        'dashboard',
        'users',
        'roles',
        'invitations',
        'domains',
        'billing',
        'invoices',
        'reports',
        'audit_logs',
      ],
    },
    {
      name: 'ENTERPRISE',
      description: 'Enterprise plan with advanced capabilities',
      price: 4999,
      currency: 'USD',
      features: [
        'dashboard',
        'users',
        'roles',
        'invitations',
        'domains',
        'billing',
        'invoices',
        'reports',
        'advanced_analytics',
        'api_access',
        'audit_logs',
      ],
    },
  ];

  for (const definition of planDefinitions) {
    const plan = await prisma.subscriptionPlan.upsert({
      where: {
        name: definition.name,
      },
      update: {
        description: definition.description,
        price: definition.price,
        currency: definition.currency,
        isActive: true,
      },
      create: {
        name: definition.name,
        description: definition.description,
        price: definition.price,
        currency: definition.currency,
      },
    });

    plans.set(definition.name, plan);

    // Make plan features idempotent.
    await prisma.planFeature.deleteMany({
      where: {
        planId: plan.id,
      },
    });

    await prisma.planFeature.createMany({
      data: definition.features.map((featureKey) => ({
        planId: plan.id,
        featureId: features.get(featureKey)!.id,
        enabled: true,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`✓ Seeded ${plans.size} subscription plans`);

  // =========================================================
  // 5. DEMO TENANT
  // =========================================================

  const tenant = await prisma.tenant.upsert({
    where: {
      slug: 'demo-school',
    },
    update: {
      name: 'Demo International School',
      institutionType: InstitutionType.SCHOOL,
      status: TenantStatus.ACTIVE,
    },
    create: {
      slug: 'demo-school',
      name: 'Demo International School',
      institutionType: InstitutionType.SCHOOL,
      status: TenantStatus.ACTIVE,
    },
  });

  console.log(`✓ Tenant: ${tenant.name}`);

  // =========================================================
  // 6. TENANT SETTINGS
  // =========================================================

  await prisma.tenantSettings.upsert({
    where: {
      tenantId: tenant.id,
    },
    update: {
      locale: 'en',
      timezone: 'Asia/Kathmandu',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
    },
    create: {
      tenantId: tenant.id,
      locale: 'en',
      timezone: 'Asia/Kathmandu',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
    },
  });

  // =========================================================
  // 7. TENANT THEME
  // =========================================================

  await prisma.tenantTheme.upsert({
    where: {
      tenantId: tenant.id,
    },
    update: {
      primaryColor: '#2563EB',
      secondaryColor: '#0F172A',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
    },
    create: {
      tenantId: tenant.id,
      primaryColor: '#2563EB',
      secondaryColor: '#0F172A',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
    },
  });

  // =========================================================
  // 8. TENANT DOMAIN
  // =========================================================

  await prisma.tenantDomain.upsert({
    where: {
      domain: 'demo.example.com',
    },
    update: {
      tenantId: tenant.id,
      type: DomainType.SYSTEM,
      isPrimary: true,
      verificationStatus: DomainVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
    },
    create: {
      tenantId: tenant.id,
      domain: 'demo.example.com',
      type: DomainType.SYSTEM,
      isPrimary: true,
      verificationStatus: DomainVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  });

  // =========================================================
  // 9. TENANT-SCOPED ROLES
  // =========================================================

  const tenantAdminRole = await prisma.role.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: 'TENANT_ADMIN',
      },
    },
    update: {
      description: 'Administrator of Demo International School',
    },
    create: {
      tenantId: tenant.id,
      name: 'TENANT_ADMIN',
      description: 'Administrator of Demo International School',
    },
  });

  // Copy permissions from global TENANT_ADMIN.
  const globalTenantAdminRole = roles.get('TENANT_ADMIN')!;

  const globalRolePermissions = await prisma.rolePermission.findMany({
    where: {
      roleId: globalTenantAdminRole.id,
    },
  });

  await prisma.rolePermission.deleteMany({
    where: {
      roleId: tenantAdminRole.id,
    },
  });

  await prisma.rolePermission.createMany({
    data: globalRolePermissions.map((permission: { permissionId: any }) => ({
      roleId: tenantAdminRole.id,
      permissionId: permission.permissionId,
    })),
    skipDuplicates: true,
  });

  // =========================================================
  // 10. ADMIN USER
  // =========================================================

  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: {
      email: 'admin@example.com',
    },
    update: {
      displayName: 'Demo Admin',
      passwordHash,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: 'admin@example.com',
      displayName: 'Demo Admin',
      passwordHash,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`✓ Admin user: ${adminUser.email}`);

  // =========================================================
  // 11. ADMIN MEMBERSHIP
  // =========================================================

  const adminMembership = await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: adminUser.id,
    },
  });

  // =========================================================
  // 12. ADMIN ROLE ASSIGNMENT
  // =========================================================

  await prisma.tenantUserRole.upsert({
    where: {
      tenantUserId_roleId: {
        tenantUserId: adminMembership.id,
        roleId: tenantAdminRole.id,
      },
    },
    update: {},
    create: {
      tenantUserId: adminMembership.id,
      roleId: tenantAdminRole.id,
    },
  });

  // =========================================================
  // 13. DEMO STAFF USER
  // =========================================================

  const staffPassword = process.env.SEED_STAFF_PASSWORD ?? 'Staff123!';

  const staffPasswordHash = await bcrypt.hash(staffPassword, 12);

  const staffUser = await prisma.user.upsert({
    where: {
      email: 'staff@example.com',
    },
    update: {
      displayName: 'Demo Staff',
      passwordHash: staffPasswordHash,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: 'staff@example.com',
      displayName: 'Demo Staff',
      passwordHash: staffPasswordHash,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  const staffMembership = await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: tenant.id,
        userId: staffUser.id,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: staffUser.id,
    },
  });

  const staffRole = await prisma.role.findFirstOrThrow({
    where: {
      tenantId: null,
      name: 'STAFF',
    },
  });

  await prisma.tenantUserRole.upsert({
    where: {
      tenantUserId_roleId: {
        tenantUserId: staffMembership.id,
        roleId: staffRole.id,
      },
    },
    update: {},
    create: {
      tenantUserId: staffMembership.id,
      roleId: staffRole.id,
    },
  });

  // =========================================================
  // 14. SUBSCRIPTION
  // =========================================================

  const proPlan = plans.get('PRO')!;

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      tenantId: tenant.id,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (!existingSubscription) {
    await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: proPlan.id,
        status: SubscriptionStatus.ACTIVE,
        startsAt: new Date(),
      },
    });
  }

  // =========================================================
  // 15. EXAMPLE FEATURE OVERRIDE
  // =========================================================

  const reportsFeature = features.get('reports')!;

  await prisma.tenantFeatureOverride.upsert({
    where: {
      tenantId_featureId: {
        tenantId: tenant.id,
        featureId: reportsFeature.id,
      },
    },
    update: {
      mode: FeatureOverrideMode.ENABLE,
      reason: 'Demo tenant reports access',
      expiresAt: null,
    },
    create: {
      tenantId: tenant.id,
      featureId: reportsFeature.id,
      mode: FeatureOverrideMode.ENABLE,
      reason: 'Demo tenant reports access',
    },
  });

  // =========================================================
  // 16. AUDIT LOG
  // =========================================================

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      actorId: adminUser.id,
      action: 'SEED',
      resource: 'tenant',
      resourceId: tenant.id,
      metadata: {
        source: 'prisma-seed',
      },
    },
  });

  console.log('');
  console.log('==========================================');
  console.log('🌱 Database seed completed successfully');
  console.log('==========================================');
  console.log('');
  console.log('Demo tenant:');
  console.log(`  slug: ${tenant.slug}`);
  console.log('');
  console.log('Admin:');
  console.log('  email: admin@example.com');
  console.log(`  password: ${adminPassword}`);
  console.log('');
  console.log('Staff:');
  console.log('  email: staff@example.com');
  console.log(`  password: ${staffPassword}`);
  console.log('');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
