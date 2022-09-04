import { ReactNode } from 'react';
import { UserHeader } from '@components/Header';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserHeader />
      {children}
    </>
  );
}
