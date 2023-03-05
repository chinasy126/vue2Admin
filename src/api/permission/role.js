import request from '@/utils/request'

const urlPrefix = 'role'

export function insertRole(params) {
  return request({
    url: `/${urlPrefix}/insert`,
    method: 'post',
    data: params
  })
}

/**
 * 修改数据
 * @param params
 * @returns {AxiosPromise}
 */
export function modifyRole(params) {
  return request({
    url: `/${urlPrefix}/modify`,
    method: 'post',
    data: params
  })
}

export function dataListByPage(params, currentPage, pageSize) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

/**
 * 删除角色
 * @param params
 * @returns {AxiosPromise}
 */
export function dataDelete(params) {
  return request({
    url: `/${urlPrefix}/delete`,
    method: 'delete',
    data: params
  })
}

/**
 * 所有角色
 * @returns {AxiosPromise}
 */
export function roleList() {
  return request({
    url: `/${urlPrefix}/rolelist`,
    method: 'post'
  })
}
