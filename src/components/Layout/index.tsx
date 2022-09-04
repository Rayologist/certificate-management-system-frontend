import Loader from '@components/Loader';
import React from 'react';
import { useUser } from 'src/contexts/UserContext';
import ServerError from 'src/pages/500';
import AdminLayout from './Admin';
import UserLayout from './User';

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
