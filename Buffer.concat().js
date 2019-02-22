let b1 = Buffer.from('珠')
let b2 = Buffer.from('峰')

Buffer.concat = function (bufferArray) {
  // console.log(bufferArray)
  let arr = []
  bufferArray.forEach((item, index) => {
    // arr[index] = item
    arr += item.toString()
  })
  // console.log(Buffer.from(arr))
  return Buffer.from(arr)
}
let newBuffer = Buffer.concat([b1, b2])
console.log(newBuffer)
