module.exports = (func, param, named = false) => {
  throw Error(
    `Argument ${
      named ? `{ ${param} }` : param
    } for function ${func} is required`,
  );
};
