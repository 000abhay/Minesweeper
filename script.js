const rows = 10;
const cols = 10;
const bombsCount = 10;

let board = [];
let gameOver = false;

const boardDiv = document.getElementById("board");

// Create empty board
function createBoard() {
    board = [];
    boardDiv.innerHTML = "";
    gameOver = false;

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => clickCell(r, c));
            boardDiv.appendChild(cell);

            row.push({
                bomb: false,
                open: false,
                element: cell,
                count: 0
            });
        }
        board.push(row);
    }

    placeBombs();
    calculateNumbers();
}

function placeBombs() {
    let bombsPlaced = 0;

    while (bombsPlaced < bombsCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        if (!board[r][c].bomb) {
            board[r][c].bomb = true;
            bombsPlaced++;
        }
    }
}

function calculateNumbers() {
    const directions = [
        [-1,-1], [-1,0], [-1,1],
        [0,-1],         [0,1],
        [1,-1], [1,0], [1,1]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].bomb) continue;

            let count = 0;
            directions.forEach(d => {
                let nr = r + d[0];
                let nc = c + d[1];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (board[nr][nc].bomb) count++;
                }
            });

            board[r][c].count = count;
        }
    }
}

function clickCell(r, c) {
    if (gameOver) return;
    let cell = board[r][c];

    if (cell.open) return;

    cell.open = true;
    cell.element.classList.add("open");

    if (cell.bomb) {
        cell.element.classList.add("bomb");
        alert("💥 Game Over!");
        revealAll();
        gameOver = true;
        return;
    }

    if (cell.count > 0) {
        cell.element.textContent = cell.count;
    } else {
        openNeighbors(r, c);
    }

    checkWin();
}

function openNeighbors(r, c) {
    const directions = [
        [-1,-1], [-1,0], [-1,1],
        [0,-1],         [0,1],
        [1,-1], [1,0], [1,1]
    ];

    directions.forEach(d => {
        let nr = r + d[0];
        let nc = c + d[1];

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            let neighbor = board[nr][nc];
            if (!neighbor.open && !neighbor.bomb) {
                clickCell(nr, nc);
            }
        }
    });
}

function revealAll() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = board[r][c];
            cell.open = true;
            cell.element.classList.add("open");

            if (cell.bomb)
                cell.element.classList.add("bomb");
            else if (cell.count > 0)
                cell.element.textContent = cell.count;
        }
    }
}

function checkWin() {
    let openedCells = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].open) openedCells++;
        }
    }

    if (openedCells === rows * cols - bombsCount) {
        alert("🎉 You Win!");
        gameOver = true;
        revealAll();
    }
}

document.getElementById("restart").addEventListener("click", createBoard);

createBoard();
