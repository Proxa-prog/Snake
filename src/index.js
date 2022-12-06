const gameField = document.querySelector('.gameField');
const cellArray = document.querySelectorAll('.cell');
const scoreBlock = document.querySelector('.scoreBlock');
const span = document.createElement('span');
const scoreLabel = document.createElement('label');
const buttonStart = document.querySelector('.buttonStart');
const buttonPause = document.querySelector('.buttonPause');
const tbody = document.querySelector('tbody');

const startCell = 16;
const zeroCount = 0;
const zeroCellCount = 0;
const firstCellCount = 1;
const fieldLength = 32;
const firstX = 1;
const firstY = 1;
const firstCount = 1;
const numberOfCells = 1024;
const numberOfFruits = 3;
const moveTime = 100;
const timeInterval = 1000;
const headSubtract1 = 1;
const headSubtract2 = 2;

let direction = "down";
let score = 0;
let interval;
let startCount = 0;
let isStart = false;
let isReset = false;
let isPause = false;
let time = new Date(0).getMilliseconds();

let snakeConfig = {
    x: startCell,
    y: startCell,
}

let snake = [];
let fruits = [];
let result = [];

span.classList.add('score');
span.innerText = score;
scoreLabel.classList.add('scoreLabel');
scoreLabel.innerText = 'score: ';
scoreBlock.appendChild(scoreLabel);
scoreBlock.appendChild(span);

buttonStart.addEventListener('click', () => {
    buttonStart.textContent = 'Reset';
    isStart = !isStart;
    isStart && (startCount === zeroCount) && startGame();
    isReset && (startCount === firstCount) && restartGame();
    isReset = true;
    startCount = 1;
});

buttonPause.addEventListener('click', () => {
    isPause = !isPause;
});


function setResult() {
    const currentResult = {
        score: score,
        time: time,
    }

    window.localStorage.setItem('result', JSON.stringify(currentResult)); 
}

// Запустить игру

function startGame() {
    for (let i = 0; i < numberOfCells; i++) {
        createCell();
        setCellAttribute();
    }
    
    while(fruits.length < numberOfFruits) {
        createFruit();
    }

    
    createSnake();
    interval = setInterval(() => {
        !isPause && move();
    }, moveTime);

    setInterval(() => {
        time++;
    }, timeInterval);

    const results = JSON.parse(window.localStorage.getItem('result'));

    if (results) {
        const tr = document.createElement('tr');
        const timeResult = document.createElement('td');
        const scoreResult = document.createElement('td');
        timeResult.textContent = results.time;
        scoreResult.textContent = results.score;
        tr.appendChild(timeResult);
        tr.appendChild(scoreResult);
        tbody.appendChild(tr);
    }
}


// Создать игровое поле

function createCell() {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    gameField.appendChild(cell);
}


// Добавить координаты ячейкам

function setCellAttribute() {
    const cellArray = document.querySelectorAll('.cell');

    let count = zeroCellCount;
    let x = firstX;
    let y = firstY;

    for (let i = 0; i < cellArray.length; i++) {
        count++;

        if (count > fieldLength) {
            y++;
            x = firstX;
            count = firstCellCount;
        }
        cellArray[i].setAttribute('posX', x++);
        cellArray[i].setAttribute('posY', y);
    }
}


// Создать змею

function createSnake() {
    const headPosition = document.querySelector(`[posX="${snakeConfig.x}"][posY="${snakeConfig.y}"]`);
    const bodyPosition = document.querySelector(`[posX="${snakeConfig.x}"][posY="${snakeConfig.y - headSubtract1}"]`);
    const bodyPosition2 = document.querySelector(`[posX="${snakeConfig.x}"][posY="${snakeConfig.y - headSubtract2}"]`);
    snake.push(headPosition);
    snake.push(bodyPosition);
    snake.push(bodyPosition2);

    snake.forEach((item, index) => {
        item.classList.add('snakeBody');

        if (index === 0) {
            item.classList.add('snakeHead');
        }
    })
};


// Поедание фрукта

function eatFruit(snakeCoordinates) {
    for (let i = 0; i < fruits.length; i++) {
        if (snakeCoordinates[0] === fruits[i].getAttribute('posX')
        && snakeCoordinates[1] === fruits[i].getAttribute('posY')) {
            const bodyPosition = document.createElement('div');
            bodyPosition.classList.add('snakeBody');
            snake.push(bodyPosition);
            score++;
            span.innerText = score;
            const fruitPosition = document.querySelector(`[posX="${fruits[i].getAttribute('posX')}"][posY="${fruits[i].getAttribute('posY')}"]`);
            fruitPosition.classList.remove('fruit');
            fruits.splice(i, 1);
            createFruit();
            setResult()
        }
    }
}


