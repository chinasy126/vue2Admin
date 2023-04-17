/**
 * Created by PanJiaChen on 16/11/18.
 */

import fa from 'element-ui/src/locale/lang/fa'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * 判断是否存在内容
 * @param val
 * @returns {string|*}
 */
export function isNull(val) {
  if (val && typeof (val) !== 'undefined') {
    return val
  } else {
    return ''
  }
}

/**
 *
 * @param fn 执行的函数
 */
export function debounce(fn, delay) {
  const timeoutDelay = delay || 500
  let timer = null
  return function(...args) {
    const context = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      console.log(timer)
      timer = null
      fn.apply(context, args)
    }, timeoutDelay)
  }
}

/**
 * 下载文件
 * @param data
 * @param fileName
 */
export function downloadFile(data, fileName = '') {
  if (!data) {
    return
  }
  const link = document.createElement('a')
  let blob = new Blob([data], {
    type: 'application/vnd.ms-excel'
  })
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)

  link.setAttribute('download', `${fileName} ` + (new Date).toLocaleString()
    + '.xls')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 比较两个数组相同返回
 * @param arr1
 * @param arr2
 * @param attr
 * @returns {*[]}
 */
export function getArrSameValue(arr1, arr2, attr) {
  var result = []
  for (var i = 0; i < arr2.length; i++) {
    var obj = arr2[i]
    var id = obj[attr]
    var isExist = false
    for (var j = 0; j < arr1.length; j++) {
      var aj = arr1[j]
      var n = aj[attr]
      if (n == id) {
        isExist = true
        break
      }
    }
    if (isExist) {
      result.push(obj)
    }
  }
  return result
}

/**
 * 比较两个数组不同返回
 * @param arr1
 * @param arr2
 * @param attr
 * @returns {*[]}
 */
export function getArrDifValue(arr1, arr2, attr) {
  var result = []
  for (var i = 0; i < arr2.length; i++) {
    var obj = arr2[i]
    var id = obj[attr]
    var isExist = false
    for (var j = 0; j < arr1.length; j++) {
      var aj = arr1[j]
      var n = aj[attr]
      if (n == id) {
        isExist = true
        break
      }
    }
    if (!isExist) {
      result.push(obj)
    }
  }
  return result
}

/**
 * 比较两组不同Array[json]
 * @param arr1
 * @param arr2
 * @param attr
 * @returns {*[]}
 */
export function getArrJsonDif(arr1, arr2, attr) {
  let arr = [...arr1, ...arr2]
  let result = []
  for (let i = 0; i < arr.length; i++) {
    let obj = arr[i]
    let val = obj[attr]
    let isExist = false
    for (let j = 0; j < arr2.length; j++) {
      let value = arr[j][attr]
      if (val === value) {
        isExist = true
        break
      }
    }
    if (isExist === false) {
      result.push(obj)
    }
  }
  return result
}

/**
 * 转换多级分类向左缩进
 * @param str
 * @returns {string}
 */
export function transformClassPower(str) {
  if (str.length === 4) {
    return ''
  } else {
    let symbol = ''
    for (let i = 1; i < str.length / 4; i++) {
      symbol = symbol + '-'
    }
    return symbol
  }
}

/**
 * 删除图片URL正则表达式
 * @param html
 * @param basePath
 * @returns {*}
 */
export function replaceImgSrc(html, basePath) {
  const regex = /<img.*?src="([^"]+)".*?>/g;
  return html.replace(regex, function(match, src) {
    if (src.indexOf(basePath) === 0) {
      const relativePath = src.substr(basePath.length);
      return `<img src="${relativePath}">`;
    }
    return match;
  });
}

/**
 * 新增正则
 * @param html
 * @param prefix
 * @returns {*}
 */
export function addImgSrcPrefix(html, prefix) {
  const regex = /<img.*?src="([^"]+)".*?>/g;
  return html.replace(regex, function(match, src) {
    if (!src.startsWith('http') && !src.startsWith('//')) {
      return `<img src="${prefix}${src}">`;
    }
    return match;
  });
}
