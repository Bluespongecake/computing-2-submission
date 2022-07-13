import R from "./ramda.js";
import lineFinder from "./lineFinder.js";

const DIMENSIONS = 4;
const BOARDWIDTH = 3;

/**
 * tacToe.js is a module to model N-dimensional tic-tac-toe. <br>
 * Made using Functional Programming techniques - Note that all
 * functions in this module are pure
 * @namespace tacToe
 * @author Max McCormack
 * @version 2022
 */
const tacToe = Object.create(null);


/**
 * Finds the factorial of a number
 * @memberof tacToe
 * @function
 * @param {number} number The number to be factorialised
 * @returns {number} The factorial of the number
*/
tacToe.factorial = function (number) {
    if (number < 0) {
        return undefined;
    }
    if (number === 0) {
        return 1;
    }
    if (number === 1) {
        return number;
    } else {
        return number * tacToe.factorial(number - 1);
    }
};


// equation: $$\frac{1}{2}\sum\limits_{C=0}^{D-1} {D \choose C} 2^{D-C}
//S^C\tag{1}$$
/**
 * Returns the number of ways there are to win an N-dimensional tic tac toe game
 * @memberof tacToe
 * @function
 * @param {*} dimensions The number of dimensions in the game
 * @param {*} sideLen The length of one side of the board
 * @returns {number} The number of ways there are to win the described
 *  tic-tac-toe game
 */
tacToe.waysToWin = function (dimensions, sideLen) {
    return (1 / 2) * R.sum(
        R.range(0, dimensions).map((c) => (
            tacToe.factorial(dimensions)
            / (tacToe.factorial(c) * tacToe.factorial(dimensions - c))
            * (2 ** (dimensions - c))
            * sideLen ** c
        ))
    );
};


//
/**
 * Returns a board of 0s in {dimensions} dimensions,
 * with all dimensions having a size of 3
 * @memberof tacToe
 * @function
 * @param {number} dimensions The number of dimensions of the board to generate
 * @returns {matrix} An N-dimensional matrix full of 0s
 */
tacToe.newBoard = function (dimensions) {
    const instigator = R.repeat(3, dimensions);
    const boardMaker = (fill, arg) =>
    ((arg.length === 0
            ? fill
            : Array.from({ length: arg[0] }).map(() =>
                boardMaker(fill, arg.slice(1)))));

    return boardMaker(0, instigator);
};
/**
 * Checks if the board is in a draw state, i.e is full.
 * This seems like an almost impossible state to reach without any winning
 * conditions present, but I
 * should probably have a function to check for it just in case.
 * For efficiency, this does not call the intensive checkWin() function, even
 * though it was be the first thing I thought of when writing the description.
 * It is designed to be called after checkWin() to see if a draw has occured.
 * @memberof tacToe
 * @function
 * @param {matrix} board N-dimensional board to check
 * @returns True if the board is in a draw state, false if it is not
 */
tacToe.isFullDraw = function(board) {
    return R.flatten(board).every((ele) => ele !== 0);
};
/**
 * Checks if the game is over by looking at the state of the board
 * @memberof tacToe
 * @function
 * @param {matrix} board N-dimensional board to check
 * @returns {boolean} True if game is over, false if it is not
 */
tacToe.gameOverChecker = function (board) {
    return false;
    //return checkWin(board);
};


/**
 * Applies a filter to a given list using a binary list.
 * For every '1' in binary list, function will set
 * element in list at that same index to 0. <br>
 * List and binary list must be equal in length
 * @memberof tacToe
 * @function
 * @param {number[]} list The list we want to alter
 * @param {number[]} binarylist A list of 1's and 0's
 * @returns {number[]} outputList
 */
tacToe.binaryOp = function(list, binarylist) {
    const combine = function(element, bNum) {
        if (bNum === 0) {
            return element;
        }
        else {
            return 0;
        }
    };
    return list.map(function (num, idx) {
        return combine(num, binarylist[idx]);
      });
};

//increments an index by the given increment matrix
tacToe.indexIncrement = function(index, increment) {
    return index.map(function (num, idx) {
       return num + increment[idx];
   });
};


/**
 * Returns the token on the board at the index passed. <br>
 * Index is passed as an array of length N dimensions <br>
 * Works for any N dimensions
 * @memberof tacToe
 * @function
 * @param {matrix} board An N-dimensional board matrix to search in
 * @param {number[]} index The index to search for - for 4 dimensions this
 * will be of length 4
 * @returns {number} The element at the selected index
 */
tacToe.returnBoardElement = function (board, index) {
    const findCoord = (board, index) => (
        index.length === 1
        ? board[index[0]]
        : findCoord(board[index[index.length - 1]],
            index.slice(0, -1))
    );
    return findCoord(board, index);
};

/**
 * Returns a list of all the corner indices in an N-dimensional cube
 * @memberof tacToe
 * @function
 * @param {number} dimensions The number of dimensions of the cube to
 * search through
 * @returns {number[][]} A 2-dimensional array of indices, each of which is of
 * length {dimensions}
 */
