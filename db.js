const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const p = require("path")
const fs = require('fs')
const dbPath = p.join(home, '.todo')

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (error, data) => {
                if (error) {
                    // 如果失败就返回error
                    reject(error)
                } else {
                    let list
                    try {
                        list = JSON.parse(data.toString())
                    } catch (error2) {
                        list = []
                    }
                    // 如果成功就将异步的结果返回到外面
                    resolve(list)
                }
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }
}
module.exports = db