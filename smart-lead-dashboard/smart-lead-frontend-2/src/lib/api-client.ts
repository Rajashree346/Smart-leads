import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:9000";

export const axiosInstance =
  axios.create({
    baseURL: API_BASE_URL,

    headers: {
      "Content-Type":
        "application/json",
    },

    timeout: 10000,
  });

axiosInstance.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (
      token &&
      config.headers
    ) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (
    response: AxiosResponse
  ) => {
    return response;
  },

  (error: AxiosError) => {
    if (
      error.response?.status ===
      401
    ) {
      console.warn(
        "Unauthorized request detected"
      );

      localStorage.removeItem(
        "token"
      );

      const isAuthPage =
        window.location.pathname.startsWith(
          "/login"
        ) ||
        window.location.pathname.startsWith(
          "/signin"
        );

      if (!isAuthPage) {
        window.location.href =
          "/login?expired=true";
      }
    }

    return Promise.reject(error);
  }
);

export const axiosWithAuth = <
  T
>(
  config: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance(config).then(
    ({ data }) => data
  );
};