tacToe.corners = function(dimensions) {
    const corners = R.compose(R.sequence(R.of), R.flip(R.repeat));
    return corners(dimensions, [0,2]);
};


/**
 * Returns a list of all the indexes we need to start looking for lines from
 * - In a square (a 2-cube) this would be the top and left sides.
 * - In a normal cube (a 3-cube) this would be the top, left and back sides
 * - For a tesseract (4-cube) it would be 4 sides, etc
 * @memberof tacToe
 * @function
 * @param {number} dims The number of dimensions of the cube to search through
 * @returns {number[][]} A 2-dimensional array of indices, each of which is of
 * length {dimensions}
 */
tacToe.everyEdgeIndexToCheck = function(dims) {
    const isOnEdge = (arr) => (arr.includes(0));
    const permutations = R.compose(R.sequence(R.of), R.flip(R.repeat));
    return permutations(dims, [0,1,2]).filter((index) => isOnEdge(index));
};


/**
 * Returns an incrementation array from a starting Index to check
 * for diagonal lines
 * @memberof tacToe
 * @function
 * @param {number[]} startIndex The N-dimensional corner to start the check from
 * incrementation from.
 * @param {number[]} frozenList Instructions to freeze a given dimension
 * - e.g [1, 0, 0 ,0] freezes the 4th dimension (index index 0)
 * @returns {number[]} An incrementation array of length {dimensions} to step
 * across when searching for lines in an N-dimensional cube.
 */
tacToe.diagonalIncrementation = function(startIndex, frozenList) {
    const translator = function(inte) {
        if (inte === 0) {
            return 1;
        }
        else if (inte === 2) {
            return -1;
        }
        else {
            return 0;
        }
    };
    return tacToe.binaryOp(startIndex.map((x) => translator(x)), frozenList);
};


/**
 * Given an index, returns whether the index is within the board
 * <br><br> Index.length should equal {dimensions}. <br><br> The boardwidth is
 * coded in as 3 and cannot be passed as a parameter, because that is all I need
 * for 3x3x3x3 tic tac toe, but this could be easily changed if needed.
 * @memberof tacToe
 * @function
 * @param {number[]} index Index to check
 * @param {number} dimensions Number of dimensions in the board
 * @returns {boolean} Either true, if the index is in the board, or false if
 * outside the board
 */
tacToe.isInBoard = function(index, dimensions) {
    if (index.length !== dimensions) {
        return false;
    }
    const isBelowMax = (n) => n < BOARDWIDTH && n >= 0;
    return index.every(isBelowMax);
};

/**
 * returns a list of the combinations of dimensions to be
 * frozen for checking - frozen dimsensions are denoted by 1,
 * free are 0 <br><br> Used by tacToe.checkwin() to define which directions to
 * search in
 * @memberof tacToe
 * @function
 * @param {number} dims number of dimensions to permute through
 * @returns {number[][]} An array of arrays of dimensions to iteratively
 * freeze - for every possible combination except all frozen at once. Each array
 * within the main array will be of length {dims}
 */
tacToe.frozenDimensionPermutations = function(dims) {
    const perms = R.compose(R.sequence(R.of), R.flip(R.repeat));
    return perms(dims, [0,1]).slice(0, -1);
};


/**
 * Given a board, checks if there is a winning condition.
 * Returns 0 (none) or the value of the player in quesion if a win
 * condition is found
 * @memberof tacToe
 * @function
 * @param {matrix} board The N-dimensional board to check through
 * @param {number} player The player to check for a win
 * @param {number} dimensions The number of dimensions in the board to check
 * through
 * @returns {number | 0} If a line is found for the player number
 * passed, will return the number of the player. Returns 0 if no 3 in a row
 * line is found.
 */
tacToe.checkWin = function (board, player, dimensions) {
    return lineFinder.findLine(board, player, dimensions, BOARDWIDTH);
};

/**
 * Returns false if coordinate is occupeid on board, true if it is
 * @param {matrix} board the board to check through
 * @param {number[]} index the index to check
 * @returns {boolean} True if it is occupeid, false if it is not
 */
tacToe.coordinateIsOccupied = function (board, index) {
    return (index.length === 1
    ? !(board[index[0]] === 0)
    : tacToe.coordinateIsOccupied(board[index[index.length - 1]],
        index.slice(0, -1)));
};

/**
 * Return a new board after a ply. <br>
 * If a spot is already taken, returns 0 <br>
 * Returns "occ" if the board index is already occupied
 * @memberof tacToe
 * @function
 * @param {number} player The number value of the player to place a token for
 * @param {matrix} board The N-dimensional board to be altered
 * @param {number[]} index The index array of the coordinate to be changed.
 * Should be passed as an array of format [x, y, z, w ....]
 * @returns {matrix} A new board with the requested alteration applied
 */
