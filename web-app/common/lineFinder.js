import R from "./ramda.js";
import tacToe from "./tacToe.js";

/**
 * lineFinder.js is a set of two functions that complement
 * tacToe.js. One is a tool to help visualise 4D boards with text,
 * useful for debugging and explaining. <br> The other is an N-dimensional line
 * finder (finds a line of elements in a row in 2,3,4,5,6... dimensions) which
 * I am quite proud of, even though it is procedural code.
 * @namespace lineFinder
 * @author Max McCormack
 * @version 2022-v1
 */
const lineFinder = Object.create(null);

/**
 * Uses procedural code to print out a 4 dimensional board in the terminal in
 * an easy-to read format for debugging or playing the game in the terminal.
 * Thought there was no point in making this function pure.
 * @param {matrix} board The 4-dimensional board to print out
 * @returns {string} The text that represents the board we want to display.
 * Can be printed out in the terminal or read to a website for easy
 * implementatoin, etc.
 * <p>Prints in the format:</p>
 * <pre>
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
- - - - - - - - - - -
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
- - - - - - - - - - -
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0
0 0 0 | 0 0 0 | 0 0 0

</pre>
<p>For a blank board</p>
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


/**
 * Finds lines of three in a row in an N-dimensional hypercube.
 * Should work for any line length, but I haven't tested it for that yet.
 * Not a pure function, but please excuse this as it was difficult enough to
 * implement procedurally as it were. (Took pretty much an entire day) <br> <br>
 * The way it works is just an extension of the logic you would apply to 3
 * dimensions or 2 dimensions. <br>
 * E.g a line in 3 dimensions would be something
 * like [2,0,2], [1,1,1], [0,2,0]. I.e at least one of the indexes are
 * incremented by 1 or -1. <br>
 * Since we can define a line in 1, 2, and 3 dimensions as three coordinates in
 * a row which differ in steps of 1 in at least one dimension, we can
 * generalise for any number of dimensions. <br> <br>
 * So, to find lines in higher dimensional grids, we just have to select a set
 * of indices to start looking from (which are found by the function tacToe.
 * everyEdgeIndexToCheck()), then loop through every possible combination of
 * increment vectors, i,e search in every direction from the starting index.
 * For higher dimensions the number of directions to search in starts to get
 * pretty numerous, so slows down a bit from 5 dimensions onwards. However,
 * searching for 3 in a row in 4 dimensions only takes a few milliseconds.
 * @memberof lineFinder
 * @function
 * @param {matrix} board The N-dimensional board to check through
 * @param {number} player The player to check for a win
 * @param {number} dimensions The number of dimensions in the board to check
 * through
 * @param {number} BOARDWIDTH The width of one side of the board
 * @returns {number} If a line is found for the player number passed, will
 * return the number of the player. Returns 0 if no three-in-a-row line is found
 */
 lineFinder.findLine = function (board, player, dimensions, BOARDWIDTH) {
    //let corners = tacToe.corners(dimensions);
    const edgeIndexes = tacToe.everyEdgeIndexToCheck(4);
    const frozensPerms = tacToe.frozenDimensionPermutations(4);

    //given an index to start from, we increment it in all possible directions,
    //stopping if we run off the board
    //we check to see if there is a winning condition by checkin if
    //we return 3x1s or 3x2s in a row in any set of dimensions
    for (let i = 0; i < edgeIndexes.length; i++){
        // console.log(edgeIndexes[i]);
        for (let j = 0; j < frozensPerms.length; j++) {
            let line = [0,0,0];
            const increment = tacToe.diagonalIncrementation(
                edgeIndexes[i], frozensPerms[j]);
            // console.log(frozensPerms[j]);
            if (increment.every((n) => n === 0)) {
                continue;
            }
            // console.log(frozensPerms[j]);
            // console.log(increment);
            let nextIndex = edgeIndexes[i];
            for (let k = 0; k < BOARDWIDTH; k++) {
                // console.log(nextIndex);
                if(tacToe.isInBoard(nextIndex, dimensions)) {
                    line[k] = tacToe.returnBoardElement(board, nextIndex);
                }
                else {
                    continue;
                }
                nextIndex = tacToe.indexIncrement(
                    nextIndex, increment);
            }
            // console.log(line);
            if (line.every(n => n === player)) {
                return player;
            }
        }

    }
    return 0;
};

export default Object.freeze(lineFinder);
