import request from 'src/utils/fetcher';
import { CreateActivityRequest, UpdateActivityRequest, DeleteActivityRequest } from 'types';
import API from '@services/config';
import useActivity from './useActivity';

async function createActivity(payload: CreateActivityRequest) {
  try {
    const data = await request({
      url: API.internals.activity,
      method: 'POST',
      payload,
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
      url: API.internals.activity,
      method: 'PUT',
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function deleteActivity(payload: DeleteActivityRequest) {
  try {
    const data = await request({
      url: API.internals.activity,
      method: 'DELETE',
      payload,
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export { useActivity, createActivity, updateActivity, deleteActivity };
