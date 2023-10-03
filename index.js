/**
 * Main entry point of the application.
 * @module index
 */

const runCall = require("./lib/runCall.js");
const doeval = require("./lib/eval.js");

module.exports = {
  /**
   * Function to run a call in the application.
   * @function runCall
   * @param {number} index - The index of the call to run.
   * @param {Array} calls - The array of calls to run.
   * @param {Object} input - The input object for the call.
   * @param {string} pk - The pk value.
   * @param {Function} ipcCall - The ipcCall function.
   * @param {Function} refresh - The refresh function.
   * @returns {Promise<Array>} - A promise that resolves to the updated array of calls.
   */
  runCall: runCall,

  /**
   * Function to evaluate JavaScript code.
   * @function doeval
   * @param {string} input - The JavaScript code to evaluate.
   * @returns {Promise<Object>} - A promise that resolves to the result of the evaluation.
   */
  doeval: doeval
};