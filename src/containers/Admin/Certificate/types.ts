import { PickAsOrNull, CreateCertificateRequest } from 'types';

export type CertificateFormValues = PickAsOrNull<
  Omit<CreateCertificateRequest, 'activityUid'>,
  'totalHour'
> & {
  dummyName?: string;
};
