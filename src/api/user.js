import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/user/info?token=${token}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 通过角色获取菜单
 * @returns {AxiosPromise}
 */
export function generateRoutes() {
  return request({
    url: '/user/nav',
    method: 'post'
  })
}

/**
 * 获取验证码
 * @returns {AxiosPromise}
 */
export function getImageApi() {
  return request({
    url: '/user/verificationcode',
    method: 'post',
    responseType: 'blob'
  })
}
