#!/usr/bin/env node
const program  = require('commander');
const api = require("./index.js")
const pkg = require('./package.json')

program
    .version(pkg.version)
program
    .option('-x, --xxx', 'what the x ???')
program
    .command('add <taskName> [other...]')
    .description('add a task')
    .action((x,y) => {
        const words = x + " " + y.join(" ")
        api.add(words).then(() =>{console.log('添加成功')},()=>{console.log('添加失败')} )
    });

program
    .command('clear [all]')
    .description('clear all tasks')
    .action(() => {
        api.clear.then(()=>{console.log('清除成功')},()=>{console.log('清除失败')})
    });

program.parse(process.argv);

// 说明用户直接运行 node cli.js
if(process.argv.length === 2){
    void api.showAll()
}
