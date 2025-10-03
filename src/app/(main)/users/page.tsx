import IconSkeleton from "@/app/components/skeletons/icon-skeleton";
import { fetchLatestUsers } from "./../../../../lib/apis";
import Image from "next/image";
import Link from "next/link";

export default async function Users() {
  const users = await fetchLatestUsers();
  return (
    <div className="mx-auto my-8 max-w-5xl bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-1  lg:grid-cols-2">
        {users.map((user) => {
          return (
            <Link href={`/users/${user.id}`} key={user.id}>
              <div className="flex bg-white p-4">
                {user.image && (
                  <Image
                    src={user.image}
                    className="block aspect-[1/1] rounded-full object-cover"
                    width={96}
                    height={96}
                    alt="user icon"
                  />
                )}
                {!!user.image || <IconSkeleton />}
                <div className="pl-4">
                  <div>
                    <p className="text-lg font-semibold text-black">
                      {user.name}
                    </p>
                    <p className="whitespace-pre-wrap font-medium text-black">
                      {user.description}
                    </p>
                    <div className="mt-4 flex">
                      <p className="text-sm font-semibold text-black">
                        投稿{user._count.posts}件
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
