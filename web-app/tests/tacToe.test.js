import tacToe from "../common/tacToe.js";
import R from "../common/ramda.js";
import lineFinder from "../common/nDimensionalLineFinder.js";

const arrayEquals = function(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
};

const waysToWin = tacToe.waysToWin;
describe("waysToWin", function () {
    it("Check that for 2 dimensions and side length 3 there are 5 ways to win",
    function () {
        const dims = 2;
        const sidelen = 3;
        const result = waysToWin(dims, sidelen);
        const expected = 8;
        if (result !== expected) {
            throw new Error(
                `For inputs of dimensions: ${dims}, side length: ${sidelen}, ${result} 
                was returned,` + `when ${expected} was expected`
            );
        }
    });
    it("Check that for 3 dimensions and side length 3 there are 49 ways to win",
    function () {
        const dims = 3;
        const sidelen = 3;
        const result = waysToWin(dims, sidelen);
        const expected = 49;
        if (result !== expected) {
            throw new Error(
                `For inputs of dimensions: ${dims}, side length: ${sidelen}, ${result} 
                was returned,` + `when ${expected} was expected`
            );
        }
    });
    it("Check that for 4 dimensions and side length 3 there are 272 ways to win",
    function () {
        const dims = 4;
        const sidelen = 3;
        const result = waysToWin(dims, sidelen);
        const expected = 272;
        if (result !== expected) {
            throw new Error(
                `For inputs of dimensions: ${dims}, side length: ${sidelen}, ${result} 
                was returned,` + `when ${expected} was expected`
            );
        }
    });


});

const newBoard = tacToe.newBoard;
describe("newBoard", function () {
    it("check newBoard() works for 2 dimensions",
    function () {
        const dims = 2;
        const result = newBoard(dims);
        if (!(R.flatten(result).length === 3 ** dims
            && R.flatten(result).every((n) => n === 0))) {
            throw new Error(
                `For an input of dimensions: ${dims}, the wrong
                board was returned`
            );
        }
    });
    it("check newBoard() works for 3 dimensions",
    function () {
        const dims = 3;
        const result = newBoard(dims);
        if (!(R.flatten(result).length === 3 ** dims
            && R.flatten(result).every((n) => n === 0))) {
            throw new Error(
                `For an input of dimensions: ${dims}, the wrong
                board was returned`
            );
        }
    });
    it("check newBoard() works for 4 dimensions",
    function () {
        const dims = 4;
        const result = newBoard(dims);
        if (!(R.flatten(result).length === 3 ** dims
            && R.flatten(result).every((n) => n === 0))) {
            throw new Error(
                `For an input of dimensions: ${dims}, the wrong
                board was returned`
            );
        }
    });


});

const binaryOp = tacToe.binaryOp;
describe("binaryOp", function () {
    it("check binaryOp works for various inputs",
    function () {
        const list = [1,2,3,4,5,6,7];
        const binOp = [1,0,0,1,0,0,0];
        const result = binaryOp(list, binOp);
        const expected = [0,2,3,0,5,6,7];
        if (!arrayEquals(result, expected)) {
            throw new Error(
                `For an input of: ${list} and ${binOp}, ${result} was returned
                when ${expected} was expected`
            );
        }
    });
});


