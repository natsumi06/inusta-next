export default function Page() {
  async function action(formData: FormData) {
    "use server";
    console.log(formData.get("message"));
  }
  return (
    <form action={action}>
      <input type="text" name="message" />
      <button type="submit">送信</button>
    </form>
  );
}
