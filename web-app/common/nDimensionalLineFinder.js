import { binary, mapObjIndexed } from "ramda";
import R from "../common/ramda.js";
import tacToe from "../common/tacToe.js";

/**
 * nDimensionalLineFinder.js is a set of helper functions that are
 * referenced by tacToe.js
 * @namespace nDimensionalLineFinder
 * @author Max McCormack
 * @version 2022
 */
const lineFinder = Object.create(null);

/**
 * Uses procedural code to print out a board in the terminal in an easy-to read
 * format for debugging or playing the game in the terminal.
 * Thought there was no point in making this function pure.
 * @param {matrix} board The 4-dimensional board to print out
 * @returns {string} The text that represents the board we want to display.
 * Can be printed out in the terminal or read to a website for easy
 * implementatoin, etc.
 */
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
