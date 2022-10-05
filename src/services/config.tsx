import urlJoin from 'url-join';

const domain = process.env.NEXT_PUBLIC_INTERNAL_SERVER_DOMAIN;

if (!domain) {
  throw new Error('INTERNAL_DOMAIN undefined');
}
const internals = urlJoin(domain, 'internals');
const certificate = urlJoin(internals, 'certificate');

const API = {
  internals: {
    activity: urlJoin(internals, 'activity'),
    participant: urlJoin(internals, 'participant'),
    certificate: {
      root: certificate,
      preview: urlJoin(certificate, 'preview'),
      send: urlJoin(certificate, 'send'),
    },
    session: urlJoin(internals, 'session'),
    static: urlJoin(internals, 'f'),
  },
  cert: urlJoin(domain, 'cert'),
} as const;

export default API;
