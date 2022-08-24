import { sessionUrl } from "@services/config";
import request from "src/utils/fetcher";

async function login(payload: { account: string; password: string }) {
  try {
    const data = request({ url: sessionUrl, payload, method: "POST" });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function refresh() {
  try {
    const data = await request({
      url: sessionUrl,
      method: "GET",
    });
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function logout() {
  return request({ url: sessionUrl, method: "DELETE", toJson: false });
}

export { login, logout, refresh };
