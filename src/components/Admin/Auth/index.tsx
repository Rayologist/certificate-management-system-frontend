import Redirect from '@components/Redirect';
import { Route } from '@config';
import { useUser } from 'src/contexts/UserContext';
import { NextPageWithLayout } from 'types';

const withAuth = (Component: NextPageWithLayout) => (props: any) => {
  const { user } = useUser();

  if (user.data.role !== 'admin') {
    return <Redirect url={Route.Login} />;
  }

  return <Component {...props} />;
};

export default withAuth;
