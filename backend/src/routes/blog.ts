import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createPostInput , updatePostInput  } from '../types/validation';  // Update the path accordingly


export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();

bookRouter.use(async (c, next) => {
    const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
	const payload = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', (payload as { id: string }).id);
	await next()
});


bookRouter.post('/', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    // Validate the input
    const { success, error } = createPostInput.safeParse(body);
    if (!success) {
        return c.json({ error: 'Invalid input', details: error.errors });
    }

    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId,
        },
    });

    return c.json({
        id: post.id,
    });
});

bookRouter.put('/', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    // Validate the input
    const { success, error } = updatePostInput.safeParse(body);
    if (!success) {
        return c.json({ error: 'Invalid input', details: error.errors });
    }

    // Await the update operation
    const updatedPost = await prisma.post.update({
        where: {
            id: body.id,
            authorId: userId,
        },
        data: {
            title: body.title,
            content: body.content,
        },
    });

    return c.json({
        message: 'Post updated successfully',
        updatedPost,
    });
});

bookRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany();

    return c.json(posts);
});

bookRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})