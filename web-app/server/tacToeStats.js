/**
 * tacToeStats.js is a module to record simple game stats
 * Derived from Dr Freddie Page's Stats4.js, which was included in the submission
 * template - it does pretty much the same stuff, but just with a few adjustments.
 * @namespace tacToeStats
 * @author Max McCormack
 * @version 2022
 */
const tacToeStats = Object.create(null);

/**
 * @memberof tacToeStats
 * @typedef {object} Statistics
 * @property {number} waysToWin The number of ways to win the given game
 * @property {number} wins The number of times the player has won
 * @property {number} draws Number of times the player has drawn
 * @property {number} losses Number of times the player has lost
 * @property {number} streak_curr Current winning streak
 * @property {number} streak_max Longest winning streak
 */

const playerStats = {};

/**
 * A function to initialise an object to store data on players statistics
 * @memberof tacToeStats
 * @function
 * @returns {object} An object containing details on players statistics
 */
const newPlayer = function () {
    return {
        "waysToWin": 272,
        "wins": 0,
        "draws": 0,
        "losses": 0,
        "streak_curr": 0,
        "streak_max": 0,
        "elo": 100
    };
};
/**
 * Written by Freddie Page - I took this from the submission template
 * @memberof tacToeStats
 * @function
 * @param {number} elo_updating The previous elo score to update
 * @param {number} elo_opponent The elo score of the opponent
 * @param {number} result The result of the last game
 * @returns {number} The calculated elo value for the player
 */
const elo = function (elo_updating, elo_opponent, result) {
    const k_factor = 40;
    const expected = 1 / (1 + 10 ** ((elo_opponent - elo_updating) / 400));
    return elo_updating + k_factor * (result - expected);
};

/**
 * A function used to request data from the tacToeStats module
 * @memberof tacToeStats
 * @function
 * @param {string[]} players A list of player names
 * @returns {Object} The stats for the player names
 * passed as a parameter
 */
tacToeStats.retrieveStats = function (players) {
    return Object.fromEntries(
        players.map(
            (player) => [player, playerStats[player] || newPlayer()]
        )
    );
};

/**
 * Accept the results of a game as parameters and return updated stats
 * @memberof tacToeStats
 * @function
 * @param {string} player_1 The name of player 1
 * @param {string} player_2 The name of player 2
 * @param {(0 | 1 | 2)} result The number of the player who won,
 * or `0` for a draw.
 * @returns {Object.<tacToeStats.Statistics>} Returns statistics for player_1
 * and player_2, i.e. the result of
 *     {@link tacToeStats.retrieveStats}`([player_1, player_2])` */
tacToeStats.recordGame = function (player1, player2, result) {
    if (!playerStats[player1]) {
        playerStats[player1] = newPlayer();
    }
    if (!playerStats[player2]) {
        playerStats[player2] = newPlayer();
    }
    const player1Stats = playerStats[player1];
    const player2Stats = playerStats[player2];
    let player1Result;
    let player2Result;
    if (result === 0) {
        player1Stats.draws += 1;
        player2Stats.draws += 1;
        player1Stats.streak_curr = 0;
        player2Stats.streak_curr = 0;
        player1Result = 0.5;
        player2Result = 0.5;
    }
    if (result === 1) {
        player1Stats.wins += 1;
        player2Stats.losses += 1;
        player1Stats.streak_curr += 1;
        player2Stats.streak_curr = 0;
        if (player1Stats.streak_curr > player1Stats.streak_max) {
            player1Stats.streak_max = player1Stats.streak_curr;
        }
        player1Result = 1;
        player2Result = 0;
    }
    if (result === 2) {
        player2Stats.wins += 1;
        player1Stats.losses += 1;
        player2Stats.streak_curr += 1;
        player1Stats.streak_curr = 0;
        if (player2Stats.streak_curr > player2Stats.streak_max) {
            player2Stats.streak_max = player2Stats.streak_curr;
        }
        player1Result = 0;
        player2Result = 1;
    }

    const newEloP1 = elo(
        player1Stats.elo,
        player2Stats.elo,
        player1Result
    );
    const newEloP2 = elo(
        player2Stats.elo,
        player1Stats.elo,
        player2Result
    );
    player1Stats.elo = newEloP1;
    player2Stats.elo = newEloP2;
};

tacToeStats.reverse = function (string) {
    // Implemention is to convert the string to an array of characters.
    // Reverse the order of the array, then recombining into a single string.
    return string.split("").reverse().join("");
};

export default Object.freeze(tacToeStats);