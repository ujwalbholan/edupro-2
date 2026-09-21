-- Development-only reference data. This script is idempotent and intentionally
-- contains no users, tenant memberships, passwords, or production secrets.

INSERT INTO "permissions" ("id", "code", "description", "created_at", "updated_at") VALUES
  ('00000000-0000-0000-0000-000000000001', 'tenant.read', 'View tenant configuration', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'tenant.manage', 'Manage tenant configuration', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'identity.user.manage', 'Manage tenant users and memberships', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'identity.invitation.manage', 'Create, resend, and revoke invitations', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'entitlement.read', 'View subscription and feature access', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000006', 'entitlement.manage', 'Manage plans, subscriptions, and feature overrides', NOW(), NOW())
ON CONFLICT ("code") DO UPDATE SET
  "description" = EXCLUDED."description",
  "updated_at" = NOW();

INSERT INTO "features" ("id", "key", "name", "description", "is_active", "created_at", "updated_at") VALUES
  ('00000000-0000-0000-0000-000000000101', 'tenant_management', 'Tenant management', 'Manage institution configuration and branding', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000102', 'identity_management', 'Identity management', 'Manage users, roles, and permissions', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000103', 'invitations', 'Invitations', 'Invite users to an institution', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000104', 'entitlement_management', 'Entitlement management', 'View subscription access and feature grants', true, NOW(), NOW())
ON CONFLICT ("key") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "is_active" = EXCLUDED."is_active",
  "updated_at" = NOW();

INSERT INTO "subscription_plans" ("id", "name", "description", "price", "currency", "is_active", "created_at", "updated_at") VALUES
  ('00000000-0000-0000-0000-000000000201', 'FREE', 'Development and evaluation plan', 0, 'USD', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000202', 'PRO', 'Full institution management plan', 4900, 'USD', true, NOW(), NOW())
ON CONFLICT ("name") DO UPDATE SET
  "description" = EXCLUDED."description",
  "price" = EXCLUDED."price",
  "currency" = EXCLUDED."currency",
  "is_active" = EXCLUDED."is_active",
  "updated_at" = NOW();

INSERT INTO "plan_features" ("plan_id", "feature_id", "enabled", "created_at", "updated_at") VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000103', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000103', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000104', true, NOW(), NOW())
ON CONFLICT ("plan_id", "feature_id") DO UPDATE SET
  "enabled" = EXCLUDED."enabled",
  "updated_at" = NOW();
