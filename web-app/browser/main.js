// import R from "../common/ramda.js";
// import tacToe from "./common/tacToe.js";
import lineFinder from "./common/lineFinder.js";
import Json_rpc from "./Json_rpc.js";

// let board = tacToe.newBoard(4);
// let boardTxt = lineFinder.terminal4DPrint(board);

const eleCh = (id) => document.getElementById(id);

const input_pane = document.getElementById("input_pane");
const output_pane = document.getElementById("output_pane");
const send_button = document.getElementById("send_button");

const reverse = Json_rpc.method("reverse");

send_button.onclick = function () {
    const text_to_reverse = input_pane.value;
    reverse(text_to_reverse).then(function (reversed_text) {
        output_pane.value = "adf";
    });
};
