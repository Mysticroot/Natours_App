// Parses query string into a MongoDB-compatible filter object
const parseQueryParams = (queryObj) => {
  const filter = {};

  for (const key in queryObj) {
    if (key.includes('[')) {
      // Handles operators like duration[gte]=5 → { duration: { $gte: 5 } }
      const [field, op] = key.split('[');
      const operator = op.replace(']', '');
      filter[field] = { [`$${operator}`]: Number(queryObj[key]) };
    } else {
      // Convert number strings to actual numbers if possible
      filter[key] = isNaN(queryObj[key])
        ? queryObj[key]
        : Number(queryObj[key]);
    }
  }

  return filter;
};

module.exports = parseQueryParams;
