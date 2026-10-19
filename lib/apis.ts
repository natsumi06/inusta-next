import prisma from "./prisma";
import { auth } from "./../auth";

export async function fetchDashboard() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Invalid Request");
  const email = session.user.email;
  try {
    return await prisma.user.findFirstOrThrow({
      where: { email },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch.");
  }
}

export async function fetchLatestPosts(skip = 0, take = 20) {
  try {
    return await prisma.post.findMany({
      select: {
        id: true,
        image: true,
        caption: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchPostsCount() {
  try {
    return await prisma.post.count();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts count");
  }
}

export async function fetchPost(id: string) {
  try {
    return await prisma.post.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        image: true,
        caption: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}

/** 自分の投稿だけを返す（投稿の編集で使う）。ほかの人の投稿なら null */
export async function fetchOwnPost(id: string) {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.post.findFirst({
    where: { id, user: { email: session.user.email } },
    select: { id: true, image: true, caption: true },
  });
}

export async function fetchLatestUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        _count: {
          select: { posts: true },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

/** 見つからなければ null（画面は 404 を出す） */
export async function fetchUser(id: string) {
  try {
    return await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        // 自分のページかどうかの判定だけに使う（画面には出さない）
        email: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchMe() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Invalid Request");
  const email = session.user.email;
  try {
    return await prisma.user.findFirstOrThrow({
      select: {
        name: true,
        email: true,
        image: true,
        description: true,
      },
      where: { email },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts.");
  }
}

/** 見つからなければ null（画面は 404 を出す） */
export async function fetchPostwithComments(id: string) {
  try {
    return await prisma.post.findFirst({
      where: { id },
      select: {
        id: true,
        image: true,
        caption: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
            email: true,
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true,
                description: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}
