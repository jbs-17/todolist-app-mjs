const _isNullish = (value) => value === null || value === undefined;

const isNullish = (...values) => {
  for (const value of values) {
    if (_isNullish(value)) return true;
  }
  return false;
};

export default isNullish;


