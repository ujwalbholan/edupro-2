-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FeatureOverrideMode" AS ENUM ('ENABLE', 'DISABLE');

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_features" (
    "plan_id" UUID NOT NULL,
    "feature_id" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("plan_id","feature_id")
);

-- CreateTable
CREATE TABLE "tenant_feature_overrides" (
    "tenant_id" UUID NOT NULL,
    "feature_id" UUID NOT NULL,
    "mode" "FeatureOverrideMode" NOT NULL,
    "reason" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_feature_overrides_pkey" PRIMARY KEY ("tenant_id","feature_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE INDEX "subscriptions_tenant_id_idx" ON "subscriptions"("tenant_id");

-- CreateIndex
CREATE INDEX "subscriptions_tenant_id_status_idx" ON "subscriptions"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "subscriptions_plan_id_idx" ON "subscriptions"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "features_key_key" ON "features"("key");

-- CreateIndex
CREATE INDEX "plan_features_feature_id_idx" ON "plan_features"("feature_id");

-- CreateIndex
CREATE INDEX "tenant_feature_overrides_feature_id_idx" ON "tenant_feature_overrides"("feature_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_feature_overrides" ADD CONSTRAINT "tenant_feature_overrides_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_feature_overrides" ADD CONSTRAINT "tenant_feature_overrides_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
