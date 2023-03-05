import request from '@/utils/request'

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix = 'news'

const dataListByPage = (params, currentPage, pageSize) => {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

/**
 * 插入数据
 * @param params
 * @returns {AxiosPromise}
 */
const newsInsert = (params) => {
  return request({
    url: `/${urlPrefix}/insert`,
    method: 'post',
    data: params
  })
}

/**
 * 操作数据
 * @param params
 * @returns {AxiosPromise}
 */
const newsModify = (params) => {
  return request({
    url: `/${urlPrefix}/modify`,
    method: 'post',
    data: params
  })
}

/**
 * 删除数据
 * @param id
 * @returns {AxiosPromise}
 */

const newsDelete = (params) => {
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
const batchDelete = (params) => {
  return request({
    url: `/${urlPrefix}/batchDelete`,
    method: 'delete',
    data: params
  })
}

/**
 * 新增修改
 * @param params
 * @returns {AxiosPromise}
 */
const saveOrUpdate = (params) => {
  return request({
    url: `/${urlPrefix}/saveOrUpdate`,
    method: 'post',
    data: params
  })
}

/**
 * 获取单条数据
 * @param param
 * @returns {AxiosPromise}
 */
const getDetail = (param) => {
  return request({
    url: `/${urlPrefix}/find`,
    method: 'post',
    data: param
  })
}

/**
 * 更新数据
 * @param id
 * @param param
 * @returns {AxiosPromise}
 */
const updateDetail = (id, param) => {
  return request({
    url: `/${urlPrefix}/update?id=${id}`,
    method: 'post',
    data: param
  })
}

/**
 * 导出EXCEL
 * @returns {AxiosPromise}
 */
export function exportExcelData(param) {
  return request({
    url: `/${urlPrefix}/export`,
    method: 'post',
    data: param,
    // headers: {
    //   Accept: '*',
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    // },
     responseType: 'blob'
  })
}

export function importExcelData(param, config, callback) {
  return request({
    url: `/${urlPrefix}/import`,
    method: 'post',
    config: config,
    onUploadProgress: callback,
    data: param
  })
}

export { batchDelete, saveOrUpdate, dataListByPage, newsInsert, newsDelete, getDetail, updateDetail, newsModify }
