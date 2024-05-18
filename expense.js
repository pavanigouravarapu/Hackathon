let expenses = [];

function addExpense() {
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }

  const expense = {
    amount,
    category,
    date
  };

  expenses.push(expense);
  displayExpenses();
}

function displayExpenses() {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';

  expenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td><button onclick="editExpense(${index})">Edit</button></td>
      <td><button onclick="deleteExpense(${index})">Delete</button></td>
    `;
    expenseList.appendChild(row);
  });
}

function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('amount').value = expense.amount;
  document.getElementById('category').value = expense.category;
  document.getElementById('date').value = expense.date;
  
  expenses.splice(index, 1);
  displayExpenses();

  const submitButton = document.querySelector('#expenseForm button');
  submitButton.textContent = 'Save Changes';
  submitButton.removeEventListener('click', addExpense);
  submitButton.addEventListener('click', function() {
    saveChanges(index);
  });
}

function saveChanges(index) {
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }

  const updatedExpense = {
    amount,
    category,
    date
  };

  expenses.splice(index, 0, updatedExpense);
  displayExpenses();

  document.getElementById('expenseForm').reset();
  const submitButton = document.querySelector('#expenseForm button');
  submitButton.textContent = 'Add Expense';
  submitButton.removeEventListener('click', saveChanges);
  submitButton.addEventListener('click', addExpense);
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  displayExpenses();
}