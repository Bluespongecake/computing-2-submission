import R from "./common/ramda.js";
import tacToe from "./common/tacToe.js";
import lineFinder from "../common/nDimensionalLineFinder.js";
import Json_rpc from "./Json_rpc.js";

let board = tacToe.newBoard(4);
let boardTxt = lineFinder.terminal4DPrint(board);

const eleCh = (id) => document.getElementById(id);

document.getElementById("game_board_text").textContent = "waka";
