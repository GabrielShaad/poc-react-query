import axios, { AxiosRequestConfig } from "axios";

interface UseAuthRequest {
  request(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<any>;
}

const instance = axios.create({
  baseURL: process.env.REACT_APP_GITHUB_URL,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
  },
});

function useAuthRequest(
  baseURL = process.env.REACT_APP_GITHUB_URL as string
): UseAuthRequest {
  const request = async (
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => {
    try {
      const response = await instance.request({
        baseURL,
        method,
        url,
        data,
        ...config,
      });

      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    request,
  };
}

export default useAuthRequest;
