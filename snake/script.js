const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = 20;

canvas.width = canvas.height = gridSize * tileCount;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 }; // Dastlabki yo'nalish o'ngga yo'naltirilgan
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let gameOver = false;

function gameLoop() {
    if (gameOver) {
        alert('Game Over! Press "Restart" to play again.');
        return;
    }

    update();
    draw();

    setTimeout(gameLoop, 300); // Tezlikni 200 ms ga o'zgartirdik
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function restartGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    gameOver = false;
    gameLoop(); // O'yin qayta boshlanadi
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case 'w':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 's':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'a':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'd':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

document.getElementById('restartButton').addEventListener('click', () => {
    restartGame();
});

gameLoop();
