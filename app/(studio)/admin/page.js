import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import AdminClient from '@/components/AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await requireAdmin())) redirect('/');
  return <AdminClient />;
}
