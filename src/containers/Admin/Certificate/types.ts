import { CreateCertificateRequest } from 'types';

export type CertificateFormValues = Omit<CreateCertificateRequest, 'activityUid'> & {
  dummyName?: string;
};
