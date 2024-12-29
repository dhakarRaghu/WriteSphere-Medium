import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

// import commonRaghvendra from 'common-raghvendra';
import { signinInput , signupInput } from "../types/validation"
  

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();
userRouter.post('/signup', async (c) => {
    const body = await c.req.json();

    // Validate input using zod schema
    const { success, error } = signupInput.safeParse(body);
    if (!success) {
        // If validation fails, return a proper error response
        return c.json({ error: "Invalid input", details: error.errors }, 400); // 400 Bad Request
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Proceed with creating user only if validation passes
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
    });
});

userRouter.post('/signin', async (c) => {
    const body = await c.req.json();

    // Validate input using zod schema
    const { success, error } = signinInput.safeParse(body);
    if (!success) {
        // If validation fails, return a proper error response
        return c.json({ error: "Invalid input", details: error.errors }, 400); // 400 Bad Request
    }

    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password,
        },
    });

    if (!user) {
        c.status(403);
        return c.json({ error: "User not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
});
 