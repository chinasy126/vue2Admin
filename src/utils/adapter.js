/**
 *  格式化列内容
 * @param cols
 */

export function adaptCol(cols = [{ title: 'xxx', key: 'aaa' }]) {
  let idx = 0;
  let newCols = cols.map(item => {
    idx++
    item.key = item.key.replace(/^\S/, s => s.toLowerCase())
    item.sorter = true
    let options = {
      width: item.width || 200,
      dataIndex: item.key,
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: `${item.key}`
      },
      onFilter: (value, record) => {
        return (record[item.key] + '')
          .toString()
          .toLowerCase()
          .includes((value + '').toLowerCase())
      }
    }
    if (item.key == 'oprate' || item.key == 'action' || item.key == 'validateTip') {
      delete item.sorter
      delete options.scopedSlots.filterDropdown
      delete options.scopedSlots.filterIcon
    }
    return Object.assign(options, item)
  })

  return newCols
}
