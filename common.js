/**
 * 1、引入 path 模块
 * 2、创建 req 方法，并传入文件（模块）路径作为参数
 *    - 使用 path.resolve(__dirname, modulePath) 方法获取绝对路径
 *    - 创建模块 new Module()
 *        Module 类包括 id 和 exports 属性
 *        id：文件夹
 *        exports：需要导出的具体内容
 *    - 尝试加载模块 tryModuleLoad(module)
 *        path.extname(module.id)：获取文件后缀
 *        创建一个 Module._extensions 对象，包括读取 .js 和 .json 文件的方法
 *            - 读取 json 文件：
 *             .json 方法通过传入的 module 参数获取到文件路径后使用 readFile 方法直接读取文件内容，最后使用 module.exports 导出（json 文件不需要运行直接导出即可）
 *             Module._extensions[extension](module)：通过获取的后缀名在 Module._extensions 对象中找到相应的方法并传入绝对路径参数读取文件 ，即：通过后缀尝试加载文件（模块）
 *         - 读取 js 文件：
 *             和 json 文件一样，先读取文件内容
 *             然后用 function 包裹起来
 *             再通过 InThisContext 方法转换成函数，需要引入 vm 模块
 *             最后通过 call() 执行函数
 *    - 增加缓存策略    
 *         创建一个 Module._cache = {} 空对象，用于存放缓存
 *         生成模块对象后，存入缓存（Module._cache[absPathname] = module）
 *         如果 Module._cache[absPathname] 已经存在，表示文件已经读取，则直接抛出 exports 对象
 * 
 *     - 识别后缀
 *          
 * 
 * 
 * 
 * module.exports 和 exports 的区别
 * exports 是 module.exports 的别名，当时不能直接改变 exports 对象的引用，因为不会影响 module.exports 对象的值
 * 
 * 
 */

let path = require('path')
let fs = require('fs')
let vm = require('vm')

function Module(id) {
  this.id = id // 文件名
  this.exports = {}
}

Module.wrapper = [
  "(function(exports, module, require, __dirname, __filename){",
  "})"
]

// 读取 .js 和 .json 文件的方法
Module._extensions = {
  '.js'(module) {
    let content = fs.readFileSync(module.id, 'utf8') // 读取文件内容
    let fnStr = Module.wrapper[0] + content + Module.wrapper[1] // 把文件内容包裹起来，用 function 包裹起来
    let fn = vm.runInThisContext(fnStr) // 通过 InThisContext 方法转换成函数
    fn.call(module.exports, module.exports, module, req) // 执行函数
  },
  '.json'(module) {
    // console.log(module)
    let json = fs.readFileSync(module.id, 'utf8')
    module.exports = json // 把文件的结果放到 exports属性上 
  }
}

/**
 * 尝试加载模块方法
 * @param {*} module :  一个对象，通过 new Module() 生成的
 * Module {
      id: 'e:\\珠峰架构课\\code\\2.node&common.js\\common.js规范\\a.json',
      exports: {}
   }
 */
function tryModuleLoad(module) { // 这个 module 传进来的是个对象，
  // console.log('module', module)
  let extension = path.extname(module.id) // .json/.js获取扩展名, module.id是个绝对路径
  // console.log(extension)
  // 通过获取的后缀名在 Module._extensions 对象中找到相应的方法并传入绝对路径参数读取文件 ，即：通过后缀尝试加载文件（模块）
  Module._extensions[extension](module)
}

Module._cache = {} // 用于存放缓存

function req(modulePath) {
  // 获取当前要加载文件的绝对路径
  let absPathname = path.resolve(__dirname, modulePath)
  // console.log(absPathname)
  // 识别后缀
  let extNames = Object.keys(Module._extensions)
  let index = -1
  let old = absPathname

  function find(absPathname) {
    if (index === extNames.length) {
      return absPathname
    }
    try {
      // 找到后 就终止查找
      fs.accessSync(absPathname)
      return absPathname
    } catch (e) {
      let ext = extNames[index++] // .js  
      let newPath = old + ext // path.join(a,b) // a/.js
      return find(newPath)
    }
  }
  absPathname = find(absPathname) // 找当前路径是否存在
  try {
    fs.accessSync(absPathname);
  } catch (e) { // 最后增加 json 后也没有后缀 就抛出错误
    throw new Error('error');
  }
  // 缓存
  if (Module._cache[absPathname]) { // 如果文件已经存在，直接将 exports 对象返回即可
    return Module._cache[absPathname].exports
  }
  // 创建模块
  let module = new Module(absPathname) // 生成的是一个对象，内容包括id（文件绝对路径和 exports）
  Module._cache[absPathname] = module // 增加缓存
  // console.log(module)
  tryModuleLoad(module) // 尝试加载当前模块
  return module.exports // req 方法会默认返回 exports 对象
}

let obj = req('./a')
console.log(obj)
