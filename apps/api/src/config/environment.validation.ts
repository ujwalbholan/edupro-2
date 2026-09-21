import { z } from 'zod';

const environmentSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    CORS_ORIGIN: z.string().optional(),
  })
  .passthrough();

export function validateEnvironment(config: Record<string, unknown>) {
  const result = environmentSchema.safeParse(config);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ')}`,
    );
  }

  return result.data;
}
