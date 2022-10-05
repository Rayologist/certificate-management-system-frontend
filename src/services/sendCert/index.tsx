import API from '@services/config';
import request from 'src/utils/fetcher';

async function sendCert(payload: {
  activityUid: string;
  certificateId: number;
  name: string;
  altName: string;
  email: string;
}) {
  try {
    const data = await request({ url: API.cert, method: 'POST', payload });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export { sendCert };
