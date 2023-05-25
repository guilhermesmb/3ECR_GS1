// Acessando o formulário
const expenseForm = document.getElementById('expenseForm');
// Acessando a lista de gastos
const expenseList = document.getElementById('expenseList');
// Acessando a seção de resumo de gastos
const totalExpenseSection = document.getElementById('totalExpense');
const expenseAnalysisSection = document.getElementById('expenseAnalysis');
// Acessando a caixa de texto de busca/filtro
const filterInput = document.getElementById('filterInput');

// Evento de envio do formulário
expenseForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtendo os valores dos campos
  const date = document.getElementById('date').value;
  const value = document.getElementById('value').value;
  const category = document.getElementById('category').value;

  // Criando um objeto com os dados da despesa
  const expense = {
    date: date,
    value: value,
    category: category
  };

  // Salvando a despesa no local storage
  saveExpense(expense);

  // Limpando os campos do formulário
  expenseForm.reset();

  // Atualizando a lista de gastos e resumo
  updateExpenseList();
  updateExpenseSummary();
});

// Função para salvar a despesa no local storage
function saveExpense(expense) {
  let expenses = [];

  if (localStorage.getItem('expenses')) {
    expenses = JSON.parse(localStorage.getItem('expenses'));
  }

  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Função para atualizar a lista de gastos
function updateExpenseList() {
  expenseList.innerHTML = '';

  if (localStorage.getItem('expenses')) {
    const expenses = JSON.parse(localStorage.getItem('expenses'));

    expenses.forEach((expense, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>Data:</strong> ${expense.date} |
        <strong>Valor:</strong> ${expense.value} |
        <strong>Categoria:</strong> ${expense.category} |
        <button onclick="deleteExpense(${index})">Excluir</button>
      `;

      expenseList.appendChild(listItem);
    });
  }
}

// Função para excluir um gasto
function deleteExpense(index) {
  let expenses = [];

  if (localStorage.getItem('expenses')) {
    expenses = JSON.parse(localStorage.getItem('expenses'));
  }

  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  updateExpenseList();
  updateExpenseSummary();
}

// Função para atualizar o resumo de gastos
function updateExpenseSummary() {
  if (localStorage.getItem('expenses')) {
    const expenses = JSON.parse(localStorage.getItem('expenses'));

    // Total dos gastos
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.value), 0);
    totalExpenseSection.innerHTML = `<strong>Total de Gastos:</strong> R$ ${total.toFixed(2)}`;

    // Análise de consumo
    const average = total / expenses.length;
    const highestExpense = Math.max(...expenses.map(expense => parseFloat(expense.value)));
    const lowestExpense = Math.min(...expenses.map(expense => parseFloat(expense.value)));

    expenseAnalysisSection.innerHTML = `
      <strong>Média de Gastos:</strong> R$ ${average.toFixed(2)} |
      <strong>Maior Gasto:</strong> R$ ${highestExpense.toFixed(2)} |
      <strong>Menor Gasto:</strong> R$ ${lowestExpense.toFixed(2)}
    `;
  } else {
    totalExpenseSection.innerHTML = '';
    expenseAnalysisSection.innerHTML = '';
  }
}

// Função para buscar/filtrar gastos
function filterExpenses() {
  const filterTerm = filterInput.value.toLowerCase();

  if (localStorage.getItem('expenses')) {
    const expenses = JSON.parse(localStorage.getItem('expenses'));

    const filteredExpenses = expenses.filter(expense =>
      expense.date.toLowerCase().includes(filterTerm) ||
      expense.value.toLowerCase().includes(filterTerm) ||
      expense.category.toLowerCase().includes(filterTerm)
    );

    expenseList.innerHTML = '';

    filteredExpenses.forEach((expense, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>Data:</strong> ${expense.date} |
        <strong>Valor:</strong> ${expense.value} |
        <strong>Categoria:</strong> ${expense.category} |
        <button onclick="deleteExpense(${index})">Excluir</button>
      `;

      expenseList.appendChild(listItem);
    });
  }
}

// Evento de digitação na caixa de texto de busca/filtro
filterInput.addEventListener('keyup', filterExpenses);

// Atualizar a lista de gastos, resumo e filtrar quando a página carregar
updateExpenseList();
updateExpenseSummary();
filterExpenses();
