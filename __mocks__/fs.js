// 假的fs
const fs = jest.genMockFromModule('fs');
// 真正的fs
const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

let readMocks = {}
fs.setReadFileMock = (path, error, data) => {
    readMocks[path] = [error, data]
}
// readFile的写法参考真的readFile的文档，options可传可不传
fs.readFile = (path, options, callback) => {
    // options参数，用户有可能不传
    if (callback === undefined) {
        callback = options
    }
    if (path in readMocks) {
        callback(readMocks[path][0], readMocks[path][1])
    } else {
        _fs.readFile(path, options, callback)
    }
}

let writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
    writeMocks[path] = fn
}
// writeFile的写法参考真的readFile的文档，options可传可不传
fs.writeFile = (path, data, options, callback) => {
    if (path in writeMocks) {
        writeMocks[path](path, data, options, callback)
    } else {
        _fs.writeFile(path, data, options, callback)
    }
}

fs.clearMocks = () => {
    readMocks = {}
    writeMocks = {}
}
module.exports = fs