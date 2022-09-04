import request from 'src/utils/fetcher';
import useSWR from 'swr';
import { certificateUrl } from '../config';

export default function useCertificate() {
  const { data, error, mutate } = useSWR(certificateUrl, (url) => request({ url, method: 'GET' }));

  return {
    certificate: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
