import { redirect } from "next/navigation";

export default function ZumeRootPage() {
  // This line forces the browser to jump to /zume/dashboard
  redirect("/zume/dashboard");
}