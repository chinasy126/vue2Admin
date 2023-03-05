import request from '@/utils/request'

/**
 * 获取数据列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getList(params, currentPage, pageSize) {
  return request({
    url: `/table/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const selectTablePage = (current, size) => {
  return request({
   // url: `/table/selectTableAndXmlPage/${current}/${size}`,
   url: `/table/selectTableMapPage/${current}/${size}`,
    // url: `/table/selectTablePage/${current}/${size}`,
    method: 'get'
  })
}

/**
 * 删除数据
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteRow(id) {
  return request({
    url: `/table/delete/${id}`,
    method: 'delete',
    data: ''
  })
}

/**
 * 插入数据
 * @param params
 * @returns {AxiosPromise}
 */
const insert = (params) => {
  return request({
    url: '/table/insert',
    method: 'post',
    data: params
  })
}

/**
 * 更新数据
 * @param params
 * @returns {AxiosPromise}
 */
const updateRow = (params, id) => {
  return request({
    url: `/table/update?id=${id}`,
    method: 'post',
    data: params
  })
}

/**
 * 查找数据
 * @param params
 * @returns {AxiosPromise}
 */

const findRow = (params) => {
  return request({
    url: `/table/find`,
    method: 'post',
    data: params
  })
}

export { insert, findRow, updateRow, selectTablePage }
