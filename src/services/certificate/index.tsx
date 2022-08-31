import useCertificate from "./useCertificate";
import { useCertificatePreview } from "./preview";
import {
  CreateCertificateRequest,
  UpdateCertificateRequest,
  DeleteCertificateRequest,
  SendCertificateRequest
} from "types";
import request from "src/utils/fetcher";
import { certificateUrl } from "@services/config";

async function createCertificate(payload: CreateCertificateRequest) {
  try {
    const data = await request({
      url: certificateUrl,
      method: "POST",
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
      url: certificateUrl + "/send",
      method: "POST",
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function updateCertificate(payload: UpdateCertificateRequest) {
  try {
    const data = await request({ url: certificateUrl, method: "PUT", payload });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function deleteCertificate(payload: DeleteCertificateRequest) {
  try {
    const data = await request({
      url: certificateUrl,
      method: "DELETE",
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
  sendCertificate
};
