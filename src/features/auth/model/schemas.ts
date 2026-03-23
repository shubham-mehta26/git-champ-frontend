import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required.').max(64),
  lastName: z.string().min(1, 'Last name is required.').max(64),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
})

export type SignUpInput = z.infer<typeof signUpSchema>
