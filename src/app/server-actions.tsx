import { action } from "./../../lib/actions";

export default function Page() {
  return (
    <form action={action}>
      <input type="text" name="message" />
      <button type="submit">送信</button>
    </form>
  );
}
