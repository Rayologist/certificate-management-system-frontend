import { useEffect } from 'react';
import { useRouter } from 'next/router';

type RedirectProps = { url: string; from?: string };

function Redirect(props: RedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const { url, from } = props;
    const as = from && `${url}?redirect=${encodeURIComponent(from)}`;
    router.push(url, as);
  }, [router, props]);

  return null;
}

export default Redirect;
