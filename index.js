const db = require("./db.js");
const inquirer = require("inquirer");

// 创建任务
module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 往里面添加一个 title任务
    list.push({title, done: false})
    // 存储任务文件
    await db.write(list)
}

// 清除任务
module.exports.clear = async () => {
    await db.write([])
}

// 打印全部的任务
module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read()
    printTasks(list)
}

// 打印全部任务todoList
function printTasks(list) {
    inquirer.prompt({
        type: "list",
        name: "index",
        message: "请选择你想操作的任务",
        // 用户可以选择退出、对选择的todo任务打✔✘，新增任务
        choices: [{name: '退出', value: '-1'}, ...list.map((task, index) => {
            return {name: `${task.done ? '[✔]' : '[✘]'}${index + 1} - ${task.title}`, value: index.toString()}
        }), {name: '+ 新增任务', value: '-2'}]
    }).then(answer => {
        const index = parseInt(answer.index)
        if (index >= 0) {
            askForAction(index, list)
        } else if (index === -1) {
            // 选择了退出
        } else if (index === -2) {
            askForCreateTask(list)
        }
    })
}

// 选择了一个todo任务
function askForAction(index, list) {
    const actions = {markAsDone, markAsUndone, updateTitle, remove}
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "选择操作",
        // 如果选择了一个todo任务，用户可以选择退出、标记todo任务已完成、未完成、删除、修改标题和退出
        choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'markAsDone'},
            {name: '未完成', value: 'markAsUndone'},
            {name: '改标题', value: 'updateTitle'},
            {name: '删除', value: 'remove'},

        ]
    }).then(answer2 => {
        // 对用户的选择执行步同的业务处理
        const action = actions[answer2.action]
        action && action(list,index)
    })
}

// 询问创建任务
function askForCreateTask(list){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "输入任务标题",
    }).then((answer) => {
        list.push({
            title: answer.title,
            done: false
        })
        void db.write(list)
    });
}
// 任务标记已完成
function markAsDone(list,index){
    list[index].done = true
    void db.write(list)
}

// 任务标记未完成
function markAsUndone(list,index){
    list[index].done = false
    void db.write(list)
}
// 更新任务标题
function updateTitle(list,index){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "新的标题",
    }).then((answer) => {
        list[index].title = answer.title
        void db.write(list)
    });
}
// 移出任务
function remove(list,index){
    // 从下标index删除一个
    list.splice(index, 1)
    void db.write(list)
}

/********************************************************************** 分割线 ********************************************************************************************************************************/


// 未优化版代码
// const db = require("./db.js");
// const inquirer = require("inquirer");
// // 优化后的代码
// module.exports.add = async (title) => {
//     // 读取之前的任务
//     const list = await db.read()
//     // 往里面添加一个 title任务
//     list.push({title, done: false})
//     // 存储任务文件
//     await db.write(list)
// }
//
// module.exports.clear = async () => {
//     await db.write([])
// }
//
// module.exports.showAll = async () => {
//     // 读取之前的任务
//     const list = await db.read()
//     inquirer.prompt({
//         type: "list",
//         name: "index",
//         message: "请选择你想操作的任务",
//         // 用户可以选择退出、对选择的todo任务打✔✘，新增任务
//         choices: [{name: '退出', value: '-1'}, ...list.map((task, index) => {
//             return {name: `${task.done ? '[✔]' : '[✘]'}${index + 1} - ${task.title}`, value: index.toString()}
//         }), {name: '+ 新增任务', value: '-2'}]
//     }).then(answer => {
//         const index = parseInt(answer.index)
//         if (index >= 0) {
//             // 选择了一个todo任务
//             inquirer.prompt({
//                 type: "list",
//                 name: "action",
//                 message: "选择操作",
//                 // 如果选择了一个todo任务，用户可以选择退出、标记todo任务已完成、未完成、删除、修改标题和退出
//                 choices: [
//                     {name: '退出', value: 'quit'},
//                     {name: '已完成', value: 'markAsDone'},
//                     {name: '未完成', value: 'markAsUndone'},
//                     {name: '改标题', value: 'updateTitle'},
//                     {name: '删除', value: 'remove'},
//
//                 ]
//             }).then(answer2 => {
//                 // 对用户的选择执行步同的业务处理
//                 switch (answer2.action) {
//                     case 'markAsDone':
//                         list[index].done = true
//                         db.write(list)
//                         break;
//                     case 'markAsUndone':
//                         list[index].done = false
//                         db.write(list)
//                         break;
//                     case 'updateTitle':
//                         inquirer.prompt({
//                             type: 'input',
//                             name: 'title',
//                             message: "新的标题",
//                         }).then((answer) => {
//                             list[index].title = answer.title
//                             db.write(list)
//                         });
//                         break;
//                     case 'remove':
//                         // 从下标index删除一个
//                         list.splice(index, 1)
//                         db.write(list)
//                         break;
//                 }
//             })
//         } else if (index === -1) {
//             // 选择了退出
//         } else if (index === -2) {
//             // 创建任务
//             inquirer.prompt({
//                 type: 'input',
//                 name: 'title',
//                 message: "输入任务标题",
//             }).then((answer) => {
//                 list.push({
//                     title: answer.title,
//                     done: false
//                 })
//                 db.write(list)
//             });
//         }
//     })
// }


// 未优化版add
// module.exports.add = (title) => {
//     // 读取之前的任务
//     fs.readFile(dbPath, {flag: 'a+'}, (error, data) => {
//         if (error) {
//             console.log(error)
//         } else {
//             let list
//             try {
//                 list = JSON.parse(data.toString())
//             } catch (error2) {
//                 list = []
//             }
//             // 往里面添加一个 title任务
//             const task = {
//                 title: title,
//                 done: false
//             }
//             list.push(task)
//             // 存储任务文件
//             const string = JSON.stringify(list)
//             fs.writeFile(dbPath,string,(error3) => {
//                 if(error3){
//                     console.log(error3)
//                 }
//             })
//             console.log(list)
//         }
//     })
//
//
// }