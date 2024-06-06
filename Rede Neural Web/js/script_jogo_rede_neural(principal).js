// Coordenadas iniciais das civilizações
let civilization1X = 25;
let civilization1Y = 25;
let civilization2X = 475;
let civilization2Y = 475;

// Velocidade de movimento das civilizações (em pixels por segundo)
const speed = 100; // 10 pixels por segundo

// Força inicial das civilizações
let strength1 = 100;
let strength2 = 100;

// Variáveis de controle
let intervalId;
let isPaused = true;

// Dimensões do mapa
const mapSize = 500;

// Área segura central
const safeZoneSize = 100;
const safeZoneStart = (mapSize - safeZoneSize) / 2;
const safeZoneEnd = safeZoneStart + safeZoneSize;

// Atualizar a força inicial na interface
document.getElementById('red-strength').innerText = strength1;
document.getElementById('blue-strength').innerText = strength2;

// Função para gerar recursos aleatórios
function generateResource() {
    const x = Math.floor(Math.random() * (mapSize - 10));
    const y = Math.floor(Math.random() * (mapSize - 10));
    const resource = document.createElement('div');
    resource.classList.add('resource');
    resource.style.left = `${x}px`;
    resource.style.top = `${y}px`;
    document.getElementById('map').appendChild(resource);
}

// Gerar um recurso a cada 5 segundos
setInterval(() => {
    if (!isPaused) {
        generateResource();
    }
}, 5000);

// Movimento automático das civilizações
function startSimulation() {
    intervalId = setInterval(() => {
        if (!isPaused) {
            moveCivilization('civilization1', getStrategicMovement(civilization1X, civilization1Y, civilization2X, civilization2Y, strength1, strength2));
            moveCivilization('civilization2', getStrategicMovement(civilization2X, civilization2Y, civilization1X, civilization1Y, strength2, strength1));
            checkCombat();
            checkResourceCollection();
            calculateWinProbability();
        }
    }, 1000); // Movimento a cada segundo
}

// Função para obter movimento estratégico
function getStrategicMovement(x, y, targetX, targetY, ownStrength, enemyStrength) {
    let deltaX = Math.random() * speed * 2 - speed;
    let deltaY = Math.random() * speed * 2 - speed;

    if (isInSafeZone(x, y)) {
        if (ownStrength >= enemyStrength) {
            // Atacar dentro da área segura
            deltaX = (targetX - x) > 0 ? speed : -speed;
            deltaY = (targetY - y) > 0 ? speed : -speed;
        } else {
            // Recuar dentro da área segura
            deltaX = (targetX - x) > 0 ? -speed : speed;
            deltaY = (targetY - y) > 0 ? -speed : speed;
        }
    } else {
        if (ownStrength < enemyStrength) {
            // Recuar
            if (x < targetX) deltaX = -Math.abs(deltaX);
            else deltaX = Math.abs(deltaX);

            if (y < targetY) deltaY = -Math.abs(deltaY);
            else deltaY = Math.abs(deltaY);
        } else {
            // Avançar
            if (Math.abs(x - targetX) > Math.abs(y - targetY)) {
                if (x < targetX) deltaX = Math.abs(deltaX);
                else deltaX = -Math.abs(deltaX);
                deltaY = 0;
            } else {
                if (y < targetY) deltaY = Math.abs(deltaY);
                else deltaY = -Math.abs(deltaY);
                deltaX = 0;
            }
        }
    }

    // Garantir que a civilização permaneça dentro dos limites do mapa
    x = Math.min(480, Math.max(0, x + deltaX));
    y = Math.min(480, Math.max(0, y + deltaY));

    return { x, y };
}

// Função para verificar se está na área segura
function isInSafeZone(x, y) {
    return x >= safeZoneStart && x <= safeZoneEnd && y >= safeZoneStart && y <= safeZoneEnd;
}

// Função para mover uma civilização para as coordenadas especificadas
function moveCivilization(civilizationId, coords) {
    const civilization = document.getElementById(civilizationId);
    civilization.style.left = coords.x + 'px';
    civilization.style.top = coords.y + 'px';

    if (civilizationId === 'civilization1') {
        civilization1X = coords.x;
        civilization1Y = coords.y;
    } else {
        civilization2X = coords.x;
        civilization2Y = coords.y;
    }
    drawTerritory(coords.x, coords.y, civilization.classList[1]);
}

// Função para desenhar o território de uma civilização
function drawTerritory(x, y, color) {
    const territory = document.createElement('div');
    territory.classList.add('territory');
    territory.style.left = (x - 5) + 'px';
    territory.style.top = (y - 5) + 'px';
    territory.style.backgroundColor = color;
    document.getElementById('map').appendChild(territory);
}

// Função para calcular a probabilidade de vitória
function calculateWinProbability() {
    const redTerritory = document.querySelectorAll('.red').length;
    const blueTerritory = document.querySelectorAll('.blue').length;
    const totalTerritory = redTerritory + blueTerritory;

    const redProbability = (redTerritory / totalTerritory) * (strength1 / (strength1 + strength2));
    const blueProbability = (blueTerritory / totalTerritory) * (strength2 / (strength1 + strength2));

    document.getElementById('red-probability').innerText = (redProbability * 100).toFixed(2) + '%';
    document.getElementById('blue-probability').innerText = (blueProbability * 100).toFixed(2) + '%';
}

