import { ReactNode } from 'react';
import Shell from '@components/Admin/Shell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Shell>{children}</Shell>
    </>
  );
}
