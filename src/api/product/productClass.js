import request from '@/utils/request'

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix = `productclass`

export function dataListByPage(params, currentPage, pageSize) {
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
 * 删除产品分类
 * @param param
 * @returns {AxiosPromise}
 */
export function dataDelete(param) {
  return request({
    url: `/${urlPrefix}/delete`,
    method: 'delete',
    data: param
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

export function category() {
  return request({
    url: `/${urlPrefix}/category`,
    method: 'post'
  })
}
