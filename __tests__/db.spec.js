const db = require('../db.js')
const fs = require('fs')
// jest接管了fs，这里的fs为mock的fs
jest.mock('fs');

describe('db', () => {
    afterEach(()=>{
        fs.clearMocks()
    })
    it('can read', async () => {
        const data = [{title: 'hi', done: false}]
        fs.setReadFileMock('/xxx', null, JSON.stringify(data))
        const list = await db.read('/xxx')
        expect(list).toStrictEqual(data)
    });
    it('can write', async () => {
        let fakeFile
        // data是写的内容
        fs.setWriteFileMock('/yyy', (path, data, callback) => {
            // 写文件到变量fakeFile
            fakeFile = data
            // null表示没有错误
            callback(null)
        })
        const list = [{title: '打乒乓球', done: true}, {title: '打扫卫生', done: false}]
        await db.write(list, '/yyy')
        expect(fakeFile).toBe(JSON.stringify(list))
    })
})