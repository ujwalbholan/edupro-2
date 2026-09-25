import { InstitutionType, TenantStatus } from "@repo/database-config/dist/generated/prisma/enums";

export type CreateTenantData = {
  name: string;
  institutionType: InstitutionType;
  status: TenantStatus;
  slug: string;
};
