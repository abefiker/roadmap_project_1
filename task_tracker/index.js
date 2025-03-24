import fs from 'node:fs';
import { describe } from 'node:test';
import prompt from 'prompt-sync';
const input = prompt({ sigint: true });

const readFile = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) { return [] };
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
        return [];
    }
}

const writeFile = async (filePath, data) => {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`File ${filePath} written successfully`);
    } catch (error) {
        console.error(`Error writing file ${filePath}: ${error.message}`);
    }
}
const tasks = await readFile('task.txt');
if (!Array.isArray(tasks)) { tasks = [] };
const taskType = {
    id: Number,
    description: String,
    status: String,
    createdAt: Date,
    updatedAt: Date
}
console.log('Command line task manager , add <task> , remove <task id> , update <task id>, list , quit');
console.log("to update use update <index of old task> <new task>")
while (true) {
    const command = input("Enter command : ").trim();
    let [action, ...args] = command.split(' ');
    const task = args.join(" ");
    if (action === "list" && (args[0] === "in-progress" || args[0] === "done")) {
        action = `list ${args[0]}`;
    }
    switch (action) {
        case 'add':
            if (!task) {
                console.log("❌ Please provide a task to add");
                continue;
            }
            const newTask = {
                id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
                description: task,
                status: "in-progress",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            tasks.push(newTask);
            await writeFile('task.txt', tasks);
            console.log(`✅ Task added: "${task}"`);
            break;
        case 'update':
            const taskId2 = parseInt(args[0])
            const newDescription = args.slice(1).join(" ")
            if (isNaN(taskId2) || taskId2 < 1 || taskId2 > tasks.length || !newDescription) {
                console.log('❌ please provide correct taskId ')
                continue
            }
            const taskIndex2 = tasks.findIndex(t => t.id === taskId2)
            if (taskIndex2 === -1) {
                console.log('❌ Task not found')
                continue
            }
            tasks[taskIndex2].description = newDescription
            tasks[taskIndex2].updatedAt = new Date().toISOString()
            await writeFile('task.txt', tasks)
            console.log(`✅ Task updated: "${task}"`)
            break
        case 'remove':
            const taskId = parseInt(task)
            if (isNaN(taskId)) {
                console.log('❌ please provide correct taskId ')
                continue
            }
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex === -1) {
                console.log('❌ Task not found')
                continue
            }
            tasks.splice(taskIndex, 1)
            await writeFile('task.txt', tasks)
            console.log(`✅ Task removed: "${task}"`)
            break;
        case 'list in-progress':
            const inProgressTasks = tasks.filter(task => task.status === "in-progress")
            if (inProgressTasks.length === 0) {
                console.log(" 📂 No tasks found");
            } else {
                console.log("📌 In-Progress Tasks : ");
                inProgressTasks.map((task) => {
                    console.log(`${task.id}. ${task.description} - ${task.status} - ${task.createdAt} - ${task.updatedAt}`)
                })
            }
            break;
        case 'list done':
            const doneTasks = tasks.filter(task => task.status === 'done')
            if (doneTasks.length === 0) {
                console.log("📂 No tasks found")
            } else {
                console.log("📌 Done Tasks : ")
                doneTasks.map((task) => {
                    console.log(`${task.id}. ${task.description} - ${task.status} - ${task.createdAt} - ${task.updatedAt}`)
                })
            }
            break;
        case 'list':
            if (tasks.length === 0) {
                console.log(" 📂 No tasks found");
            } else {
                console.log("📌 Tasks : ");
                tasks.map((task) => {
                    console.log(`${task.id}. ${task.description} - ${task.status} - ${task.createdAt} - ${task.updatedAt}`)
                })
            }
            break;
        case 'mark-in-progress':
            const taskId3 = parseInt(args[0])
            const newStatus = 'in-progress'
            if (isNaN(taskId3) || !newStatus) {
                console.log('❌ please provide correct taskId ')
                continue
            }
            const taskIndex3 = tasks.findIndex(t => t.id === taskId3)
            if (taskIndex3 === -1) {
                console.log('❌ Task not found')
                continue
            }
            tasks[taskIndex3].status = newStatus
            tasks[taskIndex3].updatedAt = new Date().toISOString()
            await writeFile('task.txt', tasks)
            console.log(`✅ Task marked as in-progress: "${task}"`)
            break
        case 'mark-done':
            const taskId4 = parseInt(args[0])
            const newStatus2 = 'done'
            if (isNaN(taskId4) || !newStatus2) {
                console.log('❌ please provide correct taskId ')
                continue
            }
            const taskIndex4 = tasks.findIndex(t => t.id === taskId4)
            if (taskIndex4 === -1) {
                console.log('❌ Task not found')
                continue
            }
            tasks[taskIndex4].status = newStatus2
            tasks[taskIndex4].updatedAt = new Date().toISOString()
            await writeFile('task.txt', tasks)
            console.log(`✅ Task marked as done: "${task}"`)
            break
        case 'quit':
            console.log("👋 Thank you for using the task manager");
            process.exit(0);
        default:
            console.log("❓ Invalid command . Use: add, update, remove, list, exit.");
    }

}