const isInBoard = tacToe.isInBoard;
describe("isInBoard", function () {

    it("Check isInBoard works for some basic index inputs",
    function () {
        const indexesTest_A = [
            [1,2,1,2],
            [1,2,3,4],
            [2,2,2,2],
            [1,2,3,2],
            [1,1,1,1]
        ];
        const expected_A = [true, false, true, false,
            true];

        const dimensions = 4;
        let results = [];

        for (let i = 0; i < indexesTest_A.length; i++) {
            results.push(isInBoard(indexesTest_A[i], dimensions));
        }
        if (!arrayEquals(results, expected_A)) {
            let failed = [];
            for (let i = 0; i < indexesTest_A.length; i++) {
                if (results[i] != expected_A[i]) {
                    failed.push(indexesTest_A[i])
                }
            }
            throw new Error(
                `isInBoard did not work correctly. Failed for indexes:
                ${failed}`
            );
        }
    });
    const indexesTest_B = [
        [0,0,0,0],
        [9,9,9,9],
        [2,2,2,2],
        [2,2,3,2],
        [1,1,1,1],
        [9,0,0,0],
        [-1,0,0,0]
    ];
    const expected_B = [true, false, true, false,
        true, false, false];
    for (let i = 0; i < indexesTest_B.length; i++) {
        it("check IsInBoard works for index inputs " + indexesTest_B[i],
        function () {
            const dimensions = 4;
            const expectedInd = expected_B[i];
            const result = isInBoard(indexesTest_B[i], dimensions);
            if (result !== expectedInd) {
                throw new Error(
                    `isInBoard did not work right. Returned ${result} instead 
                    of ${expectedInd}`
                )
            }
        });
    }
});
// this is an awful way of writing out a 4D board, but for the sake of
//readability i have compressed these two into less lines
const blankBoard = [
    [
        [[0,0,0], [0,0,0], [0,0,0]],
        [[0,0,0], [0,0,0], [0,0,0]],
        [[0,0,0], [0,0,0], [0,0,0]]],
    [
        [[0,0,0], [0,0,0], [0,0,0]],
        [[0,0,0], [0,0,0], [0,0,0]],
        [[0,0,0], [0,0,0], [0,0,0]]],
    [
        [[0,0,0], [0,0,0], [0,0,0]],
        [[0,0,0], [0,0,0], [0,0,0]],
        [[0,0,0], [0,0,0], [0,0,0]]]
];
const countBoard = [
    [
        [[ 1, 2, 3], [ 4, 5, 6], [ 7, 8, 9]],
        [[10,11,12], [13,14,15], [16,17,18]],
        [[19,20,21], [22,23,24], [25,26,27]]],
    [
        [[28,29,30], [31,32,33], [34,35,36]],
        [[37,38,39], [40,41,42], [43,44,45]],
        [[46,47,48], [49,50,51], [52,53,54]]],
    [
        [[55,56,57], [58,59,60], [61,62,63]],
        [[64,65,66], [67,68,69], [70,71,72]],
        [[73,74,75], [76,77,78], [79,80,81]]]
];

const returnBoardElement = tacToe.returnBoardElement;
describe("returnBoardElement", function () {
    it("Check that returnBoardElement() returns the correct tokens across" +
    " various indexes of a given 4D board",
    function () {
        const board = countBoard;
        //1 21 59 81 41 33 77
        const indexes = [
            [0,0,0,0],
            [2,0,2,0],
            [1,1,0,2],
            [2,2,2,2],
            [1,1,2,2],
            [1,1,1,1],
            [2,1,0,1]
        ];
        const results = [];
        for (let i = 0; i < indexes.length; i++) {
            results.push(returnBoardElement(board, indexes[i]));
        };
        const expected = [1,21,59,81,77,41,33];
        if (!arrayEquals(results, expected)) {
            throw new Error(
                `${results} was returned
                when ${expected} was expected`
            );
        }
    });
});

const everyEdgeIndexToCheck = tacToe.everyEdgeIndexToCheck;
describe("everyEdgeIndexToCheck", function () {
    //unfortunately i cannot visualise what this is meant to return for 4
    //dimensions, so i cannot write the test for it beyond 3 dims :(

    it("check everyEdgeIndexToCheck returns the correct"
    + " indices for 2 dimensions",
    function () {
        const dimensions = 2;
        const result = everyEdgeIndexToCheck(dimensions);
        const expected = [
            [0,0],
            [0,1],
            [0,2],
            [1,0],
            [2,0]
        ];
        if(expected.length !== result.length) {
            throw new Error(
                `the expected and returned arrays were of differing lengths`
                );
        }
        // the arrays don't need to be returned in any particular order, so we
        //must check that they all exist in any order
        let passed = [];
        for (let i = 0; i < expected.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (arrayEquals(expected[i], result[j])) {
                    passed.push(1);
                }
            }
        }
        if (!(passed.length === expected.length)) {
            throw new Error(
                `The wrong indices to be checked were returned ${passed}`
            );
        }
    });
    it("check everyEdgeIndexToCheck returns the correct"
    + " indices for 3 dimensions",
    function () {
        const dimensions = 3;
        const result = everyEdgeIndexToCheck(dimensions);
        const expected = [
            [0, 0, 0],
            [0, 0, 1],
            [0, 0, 2],
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 2],
            [0, 2, 0],
            [0, 2, 1],
            [0, 2, 2],
            [1, 0, 0],
            [1, 0, 1],
            [1, 0, 2],
            [1, 1, 0],
            [1, 2, 0],
            [2, 0, 0],
            [2, 0, 1],
            [2, 0, 2],
            [2, 1, 0],
            [2, 2, 0]
        ];
        if(expected.length !== result.length) {
            throw new Error(
                `the expected and returned arrays were of differing lengths`
                );
        }
        // the arrays don't need to be returned in any particular order, so we
        //must check that they all exist in any order
        let passed = [];
        for (let i = 0; i < expected.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (arrayEquals(expected[i], result[j])) {
                    passed.push(1);
                }
            }
        }
        if (!(passed.length === expected.length)) {
            throw new Error(
                `The wrong indices to be checked were returned ${passed}`
            );
        }
    });

});


