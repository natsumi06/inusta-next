import { fetchLatestUsers } from "./../../../../lib/apis";
import UsersList from "@/app/components/pages/users/users-list";
import BreadCrumbs from "@/app/components/layouts/bread-crumbs";

export default async function Users() {
  const users = await fetchLatestUsers();
  return (
    <>
      <BreadCrumbs title="わんわんユーザー 🐾" />
      <UsersList users={users} />
    </>
  );
}
