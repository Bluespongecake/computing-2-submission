import R from "../common/ramda.js";
import tacToe from "./common/tacToe.js";
import lineFinder from "./common/lineFinder.js";
import Json_rpc from "./Json_rpc.js";

let boardDivs = [];

// set up the board by creating a bunch of divs and inserting them into the HTML
(function () {
    function createDiv(id) {
        var boardDiv = document.createElement("div");
        boardDiv.className = "cell";
        boardDiv.accessKey = id;

        return boardDiv;
    }
    function createDivs() {
        var board = document.getElementById("board"),
            i = 0,
            numOfDivs = 81;
        for (i; i < numOfDivs; i += 1) {
            boardDivs.push(createDiv(i));
            board.appendChild(boardDivs[i]);
        }
        // boardDivs[5].className = "cell.x";
        // boardDivs[5].innerText = "x";
    }
    createDivs();
}());

//initialise a few constants
const x_id = "x";
const o_id = "o";

// const input_pane = document.getElementById("input_pane");
// const send_button = document.getElementById("send_button");
const text_board = document.getElementById("textboard");
let currentPlayer = 1;
const restartButton = document.getElementById("restartButton");

//create a 3x3x3x3 array of 0s
let board = tacToe.newBoard(4);

//set the token that we want to show up when hovering over the board
const setHoverClass = function(currentPlayer) {
    const boardEle = document.getElementById("board");
    const player = currentPlayer;
    const classToken = player === 1 ? x_id : o_id;
    boardEle.classList.remove(x_id);
    boardEle.classList.remove(o_id);
    boardEle.classList.add(classToken);
}

//some operations to display it is the other player's turn
const swapTurns = function(currentPlayer) {
    setHoverClass(currentPlayer);

    const sidebar1 = document.getElementById("home_player");
    const sidebar2 = document.getElementById("away_player");
    const text1 = document.getElementById("home_ready");
    const text2 = document.getElementById("away_ready");

    const messages = ["Your turn", "Please wait..."]
    sidebar1.classList.remove(x_id);
    sidebar2.classList.remove(o_id);
    if (currentPlayer === 1) {
        sidebar1.classList.add(x_id);
        text1.textContent = messages[0];
        text2.textContent = messages[1];
    }
    else if (currentPlayer === 2) {
        sidebar2.classList.add(o_id);
        text1.textContent = messages[1];
        text2.textContent = messages[0];
    }

}

function resetGame() {
    board = tacToe.newBoard(4);
    currentPlayer = 1;
    //set up the board for player 1's turn
    boardDivs.forEach(cell =>
    {
        cell.classList.remove(x_id)
        cell.classList.remove(o_id)
        cell.removeEventListener("click", handleCellClick)
        cell.addEventListener("click", handleCellClick, { once: true })
    });
    swapTurns(1);
}

resetGame();

function winFound(player) {
    document.getElementById("winningMessage").showModal();
}
//function to run when a cell is clicked
function handleCellClick(ele) {
    const cellClicked = ele.target;
    const currentClass = currentPlayer === 1 ? x_id : o_id;
    // console.log(currentClass);
    // const boardTxtNr = boardTxt.replace(/\n/g, "<br>\n");
    // const indexTxt = input_pane.value;
    // const index = indexTxt.split("").slice(0, -1).map((n) => parseInt(n));

    //detect which div was pressed, and access its 1D coordinate
    const cellPressed = cellClicked.accessKey;
    //then update this to a 4D index
    const cellPressedIdx = tacToe.twoDto4D(tacToe.oneDto2D(cellPressed));

    currentPlayer = tacToe.playersTurnFinder(board);
    board = tacToe.playTurnBoardUpdate(currentPlayer, board, cellPressedIdx);
    let boardTxt = "Player " + (tacToe.playersTurnFinder(board)) + "'s Turn";
    if (tacToe.checkWin(board, currentPlayer, 4) === currentPlayer) {
        boardTxt = "Player " + currentPlayer + " wins!!";
        winFound(currentPlayer);
    }

    text_board.textContent = boardTxt;

    //add an X or O to the required area in the board
    if (currentPlayer === 1) {
        boardDivs[tacToe.twoDTo1D(tacToe.fourDindexTo2D(cellPressedIdx))]
            .classList.add(x_id);
    }
    else if (currentPlayer === 2) {
        boardDivs[tacToe.twoDTo1D(tacToe.fourDindexTo2D(cellPressedIdx))]
            .classList.add(o_id);
    }
    //update current player
    currentPlayer = tacToe.playersTurnFinder(board);
    //update the graphics for a new turn
    swapTurns(currentPlayer);


    console.log(cellPressed);
    console.log(cellPressedIdx);
    console.log(tacToe.twoDTo1D(tacToe.fourDindexTo2D(cellPressedIdx)));
    console.log(lineFinder.terminal4DPrint(board));
}

restartButton.onclick = function () {
    document.getElementById("winningMessage").close();
    resetGame();
};

const boardGridElement = document.getElementById("board")


