const parseQuery = (query) => {
  const result = {};
  for (let key in query) {
    if (key.includes('[')) {
      const [field, op] = key.split('[');
      const operator = op.replace(']', '');
      result[field] = { [`$${operator}`]: Number(query[key]) };
    } else {
      result[key] = isNaN(query[key]) ? query[key] : Number(query[key]);
    }
  }
  return result;
};

module.exports = parseQuery;
