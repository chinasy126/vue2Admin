import request from '@/utils/request'

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix = `user`

export function dataListByPage(params, currentPage = 1, pageSize = 10) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

export function dataInsert(params) {
  return request({
    url: `/${urlPrefix}/insert`,
    method: 'post',
    data: params
  })
}

/**
 * 根据条件删除
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
 * 批量删除
 * @param params
 * @returns {AxiosPromise}
 */
export function batchDelete(params) {
  return request({
    url: `/${urlPrefix}/batchdelete`,
    method: 'post',
    data: params
  })
}

export function getDetail(id) {
  return request({
    url: `/${urlPrefix}/getdetail`,
    method: 'post',
    data: id
  })
}

export function dataModify(params) {
  return request({
    url: `/${urlPrefix}/modify`,
    method: 'post',
    data: params
  })
}

export function aaa() {
  return request({
    url: `/user/nav`,
    method: 'post'
  })
}