const playTurnBoardUpdate = tacToe.playTurnBoardUpdate;
describe("playTurnBoardUpdate", function () {
    it("check playTurnBoardUpdate works to update"
        + " a particular index on the board",
    function () {
        const player = 8;
        const index = [1,2,1,1];
        const result = playTurnBoardUpdate(player, blankBoard, index);
        const expected = [
            [
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]
            ],
            [
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,8,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]
            ],
            [
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]
            ]
        ];
        let pass = true;
        for (let i = 0; i < expected.length; i++) {
            for (let j = 0; j < expected[i].length; j++) {
                for (let k = 0; k < expected[j].length; k++ )
                    if (!arrayEquals(result[i][j][k], expected[i][j][k])) {
                        pass = false;
                    }
            }
        }
        if (!pass) {
            throw new Error(
                `the function failed to return the correct matrix for a
                4D board`
            );
        }
    });
    it("check playTurnBoardUpdate returns \"occ\" when we try to update an"
    + " index that is not 0",
    function () {
        const board = [
            [
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]
            ],
            [
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,1],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]
            ],
            [
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ]
            ]
        ];
        const player = 8;
        const index = [2,0,1,1];
        const result = playTurnBoardUpdate(player, board, index);
        const expected = "occ";
        if (result !== expected) {
            throw new Error(
                `the function did not return "occ" when an index that is
                already occupied was updated. Returned ${result} instead`
            );
        }
    });
    it("check playTurnBoardUpdate returns undefined when we try to update an"
    + " index that is outside of the board",
    function () {
        const player = 8;
        const index = [3,0,1,1];
        const result = playTurnBoardUpdate(player, blankBoard, index);
        const expected = undefined;
        if (result !== expected) {
            throw new Error(
                `the function did not return undefined when an index (${index})
                that is not in the board was requested.
                Returned ${result} instead`
            );
        }
    });

});

const playersTurnFinder = tacToe.playersTurnFinder;
describe("playersturnFinder(); - relies on playTurnBoardUpdate() being"
    + "operational", function () {
    it("Check to see that the correct player is returned given a board with one"
    + " move by one player",
    function () {
        const player = 1;
        const board = blankBoard;
        const expected = 2;
        let a = tacToe.playTurnBoardUpdate(player, board, [0,0,0,0]);
        const result = playersTurnFinder(a);
        if (expected !== result) {
            throw new Error(
                `${result} was returned when ${expected} was expected`
            )
        }
    });
    it("Check to see that the correct player is returned given a board with 16"
    + " predetermined moves by two players",
    function () {
        const board = [
            [
                [[1,2,0], [0,0,0], [0,0,0]],
                [[0,0,0], [0,1,0], [0,2,0]],
                [[0,0,0], [0,0,0], [0,0,0]]],
            [
                [[0,0,0], [2,0,0], [0,2,0]],
                [[0,1,0], [0,1,2], [0,0,0]],
                [[0,0,0], [1,0,1], [2,0,0]]],
            [
                [[0,1,0], [0,0,0], [0,1,0]],
                [[0,0,0], [0,2,0], [0,0,0]],
                [[0,0,0], [0,0,0], [0,2,0]]]
        ];
        const expected = 1;
        const boardTxt = (lineFinder.terminal4DPrint(board));
        const result = playersTurnFinder(board);
        if (expected !== result) {
            throw new Error(
                `${result} was returned when ${expected} was expected on board:
                 ${boardTxt}`
            )
        }
    });
    it("Check to see that the correct player is returned given a board with 9"
    + " moves by two players in a simulated game",
    function () {
        const player1 = 1;
        const player2 = 2;
        const board = blankBoard;
        const expected = 1;
        //This runs a predetermined simulated game
        let a = tacToe.playTurnBoardUpdate(player1, board, [0,1,0,0]);
        a = tacToe.playTurnBoardUpdate(player2, a, [0,0,1,0]);
        a = tacToe.playTurnBoardUpdate(player1, a, [0,2,1,0]);
        a = tacToe.playTurnBoardUpdate(player2, a, [0,2,2,1]);
        a = tacToe.playTurnBoardUpdate(player1, a, [2,0,1,2]);
        a = tacToe.playTurnBoardUpdate(player2, a, [1,1,1,1]);
        a = tacToe.playTurnBoardUpdate(player1, a, [2,2,2,2]);
        a = tacToe.playTurnBoardUpdate(player2, a, [0,0,0,0]);
        a = tacToe.playTurnBoardUpdate(player1, a, [0,0,0,1]);
        a = tacToe.playTurnBoardUpdate(player2, a, [2,0,1,0]);
        const boardTxt = (lineFinder.terminal4DPrint(a));
        const result = playersTurnFinder(a);
        if (expected !== result) {
            throw new Error(
                `${result} was returned when ${expected} was expected on board:
                 ${boardTxt}`
            )
        }
    });
});


