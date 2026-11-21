import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getContent, getLeads } from '@/lib/store';
import AdminApp from './AdminApp';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login');
  const [content, leads] = await Promise.all([getContent(), getLeads()]);
  return <AdminApp initialContent={content} initialLeads={leads} />;
}
