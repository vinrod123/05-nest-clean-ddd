import { z } from 'zod';

export const evenSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3000)
})

export type Env = z.infer<typeof evenSchema>