tacToe.playTurnBoardUpdate = function (player, board, index) {
    if (tacToe.gameOverChecker(board)) {
        // console.log("game over");
        return undefined;
    }
    if (index.length !== DIMENSIONS) {
        //length of index is wrong
        // console.log("index len wrong: ");
        // console.log(index.length);
        return undefined;
    }
    const IndexIsOutBoard = (indexEle) => indexEle > BOARDWIDTH - 1;
    if (index.some(IndexIsOutBoard)) {
        //an index is outside the board
        // console.log("an index is above 2");
        return undefined;
    }

    if (tacToe.coordinateIsOccupied(board, index)) {
        return "occ";
    }
    //returns a chunk of the N-dimensional board specified by
    //an index with a given number of dimensions
    //Indexes with an index less than the number of dimensions
    //specified have no effect on the output
    const chunkFinder = (board, dimensions, index) => (
        dimensions === index.length
        ? board
        : chunkFinder(board[index[index.length - 1]], dimensions,
            index.slice(0, -1))
    );

    //returns the individual updated 1-dimensional array
    const stripArrayFinderUpdater = (board, index, player) => (
        index.length === 1
        ? R.update(index[0], player, board)
        : stripArrayFinderUpdater(board[index[index.length - 1]],
            index.slice(0, -1), player)
    );

    //rebuilds the board around the updated 1D strip
    const boardRebuilder = (board, index, chunk) => (
        boardRebuilderFol(board, index, 2, chunk)
    );
    const boardRebuilderFol = (fullBoard, index, dimensionLens, chunk) => (
        dimensionLens === index.length
        ? R.update(index[index.length - 1], chunk, fullBoard)
        : boardRebuilderFol(fullBoard, index, dimensionLens + 1,
            R.update(index[dimensionLens - 1], chunk,
                chunkFinder(fullBoard, dimensionLens, index)))
    );

    const strip = stripArrayFinderUpdater(board, index, player);
    return boardRebuilder(board, index, strip);
};


/**
 * Given a board of N dimensions, returns which player's turn it is,
 * assuming X's always go first.
 * Will return 1 (X) if there are an equal no of Xs and Os, and 2 (O) otherwise
 * @memberof tacToe
 * @function
 * @param {matrix} board The N-dimensional board to be checked
 * @returns {number} The number value of the player whos turn it now is
 */
tacToe.playersTurnFinder = function (board) {
    const flattened_board = R.flatten(board);
    return (
        R.count(
            R.equals(1),
            flattened_board
        ) === R.count(
            R.equals(2),
            flattened_board
        ) ? 1 : 2
    );
};


/**
 * A function to map 4d indices on an N x N x N x N board
 * to 2d indices on a 9x9 board for visualisation
 * @memberof tacToe
 * @function
 * @param {number[]} fourDindex An array of length 4 that contains the
 * 4 dimensional index to be converted - pass as [x,y,z,w]
 * @returns {number[]} An array of length 2 that contains the returned index
 * - returns as [x,y]
 */
tacToe.fourDindexTo2D = function(fourDindex) {
    const N = 3;
    return [
        fourDindex[0] + N * fourDindex[3],
        fourDindex[1] + N * fourDindex[2]

    ];
};

/**
 * A function to convert 2D coordinates on a grid N elements wide
 * to 1D coordinates on a line. This is needed because of the way that I am
 * generating the grid of Divs
 * @memberof tacToe
 * @function
 * @param {number[]} twoDindex The 2 dimensional index to be converted
 * - pass as [x,y]
 * @returns {number} The index of the element in the grid
 */
tacToe.twoDTo1D = function(twoDindex) {
    //parameter to set how wide the 2D grid is
    //decided to just set it here rather than have it as an input because
    //that's all I need for now
    const N = 9;
    return twoDindex[0] + N * twoDindex[1];
};

/**
 * Function to convert 1D coords on a line to a 2D grid N elements wide
 * @memberof tacToe
 * @function
 * @param {number} oneDindex The 1 d index
 * @returns {number[]} The 2D coordinates
 */
tacToe.oneDto2D = function(oneDindex) {
    const N = 9;
    return [oneDindex % N, Math.trunc(oneDindex / 9)];
};

/**
 * Maps 2D coordinates on a (NxN) x (NxN) grid to 4D coordinates
 * on an N x N x N x N grid so that the user doesn't have to type in a 4D index
 * each time, and can simply click on the index they want to place their token
 * on
 * @memberof tacToe
 * @function
 * @param {number[]} twoDindex The two dimensional coordinates to convert
 * @returns {number[]} The four dimensional output coordinates
 */
tacToe.twoDto4D = function(twoDindex) {
    const N = 3;
    return [
        twoDindex[0] % N,
        twoDindex[1] % N,
        Math.floor(twoDindex[1] / N),
        Math.floor(twoDindex[0] / N)
    ];
};

export default Object.freeze(tacToe);

//fizz lol - (this is just for debugging)
// const fizz = function() {
//     console.log("fizz");
// };
