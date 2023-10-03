/**
 * Module for running calls in the application.
 * @module runCall
 */

const ev = require("./eval.js");

/**
 * Function to run a call in the application.
 * @function runCall
 * @param {number} index - The index of the call to run.
 * @param {Array} calls - The array of calls to run.
 * @param {Object} input - The input object for the call.
 * @param {string} pk - The pk value.
 * @param {Function} ipcCall - The ipcCall function, this is what differentiates browser and server code
 * @param {Function} refresh - The refresh function.
 * @returns {Promise<Array>} - A promise that resolves to the updated array of calls.
 */
const runCall = async (index, calls, input = {}, pk, ipcCall, refresh) => {
  console.log("run call");
  const call = calls[index];
  call.stdout = "";
  call.stderr = "";

  console.log("calling before");
  const before = await ev(`
    const console = {
      log: (...params) => {
        api('log', JSON.stringify(params))
      }
    };
    let params = ${JSON.stringify(input)};
    ${call.before};
    params
  `);
  console.log({
    before
  });
  call.stdout += before.stdout || "";

  const out = await ipcCall(pk, call.name, before.value);
  call.stdout += out.stdout || "";
  call.stderr += out.stderr || "";
  delete out.stdout;
  delete out.stderr;

  const after = await ev(`
    const console = {
      log: (...params) => {
        api('log', JSON.stringify(params))
      }
    };
    let out = ${JSON.stringify(out)};
    ${call.after};
    out
  `);
  const afterOut = after.value;
  call.stdout += after.stdout || "";
  call.result = JSON.stringify(afterOut, null, 2);
  refresh(calls);

  if (call.output.length) {
    for (let output of call.output) {
      await runCall(output, calls, out, pk, ipcCall, refresh);
    }
  }

  return calls;
};

module.exports = runCall;