// Перезапуск игры

function restartGame() {
    if (isReset) {
        for (let j = 0; j < snake.length; j++) {
            snake[j].classList.remove("snakeBody");
            snake[j].classList.remove("snakeHead");
        }

        for (let k = 0; k < fruits.length; k++) {
            if (fruits[k].classList.contains("fruit")) {
                fruits[k].classList.remove("fruit");
            }
        }
        
        snake = [];
        fruits = [];
        score = 0;
        span.innerText = score;

        clearInterval(interval);
        startGame();
    }
}

// Конец игры

function gameOver(snakeCoordinates) {
    for (let i = 1; i < snake.length; i++) {
        if (snakeCoordinates[0] === snake[i].getAttribute('posX')
        && snakeCoordinates[1] === snake[i].getAttribute('posY')) {
            for (let j = 0; j < snake.length; j++) {
                snake[j].classList.remove("snakeBody");
                snake[j].classList.remove("snakeHead");
            }

            for (let k = 0; k < fruits.length; k++) {
                if (fruits[k].classList.contains("fruit")) {
                    fruits[k].classList.remove("fruit");
                }
            }

            snake = [];
            fruits = [];
            score = 0;
            span.innerText = score;

            clearInterval(interval);
            startGame();
        }
    }
}


// Логика движения

function move() {
    let snakeCoordinates = [snake[0].getAttribute('posX'), snake[0].getAttribute('posY')];
   
    snake[0].classList.remove('snakeHead');
    snake[snake.length - 1].classList.remove('snakeBody');
    snake.pop();

    eatFruit(snakeCoordinates);
    gameOver(snakeCoordinates);

    if (direction === "down") {
        if (snakeCoordinates[1] < fieldLength) {
            snake.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY ="' + (+snakeCoordinates[1] + 1) + '"]'))
        } else {
            snake.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY ="1"]'))
        }
    }

    if (direction === "up") {
        if (snakeCoordinates[1] > 1) {
            snake.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY ="' + (+snakeCoordinates[1] - 1) + '"]'))
        } else {
            snake.unshift(document.querySelector('[posX ="' + snakeCoordinates[0] + '"][posY ="32"]'))
        }
    }

    if (direction === "left") {
        if (snakeCoordinates[0] > 1) {
            snake.unshift(document.querySelector('[posX ="' + (+snakeCoordinates[0] - 1) + '"][posY ="' + snakeCoordinates[1] + '"]'))
        } else {
            snake.unshift(document.querySelector('[posX ="32"][posY ="' + snakeCoordinates[1] + '"]'))
        }
    }

    if (direction === "right") {
        if (snakeCoordinates[0] < fieldLength) {
            snake.unshift(document.querySelector('[posX ="' + (+snakeCoordinates[0] + 1) + '"][posY ="' + snakeCoordinates[1] + '"]'))
        } else {
            snake.unshift(document.querySelector('[posX ="1"][posY ="' + snakeCoordinates[1] + '"]'))
        }
    }
    
    snake[0].classList.add('snakeHead');

    for (let i = 0; i < snake.length; i++) {
        snake[i].classList.add('snakeBody');
    }
}


// Управление

document.addEventListener("keydown", (event) => {
    if (event.code === "KeyW" || event.code === "ArrowUp" && direction !== "down") {
        direction = 'up';
    }
    if (event.code === "KeyS" || event.code === "ArrowDown"  && direction !== "up") {
        direction = 'down';
    }
    if (event.code === "KeyA" || event.code === "ArrowLeft" && direction !== "right") {
        direction = 'left';
    }
    if (event.code === "KeyD" || event.code === "ArrowRight" && direction !== "left") {
        direction = 'right';
    }
})


// Генерация случайного числа

function randomNumber(min, max) {
    let randNumber = min + Math.random() * (max + 1 - min);

    return Math.floor(randNumber)
}


// Создать фрукт

function createFruit() {
    const fruitPosX = randomNumber(firstCellCount, fieldLength);
    const fruitPosY = randomNumber(firstCellCount, fieldLength);
    
    const fruitPosition = document.querySelector(`[posX="${fruitPosX}"][posY="${fruitPosY}"]`);
    fruitPosition.classList.add('fruit');
    fruits.push(fruitPosition);
}
