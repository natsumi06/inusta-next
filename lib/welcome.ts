/**
 * 会員登録直後の「はじめてのホーム」で歓迎モーダルを1回だけ出すための印（Cookie）
 * - registerUser が登録成功時にセットする
 * - ホームがこれを見つけたらモーダルを出し、表示した時点で consumeWelcome が消す
 */
export const WELCOME_COOKIE = "inusta_welcome";
