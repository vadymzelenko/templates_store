import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { listForEmail } from '@/lib/bookings';
import ProfileClient from '@/components/ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const s = await getSession();
  if (!s) redirect('/');
  const initial = await listForEmail(s.email);
  return <ProfileClient email={s.email} initial={initial} />;
}
