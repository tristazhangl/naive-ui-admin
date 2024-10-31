import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { createAlovaMockAdapter } from '@alova/mock';
import { isString } from 'lodash-es';
import mocks from './mocks';
import { useUser } from '@/store/modules/user';
import { storage } from '@/utils/Storage';
import { useGlobSetting } from '@/hooks/setting';
import { PageEnum } from '@/enums/pageEnum';
import { ResultEnum } from '@/enums/httpEnum';
import { isUrl } from '@/utils';

const { useMock, apiUrl, urlPrefix, authApiUrl, loggerMock } = useGlobSetting();

const mockAdapter = createAlovaMockAdapter([...mocks], {
  // 全局控制是否启用mock接口，默认为true
  enable: useMock,

  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: adapterFetch(),

  // mock接口响应延迟，单位毫秒
  delay: 1000,

  // 自定义打印mock接口请求信息
  // mockRequestLogger: (res) => {
  //   loggerMock && console.log(`Mock Request ${res.url}`, res);
  // },
  mockRequestLogger: loggerMock,
  onMockError(error, currentMethod) {
    console.error('🚀 ~ onMockError ~ currentMethod:', currentMethod);
    console.error('🚀 ~ onMockError ~ error:', error);
  },
});

export const Alova = createAlova({
  baseURL: apiUrl,
  statesHook: VueHook,
  // 关闭全局请求缓存
  // cacheFor: null,
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
  requestAdapter: mockAdapter,
  beforeRequest(method) {
    const userStore = useUser();
    const token = userStore.getToken;
    // 添加 token 到请求头
    if (!method.meta?.ignoreToken && token) {
      method.config.headers['Authorization'] = "Bearer " + token;
    }
    // 处理 api 请求前缀
    const isUrlStr = isUrl(method.url as string);
    if (!isUrlStr && urlPrefix) {
      method.url = `${urlPrefix}${method.url}`;
    }
    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      method.url = `${apiUrl}${method.url}`;
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      let res;
      // 获取内容类型
      const contentType = response.headers.get('content-type');
  
      // 根据内容类型处理数据
      if (contentType && contentType.includes('application/json')) {
        // 如果是JSON，则解析JSON数据
        res = response.json && await response.json();
      } else if (contentType && contentType.includes('text/plain')) {
        // 如果是文本，则读取文本数据
        res = response.text && await response.text();
        return res;
      } else {
        // 默认处理其他类型或抛出错误
        res = response.body;
      }

      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res;
      }
      // 请根据自身情况修改数据结构
      const { message, status, error, } = res;
      if (status != 200) {
        return Promise.reject(new Error(message || "Error"));
      }

      // 不进行任何处理，直接返回
      // 用于需要直接获取 code、result、 message 这些信息时开启N
      if (method.meta?.isTransformResponse === false) {
        return res.data;
      }

      return res;
    }
  },
});

export const userAuthAlova = createAlova({
  baseURL: authApiUrl, // 'http://59.52.36.181:9702',
  statesHook: VueHook,
  requestAdapter: mockAdapter,
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
      let res;
      // 获取内容类型
      const contentType = response.headers.get('content-type');
  
      // 根据内容类型处理数据
      if (contentType && contentType.includes('application/json')) {
        // 如果是JSON，则解析JSON数据
        res = response.json && await response.json();
      } else if (contentType && contentType.includes('text/plain')) {
        // 如果是文本，则读取文本数据
        res = response.text && await response.text();
        return res;
      } else {
        // 默认处理其他类型或抛出错误
        res = response.body;
      }

      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res;
      }
      console.log('g res ', res)
      // 请根据自身情况修改数据结构
      const { message, status, error, } = res;
      if (status != 200) {
        return Promise.reject(new Error(message || "Error"));
      }

      // 不进行任何处理，直接返回
      // 用于需要直接获取 code、result、 message 这些信息时开启N
      if (method.meta?.isTransformResponse === false) {
        return res.data;
      }

      return res;
    }
  }
});
