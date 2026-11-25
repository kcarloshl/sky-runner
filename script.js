
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startButton");

// Configurações do avião
const aviao = {
    x: 100,
    y: 180,
    largura: 45,
    altura: 35,
    velocidade: 5
};

// Controles do teclado
const teclas = {
    cima: false,
    baixo: false
};

// Variáveis do jogo
let obstaculos = [];
let pontuacao = 0;
let frames = 0;
let jogando = false;

// Evento: pressionar uma tecla
document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowUp") {
        teclas.cima = true;
        event.preventDefault();
    }

    if (event.key === "ArrowDown") {
        teclas.baixo = true;
        event.preventDefault();
    }

});

// Evento: soltar uma tecla
document.addEventListener("keyup", (event) => {

    if (event.key === "ArrowUp") {
        teclas.cima = false;
    }

    if (event.key === "ArrowDown") {
        teclas.baixo = false;
    }

});

// Desenhar o avião

function desenharAviao() {

    ctx.save();

    // Corpo do avião
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.ellipse(
        aviao.x + 23,
        aviao.y + 17,
        24,
        9,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Nariz do avião
    ctx.fillStyle = "#1e40af";
    ctx.beginPath();
    ctx.moveTo(aviao.x + 42, aviao.y + 10);
    ctx.lineTo(aviao.x + 55, aviao.y + 17);
    ctx.lineTo(aviao.x + 42, aviao.y + 24);
    ctx.fill();

    // Asa principal
    ctx.fillStyle = "#93c5fd";
    ctx.beginPath();
    ctx.moveTo(aviao.x + 15, aviao.y + 15);
    ctx.lineTo(aviao.x + 27, aviao.y - 5);
    ctx.lineTo(aviao.x + 34, aviao.y + 15);
    ctx.fill();

    // Asa inferior
    ctx.beginPath();
    ctx.moveTo(aviao.x + 15, aviao.y + 19);
    ctx.lineTo(aviao.x + 27, aviao.y + 38);
    ctx.lineTo(aviao.x + 34, aviao.y + 19);
    ctx.fill();

    // Cauda
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath();
    ctx.moveTo(aviao.x + 4, aviao.y + 14);
    ctx.lineTo(aviao.x + 12, aviao.y + 3);
    ctx.lineTo(aviao.x + 15, aviao.y + 17);
    ctx.fill();

    // Janela do piloto
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.ellipse(
        aviao.x + 35,
        aviao.y + 13,
        5,
        3,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}


// Movimentar o avião
function moverAviao() {

    if (teclas.cima) {
        aviao.y -= aviao.velocidade;
    }

    if (teclas.baixo) {
        aviao.y += aviao.velocidade;
    }

    // Impedir que o avião saia da tela
    aviao.y = Math.max(0, Math.min(
        canvas.height - aviao.altura,
        aviao.y
    ));
}

// Criar obstáculos
function criarObstaculo() {

    const altura = Math.random() * 180 + 80;

    obstaculos.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - altura),
        largura: 45,
        altura: altura
    });
}


// Desenhar e movimentar obstáculos
function atualizarObstaculos() {

    const velocidade = Math.min(
        2 + (pontuacao * 0.03),
        6
    );

    obstaculos.forEach((obstaculo) => {

        obstaculo.x -= velocidade;

        // Desenhar obstáculo
        ctx.fillStyle = "#166534";
        ctx.fillRect(
            obstaculo.x,
            obstaculo.y,
            obstaculo.largura,
            obstaculo.altura
        );

    });

    obstaculos = obstaculos.filter(
        obstaculo => obstaculo.x + obstaculo.largura > 0
    );
}


// Verificar colisões
function verificarColisao() {

    const aviaoArea = {
        x: aviao.x + 8,
        y: aviao.y + 5,
        largura: 30,
        altura: 25
    };

    for (const obstaculo of obstaculos) {

        if (
            aviaoArea.x < obstaculo.x + obstaculo.largura &&
            aviaoArea.x + aviaoArea.largura > obstaculo.x &&
            aviaoArea.y < obstaculo.y + obstaculo.altura &&
            aviaoArea.y + aviaoArea.altura > obstaculo.y
        ) {
            jogando = false;
            startButton.textContent = "Jogar novamente";
        }
    }
}

// Atualizar pontuação
function atualizarPontuacao() {

    frames++;

    if (frames % 10 === 0) {
        pontuacao++;
        scoreElement.textContent = pontuacao;
    }
}

// Criar nuvens
let nuvens = [
    { x: 150, y: 70, velocidade: 1 },
    { x: 400, y: 150, velocidade: 1.5 },
    { x: 650, y: 90, velocidade: 1.2 }
];

function desenharNuvens() {

    nuvens.forEach(nuvem => {

        nuvem.x -= nuvem.velocidade;

        if (nuvem.x < -60) {
            nuvem.x = canvas.width + 60;
        }

        ctx.fillStyle = "rgba(255,255,255,0.8)";

        ctx.beginPath();
        ctx.arc(nuvem.x, nuvem.y, 18, 0, Math.PI * 2);
        ctx.arc(nuvem.x + 20, nuvem.y - 10, 22, 0, Math.PI * 2);
        ctx.arc(nuvem.x + 40, nuvem.y, 18, 0, Math.PI * 2);
        ctx.fill();

    });
}


// Loop principal do jogo
function jogo() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharNuvens();

    if (jogando) {

        moverAviao();

        desenharAviao();

        let intervalo = Math.max(
            65,
            100 - Math.floor(pontuacao / 10) * 3
        );

        if (frames % intervalo === 0) {
            criarObstaculo();
        }

        atualizarObstaculos();

        verificarColisao();

        atualizarPontuacao();

    } else {

        desenharAviao();

        if (pontuacao > 0) {

            ctx.fillStyle = "#dc2626";
            ctx.font = "bold 35px Arial";
            ctx.textAlign = "center";

            ctx.fillText(
                "FIM DE JOGO!",
                canvas.width / 2,
                canvas.height / 2
            );

            ctx.textAlign = "left";
        }
    }

    requestAnimationFrame(jogo);
}

// Evento: clicar no botão de iniciar
startButton.addEventListener("click", () => {

    aviao.y = 180;
    obstaculos = [];
    pontuacao = 0;
    frames = 0;

    teclas.cima = false;
    teclas.baixo = false;

    scoreElement.textContent = pontuacao;

    jogando = true;

    startButton.textContent = "Reiniciar";

});

// Iniciar o loop
jogo();
