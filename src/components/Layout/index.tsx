import dynamic from 'next/dynamic';
import Loader from '@components/Loader';
import React from 'react';
import { useUser } from 'src/contexts/UserContext';
import AdminLayout from './Admin';
import UserLayout from './User';

const ServerError = dynamic(() => import('src/pages/500'));

export default function Layout({
  children,
  isAuth,
}: {
  children: React.ReactNode;
  isAuth?: boolean;
}) {
  const { user } = useUser();

  if (user.pending) return <Loader />;

  if (user.error) {
    return (
      <UserLayout>
        <ServerError />
      </UserLayout>
    );
  }

  if (user.data.role === 'admin' && isAuth) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <UserLayout>{children}</UserLayout>;
}
