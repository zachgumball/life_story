import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return <AdminDashboard email={user.email ?? "admin"} />;
}
