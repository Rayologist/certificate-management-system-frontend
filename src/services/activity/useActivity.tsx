import request from 'src/utils/fetcher';
import useSWR from 'swr';
import API from '@services/config';

export default function useActivity() {
  const { data, error, mutate } = useSWR(API.internals.activity, (url) =>
    request({ url, method: 'GET' })
  );

  return {
    activity: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
