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
} as const;

const Href = {
  home: 'https://cbe.ntu.edu.tw/',
  facebook: 'https://www.facebook.com/NTUCBE',
  youtube: 'https://www.youtube.com/channel/UCqGbL2pwlrZI_dNBmEv6CRg',
  instagram: 'https://www.instagram.com/ntucbe',
} as const;

export { Route, Href };
