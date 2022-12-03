const gameField = document.querySelector('.gameField');
const cellArray = document.querySelectorAll('.cell');
const scoreBlock = document.querySelector('.scoreBlock');
const span = document.createElement('span');

let direction = "down";
let score = 0;
let interval;

let snakeConfig = {
    x: 16,
    y: 16,
}

let snake = [];
let fruits = [];

span.classList.add('score');
span.innerText = score;
scoreBlock.appendChild(span);


// Запустить игру

function startGame() {
    for (let i = 0; i < 1024; i++) {
        createCell();
        setCellAttribute();
    }
    
    while(fruits.length < 3) {
        createFruit();
    }

    createSnake();
    interval  = setInterval(move, 100);
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

    let count = 0;
    let x = 1;
    let y = 1;

    for (let i = 0; i < cellArray.length; i++) {
        count++;

        if (count > 32) {
            y++;
            x = 1;
            count = 1;
        }
        cellArray[i].setAttribute('posX', x++);
        cellArray[i].setAttribute('posY', y);
    }
}


// Создать змею

function createSnake() {
    const headPosition = document.querySelector(`[posX="${snakeConfig.x}"][posY="${snakeConfig.y}"]`);
    const bodyPosition = document.querySelector(`[posX="${snakeConfig.x}"][posY="${snakeConfig.y - 1}"]`);
    const bodyPosition2 = document.querySelector(`[posX="${snakeConfig.x}"][posY="${snakeConfig.y - 2}"]`);
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
        }
    }
}


// Конец игры

function gameOver(snakeCoordinates) {
    for (let i = 1; i < snake.length; i++) {
        if (snakeCoordinates[0] === snake[i].getAttribute('posX')
        && snakeCoordinates[1] === snake[i].getAttribute('posY')) {
            for (let j = 0; j < snake.length; j++) {
                snake[j].classList.remove("snakeBody")
                snake[j].classList.remove("snakeHead")
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
        if (snakeCoordinates[1] < 32) {
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
        if (snakeCoordinates[0] < 32) {
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
    if (event.code === "KeyW" && direction !== "down") {
        direction = 'up';
    }
    if (event.code === "KeyS" && direction !== "up") {
        direction = 'down';
    }
    if (event.code === "KeyA" && direction !== "right") {
        direction = 'left';
    }
    if (event.code === "KeyD" && direction !== "left") {
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
    const fruitPosX = randomNumber(1, 32);
    const fruitPosY = randomNumber(1, 32);
    
    const fruitPosition = document.querySelector(`[posX="${fruitPosX}"][posY="${fruitPosY}"]`);
    fruitPosition.classList.add('fruit');
    fruits.push(fruitPosition);
}

startGame();