import request from '@/utils/request'

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix = `menu`

export function dataListByPage(params, currentPage, pageSize) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

export function menuList(params, currentPage, pageSize) {
  return request({
    url: `/${urlPrefix}/menulist?currentPage=${currentPage}&pageSize=${pageSize}`,
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
 * 按照条件操作
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
export function dataBatchDelete(params) {
  return request({
    url: `/${urlPrefix}/batchdelete`,
    method: 'delete',
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

export function category() {
  return request({
    url: `/${urlPrefix}/category`,
    method: 'post'
  })
}

export function allMultilevelClassification() {
  return request({
    url: `/${urlPrefix}/multiclassclassification`,
    method: 'post'
  })
}

/**
 * 批量插入
 * @param params
 * @returns {AxiosPromise}
 */
export function batchInsert(params) {
  return request({
    // url: `/menuButton/menubutton/list`,
     url: `/${urlPrefix}/batch`,
    method: 'post',
    data: params
  })
}

/**
 * 新接口，新增或者修改
 * @param params
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(params){
  return request({
    url: `/${urlPrefix}/saveOrUpdate`,
    method: 'post',
    data: params
  })
}
