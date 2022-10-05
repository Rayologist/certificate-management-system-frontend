import request from 'src/utils/fetcher';
import useSWR from 'swr';
import API from '../config';

export default function useCertificate() {
  const { data, error, mutate } = useSWR(API.internals.certificate.root, (url) =>
    request({ url, method: 'GET' })
  );

  return {
    certificate: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
