import {
  CreateCertificateRequest,
  UpdateCertificateRequest,
  DeleteCertificateRequest,
  SendCertificateRequest,
} from 'types';
import request from 'src/utils/fetcher';
import API from '@services/config';
import { useCertificatePreview } from './preview';
import useCertificate from './useCertificate';

async function createCertificate(payload: CreateCertificateRequest) {
  try {
    const data = await request({
      url: API.internals.certificate.root,
      method: 'POST',
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function batchSendCertificates(payload: { participantIds: number[]; certificateId: number }) {
  try {
    const data = await request({
      url: API.internals.certificate.batchSend,
      method: 'POST',
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function sendCertificate(payload: SendCertificateRequest) {
  try {
    const data = await request({
      url: API.internals.certificate.send,
      method: 'POST',
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function updateCertificate(payload: UpdateCertificateRequest) {
  try {
    const data = await request({ url: API.internals.certificate.root, method: 'PUT', payload });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function deleteCertificate(payload: DeleteCertificateRequest) {
  try {
    const data = await request({
      url: API.internals.certificate.root,
      method: 'DELETE',
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
export {
  useCertificate,
  useCertificatePreview,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  sendCertificate,
  batchSendCertificates,
};
