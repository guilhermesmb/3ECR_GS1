// Acessando o formulário
const formularioDespesa = document.getElementById('formularioDespesa');
// Acessando a lista de gastos
const listaDespesas = document.getElementById('listaDespesas');
// Acessando a seção de resumo de gastos
const totalDespesasSecao = document.getElementById('totalDespesas');
const analiseDespesasSecao = document.getElementById('analiseDespesas');
// Acessando a caixa de texto de busca/filtro
const inputFiltro = document.getElementById('inputFiltro');

// Evento de envio do formulário
formularioDespesa.addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtendo os valores dos campos
  const data = document.getElementById('data').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const categoria = document.getElementById('categoria').value;

  // Criando um objeto com os dados da despesa
  const despesa = {
    data: data,
    valor: valor,
    categoria: categoria
  };

  // Salvando a despesa no local storage
  salvarDespesa(despesa);

  // Limpando os campos do formulário
  formularioDespesa.reset();

  // Atualizando a lista de gastos e resumo
  atualizarListaDespesas();
  atualizarResumoDespesas();
});

// Função para salvar a despesa no local storage
function salvarDespesa(despesa) {
  let despesas = [];

  if (localStorage.getItem('despesas')) {
    despesas = JSON.parse(localStorage.getItem('despesas'));
  }

  despesas.push(despesa);
  localStorage.setItem('despesas', JSON.stringify(despesas));
}

// Função para atualizar a lista de gastos
function atualizarListaDespesas() {
  listaDespesas.innerHTML = '';

  if (localStorage.getItem('despesas')) {
    const despesas = JSON.parse(localStorage.getItem('despesas'));

    despesas.forEach((despesa, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>Data:</strong> ${despesa.data} |
        <strong>Valor:</strong> ${despesa.valor.toFixed(2)} |
        <strong>Categoria:</strong> ${despesa.categoria} |
        <button onclick="excluirDespesa(${index})">Excluir</button>
      `;

      listaDespesas.appendChild(listItem);
    });
  }
}

// Função para excluir uma despesa
function excluirDespesa(index) {
  let despesas = [];

  if (localStorage.getItem('despesas')) {
    despesas = JSON.parse(localStorage.getItem('despesas'));
  }

  despesas.splice(index, 1);
  localStorage.setItem('despesas', JSON.stringify(despesas));

  atualizarListaDespesas();
  atualizarResumoDespesas();
}

// Função para atualizar o resumo de gastos
function atualizarResumoDespesas() {
  if (localStorage.getItem('despesas')) {
    const despesas = JSON.parse(localStorage.getItem('despesas'));

    if (despesas.length > 0) {
      // Total das despesas
      const total = despesas.reduce((soma, despesa) => soma + despesa.valor, 0);
      totalDespesasSecao.innerHTML = `<strong>Total de Despesas:</strong> R$ ${total.toFixed(2)}`;

      // Análise de consumo
      const media = total / despesas.length;
      const maiorDespesa = Math.max(...despesas.map(despesa => despesa.valor));
      const menorDespesa = Math.min(...despesas.map(despesa => despesa.valor));

      analiseDespesasSecao.innerHTML = `
        <strong>Média de Despesas:</strong> R$ ${media.toFixed(2)} |
        <strong>Maior Despesa:</strong> R$ ${maiorDespesa.toFixed(2)} |
        <strong>Menor Despesa:</strong> R$ ${menorDespesa.toFixed(2)}
      `;
    } else {
      // Não há despesas registradas
      totalDespesasSecao.innerHTML = '<strong>Total de Despesas:</strong> R$ 0.00';
      analiseDespesasSecao.innerHTML = 'Não há despesas registradas.';
    }
  } else {
    // Não há despesas registradas
    totalDespesasSecao.innerHTML = '';
    analiseDespesasSecao.innerHTML = 'Não há despesas registradas.';
  }
}

// Função para buscar/filtrar despesas
function filtrarDespesas() {
  const termoFiltro = inputFiltro.value.toLowerCase();

  if (localStorage.getItem('despesas')) {
    const despesas = JSON.parse(localStorage.getItem('despesas'));

    const despesasFiltradas = despesas.filter(despesa =>
      despesa.data.toLowerCase().includes(termoFiltro) ||
      despesa.valor.toString().includes(termoFiltro) ||
      despesa.categoria.toLowerCase().includes(termoFiltro)
    );

    listaDespesas.innerHTML = '';

    despesasFiltradas.forEach((despesa, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>Data:</strong> ${despesa.data} |
        <strong>Valor:</strong> ${despesa.valor.toFixed(2)} |
        <strong>Categoria:</strong> ${despesa.categoria} |
        <button onclick="excluirDespesa(${index})">Excluir</button>
      `;

      listaDespesas.appendChild(listItem);
    });
  }
}

// Evento de digitação na caixa de texto de busca/filtro
inputFiltro.addEventListener('keyup', filtrarDespesas);

// Atualizar a lista de gastos, resumo e filtrar quando a página carregar
atualizarListaDespesas();
atualizarResumoDespesas();
filtrarDespesas();
