/* ==========================================================================
   Respawn Game House - script.js
   JavaScript usado só para melhorar a experiência. O site continua
   funcionando sem ele (menu aberto, painel estático, validação nativa).

   1. Menu responsivo (botão "Menu" no celular)
   2. Painel de estações da página inicial (simulação)
   3. Formulário de contato
      - assunto pré-selecionado pela URL (ex.: contato.html?assunto=torneio)
      - data mínima = hoje
      - contador de caracteres da mensagem
      - confirmação de envio (o site é estático e não envia dados de verdade)
   ========================================================================== */

document.documentElement.classList.add("js");

/* 1. Menu responsivo */
const botaoMenu = document.querySelector(".botao-menu");
const menu = document.querySelector(".menu");

if (botaoMenu && menu) {
  menu.dataset.aberto = "false";
  botaoMenu.addEventListener("click", function () {
    const aberto = botaoMenu.getAttribute("aria-expanded") === "true";
    botaoMenu.setAttribute("aria-expanded", String(!aberto));
    menu.dataset.aberto = String(!aberto);
  });
}

/* 2. Painel de estações (simulação de ocupação) */
const painel = document.querySelector("[data-painel]");

if (painel) {
  const estacoes = painel.querySelectorAll(".estacao[data-tipo='pc']");
  const contador = painel.querySelector("[data-livres]");
  const estados = ["estacao-livre", "estacao-ocupada", "estacao-reservada"];
  const nomes = { "estacao-livre": "livre", "estacao-ocupada": "ocupada", "estacao-reservada": "reservada" };
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function atualizarContador() {
    const livres = painel.querySelectorAll(".estacao[data-tipo='pc'].estacao-livre").length;
    contador.textContent = livres;
  }

  function trocarEstado(estacao, novoEstado) {
    estados.forEach(function (classe) {
      estacao.classList.remove(classe);
    });
    estacao.classList.add(novoEstado);
    // Texto escondido visualmente, lido por leitores de tela
    estacao.querySelector(".visualmente-oculto").textContent = " " + nomes[novoEstado];
  }

  // A cada 6 segundos uma estação aleatória muda de estado,
  // como no painel do balcão. Não roda se a pessoa pediu menos movimento.
  if (!reduzirMovimento && estacoes.length > 0) {
    setInterval(function () {
      const sorteada = estacoes[Math.floor(Math.random() * estacoes.length)];
      const proximo = sorteada.classList.contains("estacao-livre") ? "estacao-ocupada" : "estacao-livre";
      trocarEstado(sorteada, proximo);
      atualizarContador();
    }, 6000);
  }
}

/* 3. Formulário de contato */
const formulario = document.querySelector("#form-contato");

if (formulario) {
  const assunto = formulario.querySelector("#assunto");
  const data = formulario.querySelector("#data");
  const mensagem = formulario.querySelector("#mensagem");
  const contadorMensagem = formulario.querySelector("#contador-mensagem");
  const confirmacao = document.querySelector("#mensagem-envio");

  // Assunto vindo da URL (links "Inscrever meu time", "Reservar estação" etc.)
  const parametros = new URLSearchParams(window.location.search);
  const assuntoUrl = parametros.get("assunto");
  if (assuntoUrl && assunto.querySelector("option[value='" + assuntoUrl + "']")) {
    assunto.value = assuntoUrl;
  }

  // Data mínima = hoje (formato AAAA-MM-DD exigido pelo input date)
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  data.min = hoje.getFullYear() + "-" + mes + "-" + dia;

  // Contador de caracteres
  function atualizarCaracteres() {
    contadorMensagem.textContent = mensagem.value.length + " de " + mensagem.maxLength + " caracteres";
  }
  mensagem.addEventListener("input", atualizarCaracteres);
  atualizarCaracteres();

  // O evento submit só acontece se TODAS as validações nativas do HTML5 passarem.
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const nome = formulario.querySelector("#nome").value.trim().split(" ")[0];
    confirmacao.querySelector("[data-nome]").textContent = nome;
    confirmacao.hidden = false;
    confirmacao.focus();
    formulario.reset();
    atualizarCaracteres();
  });
}
