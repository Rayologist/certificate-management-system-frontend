import Redirect from '@components/Redirect';
import { useUser } from 'src/contexts/UserContext';
import { NextPageWithLayout } from 'types';

const withAuth = (Component: NextPageWithLayout) => (props: any) => {
  const { user } = useUser();

  if (user.data.role !== 'admin') {
    return <Redirect url="/dashboard/login" />;
  }

  return <Component {...props} />;
};

export default withAuth;
