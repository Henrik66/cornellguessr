import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import AdminClient from "./AdminClient";

export const metadata = { title: "Admin — CornellGuessr" };

export default async function AdminPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminClient initialLocations={locations ?? []} />;
}
