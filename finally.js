Promise.prototype.finally = function (callback) {
  return this.then(
    value => {
      callback()
      return value
    },
    error => {
      callback()
      throw error
    }
  )
}
