
var _ = require('underscore'),
    async = require('async'),
    afinn = require('./AFINN.json');

/**
 * Tokenizes an input string.
 *
 * @param {String} Input
 *
 * @return {Array}
 */
function tokenize (input) {
    return input
            .replace(/[^a-zA-Z ]+/g, '')
            .replace('/ {2,}/',' ')
            .toLowerCase()
            .split(' ');
}

/**
 * Performs sentiment analysis on the provided input "phrase".
 *
 * @param {String} Input phrase
 * @param {Object} Optional sentiment additions to AFINN (hash of word/value pairs)
 *
 * @return {Object}
 */
module.exports = function (phrase, inject, callback) {
    // Parse arguments
    if (typeof callback === 'undefined') {
        callback = inject;
        inject = null;
    }

    // Merge
    if (inject !== null) {
        afinn = _.extend(afinn, inject);
    }

    // Storage objects
    var tokens = tokenize(phrase),
        totalScore = 0,
        numWords = 0

    // Iterate over tokens
    async.forEach(tokens, function (obj, callback) {
        var item = afinn[obj];
        if (typeof item === 'undefined') return callback();

        totalScore += item;
        numWords++;
        callback();
    }, function (err) {
        var score = 0;
        if (numWords == 0) {
            score = 0;
        } else {
            score = totalScore / numWords; 
        }
        callback(err, score);
    });
}