import {
  InstitutionType,
  TenantStatus,
} from '@repo/database-config/dist/generated/prisma/enums';

type TenantDefaultSettings = {
  create: {
    locale: string;
    timezone: string;
    currency: string;
    dateFormat: string;
  };
};

type TenantDefaultTheme = {
  create: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
};

export type CreateTenantData = {
  name: string;
  institutionType: InstitutionType;
  status?: TenantStatus;
  slug?: string;
  settings?: TenantDefaultSettings;
  theme?: TenantDefaultTheme;
};