const checkWin = tacToe.checkWin;
describe("checkWin - in order for these to work, playTurnBoardUpdate and"
+" newBoard must be fully operational", function () {
    it("Check to see if a 3-in a row spanning all 4 dimensions is detected" +
    " in a 4D board ",
    function () {
        const player = 1;
        let a = tacToe.newBoard(4);
        a = tacToe.playTurnBoardUpdate(player, a, [0,0,0,0]);
        a = tacToe.playTurnBoardUpdate(player, a, [1,1,1,1]);
        a = tacToe.playTurnBoardUpdate(player, a, [2,2,2,2]);
        const result = checkWin(a, player, 4);
        const expected = player;
        if (expected !== result) {
            throw new Error(
                `A 3 in a row was not detected for player ${player}`
            );
        }
    });
    it("Check to see if a 3-in a row spanning 3 dimensions in a 4D board"
    + " is detected in a 4D board",
    function () {
        const player = 1;
        let a = tacToe.newBoard(4);
        a = tacToe.playTurnBoardUpdate(player, a, [2,2,0,0]);
        a = tacToe.playTurnBoardUpdate(player, a, [2,1,1,1]);
        a = tacToe.playTurnBoardUpdate(player, a, [2,0,2,2]);
        const result = tacToe.checkWin(a, player, 4);
        const expected = player;
        if (expected !== result) {
            throw new Error(
                `A 3 in a row was not detected for player ${player}`
            );
        }
    });
    it("Check to see if a 3-in a row spanning 2 dimensions in a 4D board"
    + " is detected in a 4D board",
    function () {
        const player = 1;
        let a = tacToe.newBoard(4);
        a = tacToe.playTurnBoardUpdate(player, a, [2,0,2,0]);
        a = tacToe.playTurnBoardUpdate(player, a, [2,0,1,1]);
        a = tacToe.playTurnBoardUpdate(player, a, [2,0,0,2]);
        const result = tacToe.checkWin(a, player, 4);
        const expected = player;
        if (expected !== result) {
            throw new Error(
                `A 3 in a row was not detected for player ${player}`
            );
        }
    });
    it("Check to see if a 3-in a row spanning 1 dimension in a 4D board"
    + " is detected",
    function () {
        const player = 1;
        let a = tacToe.newBoard(4);
        a = tacToe.playTurnBoardUpdate(player, a, [2,0,2,1]);
        a = tacToe.playTurnBoardUpdate(player, a, [2,0,1,1]);
        a = tacToe.playTurnBoardUpdate(player, a, [2,0,0,1]);
        const result = tacToe.checkWin(a, player, 4);
        const expected = player;
        if (expected !== result) {
            throw new Error(
                `A 3 in a row was not detected for player ${player}`
            );
        }
    });
    it("Check to ensure the win condition is not triggered by one any single "
    + "board space being occupied \n (should take about 50ms because it checks"
    + " every single possible winning condition)",
    function () {
        const board = countBoard;
        function winFuncTester(board) {
            let returnList = [];
            for (let i = 0; i < 81; i++) {
                returnList.push(tacToe.checkWin(board, i, 4));
            }
            return returnList
        }
        const result = winFuncTester(board);
        if (!result.every((n) => n === 0)) {
            throw new Error(
                `A 3 in a row was not detected for player ${player}`
            );
        }
    });
});
