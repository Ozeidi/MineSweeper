// Description: This file contains the JavaScript code for the Minesweeper game.
let grid = [];
let size = 10;
let start_mineCount = 10;
let time = 0;
let timerId = null;

// web page elements
let minefield = document.getElementById('minefield');
let resetButton = document.getElementById('reset-button');
let mineCountValue = document.getElementById('minecount-value');
// Level selector buttons
// Get all the buttons in the level div
let levelButtons = document.querySelectorAll('#level .level-button');
// Add a click event listener to each button
levelButtons.forEach(button => {
    button.addEventListener('click', function() {
        console.log(this.innerText);
        setLevel(this.innerText);
    });
});

// Get the checkbox
let flagMode = document.getElementById('flag-mode');
// Add a click event listener to the checkbox
flagMode.addEventListener('click', function() {
    console.log('Flag mode is ' + flagMode.checked);
});
// Just for fun, let's add some sound effects
let revealSound = new Audio('/asset/sounds/reveal.wav');
let flagSound = new Audio('/asset/sounds/flag.wav');
let winSound = new Audio('/asset/sounds/win.wav');
let loseSound = new Audio('/asset/sounds/game over.wav');

// Create a function to generate the Minesweeper grid
function generateMinesweeperGrid(rows, cols) {
    mineCount = start_mineCount;
    mineCountValue.innerText = mineCount;
    stopTimer();
    startTimer();
    grid = [];
    minefield.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.onclick =  () => clickCell(cell,i,j);
            cell.oncontextmenu = (e) => flagCell(cell,i,j);
            minefield.appendChild(cell);
            grid[i][j] = {mine: false, revealed: false, flagged: false, element: cell};
        }
    }

    for (let i = 0 ; i <mineCount; i++) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        if (grid[row][col].mine) {
            i--;
        } else {
            grid[row][col].mine = true;
        }
    }

    console.log(grid);

    return grid;

}

const flagCell = (cell, row, col) => {
    flagSound.play();
    console.log("right click");
    if (!grid[row][col].revealed) {
        if(!grid[row][col].flagged) {
            cell.classList.toggle('flag');
            grid[row][col].flagged = true;
            mineCount--;
            console.log(grid[row][col]);
        }else{
            cell.classList.toggle('flag');
            grid[row][col].flagged = false;
            mineCount++;
            console.log(grid[row][col]);

        }
    }
    mineCountValue.innerText = mineCount;
    if (isGameCompleted()) {
        console.log('Congratulations, you won!');
    }
    return false;
}

// Create a function to handle cell click event
const clickCell = (cell, row, col) => {

    if (flagMode.checked) {
        flagCell(cell, row, col);
        return;
    }  
    
        // console.log(cell);
        // console.log(grid[row][col]);

        if (grid[row][col].revealed) return;

        if (grid[row][col].flagged) {
            // return
            cell.classList.toggle('flag');
            grid[row][col].flagged = false;
            console.log('unflagged');
        }
        revealSound.play();
        grid[row][col].revealed = true;
        cell.revealed = true;
        // Add your logic here
        console.log(`Clicked cell at row ${row} and column ${col}`);
        if (grid[row][col].mine) {
            GameOver();
            // alert('Game Over');
        } else {
            let mineCount = 0;
            for (let i =-1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (row + i >= 0 && row + i < grid.length && col + j >= 0 && col + j < grid[0].length && grid[row + i][col + j].mine) {
                        mineCount++;
                    }
                }
            }
            cell.classList.add('revealed');
            cell.textContent = mineCount||"";

            // Reveal all adjacent cells as well if the mine count is 0
            if (mineCount == 0) {
                for (let i =-1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (row + i >= 0 && row + i < grid.length && col + j >= 0 && col + j < grid[0].length) {
                            clickCell(grid[row + i][col + j].element, row + i, col + j);
                        }
                    }
                }
            }
    };
    if (isGameCompleted()) {
        console.log('Congratulations, you won!');
    }

}



function isGameCompleted() {
    for (let row of grid) {
        for (let cell of row) {
            if ((cell.mine && !cell.flagged) || (!cell.mine && !cell.revealed)) {
                return false;
            }
        }
    }
    winSound.play();
    resetButton.innerText = '🥳';
    stopTimer();
    return true;
}

// reveal all mines when game is over
function GameOver() {
    loseSound.play();
    resetButton.innerText = '😵';
    stopTimer();
    for (let row of grid) {
        for (let cell of row) {
            if (cell.mine) {
                cell.element.classList.add('mine');
            }
        }
    }
}

resetButton.onclick = () => {
    resetButton.innerText = '😵'; // Cross-eyed emoji

    setTimeout(() => {
        generateMinesweeperGrid(size, size);
        resetButton.innerText = '😀'; // Smiley face emoji
    }, 500); // 1000 milliseconds = 1 second
}


const setLevel = (level) => {
    switch (level) {
        case 'Beginner':
            size = 10;
            start_mineCount = 10;
            minefield.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            minefield.style.gridTemplateRows = `repeat(${size}, 1fr)`;
            generateMinesweeperGrid(size, size);
            break;
        case 'Intermediate':
            size = 20;
            start_mineCount = 40;
            minefield.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            minefield.style.gridTemplateRows = `repeat(${size}, 1fr)`;
            generateMinesweeperGrid(size, size);v
            break;
        case 'Expert':
            size = 30;
            start_mineCount = 100;
            minefield.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            minefield.style.gridTemplateRows = `repeat(${size}, 1fr)`;
            generateMinesweeperGrid(size, size);
            break;
    }
}
function startTimer() {
    time = 0;
    timerId = setInterval(() => {
        time++;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById('timer-value').innerText =  + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}
const minesweeperGrid = generateMinesweeperGrid(10, 10);
// console.log(mainBody)
