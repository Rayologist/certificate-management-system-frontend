import { participantUrl } from "@services/config";
import request from "src/utils/fetcher";
import {
  CreateParticipantRequest,
  UpdateParticipantRequest,
  DeleteParticipantRequest,
} from "types";
import { useParticipantStats, useParticipantByAuid } from "./useParticipant";

async function createParticipant(payload: CreateParticipantRequest) {
  try {
    const data = await request({
      url: participantUrl,
      method: "POST",
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
async function updateParticipant(payload: UpdateParticipantRequest) {
  try {
    const data = await request({ url: participantUrl, method: "PUT", payload });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
async function deleteParticipant(payload: DeleteParticipantRequest) {
  try {
    const data = await request({
      url: participantUrl,
      method: "DELETE",
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export {
  useParticipantStats,
  useParticipantByAuid,
  createParticipant,
  updateParticipant,
  deleteParticipant,
};
