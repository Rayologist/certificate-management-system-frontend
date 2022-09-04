import { certUrl } from '@services/config';
import request from 'src/utils/fetcher';

async function sendCert(payload: {
  activityUid: string;
  certificateId: number;
  name: string;
  email: string;
}) {
  try {
    const data = await request({ url: certUrl, method: 'POST', payload });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export { sendCert };
