import { binary, mapObjIndexed } from "ramda";
import R from "../common/ramda.js";
import tacToe from "../common/tacToe.js";

const lineFinder = Object.create(null);

lineFinder.terminal4DPrint = function(board) {
    let boardTxt = "\n";
    for (let l =0; l < 3; l++) {
        for (let k = 0; k < 3; k++) {
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 3; i++) {
                boardTxt += (board[j][l][k][i] + " ");
                }
                if (j !== 2) {
                    boardTxt += "| ";
                }
            }
            boardTxt += "\n";
        }
        if (l !== 2) {
            boardTxt += "- - - - - - - - - - -\n";
        }
    }
    return boardTxt;
};

export default Object.freeze(lineFinder);
