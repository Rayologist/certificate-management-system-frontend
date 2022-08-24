import request from "src/utils/fetcher";
import {
  CreateActivityRequest,
  UpdateActivityRequest,
  DeleteActivityRequest,
} from "types";
import { activityUrl } from "../config";
import useActivity from "./useActivity";

async function createActivity(payload: CreateActivityRequest) {
  try {
    const data = await request({
      url: activityUrl,
      method: "POST",
      payload: payload,
      toJson: false,
    });

    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function updateActivity(payload: UpdateActivityRequest) {
  try {
    const data = await request({
      url: activityUrl,
      method: "PUT",
      payload: payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function deleteActivity(payload: DeleteActivityRequest) {
  try {
    const data = await request({
      url: activityUrl,
      method: "DELETE",
      payload: payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export { useActivity, createActivity, updateActivity, deleteActivity };
