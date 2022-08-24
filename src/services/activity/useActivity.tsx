import request from "src/utils/fetcher";
import useSWR from "swr";
import { activityUrl } from "../config";

export default function useActivity() {
  const { data, error, mutate } = useSWR(activityUrl, (url) =>
    request({ url, method: "GET" })
  );

  return {
    activity: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
