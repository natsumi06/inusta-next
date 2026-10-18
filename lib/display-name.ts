/**
 * 会員登録直後、表示名を決めてもらうまでの仮の名前（メールの@より前）
 * 表示名の画面では、仮の名前のままなら入力欄を空にして見せる
 */
export function provisionalName(email: string) {
  return email.split("@")[0];
}
