import type { Metadata } from "next";
import { requireAdminUser } from "@/lib/admin-auth";
import { listPortfolioPhotosForAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Mackenzie Rose Bakes",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await requireAdminUser();
  const photos = await listPortfolioPhotosForAdmin();

  return <AdminDashboard adminEmail={admin.email} initialPhotos={photos} />;
}