// Função para verificar combate
function checkCombat() {
    const distance = Math.sqrt(Math.pow(civilization1X - civilization2X, 2) + Math.pow(civilization1Y - civilization2Y, 2));
    if (distance < 20) {
        const result = Math.random();
        if (result < 0.5) {
            strength2 -= 10;
            console.log('Red wins this round!');
        } else {
            strength1 -= 10;
            console.log('Blue wins this round!');
        }
        updateStrengthDisplay();
        checkGameOver();
    }
}

// Função para verificar coleta de recursos
function checkResourceCollection() {
    const resources = document.querySelectorAll('.resource');
    resources.forEach(resource => {
        const resourceX = parseInt(resource.style.left, 10);
        const resourceY = parseInt(resource.style.top, 10);
        const distance1 = Math.sqrt(Math.pow(civilization1X - resourceX, 2) + Math.pow(civilization1Y - resourceY, 2));
        const distance2 = Math.sqrt(Math.pow(civilization2X - resourceX, 2) + Math.pow(civilization2Y - resourceY, 2));

        if (distance1 < 15) {
            strength1 += 10;
            resource.remove();
            console.log('Red collected a resource!');
        } else if (distance2 < 15) {
            strength2 += 10;
            resource.remove();
            console.log('Blue collected a resource!');
        }
        updateStrengthDisplay();
    });
}

// Função para atualizar a exibição da força das civilizações
function updateStrengthDisplay() {
    document.getElementById('red-strength').innerText = strength1;
    document.getElementById('blue-strength').innerText = strength2;
    document.getElementById('red-health-bar').style.width = strength1 + '%';
    document.getElementById('blue-health-bar').style.width = strength2 + '%';
}

// Função para verificar se o jogo acabou
function checkGameOver() {
    if (strength1 <= 0) {
        alert('Blue wins the war!');
        resetGame();
    } else if (strength2 <= 0) {
        alert('Red wins the war!');
        resetGame();
    }
}

// Função para resetar o jogo
function resetGame() {
    strength1 = 100;
    strength2 = 100;
    civilization1X = 25;
    civilization1Y = 25;
    civilization2X = 475;
    civilization2Y = 475;
    document.getElementById('map').innerHTML = `
        <div id="civilization1" class="civilization red"></div>
        <div id="civilization2" class="civilization blue"></div>
    `;
    updateStrengthDisplay();
}

// Controles do usuário
document.getElementById('start-btn').addEventListener('click', () => {
    isPaused = false;
    if (!intervalId) startSimulation();
});

document.getElementById('pause-btn').addEventListener('click', () => {
    isPaused = true;
});

document.getElementById('reset-btn').addEventListener('click', () => {
    isPaused = true;
    clearInterval(intervalId);
    intervalId = null;
    resetGame();
});

// Função para reparar gradualmente a força das civilizações ao longo do tempo
function repairStrength() {
    const repairRate = 1; // Taxa de reparo por segundo

    setInterval(() => {
        // Adicione aqui a lógica de reparo da força
    }, 1000);
}

// Função para verificar e corrigir a posição das civilizações próximas das bordas do mapa
function checkBorder(civX, civY) {
    const buffer = 20; // Margem de segurança para evitar sair do mapa

    if (civX < buffer) {
        civX = buffer;
    } else if (civX > mapSize - buffer) {
        civX = mapSize - buffer;
    }

    if (civY < buffer) {
        civY = buffer;
    } else if (civY > mapSize - buffer) {
        civY = mapSize - buffer;
    }

    return { x: civX, y: civY };
}

// Função para coordenar o ataque conjunto
function coordinateAttack(civ1X, civ1Y, civ2X, civ2Y, ownStrength, enemyStrength) {
    const distance = Math.sqrt(Math.pow(civ1X - civ2X, 2) + Math.pow(civ1Y - civ2Y, 2));
    const threshold = 50; // Distância mínima para iniciar um ataque conjunto

    if (distance < threshold && ownStrength > enemyStrength) {
        // Atacar em conjunto
        console.log('Coordinating attack!');
        // Adicione aqui a lógica de ataque conjunto
    }
}

// Função para lançar uma bola de fogo
function launchFireball(color) {
    const map = document.getElementById('map');
    const fireball = document.createElement('div');
    fireball.classList.add('fireball');

    let startX, startY;

    if (color === 'red') {
        startX = civilization1X;
        startY = civilization1Y;
    } else {
        startX = civilization2X;
        startY = civilization2Y;
    }

    fireball.style.left = startX + 'px';
    fireball.style.top = startY + 'px';
    map.appendChild(fireball);

    const targetX = Math.random() * 500;
    const targetY = Math.random() * 500;

    setTimeout(() => {
        fireball.style.left = targetX + 'px';
        fireball.style.top = targetY + 'px';

        setTimeout (() => {
            map.removeChild(fireball);
        }, 1000);
    }, 10);
}

