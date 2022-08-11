import z from "zod";

// Register User
export const createUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6).max(64),
});

export const createUserOutput = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

// Log in user
export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginUserOutput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginUserInput = z.TypeOf<typeof createUserSchema>;
