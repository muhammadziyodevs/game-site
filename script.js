document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("playButton");
    const modal = document.getElementById("myModal");
    const closeModal = document.querySelector(".clsa"); // .close class'ini tanlab olish

    playButton.onclick = function() {
        modal.style.display = "block";
    };

    closeModal.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    const cells = document.querySelectorAll('.cell');
    const statusText = document.querySelector('.status');
    const restartBtn = document.querySelector('.restart');

    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;

        checkWinner();
    };

    const checkWinner = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusText.innerHTML = `Player ${currentPlayer} has won!`;
            isGameActive = false;
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusText.innerHTML = `Game ended in a draw!`;
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.innerHTML = `It's ${currentPlayer}'s turn`;
    };

    const restartGame = () => {
        currentPlayer = 'X';
        gameState = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        statusText.innerHTML = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.innerHTML = "");
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);

    let isGameActive = true;
    statusText.innerHTML = `It's ${currentPlayer}'s turn`;
});

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playDino');
    const modal = document.getElementById('myDino');
    const closeModal = document.querySelector('.close');
    const mario = document.querySelector('.mario');
    const obstacle = document.querySelector('.obstacle');
    const gameOverText = document.querySelector('.game-over');
    let isJumping = false;
    let isGameOver = false;

    playButton.onclick = function() {
        modal.style.display = 'block';
        startGame();
    };

    closeModal.onclick = function() {
        modal.style.display = 'none';
        resetGame();
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetGame();
        }
    };

    const jump = () => {
        if (isJumping) return;
        isJumping = true;
        let jumpCount = 0;

        const jumpInterval = setInterval(() => {
            if (jumpCount < 15) {
                mario.style.bottom = parseInt(mario.style.bottom || 0) + 10 + 'px';
            } else if (jumpCount < 30) {
                mario.style.bottom = parseInt(mario.style.bottom) - 10 + 'px';
            } else {
                clearInterval(jumpInterval);
                isJumping = false;
            }
            jumpCount++;
        }, 20);
    };

    const checkCollision = () => {
        const marioBottom = parseInt(window.getComputedStyle(mario).getPropertyValue('bottom'));
        const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

        if (obstacleLeft < 70 && obstacleLeft > 50 && marioBottom < 50) {
            gameOverText.style.display = 'block';
            obstacle.style.animation = 'none';
            isGameOver = true;
        }
    };

    const startGame = () => {
        isGameOver = false;
        gameOverText.style.display = 'none';
        obstacle.style.animation = 'move 2s linear infinite';
        document.addEventListener('keydown', handleKeydown);
        gameLoop = setInterval(checkCollision, 10);
    };

    const resetGame = () => {
        clearInterval(gameLoop);
        obstacle.style.animation = 'none';
        mario.style.bottom = '0px';
        document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (event) => {
        if (event.code === 'Space' && !isGameOver) {
            jump();
        }
    };

    let gameLoop;
});
