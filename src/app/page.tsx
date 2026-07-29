import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';

export default async function Home() {
  const session = await getServerSession(options);

  if (session) {
    redirect('/dashboard');
  }

  redirect('/signin');
}
