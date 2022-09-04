import request from 'src/utils/fetcher';
import { previewUrl } from '@services/config';
import { CreateCertificateRequest } from 'types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type PreviewRequest = Omit<CreateCertificateRequest, 'displayName' | 'activityUid'> & {
  dummyName?: string;
};

export function useCertificatePreview(setObjectURL: Dispatch<SetStateAction<string>>) {
  const [payload, setPayload] = useState<PreviewRequest>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchPreview = async () => {
    setIsLoading(true);
    const result = await request({
      url: previewUrl,
      method: 'POST',
      payload,
      toJson: false,
    });
    const blob = await result.blob();
    const objURL = URL.createObjectURL(blob);
    setObjectURL(objURL);
    setIsLoading(false);
  };

  useEffect(() => {
    if (payload) {
      fetchPreview();
    }
  }, [payload]);

  return { isLoading, setPayload };
}
