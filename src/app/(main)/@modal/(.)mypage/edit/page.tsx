import ProfileEditModal from "@/app/components/pages/profile/profile-edit-modal";
import { fetchMe } from "./../../../../../../lib/apis";

/** マイページなどから /mypage/edit へ移ったときは、今の画面の上にモーダルで開く */
export default async function Page() {
  const user = await fetchMe();
  return <ProfileEditModal user={user} />;
}
