
# Simulação de Civilizações (sujeito a atualizações frequentes)

## Descrição

Este projeto é uma simulação de duas civilizações que se movem automaticamente em um mapa, lutam por territórios, coletam recursos e engajam em combates. A civilização que conquistar mais territórios e derrotar o oponente será a vencedora.

## Funcionalidades

- **Movimento Automático**: As civilizações se movem automaticamente pelo mapa com base em estratégias.
- **Coleta de Recursos**: Recursos aparecem aleatoriamente no mapa e podem ser coletados para aumentar a força das civilizações.
- **Combate**: Quando as civilizações se encontram, elas engajam em combate, reduzindo a força uma da outra.
- **Territórios**: As civilizações deixam um rastro de sua cor enquanto se movem, indicando os territórios conquistados.
- **Probabilidade de Vitória**: A probabilidade de vitória de cada civilização é calculada em tempo real com base no território e força.

## Tecnologias Utilizadas

- **HTML**: Estrutura da página.
- **CSS**: Estilização dos elementos.
- **JavaScript**: Lógica da simulação e interatividade.

## Como Usar

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/simulacao-civilizacoes.git
    ```
2. **Abra o arquivo `index.html`** em um navegador web.
3. **Inicie a simulação** clicando no botão "Start".

## Estrutura do Projeto

- `index.html`: Contém a estrutura básica da página.
- `styles.css`: Contém a estilização da página.
- `script.js`: Contém a lógica da simulação.

## Código JavaScript

### Coordenadas iniciais das civilizações

```javascript
let civilization1X = 25;
let civilization1Y = 25;
let civilization2X = 475;
let civilization2Y = 475;
```
## Velocidade de movimento das civilizaçoes ( em pixels por segundo )


``` javascript 
const speed = 100;
```

## Força inicila das Civilizaçoes

``` javascript
let strength1 = 100;
let strength2 = 100;
```

## Variaveis de controle 

``` javascript 
let intervalID;
let isPause = true;
```

## Dimensoes do mapa 

``` javascript
const safeZoneSize = 100;
const safeZoneStart = (mapSize - safeZoneSize) / 2;
const safeZoneEnd = safeZoneStart + safeZoneSize;
```

## Atualizar a força inicial na interface 

``` javascript 
document.getElementById('red-strength').innerText = strength1;
document.getElementById('blue-strength').innerText = strength2;
```

## Funçoes para gerar recursos aleatorios

``` javascript 
function generateResource() {
    const x = Math.floor(Math.random() * (mapSize - 10));
    const y = Math.floor(Math.random() * (mapSize - 10));
    const resource = document.createElement('div');
    resource.classList.add('resource');
    resource.style.left = `${x}px`;
    resource.style.top = `${y}px`;
    document.getElementById('map').appendChild(resource);
}
```

## Gerar um recurso a cada 5 segundos 

``` javascript
setInterval(() => {
    if (!isPaused) {
        generateResource();
    }
}, 5000);
```

## Movimento automatico das civilizaçoes 

``` javascript
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
```
## Funçao para obter movimento estrategico 

``` javascript
function getStrategicMovement(x, y, targetX, targetY, ownStrength, enemyStrength) {
    let deltaX = Math.random() * speed * 2 - speed;
    let deltaY = Math.random() * speed * 2 - speed;

    if (isInSafeZone(x, y)) {
        if (ownStrength >= enemyStrength) {
            deltaX = (targetX - x) > 0 ? speed : -speed;
            deltaY = (targetY - y) > 0 ? speed : -speed;
        } else {
            deltaX = (targetX - x) > 0 ? -speed : speed;
            deltaY = (targetY - y) > 0 ? -speed : speed;
        }
    } else {
        if (ownStrength < enemyStrength) {
            if (x < targetX) deltaX = -Math.abs(deltaX);
            else deltaX = Math.abs(deltaX);

            if (y < targetY) deltaY = -Math.abs(deltaY);
            else deltaY = Math.abs(deltaY);
        } else {
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

    x = Math.min(480, Math.max(0, x + deltaX));
    y = Math.min(480, Math.max(0, y + deltaY));

    return { x, y };
}
```

## Funçao para verificar se esta na area segura 

``` javascript 
function isInSafeZone(x, y) {
    return x >= safeZoneStart && x <= safeZoneEnd && y >= safeZoneStart && y <= safeZoneEnd;
}
```

## Funçao para mover uma civilizaçao para as coordenadas especificas 

``` javascript
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
```

## LICENÇA 

Copyright Kazuha @
