import { userAuthAlova, Alova } from '@/utils/http/alova/index';
import { ContentTypeEnum } from '@/enums/httpEnum';
import qs from "qs";

/**
 * @description: 获取用户信息
 */
export function getUserInfo(userId) {
  const param = {
    userId,
  }
  return userAuthAlova.Get<InResult>('/authority/getUserAuthority', {
    params: param,
    headers: {
      'fangda-appId': 'energy-analysis-sys'
    },
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return userAuthAlova.Post<InResult>(
    '/auth/login',
    qs.stringify(params),
    {
      headers: {
        "content-type": ContentTypeEnum.FORM_URLENCODED,
      },
    }
  );
}

/**
 * @description: 获取用户信息
 */
export function getInfo(userId) {
  const param = {
    userId,
  }
  return userAuthAlova.Get<InResult>('/auth/user', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    params: param,
  });
}


/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return Alova.Post(`/user/u${uid}/changepw`, { params });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/login/logout', {
    params,
  });
}
