let graficoPrincipal;
let graficoMensal;

export function atualizarGraficoInvestimentos(resultados) {
  const ctx = document.getElementById("graficoInvestimentos");

  if (graficoPrincipal) graficoPrincipal.destroy();

  const cores = resultados.map((r, i) =>
    i === 0 ? "#a259ff" : "#3a3a55"
  );

  graficoPrincipal = new Chart(ctx, {
    type: "bar",
    data: {
      labels: resultados.map(r => r.nome),
      datasets: [{
        label: "Total Final",
        data: resultados.map(r => r.total),
        backgroundColor: cores
      }]
    },
    options: {
      animation: {
        duration: 1200,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

export function atualizarGraficoMensal(dadosMeses) {
  const ctx = document.getElementById("graficoRapido");

  if (graficoMensal) graficoMensal.destroy();

  graficoMensal = new Chart(ctx, {
    type: "line",
    data: {
      labels: dadosMeses.map((_, i) => `Mês ${i + 1}`),
      datasets: [{
        label: "Crescimento Mensal",
        data: dadosMeses,
        borderColor: "#a259ff",
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      animation: {
        duration: 1500
      }
    }
  });
}
