import R from "../common/ramda.js";
import lineFinder from "../common/nDimensionalLineFinder.js";

const DIMENSIONS = 4;
const BOARDWIDTH = 3;

/**
 * tacToe.js is a module to model N-dimensional tic-tac-toe
 * @namespace tacToe
 * @author Max McCormack
 * @version 2022
 */
const tacToe = Object.create(null);


/**
 * Finds the factorial of a number
 * @param {number} number The number to be factorialised
 * @returns {number} number! (number factorial)
 */
tacToe.factorial = function(number) {
    if (number < 0) {
        return undefined;
    }
    if (number === 0) {
        return 1;
    }
    if (number === 1) {
        return number;
    }
    else {
        return number * tacToe.factorial(number - 1);
    }
};



// equation: $$\frac{1}{2}\sum\limits_{C=0}^{D-1} {D \choose C} 2^{D-C}
//S^C\tag{1}$$
/**
 * @param {*} dimensions The number of dimensions in the game
 * @param {*} sideLen The length of one side of the board
 * @returns {number} The number of ways there are to win the described
 *  tic-tac-toe game
 */
tacToe.waysToWin = function(dimensions, sideLen) {
    return (1/2) * R.sum(
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
 * @param {number} dimensions The number of dimensions of the board to generate
 * @returns {matrix} An N-dimensional matrix full of 0s
 */
tacToe.newBoard = function (dimensions) {
    const instigator = R.repeat(3, dimensions);
    const boardMaker = (fill, arg) =>
        (arg.length === 0
            ? fill
            : Array.from({ length: arg[0] }).map(() =>
                boardMaker(fill, arg.slice(1))));

    return boardMaker(0, instigator);
};

//checks if the game is over by looking at the state of the board
tacToe.gameOverChecker = function (board) {
    return false;
    //return checkWin(board);
};


/**
 * List and binary list must be equal in length
 * for every '1' in binary list, function will set
 * element in list at that same index to 0
 * @param {number[]} list
 * @param {number[]} binarylist
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
 * returns the token on the board at the index passed
 * index is passed as an array of length N dimensions
 * works for any N dimensions
 * @param {matrix} board An N-dimensional board matrix to search in
 * @param {number[]} index the index to search for - for 4 dimensions this
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
 * in a square this would be the top and left sides.
 * In a 3-cube this would be the top, left and back sides, for a hyper cube
 * it would be 4 sides, etc
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
 * startindex is the N-dimensional corner to check from
 * frozenList is instructions to freeze a given dimension
 * e.g [1, 0, 0 ,0] freezes the 4th dimension (index index 0)
 * @param {number[]} startIndex
 * @param {number[]} frozenList
 * @returns {number[]} an incrementation array to step across when searching 
 * for lines in an N-dimensional cube
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

//returns a list of the combinations of dimensions to be
//frozen for checking - frozen dimsensions are denoted by 1, free are 0
//used by tacToe.checkwin()
/**
 * @param {number} dims number of dimensions to permute through
 * @returns {number[][]} an array of arrays of dimensions to iteratively freeze
 * - for every possible combination except all frozen at once. Each array
 * within the main array will be of length {dims}
 */
tacToe.frozenDimensionPermutations = function(dims) {
    const perms = R.compose(R.sequence(R.of), R.flip(R.repeat));
    return perms(dims, [0,1]).slice(0, -1);
};


/**
 * Finds lines of three in a row in an N-dimensional hypercube.
 * Should work for any side length, but I haven't tested it for that yet.
 * Not a pure function, but please excuse this as it was difficult enough to
 * implement procedurally as it were.
 * @param {matrix} board The N-dimensional board to check through
 * @param {number} player The player to check for a win
 * @param {number} dimensions The number of dimensions in the board to check
 * through
 * @param {number} BOARDWIDTH The width of one side of the board
 * @returns {number} If a line is found for the player number passed, will
 * return the number of the player. Returns 0 if no three-in-a-row line is found
 */
tacToe.findLine = function (board, player, dimensions, BOARDWIDTH) {
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


/**
 * Given a board, checks if there is a winning condition
 * Returns 0 (none) or the value of the player in quesion if a win
 * @param {matrix} board The N-dimensional board to check through
 * @param {number} player The player to check for a win
 * @param {number} dimensions The number of dimensions in the board to check
 * through
 * @returns {number} If a line is found for the player number passed, will
 * return the number of the player. Returns 0 if no 3 in a row line is found
 */
tacToe.checkWin = function (board, player, dimensions) {
    return tacToe.findLine(board, player, dimensions, BOARDWIDTH);
}


/**
 * Return a new board after a ply
 * If a spot is already take, returns 0
 * returns "occ" if the board index is already occupied
 * @param {number} player The number value of the player to place a token for
 * @param {matrix} board The N-dimensional board to be altered
 * @param {number[]} index The index array of the coordinate to be changed.
 * Should be passed as an array of format [x, y, z, w ....]
 * @returns {matrix} A new board with the requested alteration applied
 */
tacToe.playTurnBoardUpdate = function (player, board, index) {
    if (tacToe.gameOverChecker(board)) {
        console.log("game over");
        return undefined;
    }
    if (index.length !== DIMENSIONS) {
        //length of index is wrong
        console.log("index len wrong: ");
        console.log(index.length);
        return undefined;
    }
    const IndexIsOutBoard = (indexEle) => indexEle > BOARDWIDTH - 1;
    if (index.some(IndexIsOutBoard)) {
        //an index is outside the board
        console.log("an index is above 2");
        return undefined;
    }

    //returns 0 if coordinate is occupeid on board, 1 otherwise
    const coordinateIsOccupied = (board, index) => (
        index.length === 1
        ? !(board[index[0]] === 0)
        : coordinateIsOccupied(board[index[index.length - 1]],
            index.slice(0, -1))
    );

    if (coordinateIsOccupied(board, index)) {
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

export default Object.freeze(tacToe);

//fizz lol - (this is just for debugging)
const fizz = function() {
    console.log("fizz");
};
