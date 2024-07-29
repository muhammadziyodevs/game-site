document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid-container');
    const statsDisplay = document.getElementById('stats');
    const nextBlockDisplay = document.getElementById('nextBlock');

    const gridWidth = 10;
    const gridHeight = 20;
    const gridCells = [];
    let currentBlock;
    let nextBlock;
    let intervalId;
    let score = 0;
    let linesCleared = 0;
    let level = 1;
    let isGameOver = false;

    // Tetris blocks
    const blocks = [
        { name: 'I', color: 'cyan', shape: [[1, 1, 1, 1]] },
        { name: 'J', color: 'blue', shape: [[1, 0, 0], [1, 1, 1]] },
        { name: 'L', color: 'orange', shape: [[0, 0, 1], [1, 1, 1]] },
        { name: 'O', color: 'yellow', shape: [[1, 1], [1, 1]] },
        { name: 'S', color: 'green', shape: [[0, 1, 1], [1, 1, 0]] },
        { name: 'T', color: 'purple', shape: [[0, 1, 0], [1, 1, 1]] },
        { name: 'Z', color: 'red', shape: [[1, 1, 0], [0, 1, 1]] }
    ];

    // Initialize the game
    function init() {
        createGrid();
        createStats();
        createNextBlock();
        startGame();
    }

    // Create the Tetris grid
    function createGrid() {
        for (let row = 0; row < gridHeight; row++) {
            const rowCells = [];
            for (let col = 0; col < gridWidth; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                rowCells.push(cell);
                grid.appendChild(cell);
            }
            gridCells.push(rowCells);
        }
    }

    // Create the stats display
    function createStats() {
        updateStatsDisplay();
    }

    // Update the stats display
    function updateStatsDisplay() {
        statsDisplay.innerHTML = `
            <p>Score: ${score}</p>
            <p>Level: ${level}</p>
            <p>Lines Cleared: ${linesCleared}</p>
        `;
    }

    // Create the next block display
    function createNextBlock() {
        const randomBlock = blocks[Math.floor(Math.random() * blocks.length)];
        nextBlock = {
            name: randomBlock.name,
            color: randomBlock.color,
            shape: randomBlock.shape
        };

        nextBlockDisplay.innerHTML = '';
        for (let row = 0; row < nextBlock.shape.length; row++) {
            for (let col = 0; col < nextBlock.shape[row].length; col++) {
                if (nextBlock.shape[row][col]) {
                    const nextBlockCell = document.createElement('div');
                    nextBlockCell.classList.add('grid-cell');
                    nextBlockCell.style.backgroundColor = nextBlock.color;
                    nextBlockDisplay.appendChild(nextBlockCell);
                }
            }
        }
    }

    // Start the game
    function startGame() {
        isGameOver = false;
        score = 0;
        linesCleared = 0;
        level = 1;
        updateStatsDisplay();
        spawnBlock();
        intervalId = setInterval(() => {
            if (!moveDown()) {
                clearInterval(intervalId);
                handleBlockPlacement();
                spawnBlock();
            }
        }, 1000 / level);
    }

    // Spawn a new Tetris block
    function spawnBlock() {
        currentBlock = nextBlock;
        createNextBlock();
        currentBlock.row = 0;
        currentBlock.col = Math.floor(gridWidth / 2) - Math.floor(currentBlock.shape[0].length / 2);
        if (!isValidMove(currentBlock)) {
            gameOver();
            return;
        }
        drawBlock();
    }

    // Draw the current Tetris block on the grid
    function drawBlock() {
        clearBlock();
        for (let row = 0; row < currentBlock.shape.length; row++) {
            for (let col = 0; col < currentBlock.shape[row].length; col++) {
                if (currentBlock.shape[row][col]) {
                    const blockRow = currentBlock.row + row;
                    const blockCol = currentBlock.col + col;
                    if (blockRow >= 0 && blockRow < gridHeight && blockCol >= 0 && blockCol < gridWidth) {
                        gridCells[blockRow][blockCol].classList.add('active');
                        gridCells[blockRow][blockCol].style.backgroundColor = currentBlock.color;
                    }
                }
            }
        }
    }

    // Clear the current Tetris block from the grid
    function clearBlock() {
        gridCells.forEach(row => {
            row.forEach(cell => {
                cell.classList.remove('active');
                cell.style.backgroundColor = '';
            });
        });
    }

    // Move the current Tetris block down
    function moveDown() {
        currentBlock.row++;
        if (!isValidMove(currentBlock)) {
            currentBlock.row--;
            return false;
        }
        drawBlock();
        return true;
    }

    // Move the current Tetris block left
    function moveLeft() {
        currentBlock.col--;
        if (!isValidMove(currentBlock)) {
            currentBlock.col++;
        }
        drawBlock();
    }

    // Move the current Tetris block right
    function moveRight() {
        currentBlock.col++;
        if (!isValidMove(currentBlock)) {
            currentBlock.col--;
        }
        drawBlock();
    }

    // Rotate the current Tetris block
    function rotateBlock() {
        const originalShape = currentBlock.shape;
        const rotatedShape = [];
        const rows = originalShape.length;
        const cols = originalShape[0].length;

        for (let col = 0; col < cols; col++) {
            rotatedShape[col] = [];
            for (let row = rows - 1; row >= 0; row--) {
                rotatedShape[col][rows - row - 1] = originalShape[row][col];
            }
        }

        currentBlock.shape = rotatedShape;
        if (!isValidMove(currentBlock)) {
            currentBlock.shape = originalShape;
        }
        drawBlock();
    }

    // Check if the current Tetris block can be placed at its current position
    function isValidMove(block) {
        for (let row = 0; row < block.shape.length; row++) {
            for (let col = 0; col < block.shape[row].length; col++) {
                if (block.shape[row][col]) {
                    const blockRow = block.row + row;
                    const blockCol = block.col + col;
                    if (blockRow < 0 || blockRow >= gridHeight || blockCol < 0 || blockCol >= gridWidth ||
                        gridCells[blockRow][blockCol].classList.contains('occupied')) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Handle block placement (when block cannot move down further)
    function handleBlockPlacement() {
        for (let row = 0; row < currentBlock.shape.length; row++) {
            for (let col = 0; col < currentBlock.shape[row].length; col++) {
                if (currentBlock.shape[row][col]) {
                    const blockRow = currentBlock.row + row;
                    const blockCol = currentBlock.col + col;
                    gridCells[blockRow][blockCol].classList.add('occupied');
                }
            }
        }
        checkLines();
    }

    // Check for completed lines
    function checkLines() {
        let linesToClear = [];
        for (let row = 0; row < gridHeight; row++) {
            let isComplete = true;
            for (let col = 0; col < gridWidth; col++) {
                if (!gridCells[row][col].classList.contains('occupied')) {
                    isComplete = false;
                    break;
                }
            }
            if (isComplete) {
                linesToClear.push(row);
            }
        }
        if (linesToClear.length > 0) {
            clearLines(linesToClear);
        } else {
            endTurn();
        }
    }

    // Clear completed lines
    function clearLines(lines) {
        linesCleared += lines.length;
        score += lines.length * 100;
        if (linesCleared % 10 === 0) {
            level++;
        }
        updateStatsDisplay();

        lines.forEach(row => {
            for (let col = 0; col < gridWidth; col++) {
                gridCells[row][col].classList.remove('occupied');
            }
            for (let r = row; r > 0; r--) {
                for (let c = 0; c < gridWidth; c++) {
                    if (gridCells[r - 1][c].classList.contains('occupied')) {
                        gridCells[r][c].classList.add('occupied');
                        gridCells[r - 1][c].classList.remove('occupied');
                        gridCells[r][c].style.backgroundColor = gridCells[r - 1][c].style.backgroundColor;
                        gridCells[r - 1][c].style.backgroundColor = '';
                    }
                }
            }
        });

        setTimeout(() => {
            endTurn();
        }, 200);
    }

    // End the current turn
    function endTurn() {
        if (isGameOver) return;
        if (checkGameOver()) {
            gameOver();
            return;
        }
        spawnBlock();
    }

    // Check if the game is over
    function checkGameOver() {
        for (let col = 0; col < gridWidth; col++) {
            if (gridCells[0][col].classList.contains('occupied')) {
                return true;
            }
        }
        return false;
    }

    // Handle game over
    function gameOver() {
        isGameOver = true;
        clearInterval(intervalId);
        alert('Game Over! Your score: ' + score);
    }

    // Event listeners for keyboard controls
    document.addEventListener('keydown', (e) => {
        if (isGameOver) return;
        switch (e.code) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowUp':
                rotateBlock();
                break;
        }
    });

    // Start the game
    init();
});
