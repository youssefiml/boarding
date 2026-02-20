import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipGlobalError?: boolean;
    skipGlobalLoading?: boolean;
    skipAuthRefresh?: boolean;
  }
}
