import request from '@/utils/request'

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix = 'uploadimg'

const uploadImg = (data, config, callback) => {
  return request({
      url: `/upload/pictures`,
      method: 'post',
      config: {
        headers: config.headers
      },
      onUploadProgress: callback,
      data: data
    }
  )
}

export { uploadImg }
