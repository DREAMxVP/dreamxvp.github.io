import { simularTodos, crescimentoMensal } from "./analysis.js";
import { 
  atualizarGraficoInvestimentos, 
  atualizarGraficoMensal 
} from "./charts.js";

const valorInput = document.getElementById("valorInvestimento");
const mesesInput = document.getElementById("mesesInvestimento");
const resultadoContainer = document.getElementById("resultadoInvestimentos");

// Atualiza automaticamente ao digitar
valorInput.addEventListener("input", atualizarAutomatico);
mesesInput.addEventListener("input", atualizarAutomatico);

// Atualização principal
function atualizarAutomatico() {

  const valor = parseFloat(valorInput.value);
  const meses = parseInt(mesesInput.value);

  if (!valor || valor <= 0 || !meses || meses <= 0) {
    resultadoContainer.innerHTML = "";
    return;
  }

  // 🔥 Simula todos investimentos
  const resultados = simularTodos(valor, meses);

  // 🔥 Cria tabela ranking
  criarTabelaRanking(resultados);

  // 🔥 Atualiza gráfico lateral principal
  atualizarGraficoInvestimentos(resultados);

  // 🔥 Crescimento mês a mês do melhor investimento
  const melhor = resultados[0];
  const historico = crescimentoMensal(valor, melhor.taxa, meses);

  atualizarGraficoMensal(historico);
}


// 🔥 TABELA PROFISSIONAL
function criarTabelaRanking(resultados) {

  resultadoContainer.innerHTML = `
    <table>
      <tr>
        <th>#</th>
        <th>Investimento</th>
        <th>Taxa</th>
        <th>Total Final</th>
        <th>Lucro</th>
      </tr>

      ${resultados.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${i === 0 ? "🏆" : ""} ${r.nome}</td>
          <td>${r.taxa}%</td>
          <td>R$ ${r.total.toFixed(2)}</td>
          <td>R$ ${r.lucro.toFixed(2)}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

const ativosFake = [
  { nome: "PETR4", variacao: -2.55 },
  { nome: "ITSA4", variacao: -2.20 },
  { nome: "BBAS3", variacao: 4.50 },
  { nome: "MGLU3", variacao: -8.56 },
  { nome: "VALE3", variacao: -0.95 }
];

function carregarWatchlist() {
  const lista = document.getElementById("listaAtivos");
  lista.innerHTML = "";

  ativosFake.forEach(ativo => {
    const div = document.createElement("div");
    div.classList.add("watchItem");

    const cor = ativo.variacao > 0 ? "#00ff9d" : "#ff4d6d";

    div.innerHTML = `
      <div>
        <strong>${ativo.nome}</strong>
      </div>
      <span style="color:${cor}">
        ${ativo.variacao > 0 ? "+" : ""}${ativo.variacao}%
      </span>
    `;

    lista.appendChild(div);
  });
}

carregarWatchlist();

const API_KEY = "6FDZYJZTWIX0TJL6";

async function atualizarIndice(simbolo, elementoId) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${simbolo}&apikey=${API_KEY}`
    );

    const data = await response.json();
    const quote = data["Global Quote"];

    if (!quote) return;

    const variacao = parseFloat(quote["10. change percent"].replace("%",""));
    const preco = parseFloat(quote["05. price"]);

    const elemento = document.getElementById(elementoId);

    elemento.innerHTML = `
      <strong>${simbolo}</strong>
      <span style="color:${variacao > 0 ? "#00ff9d" : "#ff4d6d"}">
        ${variacao > 0 ? "+" : ""}${variacao.toFixed(2)}%
      </span>
    `;

  } catch (erro) {
    console.log("Erro ao atualizar índice:", erro);
  }
}

// Atualiza a cada 30 segundos
setInterval(() => {
  atualizarIndice("PETR4.SAO", "indice1");
}, 30000);

async function atualizarDolar() {
  const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
  const data = await response.json();

  const valor = parseFloat(data.USDBRL.bid);
  const variacao = parseFloat(data.USDBRL.pctChange);

  document.getElementById("dolar").innerHTML = `
    💵 Dólar: R$ ${valor.toFixed(2)} 
    <span style="color:${variacao > 0 ? "#00ff9d" : "#ff4d6d"}">
      ${variacao > 0 ? "+" : ""}${variacao.toFixed(2)}%
    </span>
  `;
}

async function atualizarIBOV() {
  const response = await fetch(
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EBVSP"
  );

  const data = await response.json();
  const resultado = data.quoteResponse.result[0];

  const valor = resultado.regularMarketPrice;
  const variacao = resultado.regularMarketChangePercent;

  document.getElementById("ibov").innerHTML = `
    📈 IBOV: ${valor.toLocaleString("pt-BR")}
    <span style="color:${variacao > 0 ? "#00ff9d" : "#ff4d6d"}">
      ${variacao > 0 ? "+" : ""}${variacao.toFixed(2)}%
    </span>
  `;
}

async function atualizarCDI() {
  const response = await fetch(
    "https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json"
  );

  const data = await response.json();
  const ultimo = data[data.length - 1];

  document.getElementById("cdi").innerHTML = `
    💰 CDI (último valor): ${parseFloat(ultimo.valor).toFixed(2)}%
  `;
}

async function atualizarIndices() {
  await atualizarDolar();
  await atualizarIBOV();
  await atualizarCDI();
}

// Atualiza ao carregar
atualizarIndices();

// Atualiza automaticamente a cada 30 segundos
setInterval(atualizarIndices, 30000);
