let b1 = Buffer.from('我的')
let b2 = Buffer.from('前端')
let b3 = Buffer.from('架构')
let b4 = Buffer.from('')
let b5

/**
 * 1、把需要合并的buffer放到一个数组中作为参数传入
 * 2、循环数组，把数组中的buffer转换成字符串，把字符串拼接并赋值给临时变量
 *    判断传入的数组是否有值
 * 3、把临时变量转换成buffer并返回
 */

Buffer.concat = function (bufferArray) {
  // console.log(bufferArray)
  let arr = ''
  bufferArray.forEach((item, index) => {
    if (item) {
      arr += item.toString()
    }
  })
  console.log(arr)
  // console.log(Buffer.from(arr))
  return Buffer.from(arr)
}
let newBuffer = Buffer.concat([b1, b2, b4, b3, b5])
console.log(newBuffer)
