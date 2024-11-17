let board;
let score = 0;
let rows = 4;
let columns = 4;
let endNumber = 2048;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

if (mode === "4096"){
    rows = 5;
    columns = 5;
    endNumber = 4096;
    document.getElementById('board').classList.add('board-4096');
} else if (mode === "8192"){
    rows = 6;
    columns = 6;
    endNumber = 8192;
    document.getElementById('board').classList.add('board-8192');
} else {
    document.getElementById('board').classList.add('board-2048');

}

window.onload = function() {
    setGame();
}

// -----set game----- //
function setGame() {
    board = Array.from({length: rows }, () => Array(columns).fill(0));

    // create tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    // create first two tiles
    setTwo();
    setTwo();
}

function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = ""; //clear the tile and classlist
    tile.classList.add("tile")
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
        checkWin(num);
    }
    
}

// check empty tiles
function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}

// genarate tiles in radom place
function setTwo(){
    if(!hasEmptyTile()){
        endGame();
        return;
    } //if there's no empty tile, don't create new ones and end game

    let found = false;
    while(!found){
        //random r,c
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*columns);

        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;  //break the loop
        }
    }
}


// win game //
function checkWin(num){
    if (num === endNumber){
        winGame()
    }}


// -----eventlistener----- //
document.addEventListener("keyup", (e) =>{
    if(e.code == "ArrowLeft"){
        slideLeft();
        setTwo();
    } else if(e.code == "ArrowRight"){
        slideRight();
    } else if(e.code == "ArrowUp"){
        slideUp();
        setTwo();

    } else if(e.code == "ArrowDown"){
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
})

//get rid of zeros
function filterZero(row){
    return row.filter(num => num != 0);
}

function slide(row){
    //get rid of zeros
    row = filterZero(row);
    
    // slide
    for(let i=0; i < row.length-1; i++) {
        // check same numbers and merge
        if(row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }

    //get rid of zeros again
    row = filterZero(row);

    //add zeros
    while(row.length < columns){
        row.push(0);  //add zeros
    }
    
    return row;
}

// -----arrowkey functions----- //
function slideLeft(){
    for(let r = 0; r < rows; r++) {
        let row = board[r]; //select rows
        row = slide(row);
        board[r] = row;
        
        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num); 
        }
    }

}

// reverse slideLeft()
function slideRight(){
    for(let r = 0; r < rows; r++) {
        let row = board[r]; //select rows
        row.reverse(); //reverse row
        row = slide(row);
        row.reverse(); //reverse row
        board[r] = row;
        
        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num); 
        }
    }

}

// trasforming columns in to rows and slideLeft
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [];
        for (let r = 0; r < rows; r++) {
            row.push(board[r][c]);
        }
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [];
        for (let r = 0; r < rows; r++) {
            row.push(board[r][c]);
        }
        row.reverse(); //reverse row
        row = slide(row);
        row.reverse(); //reverse row
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


//-----game controls----- //

//control Btns//
const homeBtn = document.getElementById("homeBtn")
const restartBtn = document.getElementById("restartBtn")
const helpBtn = document.getElementById("helpBtn")

//modals and sections//
const gameWinModal = document.getElementById("gameWinModal")
const gameOverModal = document.getElementById("gameOverModal")
const homeModal = document.getElementById("homeModal")
const restartModal = document.getElementById("restartModal")
const helpSection = document.getElementById("help")

//modal Btns//
const goHome = document.querySelectorAll("#goHome")
const confirmRestart = document.querySelectorAll("#confirmRestart")
const cancelAction = document.querySelectorAll("#cancel")


// home //

homeBtn.onclick = function(){
    homeModal.style.display = "block";
}
goHome.forEach(home=>{
    home.onclick=function(){
        window.location.href="index.html"    
    }
})


// restart //

restartBtn.onclick = function(){
    restartModal.style.display = "block";
}

confirmRestart.forEach(restart => {
    restart.onclick = function(){
        restartGame();
        let modal = restart.closest(".modal");
        if (modal) {
            modal.style.display = "none";
        }
}
})

// cancel //

cancelAction.forEach(cancel => {
    cancel.onclick = function(){
    let modal = cancel.closest(".modal");
        if (modal) {
            modal.style.display = "none";
        }}
})


function restartGame() {
    // Remove all existing tiles
    let tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        tile.parentNode.removeChild(tile);
    })
    score = 0;
    document.getElementById("score").innerText = score;
    
    setGame();
}
// game over //

function endGame(){
    gameOverModal.style.display = "block";
}

function winGame(){
    gameWinModal.style.display = "block";
}

// help //
helpBtn.onmouseover = function(){
    helpSection.style.display = "block";
}

helpBtn.onmouseout = function(){
    helpSection.style.display = "none";
}