// Select elements
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const monthFilter = document.getElementById("month-filter");
const exportExcelBtn = document.getElementById("export-excel");

// Load transactions from Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Function to calculate income, expense, and balance
function calculateBalances(filteredTransactions = transactions) {
    let totalIncome = 0, totalExpense = 0;

    filteredTransactions.forEach(transaction => {
        if (isIncomeCategory(transaction.category)) {
            totalIncome += transaction.amount;
        } else {
            totalExpense += Math.abs(transaction.amount);
        }
    });

    return {
        totalIncome,
        totalExpense,
        totalBalance: totalIncome - totalExpense
    };
}

// Function to check if the category is income-related
function isIncomeCategory(category) {
    return ["Salary", "Rent", "Freelance", "Investment"].includes(category);
}

// Function to update UI
function updateUI(filteredTransactions = transactions) {
    transactionList.innerHTML = "";
    
    const { totalIncome, totalExpense, totalBalance } = calculateBalances(filteredTransactions);

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${transaction.category}</strong>: ${transaction.description} 
                        <span>${transaction.amount > 0 ? "+" : "-"}₹${Math.abs(transaction.amount)}</span>
                        <em>(${transaction.date})</em>
                        <button onclick="deleteTransaction(${index})">X</button>`;
        li.style.borderLeftColor = isIncomeCategory(transaction.category) ? "green" : "red";
        transactionList.appendChild(li);
    });

    balance.textContent = `₹${totalBalance}`;
    income.textContent = `₹${totalIncome}`;
    expense.textContent = `₹${totalExpense}`;

    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to add transaction
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!description.value || !amount.value || !date.value) {
        alert("Please fill in all fields.");
        return;
    }

    const transaction = {
        description: description.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value,
    };

    transactions.push(transaction);
    description.value = "";
    amount.value = "";
    category.value = "Income";
    date.value = "";
    updateUI();
});

// Function to delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// Function to filter transactions by month
function filterByMonth() {
    const selectedMonth = monthFilter.value;
    if (!selectedMonth) {
        updateUI();
        return;
    }
    const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));
    updateUI(filteredTransactions);
}

// Function to export transactions to Excel
exportExcelBtn.addEventListener("click", () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "Expense_Tracker.xlsx");
});

// Initialize app
updateUI();
