import prisma from "./prisma";

export async function fetchDashboard() {
  const email = "user+1@example.com";
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

export async function fetchLatestPosts() {
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
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
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
