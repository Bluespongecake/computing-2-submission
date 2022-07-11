import R from "../common/ramda.js";
import tacToe from "./common/tacToe.js";
import lineFinder from "./common/lineFinder.js";
import Json_rpc from "./Json_rpc.js";

let board = tacToe.newBoard(4);
let currentPlayer = 1;

const eleCh = (id) => document.getElementById(id);

const input_pane = document.getElementById("input_pane");
const send_button = document.getElementById("send_button");
const text_board = document.getElementById("textboard");

send_button.onclick = function () {
    // const boardTxtNr = boardTxt.replace(/\n/g, "<br>\n");
    const indexTxt = input_pane.value;
    const index = indexTxt.split("").slice(0, -1).map((n) => parseInt(n));
    currentPlayer = tacToe.playersTurnFinder(board);
    board = tacToe.playTurnBoardUpdate(currentPlayer, board, index);
    let boardTxt = lineFinder.terminal4DPrint(board);
    if (tacToe.checkWin(board, currentPlayer, 4) === currentPlayer) {
        boardTxt = "Player " + currentPlayer + " wins!!";
    }
    text_board.textContent = boardTxt;

    console.log(index);
};
