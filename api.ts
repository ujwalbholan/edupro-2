// API v1
// │
// ├── health
// │   ├── GET    /health
// │   ├── GET    /health/live
// │   └── GET    /health/ready
// │
// ├── auth
// │   ├── POST   /auth/register
// │   ├── POST   /auth/login
// │   ├── POST   /auth/logout
// │   ├── POST   /auth/refresh
// │   ├── POST   /auth/verify-email
// │   ├── POST   /auth/forgot-password
// │   └── POST   /auth/reset-password
// │
// ├── me
// │   ├── GET    /me
// │   ├── PATCH  /me
// │   ├── GET    /me/tenants
// │   ├── GET    /me/sessions
// │   └── DELETE /me/sessions/:sessionId
// │
// ├── tenants
// │   ├── GET    /tenants
// │   ├── POST   /tenants
// │   ├── GET    /tenants/:tenantId
// │   ├── PATCH  /tenants/:tenantId
// │   └── DELETE /tenants/:tenantId
// │
// ├── tenant users
// │   ├── GET    /tenants/:tenantId/users
// │   ├── GET    /tenants/:tenantId/users/:userId
// │   ├── PATCH  /tenants/:tenantId/users/:userId
// │   └── DELETE /tenants/:tenantId/users/:userId
// │
// ├── invitations
// │   ├── GET    /tenants/:tenantId/invitations
// │   ├── POST   /tenants/:tenantId/invitations
// │   ├── GET    /tenants/:tenantId/invitations/:id
// │   ├── POST   /tenants/:tenantId/invitations/:id/revoke
// │   └── POST   /invitations/:token/accept
// │
// ├── roles
// │   ├── GET    /tenants/:tenantId/roles
// │   ├── POST   /tenants/:tenantId/roles
// │   ├── GET    /tenants/:tenantId/roles/:roleId
// │   ├── PATCH  /tenants/:tenantId/roles/:roleId
// │   ├── DELETE /tenants/:tenantId/roles/:roleId
// │   ├── GET    /tenants/:tenantId/roles/:roleId/permissions
// │   └── PUT    /tenants/:tenantId/roles/:roleId/permissions
// │
// ├── user roles
// │   ├── GET    /tenants/:tenantId/users/:userId/roles
// │   └── PUT    /tenants/:tenantId/users/:userId/roles
// │
// ├── permissions
// │   ├── GET    /permissions
// │   └── GET    /permissions/:permissionId
// │
// ├── domains
// │   ├── GET    /tenants/:tenantId/domains
// │   ├── POST   /tenants/:tenantId/domains
// │   ├── GET    /tenants/:tenantId/domains/:domainId
// │   ├── PATCH  /tenants/:tenantId/domains/:domainId
// │   ├── DELETE /tenants/:tenantId/domains/:domainId
// │   ├── POST   /tenants/:tenantId/domains/:domainId/verify
// │   └── POST   /tenants/:tenantId/domains/:domainId/set-primary
// │
// ├── settings
// │   ├── GET    /tenants/:tenantId/settings
// │   └── PATCH  /tenants/:tenantId/settings
// │
// ├── theme
// │   ├── GET    /tenants/:tenantId/theme
// │   └── PATCH  /tenants/:tenantId/theme
// │
// ├── plans
// │   ├── GET    /plans
// │   └── GET    /plans/:planId
// │
// ├── subscriptions
// │   ├── GET    /tenants/:tenantId/subscription
// │   ├── POST   /tenants/:tenantId/subscription
// │   ├── PATCH  /tenants/:tenantId/subscription
// │   └── POST   /tenants/:tenantId/subscription/change-plan
// │
// ├── features
// │   ├── GET    /features
// │   └── GET    /features/:featureId
// │
// ├── plan features
// │   ├── GET    /plans/:planId/features
// │   └── PUT    /plans/:planId/features
// │
// ├── tenant features
// │   ├── GET    /tenants/:tenantId/features
// │   ├── GET    /tenants/:tenantId/features/:featureId
// │   ├── PUT    /tenants/:tenantId/features/:featureId
// │   └── DELETE /tenants/:tenantId/features/:featureId
// │
// ├── audit
// │   ├── GET    /tenants/:tenantId/audit-logs
// │   └── GET    /tenants/:tenantId/audit-logs/:id
// │
// └── admin
//     ├── GET    /admin/tenants
//     ├── GET    /admin/tenants/:tenantId
//     ├── PATCH  /admin/tenants/:tenantId
//     ├── GET    /admin/users
//     ├── GET    /admin/users/:userId
//     ├── PATCH  /admin/users/:userId
//     ├── GET    /admin/subscriptions
//     ├── GET    /admin/plans
//     ├── POST   /admin/plans
//     ├── PATCH  /admin/plans/:planId
//     ├── GET    /admin/features
//     ├── POST   /admin/features
//     └── PATCH  /admin/features/:featureId
