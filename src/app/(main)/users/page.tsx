import IconSkeleton from "@/app/components/skeletons/icon-skeleton";
import { fetchLatestUsers } from "./../../../../lib/apis";
import UsersList from "@/app/components/pages/users/users-list";

export default async function Users() {
  const users = await fetchLatestUsers();
  return <UsersList users={users} />;
}
