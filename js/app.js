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

    const variacao = parseFloat(quote["10. change percent"].replace("%", ""));
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

document.getElementById("calcularMilhao").addEventListener("click", () => {

  const valorInicial = parseFloat(document.getElementById("valorInicial").value) || 0;
  const valorMensal = parseFloat(document.getElementById("valorMensal").value) || 0;
  const taxaAnual = parseFloat(document.getElementById("taxaJuros").value) / 100;

  const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

  let total = valorInicial;
  let meses = 0;

  while (total < 1000000) {
    total = total * (1 + taxaMensal) + valorMensal;
    meses++;

    if (meses > 1000) break; // segurança
  }

  const anos = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;

  document.getElementById("resultadoMilhao").innerHTML = `
    <h3>📊 Resultado</h3>
    <p>Você atingirá R$ 1.000.000 em:</p>
    <strong>${anos} anos e ${mesesRestantes} meses</strong>
    <p>Total acumulado: R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
  `;

});

let graficoMilhao;

document.getElementById("calcularMilhao").addEventListener("click", () => {

  const valorInicial = parseFloat(document.getElementById("valorInicial").value) || 0;
  const valorMensal = parseFloat(document.getElementById("valorMensal").value) || 0;
  const taxaAnual = parseFloat(document.getElementById("taxaJuros").value) / 100;

  const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;

  let total = valorInicial;
  let meses = 0;

  let dados = [];
  let labels = [];

  while (total < 1000000) {
    total = total * (1 + taxaMensal) + valorMensal;
    meses++;

    dados.push(total);
    labels.push(`Mês ${meses}`);

    if (meses > 1000) break;
  }

  const anos = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;

  document.getElementById("resultadoMilhao").innerHTML = `
    <h3>📊 Resultado</h3>
    <p>Você atingirá R$ 1.000.000 em:</p>
    <strong>${anos} anos e ${mesesRestantes} meses</strong>
  `;

  criarGraficoMilhao(labels, dados);
});


function criarGraficoMilhao(labels, dados) {

  const ctx = document.getElementById("graficoMilhao").getContext("2d");

  if (graficoMilhao) {
    graficoMilhao.destroy();
  }

  graficoMilhao = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Crescimento do Investimento",
          data: dados,
          borderColor: "#a259ff",
          backgroundColor: "rgba(162,89,255,0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 0
        },
        {
          label: "Meta 1 Milhão",
          data: Array(labels.length).fill(1000000),
          borderColor: "#00ff9d",
          borderDash: [5,5],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 2000
      },
      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#aaa" }
        },
        y: {
          ticks: {
            color: "#aaa",
            callback: function(value) {
              return "R$ " + value.toLocaleString("pt-BR");
            }
          }
        }
      }
    }
  });
}
