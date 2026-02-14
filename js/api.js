const OPENAI_KEY = "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";
const ALPHA_KEY = "6FDZYJZTWIX0TJL6";

export async function buscarSelic() {
  try {
    const res = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json");
    const dados = await res.json();
    return parseFloat(dados[dados.length - 1].valor);
  } catch {
    return 13.25; // valor padrão se API falhar
  }
}


export async function buscarCDI() {
  try {
    const res = await fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json");
    const dados = await res.json();
    return parseFloat(dados[dados.length - 1].valor);
  } catch {
    return 12.65;   
  }
}


export async function buscarIBOV() {
  const res = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=^BVSP&apikey=${ALPHA_KEY}`
  );
  const data = await res.json();
  const meses = data["Monthly Time Series"];
  const valores = Object.values(meses).slice(0, 12).map(m => parseFloat(m["4. close"]));
  return valores;
}



export async function gerarAnaliseIA(dadosTexto) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um consultor financeiro especialista." },
        { role: "user", content: dadosTexto }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
