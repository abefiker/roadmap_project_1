import prompt from 'prompt-sync'
import fs from 'fs'
import { parse } from 'path';
const input = prompt({ sigint: true });
const readFile = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) { return [] }
        const data = await fs.promises.readFile(filePath, 'utf-8')
        return JSON.parse(data);
    } catch (error) {
        console.log(`Error reading file ${filePath}: ${error.message}`);
        return [];
    }
}
const writeFile = async (filePath, data) => {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`File ${filePath} written successfully`);
    } catch (error) {
        console.log(`Error writing file ${filePath}: ${error.message}`);
    }
}

let expenses = await readFile('expense.json');
if (!Array.isArray(expenses)) { expenses = [] };

console.log(
    'Command line expense tracker:\n' +
    '  add --description <description> --amount <amount>\n' +
    '  delete --id <id>\n' +
    '  update <id> --description <description> --amount <amount>\n' +
    '  list\n' +
    '  summary\n' +
    '  summary --month <month>\n' +
    '  quit'
);;



const myArgs = process.argv.slice(2)
const action = myArgs[0]


const options = {}
for (let i = 0; i < myArgs.length; i++) {
    if (myArgs[i].startsWith('--')) {
        options[myArgs[i].replace('--', '')] = myArgs[i + 1] || null
    }
}

switch (action) {
    case 'add':
        const { description, amount } = options
        if (!description || !amount) {
            console.log('Error :  --description and --amount of expenses required')
            process.exit(1)
        }
        if (amount < 0) {
            console.log('Error : amount must be positive')
            process.exit(1)
        }
        const newExpense = {
            id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
            description: description,
            amount: parseFloat(amount),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        expenses.push(newExpense)
        await writeFile('expense.json', expenses)
        console.log('expenses added successfully')
        break;
    case 'list':
        if (expenses.length === 0) {
            console.log('No expenses recorded')
        } else {
            console.table(expenses)
        }
        break
    case 'delete':
        const { id } = options
        if (!id) {
            console.log('Error : --id of expenses required')
            process.exit(1)
        }
        const expenseIndex = expenses.findIndex(e => e.id === parseInt(id))
        if (expenseIndex === -1) {
            console.log(`Expense with id ${id} not found`)
            process.exit(1)
        }
        expenses.splice(expenseIndex, 1)
        await writeFile('expense.json', expenses)
        console.log(`Expense with id ${id} removed successfully`);
        break
    case 'update':
        const { id: updateId, description: updateDescription, amount: updateAmount } = options
        if (!updateId || !updateDescription || !updateAmount) {
            console.log('Error : --id, --description and --amount of expenses required')
            process.exit(1)
        }
        const expenseToUpdateIndex = expenses.findIndex(e => e.id === parseInt(updateId))
        if (expenseToUpdateIndex === -1) {
            console.log(`Expense with id ${id} not found`)
            process.exit(1)
        }
        if (updateDescription) { expenses[expenseToUpdateIndex].description = updateDescription; }
        if (updateAmount) { expenses[expenseToUpdateIndex].amount = parseFloat(updateAmount); }
        expenses[expenseToUpdateIndex].updatedAt = new Date().toISOString();
        await writeFile('expense.json', expenses)
        console.log(`Expense with id ${updateId} updated successfully`);
        break
    case 'summary':
        if (options.month) {
            const month = options.month.padStart(2, '0')
            const currentYear = new Date().getFullYear()
            const monthFormatted = `${currentYear}-${month}`

            const filteredExpenses = expenses.filter(e => e.createdAt.startsWith(monthFormatted))
            const totalExpense = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
            const monthName = new Date(`${currentYear}-${month}-01`).toLocaleString('en-US', { month: 'long' })
            console.log(`Total Expense for ${monthName}: $${totalExpense.toFixed(2)}`)
        } else {
            const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
            console.log(`Total Expense Amount : ${totalExpense.toFixed(2)}`)
        }
        break;
    default:
        console.log("❓ Invalid command . Use: add, update, remove, list, exit.");
}


