import urlJoin from 'url-join';

const root = '/';

const url = (...args: string[]): string => urlJoin(root, ...args);
const dashbaord = (...args: string[]) => url('dashboard', ...args);

const Route = {
  Login: dashbaord('login'),
  Logout: dashbaord('logout'),
  Activity: dashbaord('activity'),
  Certificate: dashbaord('certificate'),
  Participant: dashbaord('participant'),
};

export { Route };
