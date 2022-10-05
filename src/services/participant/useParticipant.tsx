import request from 'src/utils/fetcher';
import useSWR from 'swr';
import { ParticipantResponse, Response } from 'types';
import urlJoin from 'url-join';
import API from '../config';

export function useParticipantStats() {
  const { data, error, mutate } = useSWR(API.internals.participant, (url) =>
    request({ url, method: 'GET' })
  );

  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
export function useParticipantByAuid(auid: string) {
  const { data, error, mutate } = useSWR<Response<ParticipantResponse>>(
    urlJoin(API.internals.participant, auid),
    (url) => request({ url, method: 'GET' })
  );

  return {
    participant: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
