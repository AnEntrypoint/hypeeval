/**
 * Module for evaluating JavaScript code.
 * @module eval
 */

const {
  newAsyncContext
} = require("quickjs-emscripten");

/**
 * Function to run JavaScript code asynchronously.
 * @function run
 * @param {string} input - The JavaScript code to run.
 * @returns {Promise<Object>} - A promise that resolves to the result of the code execution.
 */
const run = async (input) => {
  let stdout = [];

  const context = await newAsyncContext();

  const api = {
    log: (...params) => {
      params.forEach((a) => typeof a === "string" ? stdout.push(a) : stdout.push(JSON.stringify(a)));
    }
  };

  const apiHandle = context.newAsyncifiedFunction("api", async (iname, iparams) => {
    const name = context.getString(iname);
    const jparams = context.getString(iparams);

    let params;
    try {
      params = JSON.parse(jparams);
    } catch (e) {
      params = jparams;
    }

    const output = await api[name](...params);
    return output;
  });

  apiHandle.consume((fn) => context.setProp(context.global, "api", fn));

  const result = await context.evalCodeAsync(input);

  return new Promise((resolve) => {
    if (result.error) {
      resolve({
        error: context.dump(result.error)
      });
      result.error.dispose();
    } else {
      const value = context.dump(result.value);
      resolve({
        value: value,
        stdout: stdout.join("\n")
      });
      result.value.dispose();
    }
  });
};

module.exports = run;