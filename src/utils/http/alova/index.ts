import { createAlova, } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { createAlovaMockAdapter } from '@alova/mock';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import { isString } from 'lodash-es';
import mocks from './mocks';
import { useUser } from '@/store/modules/user';
import { storage } from '@/utils/Storage';
import { useGlobSetting } from '@/hooks/setting';
import { PageEnum } from '@/enums/pageEnum';
import { ResultEnum } from '@/enums/httpEnum';
import { isUrl } from '@/utils';

const { useMock, apiUrl, urlPrefix, authApiUrl, loggerMock } = useGlobSetting();
console.log('get api url ', apiUrl)

export const Alova = createAlova({
  baseURL: apiUrl,
  statesHook: VueHook,
  // 关闭全局请求缓存
  cacheFor: null,
  // 全局缓存配置
  // cacheFor: {
  //   POST: {
  //     mode: 'memory',
  //     expire: 60 * 10 * 1000
  //   },
  //   GET: {
  //     mode: 'memory',
  //     expire: 60 * 10 * 1000
  //   },
  //   HEAD: 60 * 10 * 1000 // 统一设置HEAD请求的缓存模式
  // },
  // 在开发环境开启缓存命中日志
  cacheLogger: process.env.NODE_ENV === 'development',
  requestAdapter: axiosRequestAdapter(),
  beforeRequest(method) {
    const userStore = useUser();
    const token = userStore.getToken;
    // 添加 token 到请求头
    if (!method.meta?.ignoreToken && token) {
      method.config.headers['Authorization'] = "Bearer " + token;
    }
    // 处理 api 请求前缀
    /* const isUrlStr = isUrl(method.url as string);
    if (!isUrlStr && urlPrefix) {
      method.url = `${urlPrefix}${method.url}`;
    }
    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      method.url = `${apiUrl}${method.url}`;
    } */
  },
  responded: {
    onSuccess: async (response, method) => {
      let res = response;
      
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res;
      }
      // 请根据自身情况修改数据结构
      const { message, status, error, } = res;
      if (status != 200) {
        return Promise.reject(new Error(message || "Error"));
      }
      return res.data;
    }
  },
});

export const userAuthAlova = createAlova({
  baseURL: authApiUrl, // 'http://59.52.36.181:9702',
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),
  cacheFor: null,
  beforeRequest(method) {
    const userStore = useUser();
    const token = userStore.getToken;
    // 添加 token 到请求头
    if (!method.meta?.ignoreToken && token) {
      method.config.headers['Authorization'] = `Bearer ` + token;
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      let res = response;
      
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res;
      }
      // 请根据自身情况修改数据结构
      const { message, status, error, } = res;
      if (status != 200) {
        return Promise.reject(new Error(message || "Error"));
      }
      return res.data;
    }
  }
});
