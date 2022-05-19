import axios from 'axios';
import { name, version } from '../../package.json';

axios.defaults.timeout = 5000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const API = axios.create({
  baseURL: 'https://dummyapi.io/data/v1',
});

API.interceptors.request.use(
  config => {
    let userAgent = `${name}/${version}`;
    if (!config.headers) {
      config.headers = {};
    }
    config.headers['User-Agent'] = userAgent;
    config.headers['app-id'] = '6148e0ccba2b903341756d36';

    return config;
  },
  error => Promise.reject(error),
);

API.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error.response || error.request || error.message),
);

export default API;
export type Data<T> = { data: T };
